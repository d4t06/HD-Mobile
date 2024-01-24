import { Brand, Category, CategorySlider, PriceRange } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePrivateRequest } from ".";
import { sleep } from "@/utils/appHelper";
import { useApp } from "@/store/AppContext";
import { publicRequest } from "@/utils/request";

const APP_URL = "/app";
const MANAGE_CAT_URL = "/category-management";

type Props = {
   curCategory?: Category;
   autoRun?: boolean;
   includeSlider?: boolean;
   admin?: boolean;
};

export default function useAppConfig({
   curCategory,
   autoRun = false,
   includeSlider = false,
   admin = false,
}: Props) {
   const {
      setCategories,
      categories,
      brands,
      setBrands,
      setInitLoading,
      initLoading,
      setSliders,
      priceRanges,
      setPriceRanges,
      sliders,
   } = useApp();
   const [status, setStatus] = useState<"loading" | "success" | "error" | "">(
      "loading"
   );
   const ranUseEffect = useRef(false);

   // hooks
   const privateRequest = usePrivateRequest();

   const curBrands = useMemo(() => {
      if (curCategory === undefined) return undefined;
      return brands[curCategory.category_ascii];
   }, [curCategory, brands]);

   const curPriceRanges = useMemo(() => {
      if (curCategory === undefined) return undefined;
      return priceRanges[curCategory.category_ascii];
   }, [curCategory, priceRanges]);

   const curSlider = useMemo(() => {
      if (curCategory === undefined) return undefined;
      return sliders[curCategory.category_ascii];
   }, [curCategory, sliders]);

   const getCategoryChild = async () => {
      console.log(">>> api get brand and slider");

      try {
         if (!curCategory?.id || !curCategory.category_ascii)
            throw new Error("Cur category data error");

         setStatus("loading");
         await sleep(300);

         if (!curBrands || !curPriceRanges) {
            const brandsRes = await privateRequest.get(
               `${APP_URL}/brands?category_id=${curCategory?.id}`
            );
            const brandsData = brandsRes.data as (Brand & { id: number })[];
            setBrands((brands) => ({
               ...brands,
               [curCategory.category_ascii]: brandsData,
            }));

            const pricesRes = await privateRequest.get(
               `${APP_URL}/category-prices?category_id=${curCategory.id}`
            );
            const pricesData = pricesRes.data as (PriceRange & {
               id: number;
            })[];
            setPriceRanges((prev) => ({
               ...prev,
               [curCategory.category_ascii]: pricesData,
            }));
         }

         // when in category edit, don't not slider
         if (includeSlider && !sliders[curCategory.category_ascii]) {
            const sliderRes = await privateRequest.get(
               `${APP_URL}/category-sliders?category_ascii=${curCategory.category_ascii}`
            );
            const sliderData = sliderRes.data as CategorySlider;
            setSliders((sliders) => ({
               ...sliders,
               [curCategory.category_ascii]: sliderData.slider_data.images,
            }));
         }

         setStatus("success");
      } catch (error) {
         console.log({ message: error });
      }
   };

   const getCategories = async () => {
      try {
         console.log(">>> api get categories");
         if (import.meta.env.DEV) await sleep(300);

         let categoriesRes;
         if (admin)
            categoriesRes = await privateRequest.get(
               `${MANAGE_CAT_URL}/categories`
            );
         else categoriesRes = await publicRequest.get(`${APP_URL}/categories`);

         setCategories(categoriesRes.data || []);
      } catch (error) {
         console.log({ message: error });
         setStatus("error");
      } finally {
         setInitLoading(false);
      }
   };

   const getHomeSlider = async () => {
      try {
         setStatus("loading");

         if (import.meta.env.DEV) await sleep(300);

         if (!sliders["home"]) {
            const sliderRes = await privateRequest.get(
               `${APP_URL}/category-sliders?category_ascii=home`
            );
            if (!sliderRes.data) throw new Error("Slider not found");

            const sliderData = sliderRes.data as CategorySlider;
            setSliders((sliders) => ({
               ...sliders,
               ["home"]: sliderData.slider_data.images,
            }));
         }
         setStatus("success");
      } catch (error) {
         setStatus("error");
      }
   };

   // for admin only
   const getCategoriesSlider = async () => {
      try {
         console.log(">>> api run get category sliders");
         if (import.meta.env.DEV) await sleep(300);
         const categorySlidersRes = await privateRequest.get(
            `${MANAGE_CAT_URL}/category-sliders`
         );

         setStatus("success");
         return categorySlidersRes.data as CategorySlider[];
      } catch (error) {
         console.log({ message: error });
         setStatus("error");
      }
   };

   // run get all categories
   useEffect(() => {
      if (!autoRun || categories.length) return;

      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getCategories();
      }
   }, [initLoading]);

   // run get category child part
   useEffect(() => {
      if (initLoading) return setStatus("loading");

      //  in home page
      if (curCategory === undefined) {
         return;
      }

      getCategoryChild();
   }, [curCategory, initLoading]);

   return {
      status,
      getCategories,
      getCategoriesSlider,
      getHomeSlider,
      curBrands,
      curSlider,
      curPriceRanges,
   };
}
