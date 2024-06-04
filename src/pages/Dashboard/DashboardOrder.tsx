import Skeleton from "@/components/Skeleton";
import PushFrame from "@/components/ui/PushFrame";
import useManageOrder from "@/hooks/useManageOrder";
import emptyCart from "@/assets/images/empty-cart.png";
import { moneyFormat } from "@/utils/appHelper";
import { Button } from "@/components";
import { useMemo, useState } from "react";

import PushButton from "@/components/ui/PushButton";

const tabs: Array<Order["status"]> = [
   "processing",
   "delivering",
   "completed",
   "canceled",
];

export default function DashboardOrder() {
   const [currentTab, setCurrentTab] = useState<Order["status"] | "">("");

   const { state, getAllOrders, status } = useManageOrder({ currentTab });
   let remaining = useMemo(
      () => (!state ? 0 : state.count - state.orders.length),
      [state]
   );

   const handleGetMore = async () => {
      if (!state) throw new Error("State is undefined");
      await getAllOrders({ page: state.page + 1, type: "push", status: currentTab });
   };

   const handleSetTab = (tab: typeof currentTab) => {
      // remaining = 0
      setCurrentTab(tab);
   };

   const classes = {
      emptyImage: "w-[160px] md:w-[200px] mx-auto h-auto",
      p: "text-[16px] text-[#333] text-center",
      container: "mb-[20px] md:mb-[30px]",
      h5: "text-[14px] md:text-[16px] text-[#808080] font-[500]",
      blackText: "text-[#333] font-[600]",

      tab: "border-b-[4px] py-[3px] px-[12px] hover:brightness-100 flex-shrink-0",
      disableTab: "border-transparent text-[16px] hover:border-[#cd1818]",
      activeTab: "border-[#cd1818] text-[20px]",
   };

   const Empty = (
      <div className="">
         <img src={emptyCart} className={classes.emptyImage} alt="" />
         <p className={classes.p}>Không có sản phẩm</p>
      </div>
   );

   const renderSkeleton = (
      <div className="space-y-[20px]">
         {[...Array(3).keys()].map((index) => (
            <Skeleton key={index} className="w-full rounded-[12px] h-[200px]" />
         ))}
      </div>
   );

   if (status === "error") return <p className={classes.p}>Some thing went wrong</p>;

   return (
      <div className="">
         <div className="flex space-x-[8px] mb-[20px] overflow-auto">
            <Button
               onClick={() => handleSetTab("")}
               className={`${classes.tab} ${
                  !currentTab ? classes.activeTab : classes.disableTab
               }`}
            >
               All
               {status === "success" && !currentTab && state && " (" + state.count + ")"}
            </Button>
            {tabs.map((tab, index) => {
               const active = currentTab === tab;
               return (
                  <Button
                     key={index}
                     onClick={() => handleSetTab(tab)}
                     className={`${classes.tab} ${
                        active ? classes.activeTab : classes.disableTab
                     }`}
                  >
                     <span className="capitalize">{tab}</span>
                     {status === "success" && state && active && " (" + state.count + ")"}
                  </Button>
               );
            })}
         </div>

         <div className={classes.container}>
            {status !== "loading" && state && (
               <>
                  {state.orders.length ? (
                     <div className="space-y-[20px]">
                        {state.orders.map((order, index) => (
                           <PushFrame key={index}>
                              <h5 className={`${classes.h5} mb-[4px]`}>
                                 Đơn hàng #{order.id} -{" "}
                                 <span className="text-[#333] font-[600]">
                                    {order.createdAt} -{" "}
                                    <span className="uppercase"> {order.status}</span>{" "}
                                 </span>
                              </h5>
                              <div className="flex items-start flex-col sm:flex-row sm:items-center">
                                 <div key={index} className="flex">
                                    <div className="flex">
                                       <img
                                          src={order.items[0].image_url}
                                          className="w-[70px] h-[70px] my-auto md:w-[90px] md:h-[90px] flex-shrink-0"
                                          alt=""
                                       />
                                       <div className="h-full">
                                          <h5 className="text-[16px] font-[600] mb-[4px]">
                                             {order.items[0].product_name}
                                          </h5>
                                          <h5 className={classes.h5}>
                                             Tổng:
                                             <span className="text-[#333]">
                                                {" "}
                                                {moneyFormat(order.total_price)}
                                             </span>
                                          </h5>
                                          <h5 className={classes.h5}>
                                             Giảm giá:
                                             <span className="text-[#333]">
                                                {moneyFormat(order.discount) || " -0đ"}
                                             </span>
                                          </h5>
                                          <h5 className={`${classes.h5} `}>
                                             Thanh toán:
                                             <span className="text-[#cd1818] font-[600]">
                                                {" "}
                                                {moneyFormat(order.purchase_price)}
                                             </span>
                                          </h5>
                                       </div>
                                    </div>
                                 </div>
                                 <div className="mt-[4px] sm:mt-0 sm:ml-[10px] flex-grow">
                                    <h5 className={classes.h5}>
                                       Họ tên:{" "}
                                       <span className={classes.blackText}>
                                          {order.recipient_name}
                                       </span>
                                    </h5>
                                    <h5 className={classes.h5}>
                                       Số điện thoại:{" "}
                                       <span className={classes.blackText}>
                                          {order.recipient_phone_number}
                                       </span>
                                    </h5>
                                    <h5 className={classes.h5}>
                                       Địa chỉ:{" "}
                                       <span className={classes.blackText}>
                                          {order.recipient_address}
                                       </span>
                                    </h5>
                                 </div>

                                 <PushButton
                                    size={"clear"}
                                    baseClassName="mx-auto mt-[10px] sm:mx-0 sm:mt-0"
                                    className="px-[12px] py-[2px] sm:px-[16px] sm:py-[4px]"
                                    to={`${order.id}`}
                                 >
                                    Chi tiết
                                 </PushButton>
                              </div>
                           </PushFrame>
                        ))}
                     </div>
                  ) : (
                     Empty
                  )}
               </>
            )}
            {(status === "loading" || status === "more-loading") && renderSkeleton}
         </div>

         <div className="text-center">
            {status !== "loading" && state && !!state.orders.length && (
               <PushButton
                  disabled={status === "more-loading" || remaining <= 0}
                  className="text-[16px]"
                  onClick={handleGetMore}
               >
                  Xem thêm ({remaining <= 0 ? 0 : remaining}) sản phẩm
               </PushButton>
            )}
         </div>
      </div>
   );
}
