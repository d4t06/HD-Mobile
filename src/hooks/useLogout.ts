import { publicRequest } from "../utils/request";
import { useAuth } from "@/store/AuthContext";

const useLogout = () => {
   const { setAuth } = useAuth();

   const logout = async () => {
      try {
         await publicRequest.get("/auth/logout");
         setAuth(null);
      } catch (error) {
         console.log({ messgae: error });
      }
   };
   return logout;
};

export default useLogout;
