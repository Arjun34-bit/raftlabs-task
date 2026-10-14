import type { OrderStatus } from "@raftlabs/shared";
import { env } from "../../config/env.js";

export const automaticTransition: Partial<Record<OrderStatus, OrderStatus>> = {
  RECEIVED: "PREPARING",
  PREPARING: "OUT_FOR_DELIVERY",
  OUT_FOR_DELIVERY: "DELIVERED"
};

const elapsedByStatus: Partial<Record<OrderStatus, number>> = {
  RECEIVED: env.ORDER_PREPARING_DELAY_MS,
  PREPARING: env.ORDER_DELIVERY_START_DELAY_MS,
  OUT_FOR_DELIVERY: env.ORDER_DELIVERED_DELAY_MS
};

export const nextTransitionAt = (status: OrderStatus, createdAt: Date) => {
  const elapsed = elapsedByStatus[status];
  return elapsed === undefined ? null : new Date(createdAt.getTime() + elapsed);
};
