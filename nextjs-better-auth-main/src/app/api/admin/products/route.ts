import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth/server";
import { insertProductSchema } from "@/db/schema/products";
import { z } from "zod";

// GET /api/admin/products - Fetch all products (admin only)
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Check admin role
    if (session.user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: "Forbidden - Admin access required",
      }, { status: 403 });
    }

    const allProducts = await db.select().from(products);

    // Transform data
    const transformedProducts = allProducts.map(p => ({
      ...p,
      price: parseFloat(p.price as string),
      rating: parseFloat(p.rating as string),
      stock: parseInt(p.stock as string || '0'),
    }));

    return NextResponse.json({
      success: true,
      data: transformedProducts,
    });

  } catch (error) {
    console.error("Error fetching products:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to fetch products",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// POST /api/admin/products - Create a new product (admin only)
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Check admin role
    if (session.user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: "Forbidden - Admin access required",
      }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();

    // Generate ID if not provided
    if (!body.id) {
      body.id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    }

    const validatedData = insertProductSchema.parse(body);

    // Insert product
    const newProduct = await db
      .insert(products)
      .values({
        ...validatedData,
        price: validatedData.price.toString(),
        rating: validatedData.rating.toString(),
        stock: validatedData.stock.toString(),
      })
      .returning();

    // Transform response
    const transformedProduct = {
      ...newProduct[0],
      price: parseFloat(newProduct[0].price as string),
      rating: parseFloat(newProduct[0].rating as string),
      stock: parseInt(newProduct[0].stock as string || '0'),
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    }, { status: 201 });

  } catch (error) {
    console.error("Error creating product:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Invalid product data",
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: "Failed to create product",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// PUT /api/admin/products - Update a product (admin only)
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Check admin role
    if (session.user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: "Forbidden - Admin access required",
      }, { status: 403 });
    }

    // Parse and validate request body
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({
        success: false,
        error: "Product ID is required",
      }, { status: 400 });
    }

    const validatedData = insertProductSchema.partial().parse(body);

    // Update product
    const updatedProduct = await db
      .update(products)
      .set({
        ...validatedData,
        price: validatedData.price?.toString(),
        rating: validatedData.rating?.toString(),
        stock: validatedData.stock?.toString(),
        updatedAt: new Date(),
      })
      .where(eq(products.id, body.id))
      .returning();

    if (!updatedProduct || updatedProduct.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      }, { status: 404 });
    }

    // Transform response
    const transformedProduct = {
      ...updatedProduct[0],
      price: parseFloat(updatedProduct[0].price as string),
      rating: parseFloat(updatedProduct[0].rating as string),
      stock: parseInt(updatedProduct[0].stock as string || '0'),
    };

    return NextResponse.json({
      success: true,
      data: transformedProduct,
    });

  } catch (error) {
    console.error("Error updating product:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Invalid product data",
        details: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: "Failed to update product",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}

// DELETE /api/admin/products - Delete a product (admin only)
export async function DELETE(request: NextRequest) {
  try {
    // Verify authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({
        success: false,
        error: "Unauthorized",
      }, { status: 401 });
    }

    // Check admin role
    if (session.user.role !== 'admin') {
      return NextResponse.json({
        success: false,
        error: "Forbidden - Admin access required",
      }, { status: 403 });
    }

    // Get product ID from request body
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json({
        success: false,
        error: "Product ID is required",
      }, { status: 400 });
    }

    // Delete product
    const deletedProduct = await db
      .delete(products)
      .where(eq(products.id, body.id))
      .returning();

    if (!deletedProduct || deletedProduct.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Product not found",
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Error deleting product:", error);

    return NextResponse.json({
      success: false,
      error: "Failed to delete product",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
