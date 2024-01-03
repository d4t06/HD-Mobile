import { Brand, Category } from "@/types";
import { useEffect, useRef, useState } from "react";
import { usePrivateRequest } from ".";
import { sleep } from "@/utils/appHelper";
import { useApp } from "@/store/AppContext";

const CAT_URL = "/app/categories";
const BRAND_URL = "/app/brands";

type Props = {
   curCategory?: Category;
   autoRun?: boolean;
};

export default function useAppConfig({ curCategory, autoRun = false }: Props) {
   const { setCategories, categories, brands, setBrands, setInitLoading, initLoading } = useApp();
   const [status, setStatus] = useState<"loading" | "success" | "error" | "">("");
   const ranUseEffect = useRef(false);

   // hooks
   const privateRequest = usePrivateRequest();

   const getBrands = async () => {
      try {
         if (!curCategory?.id || !curCategory.category_ascii) throw new Error("Cur category data error");
         setStatus("loading");
         const brandsRes = await privateRequest.get(BRAND_URL + "?category_id=" + curCategory?.id);
         const brandsData = brandsRes.data as (Brand & { id: number })[];

         setBrands((brands) => ({ ...brands, [curCategory.category_ascii]: brandsData }));

         if (import.meta.env.DEV) await sleep(300);
         setStatus("success");
      } catch (error) {
         console.log({ message: error });
      }
   };

   const getCategories = async () => {
      try {
         console.log("run getCategories");
         if (import.meta.env.DEV) await sleep(1100);
         const categoriesRes = await privateRequest.get(CAT_URL);

         setCategories(categoriesRes.data || []);
         setStatus("success");
      } catch (error) {
         console.log({ message: error });
         setStatus("error");
      } finally {
         setInitLoading(false);
      }
   };

   useEffect(() => {
      if (!autoRun) return;
      if (categories.length) return;
      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getCategories();
      }
   }, []);

   useEffect(() => {
      if (initLoading) {
         setStatus("loading");
         return;
      }

      if (curCategory === undefined) return;

      if (!brands[curCategory.category_ascii]) {
         getBrands();
      }
   }, [curCategory, initLoading]);

   return { status, getCategories };
}
