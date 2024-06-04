
import { initCombineData } from "@/utils/appHelper";

export const getExistCombine = (
   combines: ProductCombine[],
   colorItem: ProductColor & { id?: number },
   storageItem: ProductStorage & { id?: number },
   product_ascii: string
) => {
   let isExits = true;
   let existCombine = combines.find((item) => item.color_id === colorItem.id && item.storage_id === storageItem.id);

   if (!existCombine) {
      isExits = false;
      existCombine = initCombineData(
         {
            product_ascii,
         },
         colorItem.color,
         storageItem.storage
      );
   }

   return { existCombine, isExits };
};

export const getExistSlider = (
   sliders: ProductSlider[] | undefined,
   colorItem: ProductColor & { id?: number },
   product_name: string
) => {
   const initSlider: Slider = {
      images: [],
      id: 0,
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

export const initProductAttributeSchema = (data: Partial<ProductAttributeSchema>) => {
   const newData: ProductAttributeSchema = {
      category_attr_id: 0,
      product_ascii: "",
      value: "",
      ...data,
   };

   return newData;
};
