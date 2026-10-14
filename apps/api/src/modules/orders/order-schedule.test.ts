import { describe, expect, it } from "vitest";
import { automaticTransition, nextTransitionAt } from "./order-schedule.js";

describe("order simulation schedule", () => {
  const createdAt = new Date("2026-01-01T00:00:00.000Z");

  it("uses absolute times measured from order creation", () => {
    expect(nextTransitionAt("RECEIVED", createdAt)!.getTime() - createdAt.getTime()).toBe(10_000);
    expect(nextTransitionAt("PREPARING", createdAt)!.getTime() - createdAt.getTime()).toBe(25_000);
    expect(nextTransitionAt("OUT_FOR_DELIVERY", createdAt)!.getTime() - createdAt.getTime()).toBe(45_000);
  });

  it("has no schedule after a terminal status", () => {
    expect(nextTransitionAt("DELIVERED", createdAt)).toBeNull();
    expect(nextTransitionAt("CANCELLED", createdAt)).toBeNull();
  });

  it("follows the fulfillment lifecycle", () => {
    expect(automaticTransition).toEqual({
      RECEIVED: "PREPARING",
      PREPARING: "OUT_FOR_DELIVERY",
      OUT_FOR_DELIVERY: "DELIVERED"
    });
  });
});
