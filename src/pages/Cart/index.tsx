import {
   CreditCardIcon,
   MapPinIcon,
   TruckIcon,
   BanknotesIcon,
} from "@heroicons/react/24/outline";
import PushFrame from "@/components/ui/PushFrame";
import { useRef } from "react";
import AddressGroup, { AddressGroupRef } from "./_components/AdressGroup";
import Skeleton from "@/components/Skeleton";
import emptyCart from "@/assets/images/not-found.png";
import { Button } from "@/components";
import Title from "@/components/Title";
import PriceGroup from "./_components/PriceGroup";
import CartItemList from "./_components/CartItemList";
import useGetCart from "@/hooks/useGetCart";
import { useSelector } from "react-redux";
import { selectCart } from "@/store/cartSlice";

export default function Cart() {
   const { cartItems } = useSelector(selectCart);

   const { status } = useGetCart();

   const AddressGroupRef = useRef<AddressGroupRef>(null);

   const classes = {
      container: "space-y-[6px]",
   };

   const Empty = (
      <div className="">
         <img src={emptyCart} className={"mx-auto"} alt="" />
         <p className="text-center">Chưa có sản phẩm</p>
      </div>
   );

   const groupSkeleton = [...Array(3).keys()].map((index) => (
      <div key={index} className="mb-[30px] space-y-[16px]">
         <Skeleton className="w-[200px] rounded-[6px] h-[24px] max-w-[30%]" />
         <Skeleton className="w-full rounded-[6px] h-[200px]" />
      </div>
   ));

   if (status === "loading") return groupSkeleton;

   if (status === "error") return <p className={"text-center"}>Some thing went wrong</p>;

   if (!cartItems.length) return Empty;

   return (
      <>
         <div className={`${false ? "disable" : ""} space-y-[20px] md:space-y-[30px] `}>
            <div className={classes.container}>
               <CartItemList />
            </div>

            <div className={classes.container}>
               <Title>
                  <TruckIcon className="w-[22px] md:w-[24px]" />
                  <span>Hình thức nhận hàng</span>
               </Title>

               <div className=" flex flex-col items-start sm:flex-row space-y-[10px] sm:space-y-0 sm:items-center sm:space-x-[10px]">
                  <Button
                     className="text-[15px]"
                     colors="second"
                     active={true}
                     onClick={() => {}}
                  >
                     Giao hàng tận nơi
                  </Button>
                  <Button className="text-[15px]" colors={"second"} onClick={() => {}}>
                     Nhận tại của hàng
                  </Button>
               </div>
            </div>

            <div className={classes.container}>
               <Title>
                  <MapPinIcon className="w-[22px] md:w-[24px]" />
                  <span>Địa chỉ</span>
               </Title>
               <PushFrame>
                  <AddressGroup ref={AddressGroupRef} />
               </PushFrame>
            </div>

            <div className={classes.container}>
               <Title>
                  <CreditCardIcon className="w-[22px] md:w-[24px]" />
                  <span>Hình thức thanh toán</span>
               </Title>

               <div className=" flex flex-col items-start sm:flex-row space-y-[10px] sm:space-y-0 sm:items-center sm:space-x-[10px]">
                  <Button
                     className="text-[15px]"
                     active={true}
                     colors={"second"}
                     onClick={() => {}}
                  >
                     <BanknotesIcon className="w-[22px] md:w-[24px] mr-[6px]" />
                     Thanh toán khi nhận hàng
                  </Button>
                  <Button className="text-[15px]" colors={"second"} onClick={() => {}}>
                     <CreditCardIcon className="w-[22px] md:w-[24px] mr-[6px]" />
                     Chuyển khoản ngân hàng
                  </Button>
               </div>
            </div>

            <PriceGroup />
         </div>
      </>
   );
}
