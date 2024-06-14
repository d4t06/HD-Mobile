import Skeleton from "@/components/Skeleton";
import PushFrame from "@/components/ui/PushFrame";
import { PaperClipIcon } from "@heroicons/react/16/solid";

type Props = {
   loading: boolean;
};

export default function Policy({ loading }: Props) {
   const classes = {
      text: "text-[16px] text-[#333] font-[500]",
   };

   const content = (
      <>
         <li className="flex items-center">
            <PaperClipIcon className="w-[20px] text-[#cd1818] flex-shrink-0 mr-[8px]" />
            <span className={classes.text}>Hư gì đổi nấy 12 tháng tại 3384 siêu thị toàn quốc</span>
         </li>
         <li className="flex items-center">
            <PaperClipIcon className="w-[20px] text-[#cd1818] flex-shrink-0 mr-[8px]" />
            <span className={classes.text}>
               Bảo hành chính hãng điện thoại 12 tháng tại các trung tâm bảo hành hãng
            </span>
         </li>
      </>
   );

   const renderSkeleton = [...Array(2).keys()].map((index) => (
      <Skeleton key={index} className="w-[full] h-[30px] rounded-[6px]" />
   ));

   return (
      <PushFrame>
         <ul className="flex flex-col space-y-[10px]">
            {loading && renderSkeleton}
            {!loading && content}
         </ul>
      </PushFrame>
   );
}
