import type { ApiSuccess, CreateOrderInput, MenuItem, Order, OrderStatus } from "@raftlabs/shared";
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000/api/v1";
async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE}${path}`, { ...init, headers: { "Content-Type": "application/json", ...init?.headers } });
  const json = await response.json(); if (!response.ok) throw new Error(json.error?.message || "Request failed"); return (json as ApiSuccess<T>).data;
}
export const api = {
  menu: () => request<MenuItem[]>("/menu"),
  createOrder: (input: CreateOrderInput, key: string) => request<{ orderId: string; trackingId: string; status: OrderStatus; totalMinor: number }>("/orders", { method: "POST", headers: { "Idempotency-Key": key }, body: JSON.stringify(input) }),
  track: (id: string) => request<Order>(`/track/${id}`),
  myOrders: (trackingIds: string[]) => request<Order[]>("/track/orders", { method: "POST", body: JSON.stringify({ trackingIds }) }),
  orders: () => request<Order[]>("/orders", { headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "" } }),
  setStatus: (id: string, status: OrderStatus) => request<Order>(`/orders/${id}/status`, { method: "PATCH", headers: { "x-admin-key": process.env.NEXT_PUBLIC_ADMIN_API_KEY || "" }, body: JSON.stringify({ status }) }),
  eventsUrl: (id: string) => `${BASE}/track/${id}/events`
};
