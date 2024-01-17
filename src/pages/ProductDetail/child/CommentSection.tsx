import { Button } from "@/components";
import CommentItem, { CommentSkeleton } from "@/components/CommentItem";
import useComment from "@/hooks/useComment";
import { ProductComment } from "@/types";
import { useMemo } from "react";
import logo from "@/assets/images/logo.jpg";

export default function CommentSection({ product_name_ascii }: { product_name_ascii: string }) {
   const {
      state: { comments, status },
      getComments,
      like,
   } = useComment({ setIsOpenModal: () => {}, product_name_ascii });

   const remaining = useMemo(() => 0, []);

   const renderComments = useMemo(
      () =>
         comments.map((c, index) => {
            const reply = c.reply_data;
            const replyCastToComment = {
               ...reply,
               cus_name: "HD Mobile",
               approve: reply?.date_convert,
               total_like: reply?.total_like,
               image_url: logo,
            } as ProductComment & { image_url: string };
            return (
               <div className="mb-[20px]" key={index}>
                  <CommentItem comment={c}>
                     <Button onClick={() => handleLike(c, "QUESTION")} className="px-[5px] !py-[0px]" primary>
                        <i className="material-icons text-[15px] mr-[4px]">thumb_up</i>
                        {c.total_like}
                     </Button>
                  </CommentItem>
                  <div className="ml-[54px] mt-[14px] bg-[#ccc] rounded-[12px]">
                     <CommentItem className="p-[10px] bg-[#f3f3f3] translate-y-[-6px]" comment={replyCastToComment}>
                        <Button
                           onClick={() => handleLike(replyCastToComment, "ANSWER")}
                           className="px-[5px] !py-[0px]"
                           primary
                        >
                           <i className="material-icons text-[15px] mr-[4px]">thumb_up</i>
                           {replyCastToComment.total_like}
                        </Button>
                     </CommentItem>
                  </div>
               </div>
            );
         }),
      [comments]
   );

   const renderSkeleton = useMemo(
      () =>
         [...Array(2).keys()].map((item) => (
            <div key={item} className="mb-[30px]">
               {CommentSkeleton}
               <div className="mt-[14px] ml-[64px]">{CommentSkeleton}</div>
            </div>
         )),
      []
   );

   const handleLike = async (comment: ProductComment, type: "QUESTION" | "ANSWER") => {
      if (!comment.id) return;
      await like(comment.id, type);
   };

   if (status === "loading") return renderSkeleton;

   return (
      <div className="">
         {renderComments}
         <p className="text-center mt-[20px]">
            <Button primary disable={remaining <= 0}>
               Xem thêm hỏi đáp
            </Button>
         </p>
      </div>
   );
}
