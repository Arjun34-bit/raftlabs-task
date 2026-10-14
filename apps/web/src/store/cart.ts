"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@raftlabs/shared";
export type CartLine = { item: MenuItem; quantity: number };
type CartStore = { lines: CartLine[]; add: (item: MenuItem) => void; increment: (id: string) => void; decrement: (id: string) => void; remove: (id: string) => void; clear: () => void };
export const useCart = create<CartStore>()(persist((set) => ({
  lines: [], add: item => set(s => ({ lines: s.lines.some(l => l.item.id === item.id) ? s.lines.map(l => l.item.id === item.id ? { ...l, quantity: Math.min(20, l.quantity + 1) } : l) : [...s.lines, { item, quantity: 1 }] })),
  increment: id => set(s => ({ lines: s.lines.map(l => l.item.id === id ? { ...l, quantity: Math.min(20, l.quantity + 1) } : l) })),
  decrement: id => set(s => ({ lines: s.lines.flatMap(l => l.item.id !== id ? [l] : l.quantity > 1 ? [{ ...l, quantity: l.quantity - 1 }] : []) })),
  remove: id => set(s => ({ lines: s.lines.filter(l => l.item.id !== id) })), clear: () => set({ lines: [] })
}), { name: "raft-cart" }));
export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.item.priceMinor * l.quantity, 0);
