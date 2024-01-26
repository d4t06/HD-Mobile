import { useAuth } from "@/store/AuthContext";
import { useToast } from "@/store/ToastContext";
import { Cart, CartItemSchema } from "@/types";
import { publicRequest } from "@/utils/request";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
   autoRun?: boolean;
};

const CART_URL = "/carts";

export default function useCart({ autoRun = false }: Props) {
   const [cart, setCart] = useState<Cart>();
   const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
   const [apiLoading, setApiLoading] = useState(false);

   const ranEffect = useRef(false);

   const { auth } = useAuth();
   const { setErrorToast } = useToast();
   const navigate = useNavigate();
   const location = useLocation();

   const apiGetDetail = async () => {
      if (!auth?.username) throw new Error("auth is undefined");

      const res = await publicRequest.get(`http://localhost:3000/api/carts/${auth.username}`);

      return res.data as Cart;
   };

   const handleCartData = (data?: Cart) => {
      if (data) {
         setCart(data);

         if (data.count) {
            localStorage.setItem("carts", JSON.stringify(data.count));
         }
      }
   };

   const getCartDetail = async () => {
      try {
         if (!auth?.username) throw new Error("auth is undefined");

         const cartData = await apiGetDetail();
         handleCartData(cartData);

         setStatus("success");
      } catch (error) {
         console.log(error);
         setErrorToast();
         setStatus("error");
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

   const deleteCartItem = async (handleCartData: (cart: Cart) => void, id?: number) => {
      try {
         if (id === undefined) throw new Error("id is undefined");

         setApiLoading(true);
         await publicRequest.delete(`${CART_URL}/cart-items/${id}`);

         const cartData = await apiGetDetail();
         handleCartData(cartData);
      } catch (error) {
         console.log(error);
         setErrorToast();
      } finally {
         setApiLoading(false);
      }
   };

   const updateCartItem = async (handleCartData: (cart: Cart) => void, cartItem: CartItemSchema & { id: number }) => {
      try {
         if (cartItem.id === undefined) throw new Error("item id is undefined");

         const { username, product_name_ascii, ...rest } = cartItem;

         setApiLoading(true);
         await publicRequest.put(`${CART_URL}/cart-items/${cartItem.id}`, rest);

         const cartData = await apiGetDetail();
         handleCartData(cartData);
      } catch (error) {
         console.log(error);
         setErrorToast();
      } finally {
         setApiLoading(false);
      }
   };

   useEffect(() => {
      if (!auth?.username || !autoRun) return;

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
      handleCartData,
      apiLoading,
      status,
   };
}
