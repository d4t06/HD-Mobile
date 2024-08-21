import { Button, Modal } from "@/components";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfirmModal from "@/components/Modal/Confirm";

import Skeleton from "@/components/Skeleton";
import useRatingAction from "@/hooks/useRatingAction";
import RatingItem from "@/components/RatingItem";
import { useRating } from "@/store/ratingContext";
import { CheckIcon, TrashIcon } from "@heroicons/react/16/solid";
import PushFrame from "@/components/ui/PushFrame";
import NoResult from "@/components/NoResult";

type Modal = "delete" | "approve";

const classes = {
   button: "p-1",
};

export default function DashboardRating() {
   const { count, page, size, ratings, status } = useRating();

   const { getRatings, action, isFetching } = useRatingAction();

   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   const currentRatingIndex = useRef<number>();
   const ranEffect = useRef(false);

   const remaining = useMemo(() => count - page * size, [ratings]);
   const closeModal = () => setIsOpenModal("");

   const handleGetMore = () => {
      getRatings({ page: page + 1, variant: "admin" });
   };

   const handleOpenModal = (modal: Modal, index: number) => {
      currentRatingIndex.current = index;
      setIsOpenModal(modal);
   };

   type Approve = {
      variant: "approve";
      id: number;
      index: number;
   };

   type Delete = {
      variant: "delete";
      id: number;
      index: number;
   };

   const handleRatingAction = async (props: Approve | Delete) => {
      switch (props.variant) {
         case "delete":
            await action({ variant: "delete", id: props.id, index: props.index });
            break;
         case "approve":
            await action({ variant: "approve", id: props.id, index: props.index });
            break;
      }

      closeModal();
   };

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;

      const _currentRatingIndex = currentRatingIndex.current;
      if (_currentRatingIndex === undefined) return <h1>Index not found</h1>;
      const currentRating = ratings[_currentRatingIndex];

      switch (isOpenModal) {
         case "delete":
            return (
               <ConfirmModal
                  label={`Delete comment of '${currentRating.username}'`}
                  callback={() =>
                     handleRatingAction({
                        variant: "delete",
                        id: currentRating.id,
                        index: _currentRatingIndex,
                     })
                  }
                  loading={isFetching}
                  closeModal={closeModal}
               />
            );

         case "approve":
            return (
               <ConfirmModal
                  label={`Approve comment of '${currentRating.username}'`}
                  callback={() =>
                     handleRatingAction({
                        variant: "approve",
                        id: currentRating.id,
                        index: _currentRatingIndex,
                     })
                  }
                  loading={isFetching}
                  closeModal={closeModal}
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

   useEffect(() => {
      if (!ranEffect.current) {
         ranEffect.current = true;

         getRatings({ replace: true, variant: "admin", size: 1 });
      }
   }, []);

   if (status === "error")
      return <h1 className="text-xl text-center">Some thing went wrong</h1>;

   return (
      <div className="">
         <div className="text-lg sm:text-xl font-medium">Review</div>
         <div className="space-y-4 mt-5">
            {status !== "loading" &&
               !!ratings.length &&
               ratings.map((r, index) => {
                  return (
                     <PushFrame key={index}>
                        <div className="flex items-center justify-between">
                           <RatingItem review={r} />

                           <div className="space-x-2">
                              <Button
                                 colors={"third"}
                                 className={classes.button}
                                 onClick={() => handleOpenModal("delete", index)}
                                 size={"clear"}
                              >
                                 <TrashIcon className="w-6" />
                              </Button>
                              {!r.approve && (
                                 <Button
                                    colors={"second"}
                                    onClick={() => handleOpenModal("approve", index)}
                                    size={"clear"}
                                    className={classes.button}
                                 >
                                    <CheckIcon className="w-6" />
                                 </Button>
                              )}
                           </div>
                        </div>
                     </PushFrame>
                  );
               })}

            {(status === "loading" || status === "more-loading") && renderSkeleton}
         </div>

         {status === "success" && !ratings.length && <NoResult />}

         {!!ratings.length && (
            <p className="mt-[30px] text-center">
               <Button onClick={handleGetMore} colors={"third"} disabled={remaining <= 0}>
                  More ({remaining > 0 ? remaining : 0}) ratings
               </Button>
            </p>
         )}
         <>{isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}</>
      </div>
   );
}
