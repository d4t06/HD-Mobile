import { useEffect, useRef } from "react";
import { sleep } from "@/utils/appHelper";
import { useParams } from "react-router-dom";
import { publicRequest } from "@/utils/request";
import { useDispatch, useSelector } from "react-redux";
import {
   resetProduct,
   runError,
   selectProduct,
   storingProduct,
} from "@/store/productSlice";

const PRODUCT_URL = "/products";

export default function useGetProductDetail() {
   const dispatch = useDispatch();
   const ranUseEffect = useRef(false);

   const { status, product } = useSelector(selectProduct);

   //   hooks
   const { productId } = useParams();

   const getProductDetail = async () => {
      try {
         if (!productId) throw new Error("missing params");

         dispatch(storingProduct({ status: "loading" }));
         if (import.meta.env.DEV) await sleep(2000);

         const res = await publicRequest.get(`${PRODUCT_URL}/${productId}`);

         dispatch(storingProduct({ product: res.data.data, status: "successful" }));
      } catch (error) {
         console.log({ message: error });
         dispatch(runError());
      }
   };

   useEffect(() => {
      if (!ranUseEffect.current) {
         getProductDetail();
         ranUseEffect.current = true;
      }

      return () => {
         dispatch(resetProduct());
      };
   }, [productId]);

   return {
      status,
      productDetail: product,
   };
}
