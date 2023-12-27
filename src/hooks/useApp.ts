import { Brand, Category } from "@/types";
import { useEffect, useRef, useState } from "react";
import { usePrivateRequest } from ".";

const CAT_URL = "/app/category";
const BRAND_URL = "/app/brand";

type Props = {
   curCat: string;
};

export default function useAppConfig({ curCat }: Props) {
   const [categories, setCategories] = useState<Category[]>([]);
   const [brands, setBrands] = useState<Brand[]>([]);

   const [status, setStatus] = useState<"loading" | "success" | "error">("success");

   const ranUseEffect = useRef(false);

   const privateRequest = usePrivateRequest();

   useEffect(() => {
      const getConfig = async () => {
         try {
            const categoriesRes = await privateRequest.get(CAT_URL);

            setCategories(categoriesRes.data || []);
            setStatus("success");
         } catch (error) {
            console.log({ message: error });
            setStatus("error");
         }
      };

      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getConfig();
      }
   }, []);

   useEffect(() => {
      const getBrands = async () => {
         try {
            const brandsRes = await privateRequest.get(BRAND_URL + "?category=" + curCat);
            const brandsData = brandsRes.data as Brand[];

            setBrands(brandsData);
         } catch (error) {
            console.log({ message: error });
         }
      };

      if (curCat) {
         getBrands();
      }
   }, [curCat]);

   return { status, categories, brands };
}
