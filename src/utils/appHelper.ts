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

export const countDayDiff = (dateString: string) => {
   const mysqlDate = new Date(dateString);
   const currentDate = new Date();

   const daysDiff = Math.floor(
      Math.abs(currentDate.getTime() - mysqlDate.getTime()) / (1000 * 60 * 60 * 24)
   );

   return daysDiff;
};

export const initImageObject = (data: Partial<ImageType>) => {
   const newImage: ImageType = {
      public_id: "",
      image_url: "",
      link_to: "",
      name: "",
      size: 0,
      ...data,
   };

   return newImage;
};

export const initProductObject = (data: Partial<ProductSchema>) => {
   const newProduct: ProductSchema = {
      product_ascii: "",
      image_url: "",
      product: "",
      brand_id: 0,
      category_id: 0,
      ...data,
   };

   return newProduct;
};

export const initProductDetailObject = (data: Partial<Product>) => {
   const newProduct: Product = {};

   return newProduct;
};

export const initStorageObject = (data: Partial<ProductStorage>) => {
   const initStorage: ProductStorage = {
      id: undefined,
      base_price: 0,
      product_ascii: "",
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
      id: undefined,
      product_ascii: "",
      color_ascii: "",
      default: false,
      ...data,
   };

   return newColor;
};

export function initCombineData(
   data: Partial<ProductCombine>,
   color: string,
   storage: string
) {
   // eliminate in order to prevent replace data
   const { storage_data, color_data, ...rest } = data;
   const combineData: ProductCombine = {
      id: undefined,
      default: false,
      price: 0,
      color_id: 0,
      storage_id: 0,
      product_ascii: "",
      quantity: 0,
      color_data: { color, color_ascii: generateId(color) },
      storage_data: { storage, storage_ascii: generateId(storage) },
      ...rest,
   };

   return combineData;
}

export const initProductSlider = (data: Partial<ProductSlider>) => {
   const productSlider: ProductSlider = {
      color_id: 0,
      id: 0,
      product_ascii: "",
      slider_id: 0,
      color_data: { color: "", color_ascii: "" },
      slider_data: { images: [], slider_name: "", id: 0 },
      ...data,
   };

   return productSlider;
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

export const initBrandObject = (data: Partial<Brand>) => {
   const object: Brand = {
      brand_name: "",
      brand_ascii: "",
      image_url: "",
      category_id: 0,
      ...data,
   };

   return object;
};

export const initLocalStorage: LCStorage = {
   like_comment_ids: [],
   like_review_ids: [],
   product_history_ids: [],
};

export const formatSize = (size: number) => {
   const units = ["Kb", "Mb"];
   let mb = 0;

   if (size < 1024) return size + units[mb];
   while (size > 1024) {
      size -= 1024;
      mb++;
   }

   return mb + "," + size + units[1];
};
