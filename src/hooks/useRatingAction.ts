import { useState } from "react";
import { usePrivateRequest } from ".";
import { useRating } from "@/store/ratingContext";
import { sleep } from "@/utils/appHelper";

const RATING_URL = "/product-ratings";
const MANAGEMENT_RATING_URL = "/product-rating-management";

export default function useRatingAction() {
   const [isFetching, setIsFetching] = useState(false);

   const { deleteRating, storingRatings } = useRating();

   const privateRequest = usePrivateRequest();

   type Add = {
      variant: "add";
      rating: RatingSchema;
   };

   type Approve = {
      variant: "approve";
      id_list: number[];
   };

   type Delete = {
      variant: "delete";
      id: number;
      index: number;
   };

   const action = async (props: Add | Approve | Delete) => {
      try {
         setIsFetching(true);

         if (import.meta.env.DEV) await sleep(300);

         switch (props.variant) {
            case "add": {
               const res = await privateRequest.post(RATING_URL, props.rating);

               return res;
            }
            case "approve": {
               const { id_list } = props;
               await privateRequest.put(`${MANAGEMENT_RATING_URL}`, {
                  id_list,
               });

               storingRatings({ replace: true, ratings: [] });

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
         return error;
      } finally {
         setIsFetching(false);
      }
   };

   return { action, isFetching };
}
