import { Button, Modal } from "@/components";
import { useEffect, useMemo, useRef, useState } from "react";
import ConfirmModal from "@/components/Modal/Confirm";

import Skeleton from "@/components/Skeleton";
import useRatingAction from "@/hooks/useRatingAction";
import RatingItem from "@/components/RatingItem";
import { useRating } from "@/store/ratingContext";
import { TrashIcon } from "@heroicons/react/16/solid";
import PushFrame from "@/components/ui/PushFrame";
import NoResult from "@/components/NoResult";
import uesGetRating from "@/hooks/useGetRating";
import { CheckIcon } from "@heroicons/react/24/outline";

type Modal = "delete" | "approve";

export default function DashboardRating() {
   const { count, page, size, ratings, status, resetRating } = useRating();

   const { action, isFetching } = useRatingAction();
   const { getRatings } = uesGetRating();

   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   const currentRatingIndex = useRef<number>();
   const ranEffect = useRef(false);

   const isRemaining = count - page * size;
   const closeModal = () => setIsOpenModal("");

   type Approve = {
      variant: "approve";
   };

   type Delete = {
      variant: "delete";
      id: number;
      index: number;
   };

   const handleRatingAction = async (props: Approve | Delete) => {
      switch (props.variant) {
         case "delete":
            await action({
               variant: "delete",
               id: props.id,
               index: props.index,
            });

            if (ratings.length === 1 && isRemaining)
               getRatings({ replace: true, approved: false });

            break;
         case "approve":
            await action({
               variant: "approve",
               id_list: ratings.map((r) => r.id),
            });

            if (isRemaining) getRatings({ replace: true, approved: false });

            break;
      }

      closeModal();
   };

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;

      switch (isOpenModal) {
         case "delete": {
            const _currentRatingIndex = currentRatingIndex.current;
            if (_currentRatingIndex === undefined)
               return <h1>Index not found</h1>;
            const currentRating = ratings[_currentRatingIndex];

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
         }

         case "approve":
            return (
               <ConfirmModal
                  label={`Approve all rating?`}
                  callback={() =>
                     handleRatingAction({
                        variant: "approve",
                     })
                  }
                  loading={isFetching}
                  closeModal={closeModal}
               />
            );
      }
   }, [isOpenModal, isFetching]);

   const renderSkeleton = useMemo(
      () =>
         [...Array(3).keys()].map((index) => (
            <Skeleton
               key={index}
               className="h-[154px] mb-[20px] w-full rounded-[12px]"
            />
         )),
      []
   );

   useEffect(() => {
      if (!ranEffect.current) {
         ranEffect.current = true;

         getRatings({ replace: true, approved: false, size: 99 });
      }

      return () => {
         resetRating();
      };
   }, []);

   if (status === "error")
      return <h1 className="text-xl text-center">Some thing went wrong</h1>;

   return (
      <div className="">
         <div className="flex items-center justify-between">
            <div className="text-lg sm:text-2xl">Rating ({count})</div>
            {!!ratings.length && (
               <Button
                  colors={"third"}
                  className={"p-1 sm:px-2 space-x-1"}
                  onClick={() => {
                     setIsOpenModal("approve");
                  }}
                  size={"clear"}
               >
                  <CheckIcon className="w-6" />
                  <span className="hidden sm:block">Approve all</span>
               </Button>
            )}
         </div>
         <div className="space-y-4 mt-5">
            {status !== "loading" &&
               !!ratings.length &&
               ratings.map((r, index) => {
                  return (
                     <PushFrame key={index}>
                        <div className="flex items-center justify-between">
                           <RatingItem review={r} />

                           <Button
                              colors={"third"}
                              className={"p-1 sm:px-2 space-x-1"}
                              onClick={() => {
                                 currentRatingIndex.current = index;
                                 setIsOpenModal("delete");
                              }}
                              size={"clear"}
                           >
                              <TrashIcon className="w-6" />
                           </Button>
                        </div>
                     </PushFrame>
                  );
               })}

            {(status === "loading" || status === "more-loading") &&
               renderSkeleton}
         </div>

         {status === "success" && !ratings.length && (
            <NoResult>
               <p>No unapprove rating jet...</p>
            </NoResult>
         )}

         {/* {!!ratings.length && (
            <p className="mt-[30px] text-center">
               <Button
                  onClick={handleGetMore}
                  colors={"third"}
                  disabled={remaining <= 0}
               >
                  More ({remaining > 0 ? remaining : 0}) ratings
               </Button>
            </p>
         )} */}
         <>
            {isOpenModal && (
               <Modal closeModal={closeModal}>{renderModal}</Modal>
            )}
         </>
      </div>
   );
}
