import { useAuth } from "@/store/AuthContext";
import { useToast } from "@/store/ToastContext";
import { Cart, CartItem, CartItemSchema } from "@/types";
import { publicRequest } from "@/utils/request";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
   autoRun?: boolean;
};

const CART_URL = "/carts";

export default function useCart({ autoRun = false }: Props) {
   const [cart, setCart] = useState<Cart>();
   const [apiLoading, setApiLoading] = useState(autoRun ? true : false);

   const ranEffect = useRef(false);

   const { auth } = useAuth();
   const { setSuccessToast, setErrorToast } = useToast();
   const navigate = useNavigate();
   const location = useLocation();

   const apiGetDetail = async () => {
      if (auth?.username) {
         throw new Error("auth is undefined");
         return;
      }

      const res = await publicRequest.get(
         `http://localhost:3000/api/carts/test`
      );

      return res.data as Cart;
   };

   const handleCartDaa = (data?: Cart) => {
      if (data) {
         setCart(data);

         if (data.count_item) {
            localStorage.setItem("carts", JSON.stringify(data.count_item));
         }
      }
   };

   const getCartDetail = async () => {
      try {
         if (!auth?.username) throw new Error("auth is undefined");

         setApiLoading(true);

         const cartData = await apiGetDetail();
         handleCartDaa(cartData);

         setApiLoading(false);
      } catch (error) {
         console.log(error);
         setErrorToast();
      }
   };

   const addItemToCart = async (cartItem: CartItemSchema) => {
      try {
         if (!auth?.username) throw new Error("auth is undefined");

         setApiLoading(true);
         await publicRequest.post(`${CART_URL}/cart-items`, cartItem);
         navigate("/check-out", { state: { from: location.pathname } });

         setApiLoading(false);
      } catch (error) {
         console.log(error);
         setErrorToast();
      } finally {
         setApiLoading(false);
      }
   };

   const deleteCartItem = async (id?: number) => {
      try {
         if (id === undefined) throw new Error("id is undefined");

         setApiLoading(true);
         await publicRequest.delete(`${CART_URL}/cart-items/${id}`);

         const cartData = await apiGetDetail();
         handleCartDaa(cartData);
      } catch (error) {
         console.log(error);
         setErrorToast();
      } finally {
         setApiLoading(false);
      }
   };

   const updateCartItem = async (cartItem: CartItem) => {
      try {
         if (cartItem.id === undefined) throw new Error("item id is undefined");

         setApiLoading(true);
         await publicRequest.put(
            `${CART_URL}/cart-items/${cartItem.id}`,
            cartItem
         );

         const cartData = await apiGetDetail();
         handleCartDaa(cartData);
      } catch (error) {
         console.log(error);
         setErrorToast();
      } finally {
         setApiLoading(false);
      }
   };

   useEffect(() => {
      if (!auth?.username || !autoRun) return;


      console.log('check auth', auth,auth.username);
      

      if (!ranEffect.current) {
         ranEffect.current = true;
         getCartDetail();
      }
   }, [auth]);

   return {
      addItemToCart,
      cart,
      getCartDetail,
      deleteCartItem,
      updateCartItem,
      apiLoading,
   };
}
