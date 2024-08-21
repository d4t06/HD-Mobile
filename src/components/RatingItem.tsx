import { useMemo } from "react";
import Skeleton from "./Skeleton";
import { StarIcon } from "@heroicons/react/16/solid";
import AvatarPlaceholder from "@/shares/components/AvartarPlaceholder";

type Props = {
   className?: string;
   review: Rating;
};

const classes = {
   userName: "font-medium",
   comment: "text-[#3f3f3f] font-medium mt-2",
   time: "text-sm text-[#3f3f3f] ml-2",
};

export default function RatingItem({ className, review }: Props) {
   const firstName = useMemo(() => {
      const arr = review?.username.split(" ");
      return arr ? arr[arr.length - 1] : "X";
   }, []);

   return (
      <div className={`flex comment-item rounded-[12px] ${className}`}>
         <AvatarPlaceholder firstChar={firstName.charAt(0).toLocaleUpperCase()} />

         <div className="ml-[10px]">
            <h5 className={classes.userName}>
               {review.username}

               <span className={classes.time}>({review.date_convert})</span>
            </h5>

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

            <p className={`${classes.comment}`}>{review.content}</p>
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
