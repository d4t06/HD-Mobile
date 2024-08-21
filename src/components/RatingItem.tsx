import { AvatarPlaceholder } from "@/components/Avatar";

import { ReactNode, useMemo } from "react";
import Skeleton from "./Skeleton";
import { StarIcon } from "@heroicons/react/16/solid";

type Props = {
   className?: string;
   review: Rating;
   admin?: boolean;
   children?: ReactNode;
};

const classes = {
   userName: "text-[18px] leading-[24px] font-[500]",
   comment: "text-[#495057] text-[16px] leading-[20px] mt-[4px]",
};

export default function RatingItem({ className, review, admin, children }: Props) {
   const firstName = useMemo(() => {
      const arr = review?.username.split(" ");
      return arr ? arr[arr.length - 1] : "X";
   }, []);

   return (
      <div className={`flex comment-item rounded-[12px] ${className}`}>
         <AvatarPlaceholder
            image_url={""}
            firstChar={firstName.charAt(0).toLocaleUpperCase()}
         />

         <div className="ml-[10px]">
            {!admin && <h5 className={classes.userName}>{review.username}</h5>}

            {review.rate && (
               <>
                  <div className="flex space-x-[4px]  mt-[4px]">
                     {[...Array(5).keys()].map((index) => {
                        const active = index <= review.rate;
                        return (
                           <span key={index} className="leading-[24px] inline-flex">
                              <StarIcon
                                 className={`w-[24px]   ${
                                    active ? "text-[#efb140]" : "text-[#808080]"
                                 }`}
                              />
                           </span>
                        );
                     })}
                  </div>
               </>
            )}

            <p className={`${classes.comment} mt-[8px]`}>{review.content}</p>

            {children && (
               <div className="h-[30px] text-[16px] mt-[4px] flex items-center gap-[8px]">
                  {!admin && (
                     <span className="text-[#808080] text-[16px]">{review.approve}</span>
                  )}{" "}
                  {children}
               </div>
            )}
         </div>
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
