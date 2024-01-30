import PrimaryLabel from "@/components/ui/PrimaryLabel";
import PushFrame from "@/components/ui/PushFrame";
import useUserOrder from "@/hooks/useUserOrder";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";
import emptyCart from "@/assets/images/empty-cart.png";
import Skeleton from "@/components/Skeleton";
import { Button } from "@/components";
import { moneyFormat } from "@/utils/appHelper";
import { Link } from "react-router-dom";

export default function UserOrder() {
   const { status, orders } = useUserOrder({ autoRun: true });

   const classes = {
      emptyImage: "w-[160px] md:w-[200px] mx-auto h-auto",
      p: "text-[16px] text-[#333] text-center",
      container: "mb-[20px] md:mb-[30px]",
      h5: "text-[14px] md:text-[16px] text-[#808080] font-[500]",
   };

   const Empty = (
      <div className="">
         <img src={emptyCart} className={classes.emptyImage} alt="" />
         <p className={classes.p}>Chưa có sản phẩm</p>
      </div>
   );

   const renderSkeleton = (
      <>
         <Skeleton className="w-[200px] rounded-[6px] h-[24px] mb-[16px]" />
         <div className="space-y-[20px]">
            {[...Array(3).keys()].map((index) => (
               <Skeleton key={index} className="w-full rounded-[6px] h-[200px]" />
            ))}
         </div>
      </>
   );

   if (status === "loading") return renderSkeleton;

   if (status === "error") return <p className={classes.p}>Some thing went wrong</p>;

   if (!orders || !orders.length) {
      return Empty;
   }

   return (
      <div className="">
         <div className={classes.container}>
            <PrimaryLabel className="mb-[12px]" title={`Tất cả đơn hàng (${orders.length})`}>
               <ArchiveBoxIcon className="w-[22px] md:w-[24px]" />
            </PrimaryLabel>

            <div className="space-y-[20px]">
               {orders.map((order, index) => (
                  <PushFrame key={index}>
                     <div className="">
                        <h5 className={`${classes.h5} mb-[4px]`}>
                           Đơn hàng #{order.id} - <span className="text-[#333] font-[600]">{order.createdAt}  - <span className="uppercase"> {order.status}</span> </span>
                        </h5>
                        <div key={index} className="flex items-start flex-col sm:flex-row sm:items-center">
                           <div className="flex flex-grow">
                              <img
                                 src={order.items[0].image_url}
                                 className="w-[70px] h-[70px] my-auto md:w-[90px] md:h-[90px] flex-shrink-0"
                                 alt=""
                              />
                              <div className="h-full">
                                 <h5 className="text-[16px] font-[600] mb-[4px]">{order.items[0].product_name}</h5>
                                 <h5 className={classes.h5}>
                                    Tổng:
                                    <span className="text-[#333]"> {moneyFormat(order.total_price)}</span>
                                 </h5>
                                 <h5 className={classes.h5}>
                                    Giảm giá:
                                    <span className="text-[#333]">{moneyFormat(order.discount) || " -0đ"}</span>
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

                           <Button className="!p-0" backClass="mx-auto mt-[10px] sm:mx-0 sm:mt-0" primary>
                              <Link className="px-[12px] py-[2px] sm:px-[16px] sm:py-[4px]" to={`/order/${order.id}`}>Chi tiết</Link>
                           </Button>
                        </div>
                     </div>
                  </PushFrame>
               ))}
            </div>
         </div>
      </div>
   );
}
