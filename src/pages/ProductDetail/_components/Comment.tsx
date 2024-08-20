import CommentItem, { CommentSkeleton } from "@/components/CommentItem";
import useComment from "@/hooks/useComment";

import { useMemo, useRef } from "react";
import logo from "@/assets/images/logo.jpg";
import NotFound from "./child/NotFound";
// import { useLocalStorage } from "@/hooks";
// import { initLocalStorage } from "@/utils/appHelper";
import PushFrame from "@/components/ui/PushFrame";
import {
   ArrowPathIcon,
   HeartIcon,
   QuestionMarkCircleIcon,
} from "@heroicons/react/16/solid";
import PushButton from "@/components/ui/PushButton";
import Title from "@/components/Title";

type Props = {
   loading: boolean;
   product_ascii: string | null;
};

export default function Comment({ loading }: Props) {
   const {
      state: { comments, status, count, page, page_size },
      getComments,
      like,
      apiLoading,
   } = useComment({ closeModal: () => {}, product_ascii: "" });

   // for loading animation
   const currentCommentIndex = useRef(0);

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
            if (!reply) return;
            const replyCastToComment = {
               ...reply,
               image_url: logo,
               cus_name: "HD Mobile",
            } as ProductComment & { image_url: string };

            const isLoading = apiLoading && currentCommentIndex.current === index;

            return (
               <div key={index}>
                  <CommentItem comment={c}>
                     <PushButton
                        disabled={isLoading}
                        onClick={() => handleLike(c, index)}
                        className="px-[5px] py-[0px]"
                        size={"clear"}
                     >
                        {isLoading ? (
                           <ArrowPathIcon className="w-[20px] mr-[4px] animate-spin" />
                        ) : (
                           <HeartIcon className="w-[20px] mr-[4px]" />
                        )}
                        {c.total_like}
                     </PushButton>
                  </CommentItem>
                  <div className="ml-[54px] mt-[14px] bg-[#ccc] rounded-[12px]">
                     <PushFrame type="translate">
                        <CommentItem className="p-[10px]" comment={replyCastToComment} />
                     </PushFrame>
                  </div>
               </div>
            );
         }),
      [comments, apiLoading]
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

   return (
      <div className="mt-[30px]">
         <div className="md:flex justify-between items-center mb-[20px]">
            <Title className="mb-[10px] md:mb-0">
               <QuestionMarkCircleIcon className="w-[24px]" />
               <span>Q & A</span>
            </Title>

            <PushButton baseClassName="w-full md:w-auto">Viết Câu hỏi</PushButton>
         </div>

         <div className="space-y-[20px]">
            {loading || (status === "loading" && renderSkeleton)}

            {status === "success" && (
               <>
                  {comments.length ? (
                     <>
                        {renderComments}
                        <p className="text-center mt-[20px]">
                           <PushButton onClick={handleGetMore} disabled={remaining <= 0}>
                              Xem thêm ({remaining > 0 ? remaining : 0}) hỏi đáp
                           </PushButton>
                        </p>
                     </>
                  ) : (
                     <NotFound title="" />
                  )}
               </>
            )}

            {status === "error" && <p>Some things went wrong ¯\_(ツ)_/¯</p>}
         </div>
      </div>
   );
}
