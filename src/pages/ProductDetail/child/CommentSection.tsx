import { Button } from "@/components";
import CommentItem, { CommentSkeleton } from "@/components/CommentItem";
import useComment from "@/hooks/useComment";
import { ProductComment } from "@/types";
import { useMemo, useRef } from "react";
import logo from "@/assets/images/logo.jpg";
import NoComment from "./NoComment";
import "../styles.scss";
import { useLocalStorage } from "@/hooks";
import { initLocalStorage } from "@/utils/appHelper";

export default function CommentSection({ product_name_ascii }: { product_name_ascii: string }) {
   const {
      state: { comments, status, count, page, page_size },
      getComments,
      like,
      apiLoading,
   } = useComment({ setIsOpenModal: () => {}, product_name_ascii });

   // for loading animation
   const currentCommentIndex = useRef(0);

   const [localVal, _setLocalVal] = useLocalStorage("HD-Mobile", initLocalStorage);

   const remaining = useMemo(() => count - page * page_size, [comments]);

   const handleGetMore = async () => {
      await getComments(page + 1);
   };

   const handleLike = async (comment: ProductComment, index: number) => {
      currentCommentIndex.current = index;
      await like(comment);
   };

   const renderComments = useMemo(
      () =>
         !!comments.length &&
         comments.map((c, index) => {
            const reply = c.reply_data;
            const replyCastToComment = {
               ...reply,
               cus_name: "HD Mobile",
               approve: reply?.date_convert,
               total_like: reply?.total_like,
               image_url: logo,
            } as ProductComment & { image_url: string };

            const isLoading = apiLoading && currentCommentIndex.current === index;
            const localVal = JSON.parse(localStorage.getItem("HD-Mobile") || JSON.stringify(initLocalStorage));

            const isLiked = localVal.like_comment_ids.includes(c.id!);

            console.log('check , ', localVal.like_comment_ids, c.id, isLiked);
            

            return (
               <div className="comment-item" key={index}>
                  <CommentItem comment={c}>
                     <Button
                        disable={isLoading}
                        onClick={() => handleLike(c, index)}
                        className="px-[5px] !py-[0px] group"
                        primary
                     >
                        {isLoading ? (
                           <i className="material-icons text-[15px] mr-[4px] animate-spin">sync</i>
                        ) : (
                           <i
                              className={`material-icons text-[15px] mr-[4px] transition-transform ${
                                 isLiked ? "group-hover:rotate-180" : ""
                              }`}
                           >
                              thumb_up
                           </i>
                        )}
                        {c.total_like}
                     </Button>
                  </CommentItem>
                  <div className="ml-[54px] mt-[14px] bg-[#ccc] rounded-[12px]">
                     <CommentItem className="p-[10px] bg-[#f3f3f3] translate-y-[-6px]" comment={replyCastToComment}>
                        {/* <Button
                           onClick={() => handleLike(replyCastToComment, "ANSWER")}
                           className="px-[5px] !py-[0px]"
                           primary
                        >
                           <i className="material-icons text-[15px] mr-[4px]">thumb_up</i>
                           {replyCastToComment.total_like}
                        </Button> */}
                        <></>
                     </CommentItem>
                  </div>
               </div>
            );
         }),
      [comments, apiLoading, localVal]
   );

   const renderSkeleton = useMemo(
      () =>
         [...Array(2).keys()].map((item) => (
            <div key={item} className="comment-item">
               {CommentSkeleton}
               <div className="mt-[14px] ml-[64px]">{CommentSkeleton}</div>
            </div>
         )),
      []
   );

   if (status === "success" && comments.length === 0) return <NoComment title="Chưa có câu hỏi" />;

   return (
      <div className="">
         {renderComments}
         {status === "loading" && renderSkeleton}
         <p className="text-center mt-[20px]">
            <Button onClick={handleGetMore} primary disable={remaining <= 0}>
               Xem thêm ({remaining > 0 ? remaining : 0}) hỏi đáp
            </Button>
         </p>
      </div>
   );
}
