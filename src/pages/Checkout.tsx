import { Cart } from "@/types";
import { useState } from "react";
import emptyCart from "@/assets/images/empty-cart.png";
import { PrimaryLabel } from "./ProductDetail";
import { useLocalStorage } from "@/hooks";

export default function Checkout() {
  const [cart, setCart] = useState<Cart>();
  

  const [value, setValue] = useLocalStorage('carts', 0);

  const classes = {
    emptyImage: "w-[160px] md:w-[200px] mx-auto h-auto",
    p: "text-[16px] text-[#333] text-center",
  };

  const Empty = (
    <div className="">
      <img src={emptyCart} className={classes.emptyImage} alt="" />
      <p className={classes.p}>Chưa có sản phẩm</p>
    </div>
  );
  return (
    <div className="">
      {PrimaryLabel("shopping_cart", `Cart (${value})`)}

      {!cart && Empty}
    </div>
  );
}
