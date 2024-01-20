import { CategoryAttribute, Product } from "@/types";
import { useEffect, useRef, useState } from "react";
import { usePrivateRequest } from ".";
import { sleep } from "@/utils/appHelper";
import { useParams } from "react-router-dom";
import { useProductContext } from "@/store/ProductDataContext";

const PRODUCT_URL = "/product-management/products";
const CAT_ATTR_URL = "/app/category-attributes";

export default function useEdit() {
   const { setEditorData } = useProductContext();

   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
   const [attrList, setAttrList] = useState<CategoryAttribute[]>([]);

   const ranUseEffect = useRef(false);

   //   hooks
   const { id } = useParams();
   const privateRequest = usePrivateRequest();

   const getProductDetail = async ({ init = true }: { init?: boolean }) => {
      if (!id) throw new Error("missing params");
      if (import.meta.env.DEV) await sleep(300);

      const res = await privateRequest.get(`${PRODUCT_URL}/${id}`);
      const data = res.data as Product;

      if (init) {
         const categoryId = data.category_id;
         if (categoryId === undefined) throw new Error("missing category id");

         const catAttrsRes = await privateRequest.get(`${CAT_ATTR_URL}/${categoryId}`);
         const catAttrsData = catAttrsRes.data.data as CategoryAttribute[];

         setAttrList(catAttrsData);
      }

      setEditorData(data);
   };

   useEffect(() => {
      const handleGetProductDetail = async () => {
         try {
            await getProductDetail({ init: true });

            setStatus("success");
         } catch (error) {
            console.log(error);
            setStatus("error");
         }
      };

      if (!ranUseEffect.current) {
         handleGetProductDetail();
         ranUseEffect.current = true;
      }
   }, []);

   return {
      status,
      attrList,
      getProductDetail,
   };
}
