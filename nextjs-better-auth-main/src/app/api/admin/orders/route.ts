import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth/server";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { eq, desc, or, like } from "drizzle-orm";

// GET /api/admin/orders - Get all orders (admin only)
export async function GET(request: NextRequest) {
  try {
    // 1. Verify user is authenticated and is admin
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: "Forbidden - Admin access required",
      }, { status: 403 });
    }

    // 2. Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 3. Build query
    let allOrders;

    if (status && ['pending', 'paid', 'failed', 'cancelled'].includes(status)) {
      // Filter by status
      allOrders = await db.query.orders.findMany({
        where: eq(orders.status, status as any),
        orderBy: [desc(orders.createdAt)],
        limit,
        offset,
      });
    } else if (search) {
      // Search by order ID, customer name, or email
      allOrders = await db.query.orders.findMany({
        where: or(
          like(orders.id, `%${search}%`),
          like(orders.customerName, `%${search}%`),
          like(orders.customerEmail, `%${search}%`)
        ),
        orderBy: [desc(orders.createdAt)],
        limit,
        offset,
      });
    } else {
      // Get all orders
      allOrders = await db.query.orders.findMany({
        orderBy: [desc(orders.createdAt)],
        limit,
        offset,
      });
    }

    // 4. Get order items for each order
    const ordersWithItems = await Promise.all(
      allOrders.map(async (order) => {
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
    console.error("Error fetching admin orders:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to fetch orders",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
