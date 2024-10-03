import {  SortType } from "@/store/filtersSlice";
import { publicRequest } from "@/utils/request";

export type SearchProductParams = {
   q: string;
   page?: number;
   sort?: SortType;
   size?: number;
};

export const search = async (
   query: SearchProductParams,
   signal?: AbortSignal
) => {
   const { sort, ...rest } = query;

   try {
      const response = await publicRequest.get(`/products/search`, {
         params: {
            ...rest,
            ...sort,
         },
         signal: signal,
      });
      return response.data.data as ProductResponse;
   } catch (error) {
      console.log(">>> searchService", error);
   }
};

