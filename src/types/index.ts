import { Omit } from "@reduxjs/toolkit/dist/tsHelpers";

export interface ProductCombine {
   id?: number;
   product_ascii: string;
   color_id: number;
   storage_id: number;
   quantity: number;
   price: number;
   default: boolean;
   color_data: {
      color: string;
      color_ascii: string;
   };
   storage_data: {
      storage: string;
      storage_ascii: string;
   };
}

export type ProductCombineSchema = Omit<
   ProductCombine,
   "color_data" | "storage_data" | "color_id" | "storage_id" | "id"
> & {
   color_id: number;
   // id: number;
   storage_id: number;
};

export interface ProductSlider {
   id: number;
   product_ascii: string;
   slider_id: number;
   color_id: number;
   color_data: {
      color: string;
      color_ascii: string;
   };
   slider_data: Slider;
}

export type ProductSliderSchema = Omit<ProductSlider, "color_data" | "slider_data">;

export type SliderImage = {
   image_url: string;
   link_to: string;
   id?: number;
};
export type SliderImageSchema = {
   slider_id: number;
   image_url: string;
};

export type Slider = {
   id: number;
   images: SliderImage[];
   slider_name: string;
};

export type SliderSchema = Omit<Slider, "images" | "id">;

export type ProductStorage = {
   id?: number;
   product_ascii: string;
   storage_ascii: string;
   storage: string;
   default: boolean;
   base_price: number;
};

export type ProductColor = {
   id?: number;
   product_ascii: string;
   color_ascii: string;
   color: string;
   default: boolean;
};

export interface Product {
   id: number;
   imei: string;
   product_name: string;
   product_ascii: string;
   category_id: number;
   brand_id: number;
   image_url: string;
   installment: boolean;
   category_data: Category;
   brand_data: {
      brand_name: string;
      brand_ascii: string;
   };
   detail: ProductDetail | null;
   storages_data: ProductStorage[];
   colors_data: ProductColor[];
   combines_data: ProductCombine[];
   sliders_data: ProductSlider[];
   attributes_data: ProductAttribute[];
   comments_data: ProductComment[];
}

export type ProductSchema = Omit<
   Product,
   | "storages_data"
   | "colors_data"
   | "combines_data"
   | "sliders_data"
   | "brand_data"
   | "category_data"
   | "detail"
   | "comments_data"
   | "id"
   | "attributes_data"
>;

export type ProductDetail = {
   id?: number;
   product_ascii: string;
   content: string;
};

export type ProductAttribute = {
   id: number;
   category_attr_id: number;
   product_ascii: string;
   value: string;
};

export type ProductAttributeSchema = Omit<ProductAttribute, "attribute_data" | "id">;

export type CategoryAttribute = {
   id?: number;
   category_id: number;
   attribute: string;
   attribute_ascii: string;
};

export type Category = {
   id: number;
   category_ascii: string;
   category_name: string;
   attribute_order: string;
   hidden?: boolean;
   attributes: CategoryAttribute[];
   price_ranges: PriceRange[];
};

export type CategorySchema = Omit<Category, "attributes" | "price_ranges" | "id">;

export type CategorySlider = {
   category_data: Category;
   slider_data: Slider;
};

export type CategorySliderSchema = {
   category_id: number;
   slider_id: number;
};

export type Brand = {
   id?: number;
   brand_ascii: string;
   brand_name: string;
   image_url: string;
   category_id: number;
};

export type User = {
   user_name: string;
   password: string;
   role_code: string;
};

export type ImageType = {
   id?: number;
   image_url: string;
   public_id: string;
   name: string;
   size: number;
   link_to: string;
};

export type Toast = {
   title?: "success" | "error" | "warning";
   desc: string;
   id: string;
};

export type ProductComment = {
   id?: number;
   q_id?: number;
   product_ascii: string;
   cus_name: string;
   content: string;
   approve: number;
   date_convert: string;
   phone_number: string;
   total_like: number;
   reply_data?: Reply;
   product_data?: {
      product_name: string;
   };
};

export type ProductReview = ProductComment & { rate: number };

export type Reply = Omit<ProductComment, "cus_name" | "phone_number" | "approve">;

export type LCStorage = {
   like_review_ids: number[];
   like_comment_ids: number[];
   product_history_ids: number[];
};

export type PriceRange = {
   id: number;
   category_id: number;
   from: number;
   to: number;
   label: string;
};

export type PriceRangeSchema = Omit<PriceRange, "id">


export type Cart = {
   id: number;
   username: string;
   count: number;
   total_price: number;
   items: CartItem[];
};
export type CartSchema = Omit<Cart, "id" | "items">;

export type CartItem = {
   id: number;
   username: string;
   product_ascii: string;
   amount: number;
   color_id: number;
   storage_id: number;
   product_data: {
      product_name: string;
      image_url: string;
      combines_data: ProductCombine[];
      colors_data: { color: string; id: number }[];
      storages_data: { storage: string; id: number }[];
      category_data: {
         category_ascii: string;
      };
   };
   updatedAt: string;
   createdAt: string;
};

export type Order = {
   id: number;
   username: string;
   status: "completed" | "canceled" | "processing" | "delivering";

   items: OrderItem[];

   discount: number;
   purchase_price: number;
   total_price: number;

   purchase_type: string;

   recipient_name: string;
   recipient_phone_number: string;
   recipient_address: string;

   deliveredAt: string;
   canceledAt: string;
   createdAt: string;
};

export type OrderSchema = Omit<
   Order,
   "createdAt" | "items" | "id" | "deliveredAt" | "canceledAt" | "createdAt"
>;

export type OrderDetail = Omit<
   Order,
   "" & {
      purchase_type: string;
      recipient_name: string;
      recipient_phone_number: string;
      deliveredAt: string;
      canceledAt: string;
   }
>;

export type OrderItem = {
   id?: number;
   order_id: number;
   product_name: string;
   amount: number;
   color: string;
   storage: string;
   image_url: string;
   slug: string;
   price: number;
};

export type CartItemSchema = Omit<CartItem, "id" | "product_data" | "updatedAt" | "createdAt">;

export type GetArrayType<T extends any[]> = T extends (infer U)[] ? U : never;
