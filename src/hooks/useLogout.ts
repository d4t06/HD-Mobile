import { useState } from "react";
import { publicRequest } from "../utils/request";
import { useAuth } from "@/store/AuthContext";
import { sleep } from "@/utils/appHelper";

const useLogout = () => {
   const { setAuth } = useAuth();
   const [isFetching, setIsFetching] = useState(false);

   const logout = async () => {
      try {
         setIsFetching(true);

         if (import.meta.env.DEV) await sleep(300);

         await publicRequest.get("/auth/logout");
         setAuth(null);
      } catch (error) {
         console.log({ messgae: error });
      } finally {
         setIsFetching(false);
      }
   };
   return { logout, isFetching };
};

export default useLogout;
