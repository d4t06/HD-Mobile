import { Button } from "@/components";
import { selectCart } from "@/store/cartSlice";
import { moneyFormat } from "@/utils/appHelper";
import { useMemo } from "react";
import { useSelector } from "react-redux";

export default function PriceGroup() {
   const { cartItems, selectedCartItemId } = useSelector(selectCart);

   const totalPrice = useMemo(() => {
      return cartItems.reduce((prev, cur) => {
         if (selectedCartItemId.includes(cur.item.id))
            return (prev += cur.item.amount * cur.price);
         return prev;
      }, 0);
   }, [cartItems, selectedCartItemId]);

   const classes = {
      h5: "text-[14px] md:text-[16px] text-[#3f3f3f] font-[500]",
   };

   return (
      <div className="fixed bg-white bottom-0 left-0 right-0 border-t-[1px] py-[10px] md:p-[16px]">
         <div className="max-w-[800px] px-[10px] mx-auto">
            <div className="flex flex-col md:flex-row items-start mx-[-8px]">
               <div className="w-full md:w-1/2 px-[8px]">
                  <div className="flex items-center leading-[30px]">
                     <p className={classes.h5}>Subtotal:</p>
                     <p className={`${classes.h5} ml-auto text-black`}>
                        {moneyFormat(totalPrice) || "0"} đ
                     </p>
                  </div>

                  <div className="flex items-center leading-[30px]">
                     <p className={classes.h5}>Voucher:</p>
                     <p className={`${classes.h5} ml-auto`}>- 0đ</p>
                  </div>
               </div>
               <div className="w-full md:w-1/2 px-[8px]">
                  <div className="flex items-center leading-[30px]">
                     <p className={classes.h5}>Total:</p>
                     <p className="text-[20px] text-[#cd1818] font-[600] ml-auto">
                     {moneyFormat(totalPrice) || "0"} đ
                     </p>
                  </div>
                  <Button
                     colors={"third"}
                     loading={false}
                     disabled={!selectedCartItemId.length}
                     onClick={() => {}}
                     className="w-full mt-[10px]"
                  >
                     Place Order
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
