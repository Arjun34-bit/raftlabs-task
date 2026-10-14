import type { OrderStatus } from "@raftlabs/shared";
import { env } from "../config/env.js";
import { orderRepository } from "../modules/orders/order.repository.js";
import { automaticTransition } from "../modules/orders/order-schedule.js";
import { orderService } from "../modules/orders/order.service.js";

export function startOrderSimulation() {
  if (!env.DEMO_MODE) return () => undefined;

  let running = false;

  const processDueOrders = async () => {
    if (running) return;
    running = true;

    try {
      for (const { id } of await orderRepository.due()) {
        // Catch up deterministically when the service was offline past more than
        // one absolute transition timestamp. The conditional UPDATE in the
        // repository makes concurrent workers safe: only one can update from
        // the expected previous status.
        for (let transitionCount = 0; transitionCount < 3; transitionCount += 1) {
          const order = await orderService.get(id);
          const status = order.status as OrderStatus;
          const target = automaticTransition[status];
          const isDue = order.nextTransitionAt && order.nextTransitionAt <= new Date();

          if (!target || !isDue) break;

          try {
            await orderService.transition(id, target, true);
          } catch (error) {
            const code = (error as { code?: string }).code;
            if (code !== "CONCURRENT_UPDATE") console.error(`Order simulation failed for ${id}`, error);
            break;
          }
        }
      }
    } catch (error) {
      console.error("Order simulation polling failed", error);
    } finally {
      running = false;
    }
  };

  void processDueOrders();
  const timer = setInterval(processDueOrders, env.ORDER_WORKER_INTERVAL_MS);
  timer.unref();

  return () => clearInterval(timer);
}
