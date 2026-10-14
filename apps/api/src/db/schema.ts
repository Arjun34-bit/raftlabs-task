import { pgTable, uuid, varchar, text, integer, boolean, timestamp, index } from "drizzle-orm/pg-core";
export const menuItems = pgTable("menu_items", {
  id: uuid("id").primaryKey().defaultRandom(), name: varchar("name", { length: 150 }).notNull(), description: text("description"),
  priceMinor: integer("price_minor").notNull(), imageUrl: text("image_url").notNull(), isAvailable: boolean("is_available").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow()
});
export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(), trackingId: uuid("tracking_id").notNull().defaultRandom().unique(), customerName: varchar("customer_name", { length: 120 }).notNull(),
  idempotencyKey: varchar("idempotency_key", { length: 100 }).unique(),
  customerPhone: varchar("customer_phone", { length: 20 }).notNull(), deliveryAddress: text("delivery_address").notNull(), totalMinor: integer("total_minor").notNull(),
  subtotalMinor: integer("subtotal_minor").notNull(), taxMinor: integer("tax_minor").notNull().default(0),
  platformFeeMinor: integer("platform_fee_minor").notNull().default(0), deliveryFeeMinor: integer("delivery_fee_minor").notNull().default(0),
  discountMinor: integer("discount_minor").notNull().default(0), promoCode: varchar("promo_code", { length: 30 }),
  status: varchar("status", { length: 30 }).notNull().default("RECEIVED"), nextTransitionAt: timestamp("next_transition_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(), updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
});
export const orderItems = pgTable("order_items", {
  id: uuid("id").primaryKey().defaultRandom(), orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  menuItemId: uuid("menu_item_id").notNull().references(() => menuItems.id), itemName: varchar("item_name", { length: 150 }).notNull(),
  quantity: integer("quantity").notNull(), unitPriceMinor: integer("unit_price_minor").notNull(), lineTotalMinor: integer("line_total_minor").notNull()
}, t => [index("order_items_order_idx").on(t.orderId)]);
export const statusHistory = pgTable("order_status_history", {
  id: uuid("id").primaryKey().defaultRandom(), orderId: uuid("order_id").notNull().references(() => orders.id, { onDelete: "cascade" }),
  fromStatus: varchar("from_status", { length: 30 }), toStatus: varchar("to_status", { length: 30 }).notNull(), changedAt: timestamp("changed_at", { withTimezone: true }).notNull().defaultNow()
}, t => [index("status_history_order_idx").on(t.orderId)]);
