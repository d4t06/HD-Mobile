import Title from "@/components/Title";
import PushFrame from "@/components/ui/PushFrame";
import { selectCart } from "@/store/cartSlice";
import { useSelector } from "react-redux";
import CartItem from "./child/CartItem";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";

export default function CartItemList() {
   const { cartItems, selectedCartItemId } = useSelector(selectCart);

   return (
      <>
         <Title>
            <ShoppingBagIcon className="w-[22px] md:w-[24px]" />
            <span>Products ({cartItems.length})</span>
         </Title>
         <PushFrame>
            <div className={`space-y-[20px] ${false ? "disable" : ""}`}>
               {cartItems.map((c, index) => {
                  const isChecked = selectedCartItemId.includes(c.item.id);
                  return (
                     <CartItem
                        key={index}
                        isChecked={isChecked}
                        cartItem={c}
                        index={index}
                     />
                  );
               })}
            </div>
         </PushFrame>
      </>
   );
}
