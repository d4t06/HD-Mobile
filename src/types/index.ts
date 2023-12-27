export type ProductCombine = {
   color_id?: number;
   color_ascii: string;
   storage_id?: number;
   storage_ascii: string;
   product_name_ascii: string;
   quantity: number;
   price: number;
   color_data?: {
      color: string;
   };
   storage_data?: {
      storage: string;
   };
};

export type ProductSlider = {
   slider_id: number;
   color_id: number;
   slider_data?: Slider;
};

export type Slider = {
   images: { image_url: string; slider_id: number }[];
   slider_name: string;
};

export type ProductStorage = {
   id?: number;
   product_name_ascii?: string;
   storage_ascii: string;
   storage: string;
   default: boolean;
   base_price: number;
};

export type ProductColor = {
   id?: number;
   product_name_ascii?: string;
   color_ascii: string;
   color: string;
   default: boolean;
};

export type Product = {
   product_name: string;
   product_name_ascii: string;
   category_name_ascii: string;
   brand_name_ascii: string;
   image_url: string;
   installment: boolean;
   storages_data: ProductStorage[];
   colors_data: ProductColor[];
   combines_data: ProductCombine[];
   sliders_data: ProductSlider[];
};

export type Detail = {
   item_id: string;
   product_id: string;
   gallery: string[];
};

export type Category = {
   category_name_ascii: string;
   category_name: string;
   icon: string;
};

export type Brand = {
   brand_name_ascii: string;
   brand_name: string;
   image_url: string;
};

export type User = {
   user_name: string;
   password: string;
   role_code: string;
};

export type ImageType = {
   image_url: string;
   image_file_path: string;
   name: string;
   size: number;
   link_to: string;
};

export type Toast = {
   title?: "success" | "error" | "warning";
   desc: string;
   id: string;
};
