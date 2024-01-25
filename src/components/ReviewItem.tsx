import { AvatarPlaceholder } from "@/components/Avatar";
import { ProductReview, Reply } from "@/types";
import { ReactNode, useMemo } from "react";
import Skeleton from "./Skeleton";
// import logo from "@/assets/images/logo.jpg";

type Props = {
   className?: string;
   review: ProductReview;
   admin?: boolean;
   children?: ReactNode;
};

const classes = {
   userName: "text-[18px] leading-[24px] font-[500]",
   comment: "text-[#495057] text-[16px] leading-[20px] mt-[4px]",
};

export default function ReviewItem({ className, review, admin, children }: Props) {
   const firstName = useMemo(() => {
      const arr = review?.cus_name.split(" ");
      return arr ? arr[arr.length - 1] : "X";
   }, []);

   return (
      <div className={`flex comment-item rounded-[12px] ${className}`}>
         <AvatarPlaceholder image_url={""} firstChar={firstName.charAt(0).toLocaleUpperCase()} />

         <div className="ml-[10px]">
            <h5 className={classes.userName}>{review.cus_name}</h5>
            {admin && (
               <div className="flex items-end gap-[8px]">
                  <h5 className={classes.userName}>{review.cus_name}</h5>

                  <>
                     <span className="text-[#808080] text-[16px]">{review.date_convert}</span>
                     {!!review.approve && <span className="text-emerald-500 font-[600] text-[16px]">(Approved)</span>}
                  </>
               </div>
            )}

            {review.rate && (
               <>
                  {admin && <p className={classes.comment}>Đã đánh giá '{review.product_data?.product_name}'</p>}

                  <div className="flex space-x-[4px]  mt-[4px]">
                     {[...Array(5).keys()].map((index) => {
                        const active = index <= review.rate;
                        return (
                           <span key={index} className="leading-[24px] inline-flex">
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 fill="currentColor"
                                 viewBox="0 0 24 24"
                                 stroke-width="1.5"
                                 stroke="currentColor"
                                 className={`w-[24px]   ${active ? "text-[#efb140]" : "text-[#808080]"}`}
                              >
                                 <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                 />
                              </svg>
                           </span>
                        );
                     })}
                  </div>
               </>
            )}

            <p className={`${classes.comment} mt-[8px]`}>{review.content}</p>

            {children && (
               <div className="h-[30px] text-[16px] mt-[4px] flex items-center gap-[8px]">
                  {!admin && <span className="text-[#808080] text-[16px]">{review.approve}</span>} {children}
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
      <Skeleton className="w-[44px] h-[44px] rounded-full" />
      <div className="ml-[10px]">
         <Skeleton className="h-[20px] w-[200px] rounded-[4px]" />
         <Skeleton className="h-[24px] mt-[10px] w-[400px] rounded-[4px]" />
         <Skeleton className="h-[18px] mt-[10px] w-[100px] rounded-[4px]" />
      </div>
   </div>
);
