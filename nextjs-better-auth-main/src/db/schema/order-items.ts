import { pgTable, text, numeric, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { orders } from "./orders";
import { products } from "./products";

export const orderItems = pgTable("order_items", {
  id: text("id").primaryKey(),
  orderId: text("orderId").references(() => orders.id).notNull(),
  productId: text("productId").references(() => products.id).notNull(),
  productName: text("productName").notNull(), // 保存快照
  productCategory: text("productCategory").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(), // 购买时价格
  quantity: integer("quantity").notNull(),
  image: text("image").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
}, (table) => ({
  orderIdIdx: index("order_items_order_id_idx").on(table.orderId),
  productIdIdx: index("order_items_product_id_idx").on(table.productId),
}));

// Zod validation schemas
export const insertOrderItemSchema = createInsertSchema(orderItems, {
  id: z.string().min(1).optional(),
  orderId: z.string().min(1),
  productId: z.string().min(1),
  productName: z.string().min(1),
  productCategory: z.string().min(1),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.string().min(1),
});

export const selectOrderItemSchema = createSelectSchema(orderItems);

export type OrderItem = typeof orderItems.$inferSelect;
export type NewOrderItem = typeof orderItems.$inferInsert;
