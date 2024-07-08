import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as productServices from "../services/productServices";
import searchService from "../services/searchService";

import { FilterType, SortType } from "./filtersSlice";
import { sleep } from "@/utils/appHelper";
// import { AxiosInstance } from "axios";
// import { usePrivateRequest } from "@/hooks";

export type ProductState = {
   products: Product[];
   count: number;
   pageSize: number;
};

export type StateType = {
   status: "" | "loading" | "more-loading" | "successful" | "error";
   productState: ProductState;
   category_id: number | undefined;
   page: number;
};

const initialState: StateType = {
   status: "loading",
   productState: {
      products: [],
      count: 0,
      pageSize: 0,
   },
   category_id: undefined,
   page: 1,
};

export type Param = {
   filters?: FilterType;
   category_id: number | undefined;
   page?: number;
   sort?: SortType;
   admin?: boolean;
   replace?: boolean;
   status?: StateType["status"];
   page_size?: number;
};

export const fetchProducts = createAsyncThunk(
   "/products/getProducts",
   async (param: Param) => {
      const { admin, replace, status, ...rest } = param;

      if (import.meta.env.DEV) await sleep(500);

      const data = (await productServices.getProducts({
         ...rest,
      })) as ProductState;

      return { ...data, ...rest, admin, replace, status };
   }
);

export const searchProducts = createAsyncThunk(
   "/search",
   async (param: Param & { key: string }) => {
      const { key, replace, status, admin, ...rest } = param;

      if (import.meta.env.DEV) await sleep(500);

      const payload = await searchService({
         q: key,
         ...rest,
      });

      return { ...payload, ...rest, status, replace };
   }
);

type PayLoadType = {
   products: Product[];
};

const productsSlice = createSlice({
   name: "products",
   initialState,
   reducers: {
      storingProducts(state, action: PayloadAction<PayLoadType>) {
         const payload = action.payload;
         state.productState.products.push(...payload.products);
      },
      setProducts(
         state,
         action: PayloadAction<
            | {
                 variant: "replace";
                 products: Product[];
              }
            | {
                 variant: "update";
                 product: Partial<ProductSchema>;
                 index: number;
              }
         >
      ) {
         const payload = action.payload;

         switch (payload.variant) {
            case "replace":
               state.productState.products = payload.products;
               break;
            case "update": {
               const { index, product } = payload;
               Object.assign(state.productState.products[index], product);
            }
         }
      },
      setStatus(state, action: PayloadAction<StateType["status"]>) {
         state.status = action.payload;
      },
   },
   extraReducers: (builder) => {
      builder
         // fetchProducts
         .addCase(fetchProducts.pending, (state, action) => {
            state.status = action.meta.arg.status || "loading";
         })
         .addCase(fetchProducts.fulfilled, (state, action) => {
            const { replace = true, ...payload } = action.payload;
            if (!payload) return state;

            state.status = "successful";
            state.page = payload.page || 1;
            state.category_id = payload.category_id;
            state.productState.count = payload.count || 0;
            state.productState.pageSize = payload.pageSize;

            if (replace) state.productState.products = payload.products;
            else state.productState.products.push(...payload.products);
         })
         .addCase(fetchProducts.rejected, (state) => {
            state.status = "error";
         })

         // search product
         .addCase(searchProducts.pending, (state, action) => {
            state.status = action.meta.arg.status || "loading";
         })

         .addCase(searchProducts.fulfilled, (state, action) => {
            const { replace = true, ...payload } = action.payload;
            if (!payload) return state;

            state.status = "successful";
            state.page = payload.page || 0;
            state.productState.count = payload.count || 0;

            const products = payload.products || [];

            if (replace) state.productState.products = products;
            else state.productState.products.push(...products);
         })

         .addCase(searchProducts.rejected, (state) => {
            state.status = "error";
         });
   },
});

export const selectedAllProduct = (state: { products: StateType }) => {
   return state.products;
};

export const { storingProducts, setProducts, setStatus } = productsSlice.actions;

export default productsSlice.reducer;
