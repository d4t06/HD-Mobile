import { FilterType, SortType } from "@/store/filtersSlice";
import { publicRequest } from "@/utils/request";

export type GetProductsParams = {
   filters?: FilterType;
   category_id: number | undefined;
   page?: number;
   sort?: SortType;
   size?: number;
};

export const getProducts = async (props: GetProductsParams) => {
   const { filters, sort, category_id, page = 1, size } = props;
   const params: Record<
      string,
      string | string[] | number[] | number | undefined
   > = {
      page,
      category_id,
      size,
      ...sort,
   };

   if (filters && filters.brands.length)
      params["brand_id"] = filters.brands.map((b) => b.id) as number[];

   if (filters?.price) params["price"] = [filters.price.from, filters.price.to];

   const response = await publicRequest.get("/products", {
      params,
      paramsSerializer: {
         indexes: false,
      },
   });
   return response.data.data;
};
