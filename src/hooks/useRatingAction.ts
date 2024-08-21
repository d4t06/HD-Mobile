import { publicRequest } from "@/utils/request";
import { useState } from "react";
import { usePrivateRequest } from ".";
import { RatingStateType, useRating } from "@/store/ratingContext";

const RATING_URL = "/product-ratings";
const MANAGEMENT_RATING_URL = "/product-rating-management";

export default function useRatingAction() {
   const [isFetching, setIsFetching] = useState(false);

   const { storingRatings, approveRating, deleteRating } = useRating();

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

   type Admin = {
      variant: "admin";
      replace?: boolean;
      page?: number;
   };

   type Client = {
      variant: "client";
      productId: number;
      replace?: boolean;
      page?: number;
   };

   const getRatings = async (props: Admin | Client) => {
      try {
         storingRatings({ status: "loading" });

         let url = "";

         const params: any = { page: props.page };

         switch (props.variant) {
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

         // let ratingAvg = 0;

         // if (replace) {
         //    const averageRes = await publicRequest.get(`${RATING_URL}/avg/${productId}`);
         //    ratingAvg = +averageRes.data;
         // }

         // if (replace) {
         //    payload["average"] = ratingAvg;
         // }

         storingRatings({
            ...payload,
            status: "success",
            replace: props.replace,
         });
      } catch (error) {
         console.log(error);
         storingRatings({ status: "error" });
      }
   };

   const action = async (props: Add | Approve | Delete) => {
      try {
         setIsFetching(true);

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
