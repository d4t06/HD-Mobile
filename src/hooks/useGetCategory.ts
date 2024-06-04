import { useEffect, useRef } from "react";
import { sleep } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { useDispatch } from "react-redux";
import { setCategory } from "@/store/categorySlice";

const CATEGORY_URL = "/categories";

export default function useGetCategory() {
   const dispatch = useDispatch();
   // const [status, setStatus] = useState<"loading" | "success" | "error" | "">("loading");
   const ranUseEffect = useRef(false);

   const getCategories = async () => {
      try {
         console.log(">>> api get categories");
         if (import.meta.env.DEV) await sleep(300);

         const res = await publicRequest.get(CATEGORY_URL);
         dispatch(setCategory({ type: "replace", categories: res.data.data }));
      } catch (error) {
         console.log({ message: error });
         dispatch(setCategory({ type: "status", status: "error" }));
      }
   };

   // run get all categories
   useEffect(() => {
      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getCategories();
      }
   }, []);
}
