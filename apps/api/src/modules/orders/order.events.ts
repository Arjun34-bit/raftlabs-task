import { EventEmitter } from "node:events";
export const orderEvents = new EventEmitter();
orderEvents.setMaxListeners(100);
