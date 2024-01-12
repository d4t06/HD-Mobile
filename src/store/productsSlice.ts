import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as productServices from "../services/productServices";
import searchService from "../services/searchService";
import { Product, ProductStorage } from "@/types";
import { FilterType, SortType } from "./filtersSlice";
import { sleep } from "@/utils/appHelper";
// import { AxiosInstance } from "axios";
// import { usePrivateRequest } from "@/hooks";

export type ProductState = {
   products: Product[];
   count: number;
   pageSize: number;
   variants_data: (ProductStorage & { product_name_ascii: string })[];
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
      variants_data: [],
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
   search?: boolean;
   replace?: boolean;
};

export const fetchProducts = createAsyncThunk("/products/getProducts", async (param: Param) => {
   console.log("fetch Products check param", param);

   let response: ProductState;
   const { admin, ...rest } = param;

   if (import.meta.env.DEV) await sleep(300);

   if (admin) {
      response = await productServices.getProductsAdmin({
         ...rest,
      });
   } else {
      response = await productServices.getProducts({
         ...rest,
      });
   }
   // }

   return { productState: response, ...rest, admin };
});

// product.rows.push
export const getMoreProducts = createAsyncThunk("/products/getMoreProducts", async (param: Param) => {
   let response: ProductState;
   const { admin, ...rest } = param;

   if (admin) {
      response = await productServices.getProductsAdmin({
         ...rest,
      });
   } else {
      response = await productServices.getProducts({
         ...rest,
      });
   }

   if (import.meta.env.DEV) await sleep(300);

   return { productState: response, ...param, admin };
});

export const searchProducts = createAsyncThunk("/search", async (param: Param & { key: string }) => {
   const { key, replace, ...rest } = param;
   const response = await searchService({
      q: key,
      ...rest,
   });

   return { productState: response, ...rest, replace };
});

const mergeVariantToProduct = (
   products: Product[],
   variants_data: (ProductStorage & { product_name_ascii: string })[]
) => {
   const newProducts = [...products];

   for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const filteredStorages_data = variants_data.filter(
         (v) => !v.default && v.product_name_ascii === p.product_name_ascii
      );

      if (filteredStorages_data.length) {
         const newP = { ...p, storages_data: filteredStorages_data } as Product;
         newProducts[i] = newP;
      }
   }

   return newProducts;
};

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
      setProducts(state, action: PayloadAction<PayLoadType>) {
         const payload = action.payload;
         state.productState.products = payload.products;
      },
   },
   extraReducers: (builder) => {
      builder
         // fetchProducts
         .addCase(fetchProducts.pending, (state) => {
            state.status = "loading";
         })
         .addCase(fetchProducts.fulfilled, (state, action) => {
            const payload = action.payload;
            if (!payload) return state;
            const productState = payload.productState;

            console.log("check payload", payload);

            state.status = "successful";
            state.page = payload.page || 1;
            state.category_id = payload.category_id || state.category_id;
            state.productState.count = productState.count || 0;

            if (!payload.admin) {
               if (!!productState.variants_data.length) {
                  const mergedProducts = mergeVariantToProduct(productState.products, productState.variants_data);
                  state.productState.products = mergedProducts;

                  return;
               }
            }

            state.productState.products = productState.products;
         })
         .addCase(fetchProducts.rejected, (state) => {
            console.log("rejecrt case");

            state.status = "error";
         })

         // getMoreProducts
         .addCase(getMoreProducts.pending, (state) => {
            state.status = "more-loading";
         })
         .addCase(getMoreProducts.fulfilled, (state, action) => {
            console.log("getMoreProducts =", action);
            const payload = action.payload;
            if (!payload) return state;

            state.productState.count = payload.productState.count || 0;
            state.productState.products.push(...payload.productState.products);

            state.status = "successful";
            state.page = payload.page || 0;
            state.category_id = payload.category_id || 0;
         })
         .addCase(getMoreProducts.rejected, (state) => {
            state.status = "error";
         })

         // search product
         .addCase(searchProducts.pending, (state) => {
            state.status = "loading";
         })

         .addCase(searchProducts.fulfilled, (state, action) => {
            const payload = action.payload;
            if (!payload) return state;

            const productState = action.payload?.productState;

            state.productState.count = payload.productState.count || 0;
            const mergedProducts = mergeVariantToProduct(productState.products, productState.variants_data);

            if (payload.replace) state.productState.products = mergedProducts;
            else state.productState.products.push(...mergedProducts);

            state.status = "successful";
            state.page = payload.page || 0;
         })

         .addCase(searchProducts.rejected, (state) => {
            state.status = "error";
         });
   },
});

export const selectedAllProduct = (state: { products: StateType }) => {
   return state.products;
};

export const { storingProducts, setProducts } = productsSlice.actions;

export default productsSlice.reducer;
