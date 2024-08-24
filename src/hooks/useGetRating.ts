import { publicRequest } from "@/utils/request";
import { sleep } from "@/utils/appHelper";
import { useRating } from "@/store/ratingContext";

const RATING_URL = "/product-ratings";

export default function uesGetRating() {
   const { storingRatings, catchError, size: storeSize } = useRating();

   type Props = {
      replace?: boolean;
      page?: number;
      size?: number;
      product_id?: number;
      approved?: boolean;
   };

   const getRatings = async (props?: Props) => {
      try {
         const { approved, page, product_id, replace, size } = props || {};

         const params: Record<string, number> = {};

         if (replace) storingRatings({ status: "loading", ratings: [] });
         else storingRatings({ status: "more-loading" });

         if (import.meta.env.DEV) await sleep(600);

         params["size"] = size || storeSize || 1;
         if (page) params["page"] = page || 1;
         if (product_id) params["product_id"] = product_id;
         if (typeof approved === "boolean" && !approved) params["approved"] = 0;

         const res = await publicRequest.get(RATING_URL, {
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
