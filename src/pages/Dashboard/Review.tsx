import { Modal } from "@/components";
import { useMemo, useRef, useState } from "react";
import { AdminReply } from "@/components/CommentItem";
import ConfirmModal from "@/components/Modal/Confirm";

import useReview from "@/hooks/useReview";
import Skeleton from "@/components/Skeleton";
import ReviewItem from "@/components/ReviewItem";
import PushButton from "@/components/ui/PushButton";

type ModalTarget = "Add-Comment" | "Add-Reply" | "Edit-Reply" | "Delete-Comment";

const classes = {
   button: "px-[5px] !py-[1px]",
};

export default function Review() {
   const [isOpenModal, setIsOpenModal] = useState(false);

   const openModalTarget = useRef<ModalTarget | "">("");
   const curReviewIndex = useRef<number>();

   const closeModal = () => setIsOpenModal(false);

   const { apiLoading, deleteReview, approveReview, state, setState } = useReview({
      close: closeModal,
      admin: true,
   });

   const { count, page, page_size, reviews, status } = state;
   const remaining = useMemo(() => count - page * page_size, [reviews]);

   const handleOpenModal = (type: ModalTarget, index: number) => {
      curReviewIndex.current = index;
      openModalTarget.current = type;
      setIsOpenModal(true);
   };

   const handleApproveReview = async (index: number) => {
      await approveReview(index, state, setState);
   };

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;
      if (curReviewIndex.current === undefined) return <h1>Index not found</h1>;
      const curReview = reviews[curReviewIndex.current];

      switch (openModalTarget.current) {
         // case "Add-Reply":
         //    return (
         //       <AddCommentModal state={state} target="Add-Reply" close={close} comment={curReview} />
         //    );
         // case "Edit-Reply":
         //    return <AddCommentModal target="Edit-Reply" close={close} comment={curReview} />;
         case "Delete-Comment":
            return (
               <ConfirmModal
                  label={`Delete comment '${curReview.cus_name}'`}
                  callback={() => deleteReview(curReview)}
                  loading={apiLoading}
                  setOpenModal={setIsOpenModal}
               />
            );
      }
   }, [isOpenModal]);

   const renderSkeleton = useMemo(
      () =>
         [...Array(3).keys()].map((index) => (
            <Skeleton key={index} className="h-[154px] mb-[20px] w-full rounded-[12px]" />
         )),
      []
   );

   const Cta = (index: number, comment: ProductComment) => (
      <>
         <PushButton
            className={classes.button}
            onClick={() => handleOpenModal("Add-Reply", index)}
            size={"clear"}
         >
            Reply
         </PushButton>
         <PushButton
            className={classes.button}
            onClick={() => handleOpenModal("Delete-Comment", index)}
            size={"clear"}
         >
            Delete
         </PushButton>
         {!comment.approve && (
            <PushButton
               loading={apiLoading && curReviewIndex.current === index}
               onClick={() => handleApproveReview(index)}
               size={"clear"}
               className={classes.button}
            >
               Approve
            </PushButton>
         )}
      </>
   );

   if (status === "error") return <h1 className="text-[22px]">Some thing went wrong</h1>;

   return (
      <div className="">
         <div className="text-[22px] font-[600] mb-[20px]">Review</div>
         {status === "loading" && renderSkeleton}

         {status === "success" &&
            !!reviews.length &&
            reviews.map((r, index) => {
               return (
                  <div key={index} className="bg-[#e1e1e1] rounded-[12px]">
                     <div className="mb-[20px] bg-white rounded-[12px] p-[10px] translate-y-[-6px]">
                        <ReviewItem admin review={r}>
                           {Cta(index, r)}
                        </ReviewItem>
                        {r.reply_data && (
                           <div className="ml-[74px] mt-[14px]">
                              <AdminReply
                                 cta={
                                    <PushButton
                                       onClick={() =>
                                          handleOpenModal("Edit-Reply", index)
                                       }
                                       className={classes.button}
                                       size={"clear"}
                                    >
                                       Edit
                                    </PushButton>
                                 }
                                 reply={r.reply_data}
                              />
                           </div>
                        )}
                     </div>
                  </div>
               );
            })}
         {status === "success" && !reviews.length && (
            <p className="text-[16px] text-[#333]">Nothing to show</p>
         )}

         {!!reviews.length && (
            <p className="mt-[30px] text-center">
               <PushButton disabled={remaining <= 0}>
                  Xem thêm ({remaining > 0 ? remaining : 0}) đánh giá
               </PushButton>
            </p>
         )}
         <>{isOpenModal && <Modal close={closeModal}>{renderModal}</Modal>}</>
      </div>
   );
}
