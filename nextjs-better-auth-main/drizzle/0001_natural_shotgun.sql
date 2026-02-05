CREATE TABLE "products" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"category" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"description" text NOT NULL,
	"image" text NOT NULL,
	"rating" numeric(3, 2) DEFAULT '0' NOT NULL,
	"stock" text DEFAULT '0',
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "products_category_idx" ON "products" USING btree ("category");--> statement-breakpoint
CREATE INDEX "products_name_idx" ON "products" USING btree ("name");