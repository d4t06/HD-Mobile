import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { GetProductsParams, getProducts } from "../services/productServices";
import { search, SearchProductParams } from "../services/searchService";

import { sleep } from "@/utils/appHelper";

export type ProductState = {
   products: Product[];
   count: number;
   pageSize: number;
};

export type StateType = {
   status: "" | "loading" | "more-loading" | "successful" | "error";
   // productState: ProductState;
   products: Product[];
   count: number;
   pageSize: number;
   category_id: number | undefined;
   page: number;
};

const initialState: StateType = {
   status: "loading",
   // productState: {
   products: [],
   count: 0,
   pageSize: 0,
   // },
   category_id: undefined,
   page: 1,
};

type FetchProductParams = GetProductsParams & {
   replace?: boolean;
   status?: StateType["status"];
};

export const fetchProducts = createAsyncThunk(
   "/products/getProducts",
   async (param: FetchProductParams) => {
      const { replace, status, ...rest } = param;

      if (import.meta.env.DEV) await sleep(500);

      const { sort, column, ...restRes } = (await getProducts({
         ...rest,
      })) as ProductResponse;

      return { ...restRes, replace, status };
   },
);

type ThunkSearchProductParams = SearchProductParams & {
   replace?: boolean;
   status?: StateType["status"];
};

export const searchProducts = createAsyncThunk(
   "/search",
   async (param: ThunkSearchProductParams) => {
      const { replace, status, ...rest } = param;

      if (import.meta.env.DEV) await sleep(500);

      const { column, sort, ...restRes } = (await search({
         ...rest,
      })) as ProductResponse;

      return { ...restRes, status, replace };
   },
);

const productsSlice = createSlice({
   name: "products",
   initialState,
   reducers: {
      setProducts(
         state,
         action: PayloadAction<
            | {
                 variant: "replace";
                 payload: Partial<StateType>;
              }
            | {
                 variant: "storing";
                 payload: Partial<StateType>;
              }
            | {
                 variant: "insert";
                 payload: Partial<StateType>;
              }
         >,
      ) {
         const { payload, variant } = action.payload;
         const { products = [], ...rest } = payload;

         Object.assign(state, rest);
         state.status = "successful";

         switch (variant) {
            case "replace":
               state.products = products;
               break;
            case "storing":
               state.products.push(...products);
               break;

            case "insert":
               const newProducts = [...products, ...state.products];
               state.products = newProducts;
               break;
         }
      },
      addProduct(state, action: PayloadAction<Product[]>) {
         state.products.push(...action.payload);
      },
      updateProduct(
         state,
         action: PayloadAction<{
            product: Partial<ProductSchema>;
            index: number;
         }>,
      ) {
         const payload = action.payload;
         const { index, product } = payload;
         Object.assign(state.products[index], product);
      },
      setStatus(state, action: PayloadAction<StateType["status"]>) {
         state.status = action.payload;
      },
      resetProducts(state: StateType) {
         Object.assign(state, initialState);
      },
   },
   extraReducers: (builder) => {
      builder
         // fetchProducts
         .addCase(fetchProducts.pending, (state, action) => {
            state.status = action.meta.arg.status || "loading";
         })
         .addCase(fetchProducts.fulfilled, (state, action) => {
            const { replace, status, products = [], ...rest } = action.payload;

            Object.assign(state, rest);

            state.status = "successful";

            if (replace) state.products = products;
            else state.products.push(...products);
         })
         .addCase(fetchProducts.rejected, (state) => {
            state.status = "error";
         })

         // search product
         .addCase(searchProducts.pending, (state, action) => {
            state.status = action.meta.arg.status || "loading";
         })

         .addCase(searchProducts.fulfilled, (state, action) => {
            const { replace, status, products = [], ...rest } = action.payload;

            Object.assign(state, rest);

            state.status = "successful";

            if (replace) state.products = products;
            else state.products.push(...products);
         })

         .addCase(searchProducts.rejected, (state) => {
            state.status = "error";
         });
   },
});

export const selectedAllProduct = (state: { products: StateType }) => {
   return state.products;
};

export const { setProducts, updateProduct, setStatus, resetProducts, addProduct } =
   productsSlice.actions;

export default productsSlice.reducer;
