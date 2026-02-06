import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { payfastConfig } from "@/lib/payfast/config";
import { verifyPayFastITN } from "@/lib/payfast/verify-itn";

// POST /api/checkout/itn - PayFast ITN (Instant Transaction Notification) webhook
export async function POST(request: NextRequest) {
  try {
    // 1. Parse form data from PayFast
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    // 2. Get signature from headers
    const signature = data.signature;

    if (!signature) {
      console.error('[ITN] Missing signature');
      return new NextResponse('Missing signature', { status: 400 });
    }

    // 3. Verify ITN
    const verification = await verifyPayFastITN(data, signature, payfastConfig.passphrase);

    if (!verification.valid) {
      console.error('[ITN] Verification failed:', verification.error);
      return new NextResponse(verification.error || 'Verification failed', { status: 400 });
    }

    // 4. Extract order information
    const orderId = data.m_payment_id;
    const pfPaymentId = data.pf_payment_id;
    const paymentStatus = data.payment_status;
    const amountGross = data.amount_gross;

    if (!orderId) {
      console.error('[ITN] Missing order ID');
      return new NextResponse('Missing order ID', { status: 400 });
    }

    // 5. Find order
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      console.error('[ITN] Order not found:', orderId);
      return new NextResponse('Order not found', { status: 404 });
    }

    // 6. Check if order is already paid
    if (order.status === 'paid') {
      console.log('[ITN] Order already paid:', orderId);
      return new NextResponse('Order already processed', { status: 200 });
    }

    // 7. Verify amount matches
    const orderTotal = parseFloat(order.total);
    const paymentAmount = parseFloat(amountGross);

    if (Math.abs(orderTotal - paymentAmount) > 0.5) { // Allow small difference
      console.error('[ITN] Amount mismatch:', { orderTotal, paymentAmount });
      return new NextResponse('Amount mismatch', { status: 400 });
    }

    // 8. Update order and decrease stock in transaction
    await db.transaction(async (tx) => {
      // Update order status
      await tx.update(orders)
        .set({
          status: 'paid',
          pfPaymentId: pfPaymentId,
          paymentDate: new Date(),
          paymentMethod: data.payment_method,
        })
        .where(eq(orders.id, orderId));

      // Get order items
      const items = await tx.query.orderItems.findMany({
        where: eq(orderItems.orderId, orderId),
      });

      // Decrease stock for each product
      for (const item of items) {
        await tx.update(products)
          .set({
            stock: sql`${products.stock} - ${item.quantity}`,
            updatedAt: new Date(),
          })
          .where(eq(products.id, item.productId));
      }
    });

    console.log('[ITN] Payment processed successfully:', orderId);

    // Return success response to PayFast
    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('[ITN] Error processing payment notification:', error);

    return new NextResponse('Internal server error', { status: 500 });
  }
}

// GET /api/checkout/itn - Reject GET requests
export async function GET() {
  return new NextResponse('Method not allowed', { status: 405 });
}
