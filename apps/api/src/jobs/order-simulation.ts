import type { OrderStatus } from "@raftlabs/shared";
import { env } from "../config/env.js";
import { orderRepository } from "../modules/orders/order.repository.js";
import { orderService } from "../modules/orders/order.service.js";
const automatic:Partial<Record<OrderStatus,OrderStatus>>={RECEIVED:"PREPARING",PREPARING:"OUT_FOR_DELIVERY",OUT_FOR_DELIVERY:"DELIVERED"};
export function startOrderSimulation(){if(!env.DEMO_MODE)return()=>{};let running=false;const timer=setInterval(async()=>{if(running)return;running=true;try{for(const {id} of await orderRepository.due()){const order=await orderService.get(id);const target=automatic[order.status as OrderStatus];if(target)await orderService.transition(id,target,true).catch(()=>undefined)}}finally{running=false}},2_000);timer.unref();return()=>clearInterval(timer)}
