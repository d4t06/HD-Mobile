import { Button, Input } from "@/components";
import { ProductComment, Product, Reply, ProductReview } from "@/types";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import ModalHeader from "./ModalHeader";
import { inputClasses } from "../ui/Input";
import useReview from "@/hooks/useReview";

type Props = {
   product?: Product;
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
   target: "Add-Review" | "Add-Reply" | "Edit-Reply";
   comment?: ProductComment;
};

const initReview = (product?: Product) => {
   const data: ProductReview = {
      content: "",
      cus_name: "",
      approve: 0,
      product_name_ascii: product?.product_name_ascii || "",
      phone_number: "",
      date_convert: "",
      total_like: 0,
      rate: 5,
   };
   return data;
};

export default function AddReviewModal({ product, setIsOpenModal, target, comment }: Props) {
   const [reviewData, setReviewData] = useState<ProductReview>(initReview(product));
   const [replyContent, setReplyContent] = useState(comment?.reply_data ? comment.reply_data.content : "");
   const [showConfirm, setShowConfirm] = useState(false);

   // hooks
   const { addReview, apiLoading, replyReview, editReply } = useReview({ setIsOpenModal });

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
               product_name_ascii: comment.product_name_ascii,
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
      "Add-Review": `Review '${product?.product_name}'`,
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
               <ModalHeader title={"Gửi thành công"} setIsOpenModal={setIsOpenModal} />
               <p className="text-[16px] text-[#333]">Chúng tôi đã nhận được đánh giá của bạn</p>
               <div className="text-center mt-[30px]">
                  <Button isLoading={false} onClick={() => setIsOpenModal(false)} primary>
                     Cút
                  </Button>
               </div>
            </>
         )}

         {!showConfirm && (
            <>
               <ModalHeader title={titleMap[target]} setIsOpenModal={setIsOpenModal} />
               {target === "Add-Review" && (
                  <div className="">
                     <div className="mb-[20px]">
                        <div className="flex justify-center space-x-[10px]">
                           {[...Array(5).keys()].map((index) => {
                              const isActive = index + 1 <= reviewData.rate;
                              return (
                                 <Button onClick={() => handleReviewData("rate", index + 1)} key={index}>
                                    {/* <i className={`${classes.star} ${isActive ? "text-[#efb140]" : "text-[#808080]"}`}>
                                       star
                                    </i> */}
                                    <svg
                                       xmlns="http://www.w3.org/2000/svg"
                                       fill="currentColor"
                                       viewBox="0 0 24 24"
                                       strokeWidth="1.5"
                                       stroke="currentColor"
                                       className={`w-[36px] ${classes.star} ${
                                          isActive ? "text-[#efb140]" : "text-[#808080]"
                                       }`}
                                    >
                                       <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                                       />
                                    </svg>
                                 </Button>
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
                  <Button isLoading={apiLoading} onClick={handleSubmit} primary>
                     Post
                  </Button>
               </div>
            </>
         )}
      </div>
   );
}
