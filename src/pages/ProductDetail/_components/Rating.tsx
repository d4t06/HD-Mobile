import useReview from "@/hooks/useReview";
import { useMemo, useRef } from "react";
import { CommentSkeleton } from "@/components/CommentItem";
import NotFound from "./child/NotFound";

import ReviewItem from "@/components/ReviewItem";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { HeartIcon, StarIcon } from "@heroicons/react/16/solid";
import Button from "@/components/ui/Button";
import Title from "@/components/Title";

type Props = {
   loading: boolean;
   product_ascii: string | null;
};

export default function Rating({ loading }: Props) {
   const {
      state: { count, page, reviews, page_size, status, average },
      getReviews,
      likeReview,
      apiLoading,
   } = useReview({ closeModal: () => {}, product_ascii: "" });

   const currentCommentIndex = useRef(0);

   const handleGetMore = async () => {
      await getReviews(page + 1);
   };

   const handleLike = async (r: ProductReview, index: number) => {
      currentCommentIndex.current = index;
      await likeReview(r);
   };

   const remaining = useMemo(() => count - page * page_size, [reviews]);

   const renderSkeleton = useMemo(
      () =>
         [...Array(2).keys()].map((item) => (
            <div key={item} className="comment-item mt-[5px]">
               {CommentSkeleton}
               {/* <div className="mt-[14px] ml-[64px]">{CommentSkeleton}</div> */}
            </div>
         )),
      []
   );

   const renderReview = useMemo(
      () =>
         reviews.map((r, index) => {
            const isLoading = apiLoading && currentCommentIndex.current === index;

            return (
               <ReviewItem key={index} review={r}>
                  <Button
                     colors={"third"}
                     disabled={isLoading}
                     onClick={() => handleLike(r, index)}
                     className="px-[5px] py-[0px] group"
                     size={"clear"}
                  >
                     {isLoading ? (
                        <ArrowPathIcon className="w-[20px] mr-[4px] animate-spin" />
                     ) : (
                        <HeartIcon className="w-[20px] mr-[4px]" />
                     )}
                     {r.total_like}
                  </Button>
               </ReviewItem>
            );
         }),
      [reviews, apiLoading]
   );

   return (
      <div className="mt-[30px]">
         <div className="md:flex justify-between items-center mb-[20px]">
            <Title className="mb-[10px] md:mb-0">
               <StarIcon className="w-[24px]" />
               <span>Rating</span>
            </Title>

            <Button colors={"third"} className="w-full md:w-auto">
               Write rating
            </Button>
         </div>

         <div className="space-y-[20px]">
            {(loading || status === "loading") && renderSkeleton}

            {status === "success" && (
               <>
                  {!!reviews.length ? (
                     <>
                        <div className="text-center mb-[30px]">
                           <h2 className="text-[20px] text-[#333] font-[600] ">
                              Average rating
                           </h2>
                           <h1 className="text-[70px] font-[600] leading-[80px] text-[#cd1818]">
                              {average.toFixed(1)} /5
                           </h1>
                           <p className="text-[#495057] text-[16px] leading-[20px]">
                              {count} ratings
                           </p>
                        </div>
                        {renderReview}

                        <p className="text-center mt-[20px]">
                           <Button
                              colors={"third"}
                              onClick={handleGetMore}
                              disabled={remaining <= 0}
                           >
                              More ({remaining > 0 ? remaining : 0}) ratings
                           </Button>
                        </p>
                     </>
                  ) : (
                     <NotFound title="" />
                  )}
               </>
            )}

            {status === "error" && <p>Some thing went wrong ¯\_(ツ)_/¯</p>}
         </div>
      </div>
   );
}
