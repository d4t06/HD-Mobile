import { Button } from "@/components";
import SliderGroup, { SliderRef } from "@/components/ProductConfig/child/SliderGroup";
import useAppConfig from "@/hooks/useAppConfig";
import { useToast } from "@/store/ToastContext";
import { CategorySlider } from "@/types";
import { sleep } from "@/utils/appHelper";
import { useEffect, useMemo, useRef, useState } from "react";

export default function Banner() {
   const { getCategoriesSlider } = useAppConfig({});
   const { setErrorToast, setSuccessToast } = useToast();

   const [categorySliders, setCategorySlider] = useState<CategorySlider[]>([]);
   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
   const [apiLoading, setApiLoading] = useState(false);

   const sliderGroupRefs = useRef<SliderRef[]>([]);
   const ranEffect = useRef(false);

   const getSliders = async () => {
      try {
         const result = await getCategoriesSlider();

         if (result) setCategorySlider(result);

         setStatus("success");
      } catch (error) {
         console.log(error);
         setStatus("error");
      }
   };

   const handleSubmit = async () => {
      try {
         setApiLoading(true);
         if (import.meta.env.DEV) await sleep(300);

         for await (const SliderGroup of sliderGroupRefs.current) {
            await SliderGroup.submit();
         }
         setSuccessToast("Update slider successful");
      } catch (error) {
         setErrorToast();
         console.log(error);
      } finally {
         setApiLoading(false);
      }
   };

   const content = useMemo(
      () =>
         !!categorySliders.length ? (
            categorySliders.map((item, index) => (
               <div key={index} className="p-[16px] bg-white rounded-[16px] mb-[30px]">
                  <h5 className="text-[18px] font-[500] mb-[10px]">{item.category_data.category_name}</h5>
                  <SliderGroup
                     ref={(ref) => (sliderGroupRefs.current[index] = ref!)}
                     color_ascii=""
                     isExist
                     initSlider={item.slider_data}
                  />
               </div>
            ))
         ) : (
            <h1 className="text-[18px]">Category not found</h1>
         ),
      [categorySliders]
   );

   useEffect(() => {
      if (!ranEffect.current) {
         ranEffect.current = true;
         getSliders();
      }
   }, []);

   return (
      <div className="">
         <div className="text-[28px] font-bold mb-[20px]">Banner</div>
         {status === "loading" && <i className="material-icons animate-spin">sync</i>}

         {status === "success" && content}

         {status === "error" && <h1 className="text-[22px]">Some thing went wrong</h1>}

         {status === "success" && !!categorySliders.length && (
            <p className="text-center">
               <Button isLoading={apiLoading} onClick={handleSubmit} primary className={""}>
                  <i className="material-icons">save</i> Save
               </Button>
            </p>
         )}
      </div>
   );
}
