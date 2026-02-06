import { db } from "@/db";
import { products } from "@/db/schema";
import { eq, like, or, sql, desc, asc } from "drizzle-orm";

export async function getProducts(options: {
  category?: string;
  search?: string;
  limit?: number;
  offset?: number;
  sort?: 'name' | 'price' | 'rating';
  order?: 'asc' | 'desc';
} = {}) {
  const {
    category = 'All',
    search = '',
    limit = 50,
    offset = 0,
    sort = 'name',
    order = 'asc',
  } = options;

  let queryBuilder = db.select().from(products);

  // Build conditions
  const conditions = [];

  if (category !== 'All') {
    conditions.push(sql`${products.category} = ${category}`);
  }

  if (search) {
    const searchTerm = `%${search}%`;
    conditions.push(
      or(
        like(products.name, searchTerm),
        like(products.description, searchTerm)
      )
    );
  }

  // Apply conditions
  if (conditions.length > 0) {
    // @ts-ignore
    queryBuilder = queryBuilder.where(conditions.length === 1 ? conditions[0] : sql`${conditions.join(' AND ')}`);
  }

  // Apply sorting
  const sortColumnMap = {
    name: products.name,
    price: products.price,
    rating: products.rating,
  };
  const orderByColumn = sortColumnMap[sort as keyof typeof sortColumnMap] || products.name;
  const orderByClause = order === 'asc' ? asc(orderByColumn) : desc(orderByColumn);
  // @ts-ignore
  queryBuilder = queryBuilder.orderBy(orderByClause);

  // Apply pagination
  // @ts-ignore
  queryBuilder = queryBuilder.limit(limit).offset(offset);

  const results = await queryBuilder;

  // Transform numeric strings to numbers
  return results.map(p => ({
    ...p,
    price: parseFloat(p.price as string),
    rating: parseFloat(p.rating as string),
    stock: p.stock as number,
  }));
}

export async function getProductById(id: string) {
  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!result || result.length === 0) {
    return null;
  }

  const product = result[0];
  return {
    ...product,
    price: parseFloat(product.price as string),
    rating: parseFloat(product.rating as string),
    stock: product.stock as number,
  };
}

export async function getProductCount(options: {
  category?: string;
  search?: string;
} = {}): Promise<number> {
  const { category = 'All', search = '' } = options;

  // Simple count implementation
  const products = await getProducts({ category, search, limit: 1000 });
  return products.length;
}
