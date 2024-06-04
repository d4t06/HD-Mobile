import jwtDecode from "jwt-decode";
import { publicRequest } from "../utils/request";
import { useAuth } from "@/store/AuthContext";
import axios from "axios";

const REFRESH_URL =
   (import.meta.env.VITE_API_ENDPOINT || "https://hd-mobile-backend.vercel.app/api") +
   "/auth/refresh";

const useRefreshToken = () => {
   const { setAuth } = useAuth();

   const refresh = async () => {
      try {
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
