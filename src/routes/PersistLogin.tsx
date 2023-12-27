import { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocalStorage, useRefreshToken } from "@/hooks";
import { useAuth } from "@/store/AuthContext";

const PersistLogin = () => {
   const { auth } = useAuth();
   const refresh = useRefreshToken();
   const [isLoading, setIsLoading] = useState(true);
   const [persist] = useLocalStorage("persist", false); //[persist, setPersist]

   useEffect(() => {
      let isMounted = true;

      const verifyRefreshToken = async () => {
         try {
            await refresh();
         } catch (error) {
            console.error(error);
         } finally {
            isMounted && setIsLoading(false);
         }
      };

      if (!auth) {
         setIsLoading(false);
         return;
      }
      if (auth.token && persist) verifyRefreshToken();

      return () => {
         isMounted = false;
      };
   }, []);

   useEffect(() => {
      console.log(`isLoading = ${isLoading}`);
      console.log("auth =", auth);
   }, [isLoading]);

   return <>{!persist ? <Outlet /> : isLoading ? "" : <Outlet />}</>;
};

export default PersistLogin;
