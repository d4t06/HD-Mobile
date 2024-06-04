import { ImageSlider } from "@/components";
import Skeleton from "@/components/Skeleton";
import { useMemo } from "react";
import MobileCategories from "./child/MobileCategories";
import useCurrentCategory from "@/hooks/useCurrentCategory";

export default function Home() {
   const { getHomeSliderImages, status, categories } = useCurrentCategory();

   const sliderSkeleton = useMemo(
      () => <Skeleton className="w-full pt-[25%] rounded-[16px]" />,
      []
   );

   const homeSlider = useMemo(() => getHomeSliderImages(), []);

   return (
      <div className="">
         {status === "loading" ? sliderSkeleton : <ImageSlider data={homeSlider} />}

         {status === "success" && <MobileCategories categories={categories} />}
      </div>
   );
}
