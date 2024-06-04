
import { useEffect, useRef, useState } from "react";
import { sleep } from "@/utils/appHelper";
import { useParams } from "react-router-dom";
import { useProductContext } from "@/store/ProductDataContext";
import { publicRequest } from "@/utils/request";

const MANAGE_PRODUCT_URL = "/product-management/products";

export default function useEdit() {
   const { setEditorData } = useProductContext();

   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
   const ranUseEffect = useRef(false);

   //   hooks
   const { productAscii } = useParams();

   const getProductDetail = async () => {
      try {
         setStatus("loading");

         if (!productAscii) throw new Error("missing params");
         if (import.meta.env.DEV) await sleep(500);

         const res = await publicRequest.get(`${MANAGE_PRODUCT_URL}/${productAscii}`);
         const data = res.data as Product;

         setStatus("success");
         setEditorData(data);
      } catch (error) {
         console.log({ message: error });
         setStatus("error");
      }
   };

   useEffect(() => {
      if (!ranUseEffect.current) {
         getProductDetail();
         ranUseEffect.current = true;
      }
   }, []);

   return {
      status,
   };
}
