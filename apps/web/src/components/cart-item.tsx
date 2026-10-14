"use client";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { formatMoney } from "@raftlabs/shared";
import type { CartLine } from "@/store/cart";
import { useCart } from "@/store/cart";
export function CartItem({ line }: { line: CartLine }) { const { increment, decrement, remove } = useCart(); return <div className="cart-item"><Image src={line.item.imageUrl} alt="" width={92} height={92}/><div className="cart-info"><h3>{line.item.name}</h3><span>{formatMoney(line.item.priceMinor)} each</span><button className="remove" onClick={() => remove(line.item.id)}><Trash2 size={14}/> Remove</button></div><div className="quantity" aria-label={`Quantity for ${line.item.name}`}><button aria-label="Decrease quantity" onClick={() => decrement(line.item.id)}><Minus size={16}/></button><b>{line.quantity}</b><button aria-label="Increase quantity" onClick={() => increment(line.item.id)}><Plus size={16}/></button></div><strong>{formatMoney(line.item.priceMinor * line.quantity)}</strong></div>; }
