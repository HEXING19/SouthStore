import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/db";
import { orders, orderItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { payfastConfig } from "@/lib/payfast/config";

// GET /api/checkout/verify-payment?session_id=xxx
// Verify payment status (fallback for when ITN is not received)
export async function GET(request: NextRequest) {
  try {
    // Verify user is authenticated
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Get session_id from query params
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({
        success: false,
        error: "session_id is required",
      }, { status: 400 });
    }

    // Find the most recent pending order for this user
    // In production, you'd store sessionId in the database and query by it
    const pendingOrders = await db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      orderBy: (orders, { desc }) => [desc(orders.createdAt)],
      limit: 10,
    });

    const matchedOrder = pendingOrders.find(o => o.status === 'pending');

    if (!matchedOrder) {
      // Check if there's a recently paid order (already processed)
      const recentPaidOrder = pendingOrders.find(o => o.status === 'paid');
      if (recentPaidOrder) {
        return NextResponse.json({
          success: true,
          order: recentPaidOrder,
          message: "Payment already processed",
        });
      }

      return NextResponse.json({
        success: false,
        error: "No pending order found",
      }, { status: 404 });
    }

    // In Sandbox mode, we can auto-verify the payment
    // In production, you would call PayFast API to verify the transaction
    if (payfastConfig.testMode) {
      console.log('[Verify Payment] Auto-confirming payment in Sandbox mode:', matchedOrder.id);

      // Update order and decrease stock in transaction
      await db.transaction(async (tx) => {
        // Update order status
        await tx.update(orders)
          .set({
            status: 'paid',
            paymentDate: new Date(),
            paymentMethod: 'EFT', // Sandbox default
          })
          .where(eq(orders.id, matchedOrder.id));

        // Get order items
        const items = await tx.query.orderItems.findMany({
          where: eq(orderItems.orderId, matchedOrder.id),
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

      // Fetch updated order
      const updatedOrder = await db.query.orders.findFirst({
        where: eq(orders.id, matchedOrder.id),
      });

      return NextResponse.json({
        success: true,
        order: updatedOrder,
        message: "Payment verified in Sandbox mode",
      });
    } else {
      // In production, return current status
      // ITN should have updated it, if not, user needs to wait
      return NextResponse.json({
        success: true,
        order: matchedOrder,
        message: "Payment is being processed",
      });
    }

  } catch (error) {
    console.error("Error verifying payment:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to verify payment",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
