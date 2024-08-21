import { publicRequest } from "@/utils/request";
import { useState } from "react";
import { usePrivateRequest } from ".";
import { useRating } from "@/store/ratingContext";
import { sleep } from "@/utils/appHelper";

const RATING_URL = "/product-ratings";
const MANAGEMENT_RATING_URL = "/product-rating-management";

export default function useRatingAction() {
   const [isFetching, setIsFetching] = useState(false);

   const { approveRating, deleteRating } = useRating();

   const privateRequest = usePrivateRequest();

   type Add = {
      variant: "add";
      rating: RatingSchema;
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

   const action = async (props: Add | Approve | Delete) => {
      try {
         setIsFetching(true);

         if (import.meta.env.DEV) await sleep(600);

         switch (props.variant) {
            case "add": {
               await publicRequest.post(RATING_URL, props.rating);

               break;
            }
            case "approve": {
               const { id, index } = props;
               await privateRequest.put(`${MANAGEMENT_RATING_URL}/${id}`);

               approveRating(index);

               break;
            }

            case "delete": {
               const { id, index } = props;
               await privateRequest.delete(`${MANAGEMENT_RATING_URL}/${id}`);

               deleteRating(index);

               break;
            }
         }
      } catch (error) {
      } finally {
         setIsFetching(false);
      }
   };

   return { action, isFetching };
}
