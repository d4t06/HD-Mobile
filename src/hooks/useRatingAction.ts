import { publicRequest } from "@/utils/request";
import { useState } from "react";
import { usePrivateRequest } from ".";
import { RatingStateType, useRating } from "@/store/ratingContext";
import { sleep } from "@/utils/appHelper";

const RATING_URL = "/product-ratings";
const MANAGEMENT_RATING_URL = "/product-rating-management";

export default function useRatingAction() {
   const [isFetching, setIsFetching] = useState(false);

   const { storingRatings, approveRating, deleteRating, size } = useRating();

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

   type GetRatings = {
      replace?: boolean;
      page?: number;
      size?: number;
      productId?: number;
   };

   interface Admin extends GetRatings {
      variant: "admin";
   }

   type Client = GetRatings & {
      variant: "client";
      productId: number;
   };

   const getRatings = async (props: Admin | Client) => {
      try {
         const { variant, replace, ...params } = props;

         if (replace) storingRatings({ status: "loading", ratings: [] });
         else storingRatings({ status: "more-loading" });

         if (import.meta.env.DEV) await sleep(600);
         let url = "";

         if (!params.size) params.size = size || 1;

         switch (variant) {
            case "admin":
               url = MANAGEMENT_RATING_URL;

               break;

            case "client":
               url = RATING_URL;
               params["productId"] = props.productId;
         }

         const res = await publicRequest.get(url, {
            params,
         });

         const payload = res.data.data as RatingStateType;

         storingRatings({
            ...payload,
            status: "success",
            replace,
         });
      } catch (error) {
         console.log(error);
         storingRatings({ status: "error" });
      }
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

   return { action, getRatings, isFetching };
}
