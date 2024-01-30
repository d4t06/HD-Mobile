import { ImageSlider } from "@/components";
import Skeleton from "@/components/Skeleton";
import useAppConfig from "@/hooks/useAppConfig";
import { useApp } from "@/store/AppContext";
import { useEffect, useMemo, useRef } from "react";
import MobileCategories from "./child/MobileCategories";

export default function Home() {
   const { categories, sliders, initLoading } = useApp();
   const { getHomeSlider, status } = useAppConfig({});
   const ranEffect = useRef(false);

   const sliderSkeleton = useMemo(() => <Skeleton className="w-full pt-[25%] rounded-[16px]" />, []);

   const handleGetHomeSlider = async () => await getHomeSlider();

   useEffect(() => {
      if (initLoading) return;
      if (!ranEffect.current) {
         ranEffect.current = true;

         handleGetHomeSlider();
         console.log("run home get home page slider");
      }
   }, [initLoading]);

   return (
      <div className="">
         {status === "loading" && sliderSkeleton}
         {status === "success" && sliders["home"] && <ImageSlider data={sliders["home"]} />}

         {/* mobile categories */}
         {!initLoading && <MobileCategories categories={categories} />}
      </div>
   );
}
