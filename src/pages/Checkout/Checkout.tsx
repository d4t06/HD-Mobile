import emptyCart from "@/assets/images/empty-cart.png";
import { useLocalStorage } from "@/hooks";
import {
   ShoppingBagIcon,
   TrashIcon,
   CreditCardIcon,
   MapPinIcon,
   TruckIcon,
   BanknotesIcon,
} from "@heroicons/react/24/outline";
import PushFrame from "@/components/ui/PushFrame";
import useCart from "@/hooks/useCart";
import { moneyFormat } from "@/utils/appHelper";
import PrimaryLabel from "@/components/ui/PrimaryLabel";
import { Button } from "@/components";
import { useRef } from "react";
import AddressGroup, { AddressGroupRef } from "./child/AdressGroup";
import Skeleton from "@/components/Skeleton";

export default function Checkout() {
   const { cart, apiLoading } = useCart({ autoRun: true });

   const AddressGroupRef = useRef<AddressGroupRef>(null);
   const currentItemID = useRef<number | undefined>();

   const handleDeleteItem = () => {};

   const handleSubmit = async () => {
      try {
         const isValidAddress = AddressGroupRef.current?.validate();

         if (!isValidAddress) throw new Error("invalid address");
      } catch (error) {
         console.log(error);
      }
   };

   const classes = {
      emptyImage: "w-[160px] md:w-[200px] mx-auto h-auto",
      p: "text-[16px] text-[#333] text-center",
      pushBtn: "leading-[26px] text-[14px] px-[6px]",
      container: "mb-[20px] md:mb-[30px]",
      formLabel: "text-[16px] text-[#333]",
      h5: "text-[14px] md:text-[16px] text-[#808080] font-[500]",
   };

   const Empty = (
      <div className="">
         <img src={emptyCart} className={classes.emptyImage} alt="" />
         <p className={classes.p}>Chưa có sản phẩm</p>
      </div>
   );

   const groupSkeleton = [...Array(3).keys()].map((index) => (
      <div key={index} className="mb-[30px] space-y-[16px]">
         <Skeleton className="w-[200px] rounded-[6px] h-[24px] max-w-[30%]" />
         <Skeleton className="w-full rounded-[6px] h-[200px]" />
      </div>
   ));

   if (apiLoading) return groupSkeleton;

   if (!cart || !cart.items.length) {
      return Empty;
   }

   return (
      <div className="">
         <>
            <div className={classes.container}>
               <PrimaryLabel
                  className="mb-[12px]"
                  title={`Tất cả sản phẩm (${cart.items.length})`}
               >
                  <ShoppingBagIcon className="w-[24px]" />
               </PrimaryLabel>
               <PushFrame>
                  <div className="space-y-[14px]">
                     {cart.items.map((item, index) => (
                        <div
                           key={index}
                           className="flex justify-between items-center"
                        >
                           <div className="flex">
                              <img
                                 src={item.product_data.image_url}
                                 className="w-[70px] md:w-[90px] flex-shrink-0"
                                 alt=""
                              />
                              <div className="ml-[10px]">
                                 <h5 className="text-[14px] md:text-[16px] font-[600]">
                                    {item.product_data.product_name}
                                 </h5>
                                 <p className="text-[14px] text-gray-600">
                                    SL: {item.amount}
                                 </p>
                                 <h4 className="text-[16px] md:text-[18px] font-[600] text-[#cd1818]">
                                    {moneyFormat(
                                       item.product_data.combines_data[0].price
                                    )}
                                    đ
                                 </h4>
                              </div>
                           </div>
                           <Button className="px-[4px]" primary>
                              <TrashIcon className="w-[20px]" />
                           </Button>
                        </div>
                     ))}
                  </div>
               </PushFrame>
            </div>

            <div className={classes.container}>
               <PrimaryLabel className="mb-[12px]" title="Hình thức nhận hàng">
                  <TruckIcon className="w-[24px]" />
               </PrimaryLabel>

               <div className="flex space-x-[10px]">
                  <PushFrame active={false} type="translate">
                     <button className={classes.pushBtn} onClick={() => {}}>
                        Giao hàng tận nơi
                     </button>
                  </PushFrame>
                  <PushFrame active={false} type="translate">
                     <button className={classes.pushBtn} onClick={() => {}}>
                        Nhận tại của hàng
                     </button>
                  </PushFrame>
               </div>
            </div>

            <div className={classes.container}>
               <PrimaryLabel className="mb-[12px]" title="Địa chỉ">
                  <MapPinIcon className="w-[24px]" />
               </PrimaryLabel>
               <PushFrame>
                  <AddressGroup ref={AddressGroupRef} />
               </PushFrame>
            </div>

            <div className={classes.container}>
               <PrimaryLabel className="mb-[12px]" title="Hình thức thanh toán">
                  <CreditCardIcon className="w-[24px]" />
               </PrimaryLabel>
               <div className="flex flex-col items-start md:flex-row space-y-[10px] md:space-y-0 md:items-center md:space-x-[10px]">
                  <PushFrame active={false} type="translate">
                     <button
                        className={`${classes.pushBtn} inline-flex items-center`}
                        onClick={() => {}}
                     >
                        <BanknotesIcon className="w-[24px] mr-[6px]" />
                        Thanh toán khi nhận hàng
                     </button>
                  </PushFrame>
                  <PushFrame active={false} type="translate">
                     <button
                        className={`${classes.pushBtn} inline-flex items-center`}
                        onClick={() => {}}
                     >
                        <CreditCardIcon className="w-[24px] mr-[6px]" />
                        Chuyển khoản ngân hàng
                     </button>
                  </PushFrame>
               </div>
            </div>

            <div className="fixed bg-white bottom-0 left-0 right-0 border-t-[1px] py-[10px] md:p-[16px]">
               <div className="max-w-[800px] px-[10px] mx-auto">
                  <div className="flex flex-col md:flex-row items-start mx-[-8px]">
                     <div className="w-full md:w-1/2 px-[8px]">
                        <div className="flex items-center leading-[30px]">
                           <p className={classes.h5}>Tổng tiền:</p>
                           <p className={`${classes.h5} ml-auto text-black`}>
                              {moneyFormat(999999)}đ
                           </p>
                        </div>

                        <div className="flex items-center leading-[30px]">
                           <p className={classes.h5}>Giảm giá voucher:</p>
                           <p className={`${classes.h5} ml-auto`}>- 0đ</p>
                        </div>
                     </div>
                     <div className="w-full md:w-1/2 px-[8px]">
                        <div className="flex items-center leading-[30px]">
                           <p className={classes.h5}>Cần thanh toán:</p>
                           <p className="text-[20px] text-[#cd1818] font-[600] ml-auto">
                              {moneyFormat(999999)}đ
                           </p>
                        </div>
                        <Button
                           onClick={handleSubmit}
                           backClass="w-full mt-[10px]"
                           primary
                        >
                           Thanh toán
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         </>
      </div>
   );
}
