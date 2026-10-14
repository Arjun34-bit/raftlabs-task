"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type RecentOrdersStore = {
  trackingIds: string[];
  add: (trackingId: string) => void;
};

export const useRecentOrders = create<RecentOrdersStore>()(persist((set) => ({
  trackingIds: [],
  add: trackingId => set(state => ({ trackingIds: [trackingId, ...state.trackingIds.filter(id => id !== trackingId)].slice(0, 20) }))
}), { name: "raft-recent-orders" }));
