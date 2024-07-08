import { Param } from "@/store/productsSlice";
import { publicRequest } from "@/utils/request";

export const searchService = async (
   query: Param & { q: string },
   signal?: AbortSignal
) => {
   // phai xu li sort
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

export default searchService;
