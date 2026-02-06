import { pgTable, text, numeric, timestamp, index, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { user } from "./auth/user";

export const orderStatusEnum = pgEnum("order_status", ['pending', 'paid', 'failed', 'cancelled']);

export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => user.id).notNull(),
  status: orderStatusEnum("status").default('pending').notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default('zar').notNull(),
  // PayFast specific fields
  pfPaymentId: text("pfPaymentId").unique(), // PayFast payment ID
  merchantOrderId: text("merchantOrderId"), // Our order ID
  // Customer info
  customerName: text("customerName"),
  customerEmail: text("customerEmail").notNull(),
  // Payment info
  paymentMethod: text("paymentMethod"), // EFT, Credit Card, etc
  paymentDate: timestamp("paymentDate"),
  // Metadata
  itemName: text("itemName").notNull(), // Item description for PayFast
  itemDescription: text("itemDescription"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  userIdIdx: index("orders_user_id_idx").on(table.userId),
  statusIdx: index("orders_status_idx").on(table.status),
  pfPaymentIdIdx: index("orders_pf_payment_id_idx").on(table.pfPaymentId),
}));

// Zod validation schemas
export const insertOrderSchema = createInsertSchema(orders, {
  id: z.string().min(1).optional(),
  userId: z.string().min(1),
  status: z.enum(['pending', 'paid', 'failed', 'cancelled']),
  total: z.number().positive(),
  currency: z.string().default('zar'),
  pfPaymentId: z.string().optional(),
  merchantOrderId: z.string().optional(),
  customerName: z.string().optional(),
  customerEmail: z.string().email(),
  paymentMethod: z.string().optional(),
  paymentDate: z.date().optional(),
  itemName: z.string().min(1),
  itemDescription: z.string().optional(),
});

export const selectOrderSchema = createSelectSchema(orders);

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
