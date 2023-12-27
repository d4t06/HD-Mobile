import { Param } from "@/store/productsSlice";
import { publicRequest } from "@/utils/request";

export const getProducts = async (params: Param) => {
   if (!params) {
      console.log("product service missing query");
      return [];
   }

   const { filters, sort, category, page } = params;
   try {
      const response = await publicRequest.get(`/products/${category}`, {
         params: {
            page,
            // ...filters, //brand='samsung,iphone'
            brand_name: filters.brand,
            price: filters.price,
            ...sort, //column=cur_price&type=asc
         },
      });
      return response.data;
   } catch (error) {
      console.log("loi getProducts services", error);
   }
};

export const getProductsAdmin = async (params: Param) => {
   const { filters, sort, category, page } = params;
   try {
      const response = await publicRequest.get(`/product-management/${category}`, {
         params: {
            page,
         },
      });
      return response.data;
   } catch (error) {
      console.log("loi getProducts services", error);
   }
};

export const getProductDetail = async (params: { category: string; id: string }) => {
   if (!params) {
      console.log("product service missing query");
      return;
   }
   const { category, id } = params;
   try {
      const response = await publicRequest.get(`/products/${category}/${id}`, {
         params: {},
      });
      return response.data;
   } catch (error) {
      console.log("loi getProductDetail services", error);
   }
};

export const buyProduct = async (data: any) => {
   if (!data) {
      console.log("data missing !");
      return;
   }
   try {
      publicRequest.post("/products", {
         body: {
            ...data,
         },
      });
   } catch (error) {
      console.log("buy product fail, ", error);
   }
};
