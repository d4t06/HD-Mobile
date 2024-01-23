import Skeleton from "@/components/Skeleton";
import PushFrame from "@/components/ui/PushFrame";

type Props = {
   loading: boolean;
};

export default function Policy({ loading }: Props) {
   const classes = {
      text: "text-[16px] text-[#333]",
   };

   const content = (
      <>
         <li className="flex items-center">
            <i className="material-icons text-[#cd1818] mr-[8px]">label_outline</i>
            <span className={classes.text}>Hư gì đổi nấy 12 tháng tại 3384 siêu thị toàn quốc</span>
         </li>
         <li className="flex items-center">
            <i className="material-icons text-[#cd1818] mr-[8px]">label_outline</i>

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
