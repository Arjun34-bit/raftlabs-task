import { beforeEach, describe, expect, it } from "vitest";
import { cartTotal, useCart } from "./cart";
const item={id:"1",name:"Dish",description:null,priceMinor:25000,imageUrl:"x",isAvailable:true};
describe("cart store",()=>{beforeEach(()=>useCart.setState({lines:[]}));it("adds, increments, decrements and removes items",()=>{useCart.getState().add(item);useCart.getState().increment(item.id);expect(cartTotal(useCart.getState().lines)).toBe(50000);useCart.getState().decrement(item.id);expect(useCart.getState().lines[0].quantity).toBe(1);useCart.getState().remove(item.id);expect(useCart.getState().lines).toHaveLength(0)})});
