import {publicRequest} from "@/utils/request";


export const searchService = async (query: any) => {
   // phai xu li sort
   const {sort, ...rest} = query

    try { 
        const response = await publicRequest.get(`products/search`, {
           params: {
            ...rest,
            ...sort
           }
        });
        console.log("searchService = ", response.data)
      //   await sleep(1000);
        return response.data;
     } catch (error) {
        console.log(">>> searchService", error);
     }
}

export default searchService