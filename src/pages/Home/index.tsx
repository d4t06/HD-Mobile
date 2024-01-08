import { ImageSlider } from "@/components";
import Skeleton from "@/components/Skeleton";
import useAppConfig from "@/hooks/useAppConfig";
import { useApp } from "@/store/AppContext";
import { useEffect, useMemo, useRef } from "react";

function Home() {
   const { sliders } = useApp();
   const { getHomeSlider, status } = useAppConfig({});
   const ranEffect = useRef(false);

   const sliderSkeleton = useMemo(() => <Skeleton className="w-full pt-[25%] rounded-[16px]" />, []);

   useEffect(() => {
      if (!ranEffect.current) {
         getHomeSlider();
         ranEffect.current = true;
      }
   }, []);

   return (
      <div className="pt-[20px]">
         {status === "loading" && sliderSkeleton}
         {status === "success" && sliders["home"] && <ImageSlider data={sliders["home"]} />}
      </div>
   );
}
export default Home;
