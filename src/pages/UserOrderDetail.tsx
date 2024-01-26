import PrimaryLabel from "@/components/ui/PrimaryLabel";
import PushFrame from "@/components/ui/PushFrame";
import { ArchiveBoxIcon } from "@heroicons/react/24/outline";

export default function UserOrderDetail() {
   const classes = {
      emptyImage: "w-[160px] md:w-[200px] mx-auto h-auto",
      p: "text-[16px] text-[#333] text-center",
      variantLabel: "text-[13px] md:text-[14px] text-gray-600 font-[500]",
      pushBtn: "leading-[26px] text-[14px] px-[6px]",
      container: "mb-[20px] md:mb-[30px]",
      formLabel: "text-[16px] text-[#333]",
      h5: "text-[14px] md:text-[16px] text-[#808080] font-[500]",
      select:
         "px-[10px] border border-[#e1e1e1] bg-[#fff] hover:bg-[#f1f1f1] cursor-pointer py-[6px] rounded-[6px] font-[500] text-[13px] md:text-[14px] text-[#333] text-[500]",
      quantityBox:
         "inline-flex  border-[#e1e1e1] border  justify-between  overflow-hidden items-center text-[#333] rounded-[99px] bg-[#fff]",
   };

   return (
      <div className="">
         <div className={classes.container}>
            <PrimaryLabel className="mb-[12px]" title={`Tất cả đơn hàng ()`}>
               <ArchiveBoxIcon className="w-[22px] md:w-[24px]" />
            </PrimaryLabel>
            <PushFrame>
               <h1>Tat ca don hang</h1>
            </PushFrame>
         </div>
      </div>
   );
}
