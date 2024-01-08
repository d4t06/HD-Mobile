import { useEffect, useRef } from "react";
// import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useLocalStorage, useRefreshToken } from "@/hooks";
import { useAuth } from "@/store/AuthContext";

const PersistLogin = () => {
   const { auth, setLoading } = useAuth();
   const refresh = useRefreshToken();
   const [persist] = useLocalStorage("persist", false); //[persist, setPersist]
   const ranEffect = useRef(false);
   const runCB = useRef(false);

   useEffect(() => {
      const verifyRefreshToken = async () => {
         try {
            runCB.current = true;
            await refresh();
         } catch (error) {
            console.error(error);
         } finally {
            setLoading(false);
         }
      };

      if (!ranEffect.current && !auth && persist) verifyRefreshToken();
      else if (!runCB.current) setLoading(false);

      return () => {
         // isMounted = false;
         ranEffect.current = true;
      };
   }, []);

   // return <>{!persist ? <Outlet /> : isLoading ? "" : <Outlet />}</>;
   return <Outlet />;
};

export default PersistLogin;
