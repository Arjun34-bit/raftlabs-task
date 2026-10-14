import { z } from "zod";
import { ORDER_STATUSES } from "@raftlabs/shared";
export const createOrderSchema = z.object({
  customer: z.object({ name: z.string().trim().min(2).max(120), phone: z.string().trim().regex(/^\+?[0-9][0-9\s-]{7,18}$/), address: z.string().trim().min(10).max(500) }),
  items: z.array(z.object({ menuItemId: z.string().uuid(), quantity: z.number().int().min(1).max(20) })).min(1).max(25),
  promoCode: z.string().trim().max(30).optional()
});
export const trackingIdsSchema = z.object({ trackingIds: z.array(z.string().uuid()).max(20) });
export const updateOrderSchema = z.object({ customerName: z.string().trim().min(2).max(120).optional(), customerPhone: z.string().trim().min(8).max(20).optional(), deliveryAddress: z.string().trim().min(10).max(500).optional() }).refine(v => Object.keys(v).length > 0);
export const statusSchema = z.object({ status: z.enum(ORDER_STATUSES) });
