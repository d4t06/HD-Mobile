import useReview from "@/hooks/useReview";
import { useMemo, useRef } from "react";
import { CommentSkeleton } from "@/components/CommentItem";
import { Button } from "@/components";
import NoComment from "./NoComment";
import { ProductReview } from "@/types";
import { initLocalStorage } from "@/utils/appHelper";
import ReviewItem from "@/components/ReviewItem";
import { ArrowPathIcon, HandThumbUpIcon } from "@heroicons/react/24/outline";
import { HeartIcon } from "@heroicons/react/16/solid";

export default function RatingSection({ product_name_ascii }: { product_name_ascii: string }) {
   const {
      state: { count, page, reviews, page_size, status, average },
      getReviews,
      likeReview,
      apiLoading,
   } = useReview({ setIsOpenModal: () => {}, product_name_ascii });

   const currentCommentIndex = useRef(0);

   // const [_localVal, _setLocalVal] = useLocalStorage("HD-Mobile", initLocalStorage);

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

            const localVal = JSON.parse(localStorage.getItem("HD-Mobile") || JSON.stringify(initLocalStorage));
            const isLiked = localVal.like_review_ids.includes(r.id!);

            return (
               <ReviewItem key={index} review={r}>
                  <Button
                     disable={isLoading}
                     onClick={() => handleLike(r, index)}
                     className="px-[5px] !py-[0px] group"
                     primary
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

   if (status === "success" && reviews.length === 0) return <NoComment title="Chưa có đánh giá" />;

   return (
      <div className="">
         {status === "loading" && renderSkeleton}

         {!!reviews.length && (
            <div className="text-center mb-[30px]">
               <h2 className="text-[20px] text-[#333] font-[600] ">Đánh giá trung bình</h2>
               {/* <p className="text-[#495057] text-[18px] leading-[20px]">Đánh giá trung bình</p> */}
               <h1 className="text-[70px] font-[600] leading-[80px] text-[#cd1818]">{average.toFixed(1)} /5</h1>
               <p className="text-[#495057] text-[16px] leading-[20px]">{count} đánh giá</p>
            </div>
         )}

         {!!reviews.length && renderReview}

         {!!reviews.length && (
            <p className="text-center mt-[20px]">
               <Button onClick={handleGetMore} disable={remaining <= 0} primary>
                  Xem thêm ({remaining > 0 ? remaining : 0}) đánh giá
               </Button>
            </p>
         )}
      </div>
   );
}
