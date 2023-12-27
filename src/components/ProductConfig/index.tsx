import classNames from "classnames/bind";

import styles from "@/pages/Login/Login.module.scss";
import stylesMain from "@/pages/AddProduct/AddProduct.module.scss";
import { Ref, forwardRef, useImperativeHandle, useRef } from "react";
import { initCombineData } from "@/utils/appHelper";
import { ProductColor, ProductCombine, ProductSlider, ProductStorage, Slider } from "@/types";
import { useProductContext } from "@/store/ProductDataContext";
import SliderGroup, { SliderRef } from "./child/SliderGroup";
import InputGroup, { CombineRef } from "./child/CombineGroup";
import { useToast } from "@/store/ToastContext";

const cy = classNames.bind(stylesMain);
const cx = classNames.bind(styles);

type Props = {
   colors: ProductColor[];
   storages: ProductStorage[];
   sliders: ProductSlider[];
};

export type ConfigRef = {
   submitSliders: () => Promise<{ id: number; color_ascii: string }[]>;
   submitCombines: () => Promise<ProductCombine[]>;
   validate: () => void;
};

const getExistCombine = (
   combines: ProductCombine[],
   colorItem: ProductColor,
   storageItem: ProductStorage,
   product_name_ascii: string
) => {
   let isExits = true;
   let existCombine = combines?.find((item) => item.color_id === colorItem.id && item.storage_id === storageItem.id);

   if (!existCombine) {
      isExits = false;
      existCombine = initCombineData({
         color_ascii: colorItem.color_ascii,
         storage_ascii: storageItem.storage_ascii,
         product_name_ascii,
      });
   }

   return { existCombine, isExits };
};

const getExistSlider = (sliders: ProductSlider[] | undefined, colorItem: ProductColor, product_name: string) => {
   const initSlider: Slider = {
      images: [],
      slider_name: `slider for ${product_name} ${colorItem.color_ascii}`,
   };
   if (!sliders) {
      return { existSlider: initSlider, isExits: false };
   } else {
      const productSlider = sliders.find((sliderItem) => sliderItem.color_id === colorItem.id);
      if (!productSlider?.slider_data) return { existSlider: initSlider, isExits: false };

      return { existSlider: productSlider.slider_data, isExits: true };
   }
};

function ProductConfig({ colors, storages, sliders }: Props, ref: Ref<ConfigRef>) {
   const { combines_data, product_name_ascii, product_name } = useProductContext();

   const sliderRefs = useRef<(SliderRef | undefined)[]>([]);
   const combineRefs = useRef<(CombineRef | undefined)[]>([]);

   // const submitSliderList = sliderRefs.current.map((item) => item.submit);
   // const submitCombines = useMemo(() => combineRefs.current.map((item) => item.submit), [colors, storages]);

   const submitSliders = async () => {
      console.log("submit slider length", sliderRefs.current.length);
      let newSliders = [];
      for (let sliderItem of sliderRefs!.current) {
         if (typeof sliderItem?.submit === "function") {
            const newSlider = await sliderItem.submit();
            if (newSlider) {
               newSliders.push(newSlider);
            }
         }
      }

      return newSliders;
   };

   const validate = () => {
      let isError = false;
      for (let sliderItem of sliderRefs!.current) {
         if (typeof sliderItem?.validate === "function") {
            if (sliderItem.validate()) isError = true;
         }
      }

      console.log("validate parant check ref", combineRefs.current.length);

      for (let combineItem of combineRefs!.current) {
         if (typeof combineItem?.validate === "function") {
            if (combineItem.validate()) isError = true;
         }
      }

      if (isError) {
         throw new Error("Input field missing");
      }
   };

   const submitCombines = async () => {
      let newCombines: ProductCombine[] = [];
      for (let combineItem of combineRefs!.current) {
         if (typeof combineItem?.submit === "function") {
            const data = await combineItem.submit();
            if (data) newCombines.push(data);
         }
      }

      return newCombines;
   };

   useImperativeHandle(
      ref,
      () => ({
         submitCombines,
         submitSliders,
         validate,
      }),
      [colors, storages]
   );

   return (
      <>
         <div className={cx("label")}>Product Slider</div>
         <div className="mb-[30px] bg-[#fff] rounded-[8px] p-[20px] flex flex-col gap-[40px]">
            {!!colors.length &&
               colors.map((item, index) => {
                  const { existSlider, isExits } = getExistSlider(sliders, item, product_name);
                  return (
                     <div key={index} className="row items-center">
                        <div key={index} className="col col-3">
                           <div className={cx("label", "text-center")}>{item.color}</div>
                        </div>
                        <SliderGroup
                           color_ascii={item.color_ascii}
                           ref={(ref) => (sliderRefs.current[index] = ref!)}
                           initSlider={existSlider}
                           isExist={isExits}
                        />
                     </div>
                  );
               })}
         </div>

         <div className="mb-[30px]">
            <div className={cx("label")}>Quantity & Price</div>
            {!!storages.length && (
               <div className={`bg-[#fff] rounded-[8px] p-[20px]`}>
                  {storages.map((storageItem, i) =>
                     colors.map((colorItem, j) => {
                        const { existCombine, isExits } = getExistCombine(
                           combines_data,
                           colorItem,
                           storageItem,
                           product_name_ascii
                        );
                        const key = storageItem.storage_ascii + colorItem.color_ascii;
                        return (
                           <div key={key} className="row items-center w-full">
                              <div className={`${cx("col col-6", "label", "min", "center")} ${cy("config-item")}`}>
                                 {storageItem.storage} / {colorItem.color}
                              </div>
                              <InputGroup
                                 ref={(ref) => (combineRefs.current[(i || 1) * j] = ref!)}
                                 initCombine={existCombine}
                                 isExist={isExits}
                              />
                           </div>
                        );
                     })
                  )}
               </div>
            )}
         </div>
      </>
   );
}
export default forwardRef(ProductConfig);
