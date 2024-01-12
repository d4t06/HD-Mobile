import { Brand, Category, CategorySlider } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePrivateRequest } from ".";
import { sleep } from "@/utils/appHelper";
import { useApp } from "@/store/AppContext";

const CAT_URL = "/app/categories";
const CAT_SLIDER_URL = "/slider-management/category_sliders";
const BRAND_URL = "/app/brands";

type Props = {
  curCategory?: Category;
  autoRun?: boolean;
  includeSlider?: boolean;
};

export default function useAppConfig({
  curCategory,
  autoRun = false,
  includeSlider = false,
}: Props) {
  const {
    setCategories,
    categories,
    brands,
    setBrands,
    setInitLoading,
    initLoading,
    setSliders,
    sliders,
  } = useApp();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "">("loading");
  const ranUseEffect = useRef(false);

  // hooks
  const privateRequest = usePrivateRequest();

  const curBrands = useMemo(() => {
    if (curCategory === undefined) return undefined;
    return brands[curCategory.category_ascii];
  }, [curCategory, brands]);

  const curSlider = useMemo(() => {
    if (curCategory === undefined) return undefined;
    return sliders[curCategory.category_ascii];
  }, [curCategory, sliders]);

  const getBrandsAndSlider = async () => {
    console.log(">>> api get brand and slider");

    try {
      if (!curCategory?.id || !curCategory.category_ascii)
        throw new Error("Cur category data error");

      setStatus("loading");
      await sleep(300);

      if (!curBrands) {
        const brandsRes = await privateRequest.get(
          BRAND_URL + "?category_id=" + curCategory?.id
        );
        const brandsData = brandsRes.data as (Brand & { id: number })[];
        setBrands((brands) => ({ ...brands, [curCategory.category_ascii]: brandsData }));
      }

      // when in category edit, don't not slider
      if (includeSlider && !sliders[curCategory.category_ascii]) {
        const sliderRes = await privateRequest.get(
          `${CAT_SLIDER_URL}/${curCategory.category_ascii}`
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
      const categoriesRes = await privateRequest.get(CAT_URL);

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
        const sliderRes = await privateRequest.get(`${CAT_SLIDER_URL}/home`);
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

  const getCategoriesSlider = async () => {
    try {
      console.log(">>> api run get category sliders");
      if (import.meta.env.DEV) await sleep(300);
      const categorySlidersRes = await privateRequest.get(CAT_SLIDER_URL);

      setStatus("success");
      return categorySlidersRes.data as CategorySlider[];
    } catch (error) {
      console.log({ message: error });
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!autoRun || categories.length) return;

    if (!ranUseEffect.current) {
      ranUseEffect.current = true;
      getCategories();
    }
  }, [initLoading]);

  useEffect(() => {
    if (initLoading) return setStatus("loading");

    //  in home page
    if (curCategory === undefined) {
      return;
    }

    getBrandsAndSlider();
  }, [curCategory, initLoading]);

  return {
    status,
    getCategories,
    getCategoriesSlider,
    getHomeSlider,
    curBrands,
    curSlider,
  };
}
