import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MenuCard } from "./menu-card";
import { useCart } from "@/store/cart";
const item={id:"11111111-1111-4111-8111-111111111111",name:"Truffle Pizza",description:"Mushroom and truffle",priceMinor:54900,imageUrl:"https://images.unsplash.com/photo.jpg",isAvailable:true};
describe("MenuCard",()=>{beforeEach(()=>useCart.setState({lines:[]}));it("renders the item and adds it to the cart",()=>{render(<MenuCard item={item}/>);expect(screen.getByText("Truffle Pizza")).toBeInTheDocument();expect(screen.getByText("₹549.00")).toBeInTheDocument();fireEvent.click(screen.getByRole("button",{name:/add/i}));expect(useCart.getState().lines[0]).toMatchObject({item,quantity:1})})});
