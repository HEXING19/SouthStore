import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { nanoid } from "nanoid";
import { payfastConfig, getPayFastUrl, getReturnUrl, getCancelUrl, getNotifyUrl } from "@/lib/payfast/config";
import { generatePayFastSignature } from "@/lib/payfast/signature";

// Request validation schema
const createPaymentSchema = z.object({
  cartItems: z.array(z.object({
    id: z.string(),
    name: z.string(),
    category: z.string(),
    price: z.number(),
    description: z.string(),
    image: z.string(),
    rating: z.number(),
    quantity: z.number(),
  })).min(1, "Cart cannot be empty"),
  totalAmount: z.number().positive("Total amount must be positive"),
});

// POST /api/checkout/create-payment - Create PayFast payment session
export async function POST(request: NextRequest) {
  try {
    // 1. Verify user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // 2. Parse and validate request body
    const body = await request.json();
    const validationResult = createPaymentSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json({
        success: false,
        error: "Invalid request data",
        details: validationResult.error.issues,
      }, { status: 400 });
    }

    const { cartItems, totalAmount } = validationResult.data;

    // 3. Verify total amount on server side
    const serverTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (Math.abs(serverTotal - totalAmount) > 0.01) {
      return NextResponse.json({
        success: false,
        error: "Price mismatch detected",
      }, { status: 400 });
    }

    // 4. Verify stock availability
    for (const item of cartItems) {
      const product = await db.query.products.findFirst({
        where: eq(products.id, item.id),
      });

      if (!product) {
        return NextResponse.json({
          success: false,
          error: `Product ${item.name} not found`,
        }, { status: 404 });
      }

      const currentStock = Number(product.stock || 0);
      if (currentStock < item.quantity) {
        return NextResponse.json({
          success: false,
          error: `Insufficient stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`,
        }, { status: 400 });
      }
    }

    // 5. Generate order ID
    const orderId = `order_${nanoid(12)}`;
    const sessionId = nanoid(16);

    // 6. Validate and prepare user data
    const userEmail = session.user.email;

    // Email is required for PayFast
    if (!userEmail) {
      return NextResponse.json({
        success: false,
        error: "Email address is required for checkout. Please update your profile.",
      }, { status: 400 });
    }

    const userName = session.user.name || 'Customer';
    const nameParts = userName.split(' ');
    const nameFirst = nameParts[0] || 'Customer';
    const nameLast = nameParts.slice(1).join(' ') || '';

    // Create item description for PayFast
    const itemDescription = cartItems.length === 1
      ? cartItems[0].name
      : `${cartItems.length} items from SouthStore`;

    await db.insert(orders).values({
      id: orderId,
      userId: session.user.id,
      status: 'pending',
      total: totalAmount.toString(),
      currency: 'zar',
      customerName: userName,
      customerEmail: userEmail,
      itemName: itemDescription,
      itemDescription: cartItems.map(item => `${item.name} x${item.quantity}`).join(', '),
      merchantOrderId: orderId,
    });

    // 7. Create order items
    for (const item of cartItems) {
      await db.insert(orderItems).values({
        id: `item_${nanoid(12)}`,
        orderId,
        productId: item.id,
        productName: item.name,
        productCategory: item.category,
        price: item.price.toString(),
        quantity: item.quantity,
        image: item.image,
      });
    }

    // 8. Generate PayFast payment data (only include non-empty optional fields)
    const paymentData: Record<string, string> = {
      merchant_id: payfastConfig.merchantId,
      merchant_key: payfastConfig.merchantKey,
      return_url: getReturnUrl(sessionId),
      cancel_url: getCancelUrl(),
      notify_url: getNotifyUrl(),
      email_address: userEmail,
      m_payment_id: orderId,
      amount: totalAmount.toFixed(2),
      item_name: itemDescription,
      // Use custom_str1/2 for string values (instead of custom_int1/2 which require numbers)
      custom_str1: session.user.id,
      custom_str2: sessionId,
    };

    // Only add non-empty optional fields
    if (nameFirst) paymentData.name_first = nameFirst;
    if (nameLast) paymentData.name_last = nameLast;
    if (itemDescription) paymentData.item_description = itemDescription;

    // Debug logging
    console.log('[PayFast] Creating payment:', {
      orderId,
      amount: totalAmount.toFixed(2),
      email: userEmail,
      itemCount: cartItems.length,
      paymentUrl: getPayFastUrl(),
    });

    // 9. Generate signature
    const signature = generatePayFastSignature(paymentData, payfastConfig.passphrase);

    return NextResponse.json({
      success: true,
      orderId,
      sessionId,
      paymentUrl: getPayFastUrl(),
      paymentData: {
        ...paymentData,
        signature,
      },
    });

  } catch (error) {
    console.error("Error creating payment:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to create payment",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
