import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import filtersReducer from "./filtersSlice";
import categorySlice from "./categorySlice";
import productSlice from "./productSlice";
import cartSlice from "./cartSlice";

const store = configureStore({
   reducer: {
      products: productsReducer,
      filters: filtersReducer,
      category: categorySlice,
      product: productSlice,
      cart: cartSlice,
   },
});

export type AppDispatch = typeof store.dispatch;

export default store;
