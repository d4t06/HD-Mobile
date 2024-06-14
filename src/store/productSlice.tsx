import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StateType = {
   product: ProductDetail | null;
   status: "loading" | "successful" | "error";
};

const initialState: StateType = {
   status: "loading",
   product: null,
};

const productSlice = createSlice({
   name: "product",
   initialState,
   reducers: {
      setProduct(state: StateType, action: PayloadAction<ProductDetail>) {
         state.product = action.payload;
         state.status = "successful";
      },

      setProductStatus(state: StateType, action: PayloadAction<StateType["status"]>) {
         state.status = action.payload;
      },

      updateProduct: (
         state: StateType,
         action: PayloadAction<Partial<ProductDetail>>
      ) => {
         if (!state.product) return state;
         Object.assign(state.product, action.payload);
      },

      setVariant(
         state: StateType,
         action: PayloadAction<
            | { type: "add"; variant: ProductVariant; combines: ProductCombine[] }
            | { type: "update"; variant: Partial<ProductVariant>; index: number }
            | { type: "delete"; index: number }
         >
      ) {
         if (!state.product) return state;

         const payload = action.payload;
         switch (payload.type) {
            case "add":
               state.product.variants.push(payload.variant);
               state.product.combines.push(...payload.combines);
               break;
            case "update":
               Object.assign(state.product.variants[payload.index], payload.variant);
               break;
            case "delete":
               state.product.variants.splice(payload.index, 1);
               break;
         }
      },

      setSlider(
         state: StateType,
         action: PayloadAction<
            | { type: "add"; sliderImages: SliderImage[]; colorIndex: number }
            | {
                 type: "update";
                 sliderImage: Partial<SliderImage>;
                 index: number;
                 colorIndex: number;
              }
            | { type: "delete"; index: number; colorIndex: number }
         >
      ) {
         if (!state.product) return state;

         const payload = action.payload;
         switch (payload.type) {
            case "add":
               const { colorIndex, sliderImages } = payload;
               state.product.colors[colorIndex].product_slider.slider.slider_images.push(
                  ...sliderImages
               );
               break;
            case "update": {
               const { colorIndex, sliderImage, index } = payload;
               Object.assign(
                  state.product.colors[colorIndex].product_slider.slider.slider_images[
                     index
                  ],
                  sliderImage
               );
               break;
            }
            case "delete": {
               const { colorIndex, index } = payload;
               state.product.colors[
                  colorIndex
               ].product_slider.slider.slider_images.splice(index, 1);
               break;
            }
         }
      },

      setDefaultVariant(state: StateType, action: PayloadAction<DefaultVariant>) {
         if (!state.product) return state;

         state.product.default_variant = action.payload;
      },

      setDefaultVariantCombine(
         state: StateType,
         action: PayloadAction<{
            index: number;
            defaultVariantCombine: Partial<DefaultVariantCombine>;
         }>
      ) {
         if (!state.product) return state;

         const { defaultVariantCombine, index } = action.payload;
         Object.assign(
            state.product.variants[index].default_combine,
            defaultVariantCombine
         );
      },

      setColor(
         state: StateType,
         action: PayloadAction<
            | { type: "add"; color: ProductColor; combines: ProductCombine[] }
            | { type: "update"; color: Partial<ProductColor>; index: number }
            | { type: "delete"; index: number }
         >
      ) {
         if (!state.product) return state;

         const payload = action.payload;
         switch (payload.type) {
            case "add":
               state.product.colors.push(payload.color);
               state.product.combines.push(...payload.combines);
               break;
            case "update":
               Object.assign(state.product.colors[payload.index], payload.color);
               break;
            case "delete":
               state.product.colors.splice(payload.index, 1);
               break;
         }
      },

      setAttribute(
         state: StateType,
         action: PayloadAction<
            | { type: "add"; attribute: ProductAttribute }
            | { type: "update"; attribute: Partial<ProductAttribute>; index: number }
            | { type: "delete"; index: number }
         >
      ) {
         if (!state.product) return state;

         const payload = action.payload;
         switch (payload.type) {
            case "add":
               state.product.attributes.push(payload.attribute);
               break;
            case "update":
               Object.assign(state.product.attributes[payload.index], payload.attribute);
               break;
            case "delete":
               state.product.colors.splice(payload.index, 1);
               break;
         }
      },

      setCombine(
         state: StateType,
         action: PayloadAction<
            | { type: "add"; combine: ProductCombine }
            | { type: "update"; combine: Partial<ProductCombine>; index: number }
            | { type: "replace"; combines: ProductCombine[] }
         >
      ) {
         if (!state.product) return state;

         const payload = action.payload;
         switch (payload.type) {
            case "add":
               state.product.combines.push(payload.combine);
               break;
            case "update":
               Object.assign(state.product.combines[payload.index], payload.combine);
               break;
            case "replace":
               state.product.combines = payload.combines;
               break;
         }
      },

      runError(state: StateType) {
         state.product = null;
         state.status = "error";
      },
   },
});

export const selectProduct = (state: { product: StateType }) => state.product;

export const {
   updateProduct,
   setAttribute,
   setColor,
   setCombine,
   setDefaultVariant,
   setDefaultVariantCombine,
   setProduct,
   setProductStatus,
   setVariant,
   runError,
   setSlider,
} = productSlice.actions;

export default productSlice.reducer;
