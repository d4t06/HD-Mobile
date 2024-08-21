import { sleep } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { useState } from "react";

const RATING_URL = "/product-ratings";

export default function useGetRatingAverage() {
   const [avg, setAvg] = useState<number>();
   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

   const getAverage = async (productId: number) => {
      try {
         setStatus("loading");

         if (import.meta.env.DEV) await sleep(600);

         const res = await publicRequest.get(`${RATING_URL}/avg`, {
            params: { product_id: productId },
         });

         setAvg(+res.data.data.average);
         setStatus("success");
      } catch (error) {
         setStatus("error");
      }
   };

   return {
      avg,
      status,
      getAverage,
   };
}
