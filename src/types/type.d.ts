type AuthResponse = {
   userInfo: {
      username: string;
      role: string;
   };
   token: string;
};

interface ProductCombine {
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

type ProductCombineSchema = Omit<
   ProductCombine,
   "color_data" | "storage_data" | "color_id" | "storage_id" | "id"
> & {
   color_id: number;
   // id: number;
   storage_id: number;
};

interface ProductSlider {
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

type ProductSliderSchema = Omit<ProductSlider, "color_data" | "slider_data">;

type SliderImage = {
   image_url: string;
   link_to: string;
   id?: number;
};
type SliderImageSchema = {
   slider_id: number;
   image_url: string;
};

type Slider = {
   id: number;
   slider_images: SliderImage[];
   slider_name: string;
};

type SliderSchema = Omit<Slider, "images" | "id">;

type ProductStorage = {
   id?: number;
   product_ascii: string;
   storage_ascii: string;
   storage: string;
   default: boolean;
   base_price: number;
};

type ProductColor = {
   id?: number;
   product_ascii: string;
   color_ascii: string;
   color: string;
   default: boolean;
};

interface Product {
   id: number;
   product: string;
   product_ascii: string;
   category_id: number;
   brand_id: number;
   image_url: string;
   description: ProductDetail | null;
   storages: ProductStorage[];
   colors: ProductColor[];
   combines: ProductCombine[];
   attributes: ProductAttribute[];
   comments_data: ProductComment[];
}

type ProductSchema = Omit<
   Product,
   | "storages"
   | "colors"
   | "combines"
   | "description"
   | "comments_data"
   | "id"
   | "attributes"
>;

type ProductDetail = {
   id?: number;
   product_ascii: string;
   content: string;
};

type ProductAttribute = {
   id: number;
   category_attr_id: number;
   product_ascii: string;
   value: string;
};

type ProductAttributeSchema = Omit<ProductAttribute, "attribute_data" | "id">;

type CategoryAttribute = {
   id: number;
   category_id: number;
   attribute: string;
   attribute_ascii: string;
};

type CategoryAttributeSchema = Omit<CategoryAttribute, "id">;

type Category = {
   id: number;
   category_ascii: string;
   category: string;
   attribute_order: string;
   hidden: boolean;
   brands: Brand[];
   attributes: CategoryAttribute[];
   price_ranges: PriceRange[];
   category_slider: CategorySlider;
};

type CategorySchema = Omit<
   Category,
   "attributes" | "price_ranges" | "id" | "category_slider" | "brands"
>;

type CategorySlider = {
   category: Category;
   slider: Slider;
};

type CategorySliderSchema = {
   category_id: number;
   slider_id: number;
};

type Brand = {
   id: number;
   brand_ascii: string;
   brand: string;
   image_url: string;
   category_id: number;
};

type BrandSchema = Omit<Brand, "id">;

type ImageType = {
   id?: number;
   image_url: string;
   public_id: string;
   name: string;
   size: number;
   link_to: string;
};

type Toast = {
   title?: "success" | "error" | "warning";
   desc: string;
   id: string;
};

type ProductComment = {
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

type ProductReview = ProductComment & { rate: number };

type Reply = Omit<ProductComment, "cus_name" | "phone_number" | "approve">;

type LCStorage = {
   like_review_ids: number[];
   like_comment_ids: number[];
   product_history_ids: number[];
};

type PriceRange = {
   id: number;
   category_id: number;
   from: number;
   to: number;
   label: string;
};

type PriceRangeSchema = Omit<PriceRange, "id">;

type Cart = {
   id: number;
   username: string;
   count: number;
   total_price: number;
   items: CartItem[];
};
type CartSchema = Omit<Cart, "id" | "items">;

type CartItem = {
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

type Order = {
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

type OrderSchema = Omit<
   Order,
   "createdAt" | "items" | "id" | "deliveredAt" | "canceledAt" | "createdAt"
>;

type OrderDetail = Omit<
   Order,
   "" & {
      purchase_type: string;
      recipient_name: string;
      recipient_phone_number: string;
      deliveredAt: string;
      canceledAt: string;
   }
>;

type OrderItem = {
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

type CartItemSchema = Omit<CartItem, "id" | "product_data" | "updatedAt" | "createdAt">;

type GetArrayType<T extends any[]> = T extends (infer U)[] ? U : never;
