import { Input } from "@/components";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import ModalHeader from "./ModalHeader";
import { inputClasses } from "../ui/Input";
import useComment, { CommentStateType } from "@/hooks/useComment";
import PushButton from "../ui/PushButton";

type Props = {
   product?: Product;
   closeModal: () => void;
   target: "Add-Comment" | "Add-Reply" | "Edit-Reply" | "Edit-Reply";
   comment?: ProductComment;
   index?: number;
   state: CommentStateType;
   setState: Dispatch<SetStateAction<CommentStateType>>;
};

const initComment = (product?: Product) => {
   const data: ProductComment = {
      content: "",
      cus_name: "",
      approve: 0,
      date_convert: "",
      product_ascii: product?.product_ascii || "",
      phone_number: "",
      total_like: 0,
   };
   return data;
};

export default function AddCommentModal({
   product,
   closeModal,
   target,
   comment,
   index,
   setState,
   state,
}: Props) {
   const [commentData, setCommentData] = useState<ProductComment>(initComment(product));
   const [replyContent, setReplyContent] = useState(
      comment?.reply_data ? comment.reply_data.content : ""
   );
   const [showConfirm, setShowConfirm] = useState(false);

   // hooks
   const { addComment, apiLoading, replyComment, editReply } = useComment({
      closeModal,
   });

   const handleCommentData = (field: keyof typeof commentData, value: string) => {
      setCommentData((prev) => ({ ...prev, [field]: value }));
   };

   const intiValue = useMemo(
      () => (target === "Add-Comment" ? commentData.content : replyContent),
      [commentData, replyContent]
   );

   const handleChangeContent = (value: string) => {
      switch (target) {
         case "Add-Comment":
            return handleCommentData("content", value);
         case "Add-Reply":
         case "Edit-Reply":
            return setReplyContent(value);
      }
   };

   const handleSubmit = async () => {
      switch (target) {
         case "Add-Comment":
            return await addComment(commentData, setShowConfirm);
         case "Add-Reply":
            if (comment?.id === undefined || index === undefined)
               throw new Error("id or index is undefined");
            const replyData: Reply = {
               q_id: comment.id,
               product_ascii: comment.product_ascii,
               content: replyContent,
               total_like: 0,
               date_convert: "",
            };

            await replyComment(replyData, index, state, setState);
            break;
         case "Edit-Reply":
            if (
               !comment?.reply_data ||
               comment.reply_data.id === undefined ||
               index === undefined
            )
               return;
            await editReply(comment.reply_data.id, replyContent, index, state, setState);
      }
   };

   const titleMap: Record<typeof target, string> = {
      "Add-Comment": "Add new comment",
      "Add-Reply": `Reply comment '${comment?.cus_name ?? undefined}'`,
      "Edit-Reply": `Edit reply '${comment?.cus_name ?? undefined}'`,
   };

   return (
      <div className="w-[700px] max-w-[85vw]">
         {showConfirm && (
            <>
               <ModalHeader title={"Gửi thành công"} closeModal={closeModal} />
               <p className="text-[16px] text-[#333]">
                  Chúng tôi đã nhận được câu hỏi của bạn và sẽ lời trong thời gian sớm
                  nhất hihi
               </p>
               <div className="text-center mt-[30px]">
                  <PushButton onClick={closeModal}>Ok</PushButton>
               </div>
            </>
         )}

         {!showConfirm && (
            <>
               <ModalHeader title={titleMap[target]} closeModal={closeModal} />

               {target === "Add-Comment" && (
                  <div className="flex gap-[20px] mb-[20px]">
                     <Input
                        className="w-full"
                        placeholder="Họ và tên *"
                        value={commentData.cus_name}
                        cb={(val) => handleCommentData("cus_name", val)}
                     />
                     <Input
                        className="w-full"
                        value={commentData.phone_number}
                        placeholder="Điện thoại"
                        cb={(val) => handleCommentData("phone_number", val)}
                     />
                  </div>
               )}
               <div className="bg-[#ccc] rounded-[12px]">
                  <textarea
                     placeholder="Nội dung"
                     value={intiValue}
                     className={`${inputClasses.input} w-full min-h-[100px]`}
                     onChange={(e) => handleChangeContent(e.target.value)}
                  />
               </div>

               <div className="text-right mt-[30px]">
                  <PushButton loading={apiLoading} onClick={handleSubmit}>
                     Post
                  </PushButton>
               </div>
            </>
         )}
      </div>
   );
}
