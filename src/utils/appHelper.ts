import { Product, ProductColor, ProductCombine, ProductSlider, ProductStorage } from "@/types";

export const sleep = (time: number) =>
   new Promise<void>((rs) => {
      setTimeout(() => {
         rs();
      }, time);
   });

export const moneyFormat = (money: string | number) => {
   const formatter = new Intl.NumberFormat("en-US");
   if (!money) return "";
   return formatter.format(+money);
};

export const initProductObject = (data: Partial<Product>) => {
   const newProduct: Product = {
      brand_name_ascii: "",
      product_name_ascii: "",
      category_name_ascii: "",
      image_url: "",
      installment: false,
      product_name: "",
      storages_data: [],
      colors_data: [],
      combines_data: [],
      sliders_data: [],
      ...data,
   };

   return newProduct;
};

export const initStorageObject = (data: Partial<ProductStorage>) => {
   const initStorage: ProductStorage = {
      base_price: 0,
      default: false,
      storage: "",
      storage_ascii: "",
      ...data,
   };

   return initStorage;
};

export const initColorObject = (data: Partial<ProductColor>) => {
   const newColor: ProductColor = {
      color: "",
      color_ascii: "",
      default: false,
      ...data,
   };

   return newColor;
};

export const initCombineData = (data: Partial<ProductCombine>) => {
   const combineData: ProductCombine = {
      price: 0,
      color_ascii: '',
      storage_ascii: '',
      product_name_ascii: "",
      quantity: 0,
      ...data,
   };

   return combineData;
};

export const initProductSlider = (slider_id: number, color_id: number, product_name_ascii: string) => {
   const combineData: ProductSlider & {product_name_ascii: string} = {
      color_id, 
      slider_id,
      product_name_ascii
   };

   return combineData;
};

export const generateId = (name: string): string => {
   const convertToEn = (str: string) => {
      const newString = str
         .toLocaleLowerCase()
         .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ắ|ằ|ẳ|ẵ|ặ/g, "a")
         .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
         .replace(/ì|í|ị|ỉ|ĩ/g, "i")
         .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ/g, "o")
         .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
         .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
         .replace(/đ/g, "d");
      return newString;
   };
   return convertToEn(name).replaceAll(/[\W_]/g, "-");
};
