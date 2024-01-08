import { Param } from "@/store/productsSlice";
import { publicRequest } from "@/utils/request";

export const searchService = async (query: Param & { q: string }, signal?: AbortSignal) => {
   // phai xu li sort
   const { sort, ...rest } = query;

   try {
      const response = await publicRequest.get(`/search`, {
         params: {
            ...rest,
            ...sort,
         },
         signal: signal,
      });
      console.log("searchService = ", response.data);
      //   await sleep(1000);
      return response.data;
   } catch (error) {
      console.log(">>> searchService", error);
   }
};

export default searchService;
