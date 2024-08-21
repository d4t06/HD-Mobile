import { publicRequest } from "@/utils/request";
import { sleep } from "@/utils/appHelper";
import { useRating } from "@/store/ratingContext";

const RATING_URL = "/product-ratings";
const MANAGEMENT_RATING_URL = "/product-rating-management";

export default function uesGetRating() {
   const { storingRatings, catchError, size } = useRating();

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

         const payload = res.data.data;

         storingRatings({
            ...payload,
            status: "success",
            replace,
         });
      } catch (error) {
         console.log(error);
         catchError();
      }
   };

   return { getRatings };
}
