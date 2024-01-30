import { Button } from "@/components";
import useCart from "@/hooks/useCart";
import { useToast } from "@/store/ToastContext";
import { Cart, CartItem, CartItemSchema } from "@/types";

import { PlusSmallIcon } from "@heroicons/react/20/solid";
import { MinusSmallIcon } from "@heroicons/react/24/solid";
import { useEffect, useRef } from "react";

function VariantList({ cartItem, handleCartData }: { cartItem: CartItem; handleCartData: (cart: Cart) => void }) {
   // ref: Ref<VariantListRef>
   const { updateCartItem, apiLoading } = useCart({});
   const { setErrorToast } = useToast();

   const colorRef = useRef<HTMLSelectElement>(null);
   const storageRef = useRef<HTMLSelectElement>(null);

   const handleUpdateCartItem = async (value: number, field: "quantity" | "color_id" | "storage_id") => {
      try {
         const { product_data, updatedAt, createdAt, ...rest } = cartItem;
         const cartItemForUpdate: CartItemSchema & { id: number } = {
            ...rest,
         };

         switch (field) {
            case "color_id":
               cartItemForUpdate.color_id = value;
               // console.log('>>> check cart item', cartItemForUpdate, field, value);

               await updateCartItem(handleCartData, cartItemForUpdate, "update-variant");
               break;
            case "storage_id":
               cartItemForUpdate.storage_id = value;
               // console.log('>>> check cart item', cartItemForUpdate, field, value);

               await updateCartItem(handleCartData, cartItemForUpdate, "update-variant");
               break;
            case "quantity":
               cartItemForUpdate.amount = value;
               // console.log('>>> check cart item', cartItemForUpdate, field, value);

               await updateCartItem(handleCartData, cartItemForUpdate, "update-quantity");
         }
      } catch (error) {
         console.log(error);
         setErrorToast();
      }
   };

   useEffect(() => {
      if (cartItem) {
         if (colorRef.current && storageRef.current) {
            colorRef.current.value = cartItem.color_id + "";
            storageRef.current.value = cartItem.storage_id + "";
         }
      }
   }, []);

   const classes = {
      container: "flex flex-col space-y-[10px] md:space-y-0 md:space-x-[10px] md:flex-row ",
      variantLabel: "text-[13px] md:text-[14px] text-gray-600 font-[500]",

      select:
         "px-[10px] border border-[#e1e1e1] bg-[#fff] hover:bg-[#f1f1f1] cursor-pointer py-[7px] rounded-[6px] font-[500] text-[13px] md:text-[14px] text-[#333] text-[500]",
      quantityBox:
         "inline-flex  border-[#e1e1e1] border  justify-between  overflow-hidden items-center text-[#333] rounded-[99px] bg-[#fff]",
   };

   return (
      <div className={`${classes.container} ${apiLoading ? "opacity-60 pointer-events-none" : ""}`}>
         <div className="space-y-[4px]">
            <p className={classes.variantLabel}>Quantity</p>
            <div className={classes.quantityBox}>
               <Button
                  disable={cartItem.amount === 1}
                  className=" hover:bg-[#e1e1e1] border-r border-[#e1e1e1] p-[3px]"
                  onClick={() => handleUpdateCartItem(cartItem.amount - 1, "quantity")}
               >
                  <MinusSmallIcon className="w-[24px]" />
               </Button>
               <span className="text-[16px] font-[500] px-[10px]">{cartItem.amount}</span>
               <Button
                  className="border-l border-[#e1e1e1] p-[3px] hover:bg-[#e1e1e1]"
                  onClick={() => handleUpdateCartItem(cartItem.amount + 1, "quantity")}
               >
                  <PlusSmallIcon className="w-[24px]" />
               </Button>
            </div>
         </div>
         <div className="space-y-[4px]">
            <p className={classes.variantLabel}>Color</p>
            <select
               ref={colorRef}
               onChange={(e) => handleUpdateCartItem(+e.target.value, "color_id")}
               className={classes.select}
               name=""
               id=""
            >
               {cartItem.product_data.colors_data.map((cl, index) => (
                  <option key={index} value={cl.id}>
                     {cl.color}
                  </option>
               ))}
            </select>
         </div>
         <div className="space-y-[4px]">
            <p className={classes.variantLabel}>Storage</p>

            <select
               ref={storageRef}
               onChange={(e) => handleUpdateCartItem(+e.target.value, "storage_id")}
               className={classes.select}
               name=""
               id=""
            >
               {cartItem.product_data.storages_data.map((s, index) => (
                  <option key={index} value={s.id}>
                     {s.storage}
                  </option>
               ))}
            </select>
         </div>
      </div>
   );
}

export default VariantList;
