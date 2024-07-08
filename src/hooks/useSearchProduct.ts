import { publicRequest } from "@/utils/request";
import { useEffect, useState } from "react";

type Props = {
   query: string;
};
export default function useSearchProduct({ query }: Props) {
   const [isFetching, setIsFetching] = useState(false);
   const [searchResult, setSearchResult] = useState<ProductSearch[]>([]);

   useEffect(() => {
      if (!query.trim()) {
         setIsFetching(false);
         setSearchResult([]);
         return;
      }
      const controller = new AbortController();

      const fetchApi = async () => {
         try {
            setIsFetching(true);

            const res = await publicRequest.get(`/products/search?q=${query}`);
            setSearchResult(res.data.data.products as ProductSearch[]);
         } catch (error) {
            console.log(error);
         } finally {
            setIsFetching(false);
         }
      };

      fetchApi();

      return () => {
         console.log("abort");
         controller.abort();
      };
   }, [query]);

   return { isFetching, searchResult, setSearchResult };
}
