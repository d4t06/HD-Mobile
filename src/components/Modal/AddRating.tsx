import { Button } from "@/components";
import { useState } from "react";
import ModalHeader from "./ModalHeader";
import { inputClasses } from "../ui/Input";
import { StarIcon } from "@heroicons/react/16/solid";
import useRatingAction from "@/hooks/useRatingAction";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { ModalContentWrapper } from ".";

type Props = {
   product: ProductDetail;
   username: string;
   closeModal: () => void;
};

const initReview = (product: ProductDetail, username: string) => {
   const data: RatingSchema = {
      content: "",
      username,
      product_id: product.id,
      rate: 5,
   };
   return data;
};

export default function AddRating({ product, username, closeModal }: Props) {
   const [ratingData, setRatingData] = useState<RatingSchema>(
      initReview(product, username),
   );
   const [showConfirm, setShowConfirm] = useState(false);

   const { action, isFetching } = useRatingAction();

   const handleRatingData = (field: keyof typeof ratingData, value: string | number) => {
      setRatingData((prev) => ({ ...prev, [field]: value }));
   };

   const handleSubmit = async () => {
      await action({ rating: ratingData, variant: "add" }).then((res: any) => {
         console.log("check res", res);

         if ([200, 201].includes(res?.response?.status || res?.code))
            setShowConfirm(true);
         else closeModal();
      });
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
      <>
         <ModalContentWrapper>
            <ModalHeader title={`Rating '${product.name}'`} closeModal={closeModal} />

            {showConfirm && (
               <>
                  <div className="flex flex-col items-center">
                     <CheckBadgeIcon className="w-[100px] text-emerald-500" />
                     <p className=" font-medium text-[#3f3f3f]">We are got your rating</p>
                  </div>
                  <div className="text-center mt-5">
                     <Button colors={"third"} loading={false} onClick={closeModal}>
                        Cút
                     </Button>
                  </div>
               </>
            )}

            {!showConfirm && (
               <>
                  <div className="mb-[20px]">
                     <div className="flex justify-center space-x-[10px]">
                        {[...Array(5).keys()].map((index) => {
                           const isActive = index + 1 <= ratingData.rate;
                           return (
                              <button
                                 onClick={() => handleRatingData("rate", index + 1)}
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
                        {satisfactionMap[ratingData.rate]}
                     </h2>
                  </div>

                  <div className="bg-[#ccc] rounded-[12px]">
                     <textarea
                        placeholder="..."
                        value={ratingData.content}
                        className={`${inputClasses.input} w-full min-h-[100px]`}
                        onChange={(e) => handleRatingData("content", e.target.value)}
                     ></textarea>
                  </div>
                  <div className="text-right mt-[30px]">
                     <Button colors={"third"} loading={isFetching} onClick={handleSubmit}>
                        Post
                     </Button>
                  </div>
               </>
            )}
         </ModalContentWrapper>
      </>
   );
}
