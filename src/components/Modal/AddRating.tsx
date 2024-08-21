import { Button } from "@/components";
import { useState } from "react";
import ModalHeader from "./ModalHeader";
import { inputClasses } from "../ui/Input";
import { StarIcon } from "@heroicons/react/16/solid";
import useRatingAction from "@/hooks/useRatingAction";

type Props = {
   product: ProductDetail;
   username: string;
   close: () => void;
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

export default function AddRating({ product, username, close }: Props) {
   const [ratingData, setRatingData] = useState<RatingSchema>(
      initReview(product, username)
   );
   const [showConfirm, setShowConfirm] = useState(false);

   const { action, isFetching } = useRatingAction();

   const handleRatingData = (field: keyof typeof ratingData, value: string | number) => {
      setRatingData((prev) => ({ ...prev, [field]: value }));
   };

   const handleSubmit = async () => {
      await action({ rating: ratingData, variant: "add" });
      setShowConfirm(true);
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
         {showConfirm && (
            <div className="w-[400px] max-w-[85vw]">
               <ModalHeader title={"Rate successful"} closeModal={close} />
               <p className=" font-medium text-[#3f3f3f]">We are got your rating</p>
               <div className="text-center mt-[30px]">
                  <Button colors={"third"} loading={false} onClick={close}>
                     Cút
                  </Button>
               </div>
            </div>
         )}

         {!showConfirm && (
            <div className="w-[700px] ">
               <ModalHeader title={`Rating '${product.name}'`} closeModal={close} />

               <div className="">
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
               </div>

               <div className="bg-[#ccc] rounded-[12px]">
                  <textarea
                     placeholder="Nội dung"
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
            </div>
         )}
      </>
   );
}
