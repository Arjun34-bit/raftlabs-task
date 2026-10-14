"use client";
import Image from "next/image";
import { Plus } from "lucide-react";
import type { MenuItem } from "@raftlabs/shared";
import { formatMoney } from "@raftlabs/shared";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
export function MenuCard({ item }: { item: MenuItem }) { const add = useCart(s => s.add); return <article className="menu-card"><div className="food-image"><Image src={item.imageUrl} alt={item.name} fill sizes="(max-width: 700px) 100vw, 33vw"/></div><div className="menu-card-body"><div><h3>{item.name}</h3><p>{item.description}</p></div><div className="card-footer"><strong>{formatMoney(item.priceMinor)}</strong><button onClick={() => { add(item); toast.success(`${item.name} added`); }}><Plus size={17}/> Add</button></div></div></article>; }
