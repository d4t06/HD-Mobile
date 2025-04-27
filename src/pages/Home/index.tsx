import { ImageSlider } from "@/components";
import Skeleton from "@/components/Skeleton";
import { useEffect, useMemo, useState } from "react";
// import MobileCategories from "./child/MobileCategories";
import useCurrentCategory from "@/hooks/useCurrentCategory";
import NewProduct from "./child/NewProduct";

export default function Home() {
   const { getHomeSliderImages, status, categories } = useCurrentCategory();
   const [homeSlider, setHomeSlider] = useState<SliderImage[]>([]);

   const sliderSkeleton = useMemo(
      () => <Skeleton className="w-full pt-[25%] rounded-[16px]" />,
      []
   );

   useEffect(() => {
      const homeSliderImages = getHomeSliderImages();
      if (homeSliderImages.length) setHomeSlider(homeSliderImages);
   }, [categories]);

   return (
      <div className="space-y-[30px]">
         {status === "loading" ? sliderSkeleton : <ImageSlider data={homeSlider} />}
         {/*{status === "success" && <MobileCategories categories={categories} />}*/}

         <NewProduct loading={status === "loading"} />
      </div>
   );
}
