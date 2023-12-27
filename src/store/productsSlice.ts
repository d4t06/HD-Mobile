import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import * as productServices from "../services/productServices";
import searchService from "../services/searchService";
import { Product, ProductStorage } from "@/types";
import { FilterType, SortType } from "./filtersSlice";
import { sleep } from "@/utils/appHelper";

type ProductState = {
   products: Product[];
   count: number;
   pageSize: number;
   variants_data: (ProductStorage & { product_name_ascii: string })[];
};

type StateType = {
   status: "idle" | "loading" | "more-loading" | "successful" | "error";
   productState: ProductState;
   category: string;
   page: number;
};

const initialState: StateType = {
   status: "idle",
   productState: {
      products: [],
      count: 0,
      pageSize: 0,
      variants_data: [],
   },
   category: "",
   page: 1,
};

export type Param = {
   filters: FilterType;
   category: string;
   page: number;
   sort: SortType;
   admin?: boolean;
};

export const fetchProducts = createAsyncThunk("/products/getProducts", async (param: Param) => {
   try {
      let response: ProductState;
      const { admin, ...rest } = param;
      if (param.category.includes("search")) {
         const key = param.category.split("search=")[1]; //search=iphone 14
         response = await searchService({
            q: key,
            page: param.page,
            sort: param.sort,
         });
      } else {
         if (admin) {
            response = await productServices.getProductsAdmin({
               ...rest,
            });
         } else {
            response = await productServices.getProducts({
               ...rest,
            });
         }
      }
      if (import.meta.env.DEV) await sleep(300);

      return { productState: response, ...rest, admin };
   } catch (error) {
      console.log("fetchProducts error", error);
   }
});

// product.rows.push
export const getMoreProducts = createAsyncThunk("/products/getMoreProducts", async (param: Param) => {
   try {
      let response: ProductState;
      const { admin, ...rest } = param;
      if (param.category.includes("search")) {
         console.log("include search");
         const key = param.category.split("search=")[1]; //search=iphone 14
         response = await searchService({ q: key, page: param.page, sort: param.sort });
      } else {
         response = await productServices.getProducts(param);
      }

      if (import.meta.env.DEV) await sleep(300);

      return { productState: response, ...param, admin };
   } catch (error) {
      console.log("fetchProducts error", error);
   }
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
         const newP = { ...p, storages_data: [...p.storages_data, ...filteredStorages_data] } as Product;
         newProducts[i] = newP;
      }
   }

   return newProducts;
};

const productsSlice = createSlice({
   name: "products",
   initialState,
   reducers: {
      storingProducts(state, action: PayloadAction<StateType>) {
         const payload = action.payload;

         state.productState.count = payload.productState.count || state.productState.count;
         state.productState.products.push(...payload.productState.products);

         state.status = "successful";
         state.page = payload.page;
         state.category = payload.category || "";
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
            state.category = payload.category || "";
            state.productState.count = productState.count;

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

            state.productState.count = payload.productState.count;
            state.productState.products.push(...payload.productState.products);

            state.status = "successful";
            state.page = payload.page;
            state.category = payload.category || "";
         })
         .addCase(getMoreProducts.rejected, (state) => {
            state.status = "error";
         });
   },
});

export const selectedAllProduct = (state: { products: StateType }) => {
   return state.products;
};

export const { storingProducts } = productsSlice.actions;

export default productsSlice.reducer;
