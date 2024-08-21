// import useRating from "@/hooks/useRating";
import { useEffect, useMemo, useState } from "react";
import { CommentSkeleton } from "@/components/CommentItem";
import NotFound from "./child/NotFound";

import RatingItem from "@/components/RatingItem";
import { StarIcon } from "@heroicons/react/16/solid";
import Button from "@/components/ui/Button";
import Title from "@/components/Title";
import { Modal } from "@/components";
import AddRating from "@/components/Modal/AddRating";
import { useAuth } from "@/store/AuthContext";
import { useRating } from "@/store/ratingContext";
import useRatingAction from "@/hooks/useRatingAction";

type Props = {
   loading: boolean;
   product: ProductDetail | null;
};

export default function Rating({ loading, product }: Props) {
   const { count, page, ratings, size, status, average } = useRating();

   const { getRatings } = useRatingAction();

   const { auth } = useAuth();

   const [isOpenModal, setIsOpenModal] = useState(false);

   const closeModal = () => setIsOpenModal(false);

   const handleGetMore = async () => {
      if (!product) return;
      await getRatings({ variant: "client", page: page + 1, productId: product.id });
   };

   const remaining = useMemo(() => count - page * size, [ratings]);

   const renderSkeleton = useMemo(
      () =>
         [...Array(2).keys()].map((item) => (
            <div key={item} className="comment-item mt-[5px]">
               {CommentSkeleton}
            </div>
         )),
      []
   );

   useEffect(() => {
      if (loading) return;

      if (product) {
         getRatings({ variant: "client", replace: true, productId: product.id });
      }
   }, [loading]);

   return (
      <>
         <div className="mt-[30px]">
            <div className="md:flex justify-between items-center mb-[20px]">
               <Title className="mb-[10px] md:mb-0">
                  <StarIcon className="w-[24px]" />
                  <span>Rating</span>
               </Title>

               <Button
                  onClick={() => setIsOpenModal(true)}
                  colors={"third"}
                  className="w-full md:w-auto"
               >
                  Write rating
               </Button>
            </div>

            <div className="space-y-[20px]">
               {(loading || status === "loading") && renderSkeleton}

               {status === "success" && (
                  <>
                     {!!ratings.length ? (
                        <>
                           <div className="text-center mb-[30px]">
                              <h2 className="text-[20px] text-[#333] font-[600] ">
                                 Average rating
                              </h2>
                              <h1 className="text-[70px] font-[600] leading-[80px] text-[#cd1818]">
                                 {average.toFixed(1)} /5
                              </h1>
                              <p className="text-[#495057] text-[16px] leading-[20px]">
                                 {count} ratings
                              </p>
                           </div>

                           {ratings.map((r, index) => {
                              return <RatingItem key={index} review={r} />;
                           })}

                           <p className="text-center mt-[20px]">
                              <Button
                                 colors={"third"}
                                 onClick={handleGetMore}
                                 disabled={remaining <= 0}
                              >
                                 More ({remaining > 0 ? remaining : 0}) ratings
                              </Button>
                           </p>
                        </>
                     ) : (
                        <NotFound title="" />
                     )}
                  </>
               )}

               {status === "error" && <p>Some thing went wrong ¯\_(ツ)_/¯</p>}
            </div>
         </div>

         {isOpenModal && product && auth && (
            <Modal closeModal={closeModal}>
               <AddRating close={closeModal} username={auth.username} product={product} />
            </Modal>
         )}
      </>
   );
}
