import { CheckCircle2 } from "lucide-react";
import { formatMoney } from "@raftlabs/shared";

type Pricing = { subtotalMinor: number; taxMinor: number; platformFeeMinor: number; deliveryFeeMinor: number; discountMinor: number; totalMinor: number; promoCode?: string | null };

export function OrderPricing({ pricing }: { pricing: Pricing }) {
  const beforeDiscount = pricing.totalMinor + pricing.discountMinor;
  return <div className="pricing-breakdown">
    <div className="summary-row"><span>Item subtotal</span><b>{formatMoney(pricing.subtotalMinor)}</b></div>
    <div className="summary-row"><span>Taxes</span><b>{formatMoney(pricing.taxMinor)}</b></div>
    <div className="summary-row"><span>Platform fee</span><b>{formatMoney(pricing.platformFeeMinor)}</b></div>
    <div className="summary-row"><span>Delivery fee</span><b>{pricing.deliveryFeeMinor ? formatMoney(pricing.deliveryFeeMinor) : <span className="free-fee">FREE</span>}</b></div>
    {pricing.discountMinor > 0 && <div className="summary-row discount-row"><span><CheckCircle2 size={15}/> {pricing.promoCode} applied</span><b>−{formatMoney(pricing.discountMinor)}</b></div>}
    <div className="summary-row total"><span>Final total</span><span>{pricing.discountMinor > 0 && <del>{formatMoney(beforeDiscount)}</del>} {formatMoney(pricing.totalMinor)}</span></div>
  </div>;
}
