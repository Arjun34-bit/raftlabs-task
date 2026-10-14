export const ORDER_STATUSES = ["RECEIVED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
export type MenuItem = { id: string; name: string; description: string | null; priceMinor: number; imageUrl: string; isAvailable: boolean };
export type OrderItem = { id: string; menuItemId: string; itemName: string; quantity: number; unitPriceMinor: number; lineTotalMinor: number };
export type StatusHistory = { id: string; fromStatus: OrderStatus | null; toStatus: OrderStatus; changedAt: string };
export type Order = {
  id: string; trackingId: string; customerName: string; customerPhone?: string; deliveryAddress: string;
  subtotalMinor: number; taxMinor: number; platformFeeMinor: number; deliveryFeeMinor: number; discountMinor: number;
  promoCode?: string | null; totalMinor: number; status: OrderStatus; createdAt: string; updatedAt: string; items: OrderItem[]; history?: StatusHistory[];
};
export type CreateOrderInput = { customer: { name: string; phone: string; address: string }; items: { menuItemId: string; quantity: number }[]; promoCode?: string };
export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: { code: string; message: string; details?: unknown } };
export const formatMoney = (minor: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(minor / 100);
export const PROMO_CODE = "SAVE10";
export const calculatePricing = (subtotalMinor: number, promoCode?: string) => {
  const taxMinor = Math.round(subtotalMinor * 0.05);
  const platformFeeMinor = 900;
  const deliveryFeeMinor = subtotalMinor >= 80000 ? 0 : 4000;
  const validPromo = promoCode?.trim().toUpperCase() === PROMO_CODE;
  const discountMinor = validPromo ? Math.min(Math.round(subtotalMinor * 0.1), 15000) : 0;
  return { subtotalMinor, taxMinor, platformFeeMinor, deliveryFeeMinor, discountMinor, promoCode: validPromo ? PROMO_CODE : undefined, totalMinor: subtotalMinor + taxMinor + platformFeeMinor + deliveryFeeMinor - discountMinor };
};
