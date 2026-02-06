import { pgTable, text, numeric, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  description: text("description").notNull(),
  image: text("image").notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).notNull().default("0"),
  stock: integer("stock").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  categoryIdx: index("products_category_idx").on(table.category),
  nameIdx: index("products_name_idx").on(table.name),
}));

// Zod validation schemas
export const insertProductSchema = createInsertSchema(products, {
  id: z.string().min(1).optional(),
  name: z.string().min(1),
  category: z.enum(['Clothing', 'Hardware', 'Home', 'Electronics']),
  price: z.coerce.number().positive(),
  description: z.string().min(1),
  image: z.string().url().or(z.string().startsWith('/')),
  rating: z.coerce.number().min(0).max(5).default(0),
  stock: z.coerce.number().min(0).default(0),
});

export const selectProductSchema = createSelectSchema(products);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
