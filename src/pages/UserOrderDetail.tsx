import Skeleton from "@/components/Skeleton";
import PrimaryLabel from "@/components/ui/PrimaryLabel";
import PushButton from "@/components/ui/PushButton";
import PushFrame from "@/components/ui/PushFrame";
import useUserOrder from "@/hooks/useUserOrder";

import { moneyFormat } from "@/utils/appHelper";
import { ArchiveBoxIcon, CreditCardIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";

export default function UserOrderDetail() {
   const statusWantToUpdate = useRef<Order["status"] | "">("");

   const { id } = useParams<{ id: string }>();
   const { orderDetail, status, updateStatus, apiLoading } = useUserOrder({ id });

   const handleUpdateOrderStatus = async (status: typeof statusWantToUpdate.current) => {
      if (id === undefined || !status) throw new Error("id not found");

      const data = {
         id: +id,
         status: status,
      };
      statusWantToUpdate.current = status;

      await updateStatus(data);
   };

   const renderSkeleton = [...Array(3).keys()].map((index) => (
      <div key={index} className="mb-[30px] space-y-[16px]">
         <Skeleton className="w-[200px] rounded-[6px] h-[24px] max-w-[30%]" />
         <Skeleton className="w-full rounded-[6px] h-[200px]" />
      </div>
   ));

   const renderDateInfo = () => {
      switch (orderDetail?.status) {
         case "delivering":
         case "processing":
            return (
               <h5 className={classes.h5}>
                  Ngày nhận dự kiến:
                  <span className={classes.blackText}> Mùng 1 Tết nhận bạn</span>
               </h5>
            );
         case "canceled":
            return (
               <h5 className={classes.h5}>
                  Ngày huỷ:
                  <span className={classes.blackText}> {orderDetail.canceledAt}</span>
               </h5>
            );
         case "completed":
            return (
               <h5 className={classes.h5}>
                  Ngày nhận:
                  <span className={classes.blackText}> {orderDetail.deliveredAt}</span>
               </h5>
            );
      }
   };

   const classes = {
      p: "text-[16px] text-center",
      container: "mb-[20px] md:mb-[30px]",
      h5: "text-[14px] md:text-[16px] text-gray-600 font-[500]",
      blackText: "text-[333] font-[600]",
      h1: "text-[22px] font-[600] text-[#333] uppercase",
   };

   if (status === "loading") return renderSkeleton;

   if (status === "error" || !orderDetail)
      return <p className={classes.p}>Some thing went wrong</p>;

   return (
      <div className="">
         <div className={classes.container}>
            <PrimaryLabel className="mb-[8px]" title={`Thông tin đơn hàng`}>
               <ArchiveBoxIcon className="w-[22px] md:w-[24px]" />
            </PrimaryLabel>
            <PushFrame>
               <h1 className={classes.h1}>
                  <span className={classes.blackText}>{orderDetail.status}</span>
               </h1>
               <h5 className={classes.h5}>
                  Ngày đặt hàng:{" "}
                  <span className={classes.blackText}>{orderDetail.createdAt}</span>
               </h5>
               {renderDateInfo()}
            </PushFrame>
         </div>
         <div className={classes.container}>
            <PrimaryLabel className="mb-[8px]" title={`Thông tin người nhận`}>
               <MapPinIcon className="w-[22px] md:w-[24px]" />
            </PrimaryLabel>
            <PushFrame>
               <h5 className={classes.h5}>
                  Họ tên:{" "}
                  <span className={classes.blackText}>{orderDetail.recipient_name}</span>
               </h5>
               <h5 className={classes.h5}>
                  Số điện thoại:{" "}
                  <span className={classes.blackText}>
                     {orderDetail.recipient_phone_number}
                  </span>
               </h5>
               <h5 className={classes.h5}>
                  Địa chỉ:{" "}
                  <span className={classes.blackText}>
                     {orderDetail.recipient_address}
                  </span>
               </h5>
            </PushFrame>
         </div>
         <div className={classes.container}>
            <PrimaryLabel className="mb-[8px]" title={`Sản phẩm`}>
               <ArchiveBoxIcon className="w-[22px] md:w-[24px]" />
            </PrimaryLabel>
            <PushFrame>
               <div className={`space-y-[20px]`}>
                  {orderDetail.items.map((item, index) => (
                     <div key={index} className="flex items-center">
                        <div className="flex flex-grow">
                           <Link to={"/" + item.slug}>
                              <img
                                 src={item.image_url}
                                 className="w-[70px] h-[70px] my-auto md:w-[90px] md:h-[90px] flex-shrink-0"
                                 alt=""
                              />
                           </Link>
                           <div className="h-full">
                              <Link
                                 to={"/" + item.slug}
                                 className="text-[16px] font-[600] md:mb-0"
                              >
                                 {item.product_name} - {item.color} - {item.storage}
                              </Link>
                              <h5 className={classes.h5}>Quantity: {item.amount}</h5>
                              <h5 className={classes.h5}>
                                 Price:
                                 <span className="text-[#cd1818] font-[600]">
                                    {" "}
                                    {moneyFormat(item.price)}đ
                                 </span>
                              </h5>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </PushFrame>
         </div>

         <div className={classes.container}>
            <PrimaryLabel className="mb-[8px]" title={`Thông tin thanh toán`}>
               <CreditCardIcon className="w-[22px] md:w-[24px]" />
            </PrimaryLabel>
            <PushFrame>
               <h5 className={classes.h5}>
                  Hình thức thanh toán:{" "}
                  <span className={classes.blackText}>{orderDetail.purchase_type}</span>
               </h5>

               <div className="mt-[14px]">
                  <h5 className={classes.h5}>
                     Tổng:{" "}
                     <span className={classes.blackText}>
                        {moneyFormat(orderDetail.total_price)}đ
                     </span>
                  </h5>
                  <h5 className={classes.h5}>
                     Giảm giá:{" "}
                     <span className={classes.blackText}>
                        {moneyFormat(orderDetail.discount) || "-0"}đ
                     </span>
                  </h5>
                  <h5 className={`${classes.h5} mt-[10px]`}>
                     Thanh toán:{" "}
                     <span className={`${classes.blackText} text-[18px] text-[#cd1818]`}>
                        {moneyFormat(orderDetail.purchase_price)}đ
                     </span>
                  </h5>
               </div>
            </PushFrame>
         </div>

         <div className="mt-[30px] flex flex-col space-y-[14px] sm:flex-row sm:space-y-0 sm:space-x-[14px] justify-center ">
            {orderDetail.status !== "canceled" && orderDetail.status !== "completed" && (
               <>
                  <PushButton
                     loading={apiLoading && statusWantToUpdate.current === "canceled"}
                     onClick={() => handleUpdateOrderStatus("canceled")}
                  >
                     Huỷ
                  </PushButton>
                  <PushButton
                     loading={apiLoading && statusWantToUpdate.current === "completed"}
                     onClick={() => handleUpdateOrderStatus("completed")}
                  >
                     Đã nhận hàng
                  </PushButton>
               </>
            )}
         </div>
      </div>
   );
}
