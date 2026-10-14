"use client";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatMoney } from "@raftlabs/shared";
import { CartItem } from "@/components/cart-item";
import { cartTotal, useCart } from "@/store/cart";
export default function CartPage(){const lines=useCart(s=>s.lines);const total=cartTotal(lines);return <section className="page-shell"><div className="page-head"><span className="kicker">YOUR ORDER</span><h1 className="page-title">The good stuff.</h1><p>Review your picks before heading to checkout.</p></div>{!lines.length?<div className="panel empty"><ShoppingBag size={48}/><h2>Your cart is empty</h2><p>There are plenty of delicious ways to fix that.</p><Link className="primary" href="/#menu">Browse the menu</Link></div>:<div className="two-col"><div className="cart-list">{lines.map(line=><CartItem key={line.item.id} line={line}/>)}</div><aside className="panel summary"><h2>Order summary</h2><div className="summary-row"><span>Subtotal</span><b>{formatMoney(total)}</b></div><div className="summary-row"><span>Delivery</span><b>Free</b></div><div className="summary-row total"><span>Total</span><span>{formatMoney(total)}</span></div><Link href="/checkout" className="primary">Continue to checkout</Link></aside></div>}</section>}
