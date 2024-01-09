import { Empty, ImageSlider } from "@/components";
import Skeleton from "@/components/Skeleton";
import useAppConfig from "@/hooks/useAppConfig";
import { useApp } from "@/store/AppContext";
import { useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

function Home() {
   const { categories, sliders, initLoading } = useApp();
   const { getHomeSlider, status } = useAppConfig({});
   const ranEffect = useRef(false);

   const sliderSkeleton = useMemo(() => <Skeleton className="w-full pt-[25%] rounded-[16px]" />, []);

   useEffect(() => {
      if (!ranEffect.current) {
         getHomeSlider();
         ranEffect.current = true;
      }
   }, []);


   console.log('check status', status);
   

   return (
      <div className="">
         {status === "loading" && sliderSkeleton}
         {status === "success" && sliders["home"] && <ImageSlider data={sliders["home"]} />}

         {!initLoading && (
            <div className="hidden max-[768px]:block mt-[16px]">
               <h5 className="text-[18px] mb-[6px]">Danh mục sản phẩm</h5>
               <div className="row overflow-auto !flex-nowrap">
                  {categories.map((c, index) => (
                     <div key={index} className="col flex-shrink-0 w-4/12">
                        <Empty className="bg-[#cd1818] text-white rounded-[12px] pt-[50%]">
                           <Link to={`/${c.category_ascii}`} className="flex flex-col items-center">
                              <i className="material-icons text-[30px]">{c.icon}</i>
                              <span className="text-[14px] mt-[4px]">{c.category_name}</span>
                           </Link>
                        </Empty>
                     </div>
                  ))}
               </div>
            </div>
         )}
      </div>
   );
}
export default Home;
