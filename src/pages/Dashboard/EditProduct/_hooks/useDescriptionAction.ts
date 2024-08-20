import { usePrivateRequest } from "@/hooks";
import { useToast } from "@/store/ToastContext";
import { sleep } from "@/utils/appHelper";
import { useState } from "react";

const URL = "/product-descriptions";

export default function useDescriptionAction() {
   const [isFetching, setIsFetching] = useState(false);

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   const update = async (
      desc: DescriptionSchema,
      productId: number,
      restChange: () => void
   ) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         await privateRequest.put(`${URL}/${productId}`, desc);
         setSuccessToast("Update description successful");

         restChange();
      } catch (error) {
         console.log({ message: error });
         setErrorToast("Update description fail");
      } finally {
         setIsFetching(false);
      }
   };

   return { update, isFetching };
}
