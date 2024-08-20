import { selectCategory } from "@/store/categorySlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export default function useCurrentCategory() {
   const { status, categories } = useSelector(selectCategory);

   const { category_ascii } = useParams<{ category_ascii: string }>();

   const currentCategory = useMemo(
      () => categories.find((c) => c.name_ascii === category_ascii),
      [category_ascii, categories]
   );

   const getHomeSliderImages = () => {
      return (
         categories.find((c) => c.name_ascii === "home")?.category_slider.slider
            .slider_images || []
      );
   };

   return {
      status,
      getHomeSliderImages,
      currentCategory,
      categories,
   };
}
