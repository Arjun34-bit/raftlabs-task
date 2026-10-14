import { and, asc, desc, eq, inArray, lte } from "drizzle-orm";
import { db } from "../../db/client.js";
import { menuItems, orderItems, orders, statusHistory } from "../../db/schema.js";
import { calculatePricing, type CreateOrderInput, type OrderStatus } from "@raftlabs/shared";

const hydrate = async (order: typeof orders.$inferSelect | undefined, includePrivate = true) => {
  if (!order) return undefined;
  const [items, history] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
    db.select().from(statusHistory).where(eq(statusHistory.orderId, order.id)).orderBy(asc(statusHistory.changedAt))
  ]);
  return { ...order, customerPhone: includePrivate ? order.customerPhone : undefined, items, history };
};
export const orderRepository = {
  async create(input: CreateOrderInput, idempotencyKey?: string) {
    if (idempotencyKey) {
      const existing = (await db.select().from(orders).where(eq(orders.idempotencyKey, idempotencyKey)).limit(1))[0];
      if (existing) return hydrate(existing);
    }
    return db.transaction(async tx => {
      const requested = [...new Set(input.items.map(i => i.menuItemId))];
      const products = await tx.select().from(menuItems).where(eq(menuItems.isAvailable, true));
      const selected = products.filter(p => requested.includes(p.id));
      if (selected.length !== requested.length) throw Object.assign(new Error("One or more menu items are unavailable"), { status: 422, code: "ITEM_UNAVAILABLE" });
      const lines = input.items.map(item => { const product = selected.find(p => p.id === item.menuItemId)!; return { product, quantity: item.quantity, lineTotalMinor: product.priceMinor * item.quantity }; });
      const pricing = calculatePricing(lines.reduce((sum, line) => sum + line.lineTotalMinor, 0), input.promoCode);
      const [order] = await tx.insert(orders).values({ idempotencyKey, customerName: input.customer.name, customerPhone: input.customer.phone, deliveryAddress: input.customer.address, ...pricing, nextTransitionAt: new Date(Date.now() + 10_000) }).returning();
      await tx.insert(orderItems).values(lines.map(({ product, quantity, lineTotalMinor }) => ({ orderId: order.id, menuItemId: product.id, itemName: product.name, quantity, unitPriceMinor: product.priceMinor, lineTotalMinor })));
      await tx.insert(statusHistory).values({ orderId: order.id, fromStatus: null, toStatus: "RECEIVED" });
      return hydrate(order);
    });
  },
  async findByTrackingId(id: string) { return hydrate((await db.select().from(orders).where(eq(orders.trackingId, id)).limit(1))[0], false); },
  async findByTrackingIds(ids: string[]) { if (!ids.length) return []; const rows = await db.select().from(orders).where(inArray(orders.trackingId, ids)).orderBy(desc(orders.createdAt)); return Promise.all(rows.map(order => hydrate(order, false))); },
  async findById(id: string) { return hydrate((await db.select().from(orders).where(eq(orders.id, id)).limit(1))[0]); },
  async list() { const rows = await db.select().from(orders).orderBy(desc(orders.createdAt)).limit(100); return Promise.all(rows.map(o => hydrate(o))); },
  async update(id: string, values: { customerName?: string; customerPhone?: string; deliveryAddress?: string }) { const [row] = await db.update(orders).set({ ...values, updatedAt: new Date() }).where(eq(orders.id, id)).returning(); return hydrate(row); },
  async transition(id: string, from: OrderStatus, to: OrderStatus, nextTransitionAt: Date | null = null) {
    return db.transaction(async tx => {
      const [row] = await tx.update(orders).set({ status: to, updatedAt: new Date(), nextTransitionAt }).where(and(eq(orders.id, id), eq(orders.status, from))).returning();
      if (!row) return undefined;
      await tx.insert(statusHistory).values({ orderId: id, fromStatus: from, toStatus: to });
      return hydrate(row);
    });
  },
  due: () => db.select({ id: orders.id }).from(orders).where(lte(orders.nextTransitionAt, new Date())).limit(25),
  history: (id: string) => db.select().from(statusHistory).where(eq(statusHistory.orderId, id)).orderBy(asc(statusHistory.changedAt))
};
