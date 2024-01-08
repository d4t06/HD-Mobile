import { Navigate, Outlet } from "react-router-dom";
import jwt_decode from "jwt-decode";
import loadingGif from "@/assets/images/loading.gif";

import { useAuth } from "@/store/AuthContext";

function RequireAuth({ allowedRole }: { allowedRole: string[] }) {
   const { auth, loading } = useAuth();

   const decode: { username: ""; role: "" } = auth ? jwt_decode(auth.token) : { username: "", role: "" };

   if (loading)
      return (
         <div className="h-screen flex items-center">
            <img className="mx-auto w-[200px]" src={loadingGif} alt="" />
         </div>
      );

   return !!allowedRole?.find((role) => decode.role === role) ? (
      <Outlet />
   ) : auth?.token ? (
      <Navigate to="/unauthorized" />
   ) : (
      <Navigate to="/login" />
   );
}

export default RequireAuth;
