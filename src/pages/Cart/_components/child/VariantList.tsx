import { CartAction } from "@/hooks/useCartAction";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

type Props = {
   actions: CartAction;
   cartItem: cartItemDetail;
   isFetching: boolean;
   index: number;
};

function VariantList({ cartItem, actions, isFetching, index }: Props) {
   const colorRef = useRef<HTMLSelectElement>(null);
   const storageRef = useRef<HTMLSelectElement>(null);

   type Props = {
      cartItem: Partial<CartItemSchema>;
      change: "variant" | "amount";
   };

   const handleCartItemAction = async (props: Props) => {
      const {
         item: { product, ...rest },
      } = cartItem;

      const schema: CartItemSchema = {
         ...rest,
         ...props.cartItem,
      };

      switch (props.change) {
         case "amount":
            await actions({
               variant: "edit",
               cartItem: schema,
               change: "amount",
               index,
               id: cartItem.item.id,
            });

            break;
         case "variant":
            await actions({
               variant: "edit",
               cartItem: schema,
               change: "whole",
               index,
               id: cartItem.item.id,
            });

            break;
      }
   };

   useEffect(() => {
      if (cartItem) {
         if (colorRef.current && storageRef.current) {
            colorRef.current.value = cartItem.item.color_id + "";
            storageRef.current.value = cartItem.item.variant_id + "";
         }
      }
   }, []);

   const classes = {
      container:
         "flex flex-col space-y-[10px] md:space-y-0 md:space-x-[16px] md:flex-row ",
      variantLabel: "text-[#3f3f3f] font-[500]",
      button: 'hover:bg-[#e1e1e1] border-[#e1e1e1] h-full px-[6px]',

      select:
         "px-[14px] h-[32px] border border-[#e1e1e1] bg-[#fff] hover:bg-[#f1f1f1] cursor-pointer rounded-[99px] font-[500] text-[14px] text-[#333] text-[500]",
      quantityBox:
         "inline-flex h-[32px] border-[#e1e1e1] border  justify-between  overflow-hidden items-center text-[#333] rounded-[99px] bg-[#fff]",
   };

   return (
      <div className={`${classes.container} ${isFetching ? "disable" : ""}`}>
         <div className="space-y-[4px]">
            <p className={classes.variantLabel}>Quantity</p>
            <div className={classes.quantityBox}>
               <button
                  disabled={cartItem.item.amount === 1}
                  className={`${classes.button} border-r`}
                  onClick={() =>
                     handleCartItemAction({
                        change: "amount",
                        cartItem: { amount: cartItem.item.amount - 1 },
                     })
                  }
               >
                  <MinusIcon className="w-[22px]" />
               </button>
               <p className="px-[14px] font-[500] leading-[1]">
                  {cartItem.item.amount}
               </p>
               <button
                  className={`${classes.button} border-l`}
                  onClick={() =>
                     handleCartItemAction({
                        change: "amount",
                        cartItem: { amount: cartItem.item.amount + 1 },
                     })
                  }
               >
                  <PlusIcon className="w-[22px]" />
               </button>
            </div>
         </div>
         <div className="space-y-[4px]">
            <p className={classes.variantLabel}>Color</p>
            <select
               ref={colorRef}
               onChange={(e) =>
                  handleCartItemAction({
                     change: "variant",
                     cartItem: { color_id: +e.target.value },
                  })
               }
               className={classes.select}
               name=""
               id=""
            >
               {cartItem.item.product.colors.map((cl, index) => (
                  <option key={index} value={cl.id}>
                     {cl.color}
                  </option>
               ))}
            </select>
         </div>
         <div className="space-y-[4px]">
            <p className={classes.variantLabel}>Variant</p>

            <select
               ref={storageRef}
               onChange={(e) =>
                  handleCartItemAction({
                     change: "variant",
                     cartItem: { variant_id: +e.target.value },
                  })
               }
               className={classes.select}
               name=""
               id=""
            >
               {cartItem.item.product.variants.map((s, index) => (
                  <option key={index} value={s.id}>
                     {s.variant}
                  </option>
               ))}
            </select>
         </div>
      </div>
   );
}

export default VariantList;
