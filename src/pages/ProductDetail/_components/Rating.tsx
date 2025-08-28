import { useEffect, useMemo, useRef, useState } from "react";
import RatingItem from "@/components/RatingItem";
import { PencilSquareIcon, StarIcon } from "@heroicons/react/16/solid";
import Button from "@/components/ui/Button";
import Title from "@/components/Title";
import { Modal } from "@/components";
import AddRating from "@/components/Modal/AddRating";
import { useAuth } from "@/store/AuthContext";
import { useRating } from "@/store/ratingContext";
import useGetRatingAverage from "@/hooks/useGetRatingAverage";
import Skeleton from "@/components/Skeleton";
import NoResult from "@/components/NoResult";
import uesGetRating from "@/hooks/useGetRating";

type Props = {
   loading: boolean;
   product: ProductDetail | null;
};

export default function Rating({ loading, product }: Props) {
   const { auth } = useAuth();
   const { size, status, page, ratings, count } = useRating();

   const [isOpenModal, setIsOpenModal] = useState(false);

   const ranEffect = useRef(false);

   // hooks
   const { avg, status: getAvgStatus, getAverage } = useGetRatingAverage();
   const { getRatings } = uesGetRating();

   const closeModal = () => setIsOpenModal(false);

   const handleGetMore = async () => {
      if (!product) return;
      await getRatings({
         page: page + 1,
         product_id: product.id,
      });
   };

   const remaining = useMemo(() => count - page * size, [ratings]);

   const renderSkeleton = useMemo(
      () =>
         [...Array(2).keys()].map((item) => (
            <div className="flex" key={item}>
               <Skeleton className="w-[44px] h-[44px] rounded-full flex-shrink-0" />
               <div className="ml-[10px]">
                  <Skeleton className="h-[20px] w-[200px] max-w-[30vw] rounded-[4px]" />
                  <Skeleton className="h-[24px] mt-[10px] w-[400px] max-w-[50vw] rounded-[4px]" />
                  <Skeleton className="h-[18px] mt-[10px] w-[100px] max-w-[30vw] rounded-[4px]" />
               </div>
            </div>
         )),
      [],
   );

   useEffect(() => {
      if (product) {
         if (!ranEffect.current) {
            ranEffect.current = true;

            getRatings({ replace: true, product_id: product.id });
            getAverage(product.id);
         }
      }
   }, [product]);

   return (
      <>
         <div className="mt-[30px]">
            <div className="md:flex justify-between items-center mb-[20px]">
               <Title className="mb-[10px] md:mb-0">
                  <StarIcon className="w-6" />
                  <span>Rating</span>
               </Title>

               {auth && (
                  <Button
                     onClick={() => setIsOpenModal(true)}
                     colors={"second"}
                     className="w-full md:w-auto space-x-1"
                  >
                     <PencilSquareIcon className="w-6" />
                     <span>Write rating</span>
                  </Button>
               )}
            </div>

            <div className="space-y-[20px]">
               {!!ratings.length && (
                  <div className="flex flex-col items-center mb-[30px] font-medium">
                     <h2 className="text-lg text-[#3f3f3f]  ">Average rating</h2>
                     {getAvgStatus === "loading" && (
                        <>
                           <Skeleton className="h-[52px] my-1 w-[200px] rounded-md" />
                           <Skeleton className="h-[18px] my-1 w-[100px] rounded-md" />
                        </>
                     )}

                     {getAvgStatus !== "loading" && (
                        <h1 className="text-[50px] leading-[60px]  text-[#cd1818]">
                           {getAvgStatus === "success" && avg ? (
                              <span>{avg.toFixed(0)} / 5</span>
                           ) : (
                              <span>--</span>
                           )}
                        </h1>
                     )}

                     {getAvgStatus !== "loading" && (
                        <p className="text-[#3f3f3f]">{count} ratings</p>
                     )}
                  </div>
               )}

               {status !== "error" && (
                  <>
                     {!!ratings.length ? (
                        ratings.map((r, index) => {
                           return <RatingItem key={index} review={r} />;
                        })
                     ) : (
                        <>
                           {status === "success" && (
                              <NoResult>
                                 <p>No rating jet...</p>
                              </NoResult>
                           )}
                        </>
                     )}

                     {(loading || status === "loading" || status === "more-loading") &&
                        renderSkeleton}

                     {!!count && (
                        <p className="text-center mt-[20px]">
                           <Button
                              colors={"third"}
                              onClick={handleGetMore}
                              disabled={remaining <= 0}
                           >
                              More ({remaining > 0 ? remaining : 0}) ratings
                           </Button>
                        </p>
                     )}
                  </>
               )}

               {status === "error" && (
                  <NoResult>
                     <p>Something went wrong</p>
                  </NoResult>
               )}
            </div>
         </div>

         {isOpenModal && product && auth && (
            <Modal closeModal={closeModal}>
               <AddRating
                  closeModal={closeModal}
                  username={auth.username}
                  product={product}
               />
            </Modal>
         )}
      </>
   );
}
