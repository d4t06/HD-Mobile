import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "./productsSlice";
import filtersReducer from "./filtersSlice";
import categorySlice from "./categorySlice";

const store = configureStore({
   reducer: {
      products: productsReducer,
      filters: filtersReducer,
      category: categorySlice,
   },
});

export type AppDispatch = typeof store.dispatch;

export default store;
