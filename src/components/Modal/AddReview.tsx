import { Button, Input } from "@/components";

import { useMemo, useState } from "react";
import ModalHeader from "./ModalHeader";
import { inputClasses } from "../ui/Input";
import useReview from "@/hooks/useReview";
import { StarIcon } from "@heroicons/react/16/solid";

type Props = {
   product: Product;
   closeModal: () => void;
   target: "Add-Review" | "Add-Reply" | "Edit-Reply";
   comment?: ProductComment;
};

const initReview = (product: Product) => {
   const data: ProductReview = {
      content: "",
      cus_name: "",
      approve: 0,
      product_id: product.id,
      phone_number: "",
      date_convert: "",
      total_like: 0,
      rate: 5,
   };
   return data;
};

export default function AddReviewModal({ product, closeModal, target, comment }: Props) {
   const [reviewData, setReviewData] = useState<ProductReview>(initReview(product));
   const [replyContent, setReplyContent] = useState(
      comment?.reply_data ? comment.reply_data.content : ""
   );
   const [showConfirm, setShowConfirm] = useState(false);

   // hooks
   const { addReview, apiLoading, replyReview, editReply } = useReview({
      closeModal,
   });

   const handleReviewData = (field: keyof typeof reviewData, value: string | number) => {
      setReviewData((prev) => ({ ...prev, [field]: value }));
   };

   const intiValue = useMemo(
      () => (target === "Add-Review" ? reviewData.content : replyContent),
      [reviewData, replyContent]
   );

   const handleChangeContent = (value: string) => {
      switch (target) {
         case "Add-Review":
            return handleReviewData("content", value);
         case "Add-Reply":
         case "Edit-Reply":
            return setReplyContent(value);
      }
   };

   const handleSubmit = async () => {
      switch (target) {
         case "Add-Review":
            return await addReview(reviewData, setShowConfirm);
         case "Add-Reply":
            if (comment?.id === undefined) return;
            const replyData: Reply = {
               q_id: comment.id,
               product_id: comment.product_id,
               content: replyContent,
               total_like: 0,
               date_convert: "",
            };

            await replyReview(replyData);
            break;
         case "Edit-Reply":
            if (!comment?.reply_data || comment.reply_data.id === undefined) return;
            await editReply(comment.reply_data.id, replyContent);
      }
   };

   const titleMap: Record<typeof target, string> = {
      "Add-Review": `Review '${product?.name}'`,
      "Add-Reply": `Reply review '${comment?.cus_name ?? undefined}'`,
      "Edit-Reply": `Edit reply '${comment?.cus_name ?? undefined}'`,
   };

   const classes = {
      activeStar: "#efb140",
      star: "material-icons text-[40px]",
   };

   const satisfactionMap: Record<number, string> = {
      1: "Very bad",
      2: "Bad",
      3: "Good",
      4: "Very good",
      5: "Excellent",
   };

   return (
      <div className="w-[700px] max-w-[85vw]">
         {showConfirm && (
            <>
               <ModalHeader title={"Gửi thành công"} closeModal={closeModal} />
               <p className="text-[16px] text-[#333]">
                  Chúng tôi đã nhận được đánh giá của bạn
               </p>
               <div className="text-center mt-[30px]">
                  <Button colors={"third"} loading={false} onClick={closeModal}>
                     Cút
                  </Button>
               </div>
            </>
         )}

         {!showConfirm && (
            <>
               <ModalHeader title={titleMap[target]} closeModal={closeModal} />
               {target === "Add-Review" && (
                  <div className="">
                     <div className="mb-[20px]">
                        <div className="flex justify-center space-x-[10px]">
                           {[...Array(5).keys()].map((index) => {
                              const isActive = index + 1 <= reviewData.rate;
                              return (
                                 <button
                                    onClick={() => handleReviewData("rate", index + 1)}
                                    key={index}
                                 >
                                    <StarIcon
                                       className={`w-[36px] ${classes.star} ${
                                          isActive ? "text-[#efb140]" : "text-[#808080]"
                                       }`}
                                    />
                                 </button>
                              );
                           })}
                        </div>
                        <h2 className="text-[20px] font-[500] leading-[26px] mt-[10px] text-center">
                           {satisfactionMap[reviewData.rate]}
                        </h2>
                     </div>

                     <div className="flex items-end mb-[20px] mx-[-10px]">
                        <div className="w-1/2 px-[10px]">
                           <Input
                              className="w-full"
                              placeholder="Họ và tên *"
                              value={reviewData.cus_name}
                              cb={(val) => handleReviewData("cus_name", val)}
                           />
                        </div>
                        <div className="w-1/2 px-[10px]">
                           <Input
                              className="w-full"
                              value={reviewData.phone_number}
                              placeholder="Điện thoại"
                              cb={(val) => handleReviewData("phone_number", val)}
                           />
                        </div>
                     </div>
                  </div>
               )}
               <div className="bg-[#ccc] rounded-[12px]">
                  <textarea
                     placeholder="Nội dung"
                     value={intiValue}
                     className={`${inputClasses.input} w-full min-h-[100px]`}
                     onChange={(e) => handleChangeContent(e.target.value)}
                  ></textarea>
               </div>
               <div className="text-right mt-[30px]">
                  <Button colors={"third"} loading={apiLoading} onClick={handleSubmit}>
                     Post
                  </Button>
               </div>
            </>
         )}
      </div>
   );
}
