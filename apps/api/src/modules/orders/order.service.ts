import type { CreateOrderInput, OrderStatus } from "@raftlabs/shared";
import { orderRepository } from "./order.repository.js";
import { canTransition } from "./order-status.js";
import { orderEvents } from "./order.events.js";
export const orderService = {
  create: (input: CreateOrderInput, key?: string) => orderRepository.create(input, key),
  getPublic: async (trackingId: string) => { const order = await orderRepository.findByTrackingId(trackingId); if (!order) throw notFound(); return order; },
  listPublic: (trackingIds: string[]) => orderRepository.findByTrackingIds(trackingIds),
  get: async (id: string) => { const order = await orderRepository.findById(id); if (!order) throw notFound(); return order; },
  list: () => orderRepository.list(),
  async update(id: string, values: Parameters<typeof orderRepository.update>[1]) { const order = await orderRepository.update(id, values); if (!order) throw notFound(); return order; },
  async transition(id: string, to: OrderStatus, automated = false) { const current = await this.get(id); const from = current.status as OrderStatus; if (!canTransition(from, to)) throw Object.assign(new Error(`Cannot change order from ${from} to ${to}`), { status: 409, code: "INVALID_STATUS_TRANSITION" }); const nextTransitionAt = automated && to !== "DELIVERED" ? new Date(Date.now() + (to === "PREPARING" ? 15_000 : 20_000)) : null; const updated = await orderRepository.transition(id, from, to, nextTransitionAt); if (!updated) throw Object.assign(new Error("Order changed concurrently; try again"), { status: 409, code: "CONCURRENT_UPDATE" }); orderEvents.emit(id, updated); orderEvents.emit(current.trackingId, updated); return updated; },
  async cancel(id: string) { return this.transition(id, "CANCELLED"); }
};
const notFound = () => Object.assign(new Error("Order not found"), { status: 404, code: "NOT_FOUND" });
