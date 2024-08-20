import { Param } from "@/store/productsSlice";
import { publicRequest } from "@/utils/request";

export const getProducts = async (props: Param) => {
   const { filters, sort, category_id, page, size, admin } = props;
   const params: Record<string, string | string[] | number[] | number | undefined> = {
      page: page || 1,
      category_id,
   };

   if (size) params["size"] = size;

   if (filters && filters.brands.length)
      params["brand_id"] = filters.brands.map((b) => b.id) as number[];
   if (sort && sort.column && sort.type) {
      params["column"] = sort.column;
      params["type"] = sort.type;
   }

   if (filters?.price) {
      params["price"] = [filters.price.from, filters.price.to];
   }

   let url = "/products";
   if (admin) url = "/product-management/products";

   const response = await publicRequest.get(url, {
      params,
      paramsSerializer: {
         indexes: false,
      },
   });
   return response.data.data;
};
