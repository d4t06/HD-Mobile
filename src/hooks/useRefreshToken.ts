import { useAuth } from "@/store/AuthContext";
import { sleep } from "@/utils/appHelper";
import axios from "axios";

const REFRESH_URL =
   (import.meta.env.VITE_API_ENDPOINT || "https://hd-mobile-backend-ts.vercel.app/api") +
   "/auth/refresh";

const useRefreshToken = () => {
   const { setAuth } = useAuth();

   const refresh = async () => {
      try {
         if (import.meta.env.DEV) await sleep(600);

         const response = await axios.get(REFRESH_URL, { withCredentials: true });

         const data = response.data.data as AuthResponse;

         setAuth({
            role: data.userInfo.role,
            token: data.token,
            username: data.userInfo.username,
         });

         return data.token;
      } catch (error) {
         console.log({ message: error });
      }
   };
   return refresh;
};

export default useRefreshToken;
