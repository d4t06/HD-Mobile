import { useAuth } from "@/store/AuthContext";
import { setCart } from "@/store/cartSlice";
import { sleep } from "@/utils/appHelper";
import { publicRequest } from "@/utils/request";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

const CART_URL = "/cart-items";

export default function useGetCart() {
   const dispatch = useDispatch();

   const { auth, loading } = useAuth();

   const [status, setStatus] = useState<"loading" | "successful" | "error">("loading");

   const ranEffect = useRef(false);

   const getCartItems = async () => {
      try {
         if (import.meta.env.DEV) await sleep(500);

         const res = await publicRequest.get(`${CART_URL}/${auth!.username}`);
         dispatch(
            setCart({ variant: "replace", cartItems: res.data.data as cartItemDetail[] })
         );

         setStatus("successful");

      } catch (error) {
         console.log({ message: error });
         setStatus("error");
      }
   };

   useEffect(() => {
      if (loading) return;
      if (!auth) return;

      if (!ranEffect.current) {
         ranEffect.current = true;
         getCartItems();
      }
   }, [loading]);

   return { status };
}
