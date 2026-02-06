import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";

// GET /api/checkout/orders - Get user's order history
export async function GET(request: NextRequest) {
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

    // 2. Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 3. Build query
    let query = db.query.orders.findMany({
      where: eq(orders.userId, session.user.id),
      orderBy: [desc(orders.createdAt)],
      limit,
      offset,
    });

    // 4. Filter by status if provided
    if (status && ['pending', 'paid', 'failed', 'cancelled'].includes(status)) {
      query = db.query.orders.findMany({
        where: eq(orders.userId, session.user.id) && eq(orders.status, status as any),
        orderBy: [desc(orders.createdAt)],
        limit,
        offset,
      });
    }

    const userOrders = await query;

    // 5. Get order items for each order
    const ordersWithItems = await Promise.all(
      userOrders.map(async (order) => {
        const items = await db.query.orderItems.findMany({
          where: eq(orderItems.orderId, order.id),
        });

        return {
          ...order,
          total: parseFloat(order.total),
          items: items.map(item => ({
            ...item,
            price: parseFloat(item.price),
          })),
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: ordersWithItems,
      meta: {
        count: ordersWithItems.length,
        limit,
        offset,
      },
    });

  } catch (error) {
    console.error("Error fetching orders:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to fetch orders",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
