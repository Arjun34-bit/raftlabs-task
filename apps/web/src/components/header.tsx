"use client";
import Link from "next/link";
import { ClipboardList, ShoppingBag, UtensilsCrossed } from "lucide-react";
import { useCart } from "@/store/cart";
export function Header() { const count = useCart(s => s.lines.length); return <header className="site-header"><Link className="brand" href="/"><span className="brand-icon"><UtensilsCrossed size={20}/></span><span>Feast<span>Fleet</span></span></Link><nav><Link href="/">Menu</Link><Link className="orders-link" href="/orders"><ClipboardList size={18}/><span>My Orders</span></Link><Link className="cart-link" href="/cart"><ShoppingBag size={19}/><span>Cart</span>{count > 0 && <b>{count}</b>}</Link></nav></header>; }
