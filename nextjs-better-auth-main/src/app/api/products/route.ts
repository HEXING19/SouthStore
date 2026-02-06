import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products } from "@/db/schema";
import { sql, and, or, like, desc, asc } from "drizzle-orm";
import { z } from "zod";

// Query parameter validation schema
const querySchema = z.object({
  category: z.enum(['Clothing', 'Hardware', 'Home', 'Electronics', 'All']).optional().default('All'),
  search: z.string().optional().default(''),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
  sort: z.enum(['name', 'price', 'rating']).optional().default('name'),
  order: z.enum(['asc', 'desc']).optional().default('asc'),
});

// GET /api/products - Fetch all products with filtering, search, sorting, and pagination
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Validate query parameters
    const query = querySchema.parse({
      category: searchParams.get('category') || 'All',
      search: searchParams.get('search') || '',
      limit: searchParams.get('limit') || 50,
      offset: searchParams.get('offset') || 0,
      sort: searchParams.get('sort') || 'name',
      order: searchParams.get('order') || 'asc',
    });

    // Build base query
    let queryBuilder = db.select().from(products);

    // Build conditions
    const conditions = [];

    if (query.category !== 'All') {
      conditions.push(sql`${products.category} = ${query.category}`);
    }

    if (query.search) {
      const searchTerm = `%${query.search}%`;
      conditions.push(
        or(
          like(products.name, searchTerm),
          like(products.description, searchTerm)
        )
      );
    }

    // Apply conditions
    if (conditions.length > 0) {
      // @ts-ignore - Drizzle types are complex with dynamic conditions
      queryBuilder = queryBuilder.where(conditions.length === 1 ? conditions[0] : and(...conditions));
    }

    // Apply sorting
    const sortColumnMap = {
      name: products.name,
      price: products.price,
      rating: products.rating,
    };
    const orderByColumn = sortColumnMap[query.sort as keyof typeof sortColumnMap] || products.name;
    const orderByClause = query.order === 'asc' ? asc(orderByColumn) : desc(orderByColumn);
    // @ts-ignore
    queryBuilder = queryBuilder.orderBy(orderByClause);

    // Apply pagination
    // @ts-ignore
    queryBuilder = queryBuilder.limit(query.limit).offset(query.offset);

    const allProducts = await queryBuilder;

    // Transform data to convert numeric strings to numbers
    const transformedProducts = allProducts.map(p => ({
      ...p,
      price: parseFloat(p.price as string),
      rating: parseFloat(p.rating as string),
      stock: p.stock as number,
    }));

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      meta: {
        count: transformedProducts.length,
        limit: query.limit,
        offset: query.offset,
      }
    });

  } catch (error) {
    console.error("Error fetching products:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: "Invalid query parameters",
        details: error.issues,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: "Failed to fetch products",
      details: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
}
