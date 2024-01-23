// import usePrivateRequest from "../../hooks/usePrivateRequest"
import { useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import { Button } from "@/components";
import { useEffect } from "react";
import { useAuth } from "@/store/AuthContext";

export default function AccountPage() {
   const { auth, loading } = useAuth();
   const navigate = useNavigate();
   const logout = useLogout();

   const singOut = async () => {
      await logout();
      navigate("/");
   };

   useEffect(() => {
      if (loading) return;

      if (!auth) navigate("/login");
   }, [loading]);

   if (loading) return;

   return (
      <div className="mt-[30px]">
         <h1 className="text-[24px]">Account Page</h1>
         <Button primary onClick={() => singOut()}>
            Logout
         </Button>
      </div>
   );
}
