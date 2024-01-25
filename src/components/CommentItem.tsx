import { AvatarPlaceholder } from "@/components/Avatar";
import { ProductComment, Reply } from "@/types";
import { HTMLAttributes, ReactNode, useMemo } from "react";
import Skeleton from "./Skeleton";

interface Props extends HTMLAttributes<HTMLDivElement> {
   comment: ProductComment & { image_url?: string; rate?: number };
   admin?: boolean;
   children?: ReactNode;
   review?: boolean;
}

const classes = {
   userName: "text-[18px] leading-[24px] font-[500]",
   comment: "text-[#495057] text-[16px] leading-[20px] mt-[4px]",
};

export default function CommentItem({ className, comment, admin, children }: Props) {
   const firstName = useMemo(() => {
      const arr = comment?.cus_name.split(" ");
      return arr ? arr[arr.length - 1] : "X";
   }, []);

   const titleContent = {
      defaultComment: comment.cus_name,
      commentDashboard: "",
   };

   return (
      <div className={`flex comment-item rounded-[12px] ${className}`}>
         <AvatarPlaceholder image_url={comment.image_url} firstChar={firstName.charAt(0).toLocaleUpperCase()} />

         <div className="ml-[10px]">
            {admin ? (
               <>
                  <div className="flex items-end">
                     <h5 className={classes.userName}>{comment.cus_name}</h5>
                     <span className="text-[#808080] text-[16px] ml-[8px]">{titleContent.commentDashboard}</span>
                  </div>
                  <p className={classes.comment}>Đã bình luận '{comment.product_name_ascii}'</p>
               </>
            ) : (
               <h5 className={classes.userName}>{titleContent.defaultComment}</h5>
            )}

            <p className={`${classes.comment} !mt-[10px]`}>{comment.content}</p>

            {children && (
               <div className="h-[24px] text-[16px] mt-[4px] flex items-center space-x-[8px]">
                  {!admin && <span className="text-[#808080] text-[16px]">{comment.approve}</span>} {children}
               </div>
            )}
         </div>
      </div>
   );
}

export function AdminReply({ reply, cta }: { reply: Reply; cta: ReactNode }) {
   return (
      <div className="">
         <div className="flex items-end gap-[8px]">
            <h5 className={classes.userName}>Đã trả lời</h5>
            <span className="text-[#808080] text-[16px]">({reply.date_convert})</span>
            {cta}
         </div>

         <p className={classes.comment}>{reply.content}</p>
      </div>
   );
}

export const CommentSkeleton = (
   <div className="flex">
      <Skeleton className="w-[44px] h-[44px] rounded-full flex-shrink-0" />
      <div className="ml-[10px]">
         <Skeleton className="h-[20px] w-[200px] max-w-[30vw] rounded-[4px]" />
         <Skeleton className="h-[24px] mt-[10px] w-[400px] max-w-[50vw] rounded-[4px]" />
         <Skeleton className="h-[18px] mt-[10px] w-[100px] max-w-[30vw] rounded-[4px]" />
      </div>
   </div>
);
