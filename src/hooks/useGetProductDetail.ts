import { useEffect, useRef } from "react";
import { sleep } from "@/utils/appHelper";
import { useParams } from "react-router-dom";
import { publicRequest } from "@/utils/request";
import { useDispatch, useSelector } from "react-redux";
import {
   runError,
   selectProduct,
   setProduct,
   setProductStatus,
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

         dispatch(setProductStatus("loading"));
         if (import.meta.env.DEV) await sleep(500);

         const res = await publicRequest.get(`${PRODUCT_URL}/${productId}`);

         dispatch(setProduct(res.data.data));
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
   }, [productId]);

   return {
      status,
      productDetail: product,
   };
}
