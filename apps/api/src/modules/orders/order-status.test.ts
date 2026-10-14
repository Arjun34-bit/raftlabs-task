import { describe, expect, it } from "vitest";
import { canTransition } from "./order-status.js";
describe("order state machine", () => {
  it("allows the fulfillment path", () => { expect(canTransition("RECEIVED", "PREPARING")).toBe(true); expect(canTransition("PREPARING", "OUT_FOR_DELIVERY")).toBe(true); expect(canTransition("OUT_FOR_DELIVERY", "DELIVERED")).toBe(true); });
  it("allows cancellation before dispatch", () => { expect(canTransition("RECEIVED", "CANCELLED")).toBe(true); expect(canTransition("PREPARING", "CANCELLED")).toBe(true); });
  it("rejects backwards and terminal transitions", () => { expect(canTransition("DELIVERED", "PREPARING")).toBe(false); expect(canTransition("CANCELLED", "RECEIVED")).toBe(false); });
});
