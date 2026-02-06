import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.string().min(1),
});

// GET /api/products/[id] - Fetch a single product by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Await params (Next.js 15+)
    const { id } = paramsSchema.parse(await params);

    const productResult = await db
      .select()
      .from(products)
      .where(eq(products.id, id))
      .limit(1);

    if (!productResult || productResult.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      }, { status: 404 });
    }

    // Transform data to convert numeric strings to numbers
    const product = productResult[0];
    const transformedProduct = {
      ...product,
      price: parseFloat(product.price as string),
      rating: parseFloat(product.rating as string),
      stock: product.stock as number,
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    });

  } catch (error) {
    console.error("Error fetching product:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Invalid product ID",
        details: error.issues,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: "Failed to fetch product",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
