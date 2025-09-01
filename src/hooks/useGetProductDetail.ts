import { useEffect, useState } from "react";
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

   const { status, product } = useSelector(selectProduct);

   const [productID, setProductID] = useState<string>();

   //   hooks
   const params = useParams<{ productId: string }>();

   const getProductDetail = async () => {
      try {
         dispatch(storingProduct({ status: "loading" }));
         if (import.meta.env.DEV) {
            await sleep(300);
            console.log(">>> api: Get product detail");
         }

         const res = await publicRequest.get(`${PRODUCT_URL}/${productID}`);

         dispatch(storingProduct({ product: res.data.data, status: "successful" }));
      } catch (error) {
         console.log({ message: error });
         dispatch(runError());
      }
   };

   useEffect(() => {
      const productId = params.productId;
      if (!productId) return;

      if (!isNaN(+productId)) setProductID(productId);
   }, [params]);

   useEffect(() => {
      if (productID === undefined) return;

      getProductDetail();

      return () => {
         dispatch(resetProduct());
      };
   }, [productID]);

   return {
      status,
      productDetail: product,
   };
}
