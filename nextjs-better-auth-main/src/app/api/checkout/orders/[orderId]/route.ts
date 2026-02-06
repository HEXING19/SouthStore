import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET /api/checkout/orders/[orderId] - Get order details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
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

    // 2. Get order ID from params
    const { orderId } = await params;

    // 3. Find order
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, orderId),
    });

    if (!order) {
      return NextResponse.json({
        success: false,
        error: "Order not found",
      }, { status: 404 });
    }

    // 4. Verify order belongs to user
    if (order.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: "Forbidden",
      }, { status: 403 });
    }

    // 5. Get order items
    const items = await db.query.orderItems.findMany({
      where: eq(orderItems.orderId, orderId),
    });

    // 6. Return order with items
    return NextResponse.json({
      success: true,
      data: {
        ...order,
        total: parseFloat(order.total),
        items: items.map(item => ({
          ...item,
          price: parseFloat(item.price),
        })),
      },
    });

  } catch (error) {
    console.error("Error fetching order:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to fetch order",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
