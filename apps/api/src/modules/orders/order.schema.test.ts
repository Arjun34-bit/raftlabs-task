import { describe, expect, it } from "vitest";
import { createOrderSchema } from "./order.schema.js";
const valid = { customer: { name: "Rahul Sharma", phone: "9876543210", address: "Sion, Mumbai 400022" }, items: [{ menuItemId: "11111111-1111-4111-8111-111111111111", quantity: 2 }] };
describe("createOrderSchema", () => {
  it("accepts valid orders", () => expect(createOrderSchema.safeParse(valid).success).toBe(true));
  it("rejects an empty cart", () => expect(createOrderSchema.safeParse({ ...valid, items: [] }).success).toBe(false));
  it("rejects non-positive quantities", () => expect(createOrderSchema.safeParse({ ...valid, items: [{ ...valid.items[0], quantity: 0 }] }).success).toBe(false));
  it("rejects invalid customer details", () => expect(createOrderSchema.safeParse({ ...valid, customer: { name: "x", phone: "12", address: "short" } }).success).toBe(false));
});
