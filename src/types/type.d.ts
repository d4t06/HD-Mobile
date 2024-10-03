type AuthResponse = {
   userInfo: {
      username: string;
      role: string;
   };
   token: string;
};

interface ProductCombine {
   id: number;
   product_id: number;
   color_id: number;
   variant_id: number;
   quantity: number;
   price: number;
}

interface ProductSlider {
   id: number;
   product_id: number;
   slider_id: number;
   color_id: number;
   slider: Slider;
}

type SliderImage = {
   id: number;
   slider_id: number;
   image_id: number;
   link_to: string;
   image: ImageType;
};

type SliderImageSchema = Omit<SliderImage, "id" | "image">;

type Slider = {
   id: number;
   slider_images: SliderImage[];
   slider_name: string;
};

type ProductVariantDetail = {
   id: number;
   product_id: number;
   name_ascii: string;
   name: string;
   default_combine: DefaultVariantCombineDetail;
};

type ProductVariant = Omit<ProductVariantDetail, "default_combine"> & {
   default_combine: DefaultVariantCombine;
};

type ProductVariantSchema = Omit<
   ProductVariantDetail,
   "id" | "default_combine"
>;

type ProductColor = {
   id: number;
   product_id: number;
   name_ascii: string;
   name: string;
   product_slider: ProductSlider;
};

type ProductColorSchema = Omit<ProductColor, "id" | "product_slider">;

type DefaultVariantDetail = {
   id: number;
   product_id: number;
   variant_id: number;
   variant: ProductVariantDetail;
};

type DefaultVariant = Omit<DefaultVariantDetail, "variant">;

type DefaultVariantSchema = Omit<DefaultVariant, "id">;

type DefaultVariantCombineDetail = {
   id: number;
   variant_id: number;
   combine_id: number;
   combine: ProductCombine;
};

type DefaultVariantCombine = Omit<DefaultVariantCombineDetail, "combine">;

type DefaultVariantCombineSchema = Omit<
   DefaultVariantCombineDetail,
   "combine" | "id"
>;

type ProductResponse = {
   products: Product[];
   count: number;
   page: number;
   page_size: number;
   sort: boolean;
   category_id: number | null;
   column: number | null;
};

type Description = {
   id: number;
   product_id: number;
   content: string;
};

type DescriptionSchema = Omit<Description, "id">;

type CartProduct = Omit<Product, "default_variant"> & {
   colors: ProductColor[];
};

type ProductDetail = {
   id: number;
   name: string;
   name_ascii: string;
   category_id: number | null;
   category: Category | null;
   brand_id: number;
   image_url: string;
   description: Description;
   variants: ProductVariant[];
   colors: ProductColor[];
   combines: ProductCombine[];
   attributes: ProductAttribute[];
   comments_data: ProductComment[];
   default_variant: DefaultVariant;
};

// type Product = {
//    id: number;
//    name: string;
//    name_ascii: string;
//    category_id: number;
//    brand_id: number;
//    image_url: string;
//    variants: ProductVariantDetail[];
//    default_variant: DefaultVariantDetail;
// };

type Product = Omit<
   ProductDetail,
   | "comments_data"
   | "combines"
   | "colors"
   | "variants"
   | "default_variant"
   | "description"
> & {
   default_variant: DefaultVariantDetail;
   variants: ProductVariantDetail[];
};

type ProductSearch = Omit<
   ProductDetail,
   | "comments_data"
   | "combines"
   | "colors"
   | "variants"
   | "default_variant"
   | "description"
> & {
   default_variant: DefaultVariantDetail;
};

type ProductSearchResponse = Omit<ProductResponse, "products"> & {
   products: ProductSearch[];
};

type ProductSchema = Omit<
   Product,
   | "storages"
   | "colors"
   | "category"
   | "combines"
   | "description"
   | "comments_data"
   | "id"
   | "attributes"
   | "default_variant"
   | "variants"
>;

type ProductAttribute = {
   id: number;
   category_attribute_id: number;
   product_id: number;
   value: string;
};

type ProductAttributeSchema = Omit<ProductAttribute, "attribute_data" | "id">;

type CategoryAttribute = {
   id: number;
   category_id: number;
   name: string;
   name_ascii: string;
};

type CategoryAttributeSchema = Omit<CategoryAttribute, "id">;

type Category = {
   id: number;
   name_ascii: string;
   name: string;
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
   name_ascii: string;
   name: string;
   image_url: string;
   category_id: number;
};

type BrandSchema = Omit<Brand, "id">;

type ImageType = {
   id: number;
   image_url: string;
   public_id: string;
   name: string;
   size: number;
   link_to: string;
};

type ImageTypeSchema = Omit<ImageType, "id">;

type Toast = {
   title?: "success" | "error" | "warning";
   desc: string;
   id: string;
};

type Rating = {
   id: number;
   product_id: number;
   username: string;
   content: string;
   approve: number;
   date_convert: string;
   total_like: number;
   rate: number;
};

type RatingSchema = Omit<
   Rating,
   "id" | "total_like" | "approve" | "date_convert"
>;

type PriceRange = {
   id: number;
   category_id: number;
   from: number;
   to: number;
   label: string;
};

type PriceRangeSchema = Omit<PriceRange, "id">;

type CartItem = {
   id: number;
   username: string;
   product_id: number;
   amount: number;
   color_id: number;
   variant_id: number;
   amount: number;
   product: CartProduct;
};

type cartItemDetail = {
   item: CartItem;
   price: number;
};

type CartItemSchema = Omit<CartItem, "id" | "product">;

type LayoutClasses = {
   flexContainer: string;
   flexCol: string;
   group: string;
   label: string;
};
