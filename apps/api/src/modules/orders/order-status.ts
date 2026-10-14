import type { OrderStatus } from "@raftlabs/shared";
export const transitions: Record<OrderStatus, OrderStatus[]> = {
  RECEIVED: ["PREPARING", "CANCELLED"], PREPARING: ["OUT_FOR_DELIVERY", "CANCELLED"],
  OUT_FOR_DELIVERY: ["DELIVERED"], DELIVERED: [], CANCELLED: []
};
export const canTransition = (from: OrderStatus, to: OrderStatus) => transitions[from].includes(to);
