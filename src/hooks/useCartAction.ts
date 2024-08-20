import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrivateRequest } from ".";
import { useDispatch, useSelector } from "react-redux";
import { sleep } from "@/utils/appHelper";
import { selectCart, setCart } from "@/store/cartSlice";

const CART_ITEM_URL = "/cart-items";

export default function useCartAction() {
   const dispatch = useDispatch();

   const { cartItems } = useSelector(selectCart);

   const [isFetching, setIsFetching] = useState(false);

   const privateRequest = usePrivateRequest();
   const navigate = useNavigate();
   const location = useLocation();

   type Add = {
      variant: "add";
      cartItem: CartItemSchema;
   };

   type Edit = {
      variant: "edit";
      cartItem: CartItemSchema;
      id: number;
      index: number;
      change: "amount" | "whole";
   };

   type Delete = {
      variant: "delete";
      id: number;
      index: number;
   };

   const actions = async (props: Add | Edit | Delete) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         switch (props.variant) {
            case "add":
               await privateRequest.post(`${CART_ITEM_URL}`, props.cartItem);

               navigate("/check-out", { state: { from: location.pathname } });

               break;
            case "edit": {
               const { cartItem, change, id, index } = props;
               const res = await privateRequest.put(`${CART_ITEM_URL}/${id}`, cartItem);

               const price = res.data.data;

               if (change === "amount")
                  dispatch(
                     setCart({ variant: "update", change: "amount", cartItem, index })
                  );

               if (change === "whole") {
                  const foundedCartItemIndex = cartItems.findIndex(
                     (c) =>
                        c.item.product_id === cartItem.product_id &&
                        c.item.color_id === cartItem.color_id &&
                        c.item.variant_id === cartItem.variant_id
                  );

                  // update before
                  dispatch(
                     setCart({
                        cartItem,
                        variant: "update",
                        change: "whole",
                        index,
                        price,
                     })
                  );

                  // if have have cart item
                  if (foundedCartItemIndex !== -1) {
                     const foundedCartItem = cartItems[foundedCartItemIndex].item;
                     await privateRequest.delete(
                        `${CART_ITEM_URL}/${foundedCartItem.id}`
                     );

                     dispatch(
                        setCart({
                           variant: "delete",
                           index: foundedCartItemIndex,
                        })
                     );
                  }
               }

               break;
            }
            case "delete": {
               const { index, id } = props;
               await privateRequest.delete(`${CART_ITEM_URL}/${id}`);
               dispatch(setCart({ variant: "delete", index }));

               break;
            }
         }
      } catch (error) {
         console.log({ message: error });
      } finally {
         setIsFetching(false);
      }
   };

   return {
      isFetching,
      actions,
   };
}

export type CartAction = ReturnType<typeof useCartAction>["actions"];
