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
   const newImage: ImageTypeSchema = {
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


export const getLocalStorage = () =>
   JSON.parse(localStorage.getItem("HD-Mobile") || "{}") as Record<string, any>;

export const setLocalStorage = (key: string, value: any) => {
   const storage = getLocalStorage();
   storage[key] = value;

   return localStorage.setItem("HD-Mobile", JSON.stringify(storage));
};