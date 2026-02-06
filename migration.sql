-- ========================================
-- PayFast Checkout 数据库迁移脚本
-- ========================================

-- 1. 创建订单状态枚举
CREATE TYPE "order_status" AS ENUM('pending', 'paid', 'failed', 'cancelled');

-- 2. 创建订单表
CREATE TABLE "orders" (
  "id" text PRIMARY KEY NOT NULL,
  "userId" text NOT NULL,
  "status" "order_status" DEFAULT 'pending' NOT NULL,
  "total" numeric(10, 2) NOT NULL,
  "currency" text DEFAULT 'zar' NOT NULL,
  "pfPaymentId" text,
  "merchantOrderId" text,
  "customerName" text,
  "customerEmail" text NOT NULL,
  "paymentMethod" text,
  "paymentDate" timestamp,
  "itemName" text NOT NULL,
  "itemDescription" text,
  "createdAt" timestamp DEFAULT now(),
  "updatedAt" timestamp DEFAULT now(),
  CONSTRAINT "orders_pfPaymentId_unique" UNIQUE("pfPaymentId")
);

-- 3. 创建订单项表
CREATE TABLE "order_items" (
  "id" text PRIMARY KEY NOT NULL,
  "orderId" text NOT NULL,
  "productId" text NOT NULL,
  "productName" text NOT NULL,
  "productCategory" text NOT NULL,
  "price" numeric(10, 2) NOT NULL,
  "quantity" integer NOT NULL,
  "image" text NOT NULL,
  "createdAt" timestamp DEFAULT now()
);

-- 4. 更新 products 表的 stock 字段（带类型转换）
-- 第一步：将现有的 text 数据转换为 integer（如果数据都是数字）
ALTER TABLE "products" ALTER COLUMN "stock" SET DATA TYPE integer USING "stock"::integer;

-- 第二步：设置 NOT NULL 约束
ALTER TABLE "products" ALTER COLUMN "stock" SET NOT NULL;

-- 5. 设置默认值
ALTER TABLE "products" ALTER COLUMN "stock" SET DEFAULT 0;

-- 6. 添加外键约束
ALTER TABLE "orders" ADD CONSTRAINT "orders_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_orderId_orders_id_fk" FOREIGN KEY ("orderId") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_products_id_fk" FOREIGN KEY ("productId") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;

-- 7. 创建索引
CREATE INDEX "orders_user_id_idx" ON "orders" USING btree ("userId");
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");
CREATE INDEX "orders_pf_payment_id_idx" ON "orders" USING btree ("pfPaymentId");
CREATE INDEX "order_items_order_id_idx" ON "order_items" USING btree ("orderId");
CREATE INDEX "order_items_product_id_idx" ON "order_items" USING btree ("productId");

-- ========================================
-- 完成！
-- ========================================
