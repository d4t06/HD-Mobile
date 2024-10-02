import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StateType = {
   categories: Category[];
   status: "loading" | "error" | "success";
};

const initialState: StateType = {
   categories: [],
   status: "loading",
};

const categorySlice = createSlice({
   name: "category",
   initialState,
   reducers: {
      setCategory(
         state: StateType,
         action: PayloadAction<
            | { type: "replace"; categories: Category[] }
            | { type: "status"; status: StateType["status"] }
            | { type: "add"; categories: Category[] }
            | { type: "update"; category: Partial<Category>; index: number }
         >
      ) {
         const payload = action.payload;
         switch (payload.type) {
            case "add":
               state.categories.push(...payload.categories);
               break;
            case "replace":
               state.categories = payload.categories;
               state.status = "success";
               break;

            case "update":
               Object.assign(state.categories[payload.index], payload.category);
               break;
            case "status":
               state.status = payload.status;
               break;
         }
      },

      setBrand(
         state: StateType,
         action: PayloadAction<
            | { type: "add"; categoryIndex: number; brand: Brand }
            | {
                 type: "update";
                 categoryIndex: number;
                 brand: Partial<Brand>;
                 index: number;
              }
            | { type: "delete"; categoryIndex: number; index: number }
         >
      ) {
         switch (action.payload.type) {
            case "add": {
               const { brand, categoryIndex } = action.payload;
               state.categories[categoryIndex].brands.push(brand);
               break;
            }
            case "delete": {
               const { categoryIndex, index } = action.payload;
               state.categories[categoryIndex].brands.splice(index, 1);
               break;
            }
            case "update": {
               const { brand, categoryIndex, index } = action.payload;
               Object.assign(state.categories[categoryIndex].brands[index], brand);
               break;
            }
         }
      },

      setCategorySlider(
         state: StateType,
         action: PayloadAction<
            | { type: "add"; categoryIndex: number; sliderImages: SliderImage[] }
            | {
                 type: "update";
                 categoryIndex: number;
                 sliderImage: Partial<SliderImage>;
                 index: number;
              }
            | { type: "delete"; categoryIndex: number; index: number }
         >
      ) {
         switch (action.payload.type) {
            case "add": {
               const { sliderImages, categoryIndex } = action.payload;
               state.categories[categoryIndex].category_slider.slider.slider_images.push(
                  ...sliderImages
               );
               break;
            }
            case "delete": {
               const { categoryIndex, index } = action.payload;
               state.categories[
                  categoryIndex
               ].category_slider.slider.slider_images.splice(index, 1);
               break;
            }
            case "update": {
               const { sliderImage, categoryIndex, index } = action.payload;
               Object.assign(
                  state.categories[categoryIndex].category_slider.slider.slider_images[
                     index
                  ],
                  sliderImage
               );
               break;
            }
         }
      },

      setPriceRanges(
         state: StateType,
         action: PayloadAction<
            | { type: "add"; categoryIndex: number; priceRange: PriceRange }
            | {
                 type: "update";
                 categoryIndex: number;
                 priceRange: Partial<PriceRange>;
                 index: number;
              }
            | { type: "delete"; categoryIndex: number; index: number }
         >
      ) {
         switch (action.payload.type) {
            case "add": {
               const { priceRange, categoryIndex } = action.payload;
               state.categories[categoryIndex].price_ranges.push(priceRange);
               break;
            }
            case "delete": {
               const { categoryIndex, index } = action.payload;
               state.categories[categoryIndex].price_ranges.splice(index, 1);
               break;
            }
            case "update": {
               const { priceRange, categoryIndex, index } = action.payload;
               Object.assign(
                  state.categories[categoryIndex].price_ranges[index],
                  priceRange
               );
               break;
            }
         }
      },

      setAttributes(
         state: StateType,
         action: PayloadAction<
            | { type: "add"; categoryIndex: number; attribute: CategoryAttribute }
            | {
                 type: "update";
                 categoryIndex: number;
                 attribute: Partial<CategoryAttribute>;
                 index: number;
              }
            | { type: "delete"; categoryIndex: number; index: number }
         >
      ) {
         switch (action.payload.type) {
            case "add": {
               const { attribute, categoryIndex } = action.payload;
               state.categories[categoryIndex].attributes.push(attribute);
               break;
            }
            case "delete": {
               const { categoryIndex, index } = action.payload;
               state.categories[categoryIndex].attributes.splice(index, 1);
               break;
            }
            case "update": {
               const { attribute, categoryIndex, index } = action.payload;
               Object.assign(
                  state.categories[categoryIndex].attributes[index],
                  attribute
               );
               break;
            }
         }
      },
   },
});

export const selectCategory = (state: { category: StateType }) => state.category;
export const { setAttributes, setBrand, setCategory, setPriceRanges, setCategorySlider } =
   categorySlice.actions;

export default categorySlice.reducer;
