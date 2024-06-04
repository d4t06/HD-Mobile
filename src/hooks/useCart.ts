import { useAuth } from "@/store/AuthContext";
import { useToast } from "@/store/ToastContext";

import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrivateRequest } from ".";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";

type Props = {
   autoRun?: boolean;
};

const CART_URL = "/carts";

export default function useCart({ autoRun = false }: Props) {
   const [cart, setCart] = useState<Cart>();
   const [initStatus, setInitStatus] = useState<"loading" | "error" | "success">(
      "loading"
   );
   const [apiLoading, setApiLoading] = useState(false);

   const ranEffect = useRef(false);

   const { status } = useSelector(selectCategory);

   const { auth, loading: authLoading } = useAuth();
   const privateRequest = usePrivateRequest();
   const { setErrorToast } = useToast();
   const navigate = useNavigate();
   const location = useLocation();

   const apiGetDetail = async () => {
      if (!auth?.username) throw new Error("auth is undefined");

      const res = await privateRequest.get(`${CART_URL}/${auth.username}`);
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

         setInitStatus("success");
      } catch (error) {
         console.log(error);
         setErrorToast();
         setInitStatus("error");
      }
   };

   const handleGetCartDetail = async () => {
      if (!auth || !auth.username) {
         setInitStatus("success");
         navigate("/");
      } else await getCartDetail();
   };

   const addItemToCart = async (cartItem: CartItemSchema) => {
      try {
         if (!auth?.username) throw new Error("auth is undefined");

         setApiLoading(true);
         await privateRequest.post(`${CART_URL}/cart-items`, cartItem);
         navigate("/check-out", { state: { from: location.pathname } });

         setApiLoading(false);
      } catch (error) {
         console.log(error);
         setErrorToast();
      } finally {
         setApiLoading(false);
      }
   };

   const deleteCartItem = async (handleCartData?: (cart: Cart) => void, id?: number) => {
      try {
         if (id === undefined) throw new Error("id is undefined");

         setApiLoading(true);
         await privateRequest.delete(`${CART_URL}/cart-items/${id}`);

         if (handleCartData) {
            const cartData = await apiGetDetail();
            handleCartData(cartData);
         }
      } catch (error) {
         console.log(error);
         setErrorToast();
      } finally {
         setApiLoading(false);
      }
   };

   const updateCartItem = async (
      handleCartData: (cart: Cart) => void,
      cartItem: CartItemSchema & { id: number },
      type: "update-quantity" | "update-variant"
   ) => {
      try {
         if (cartItem.id === undefined) throw new Error("item id is undefined");

         const { username, ...rest } = cartItem;

         setApiLoading(true);
         if (type === "update-quantity") {
            await privateRequest.put(`${CART_URL}/cart-items/${cartItem.id}`, rest);
         } else if (type === "update-variant") {
            const { amount, ...restLess } = rest;
            await privateRequest.put(`${CART_URL}/cart-items/${cartItem.id}`, restLess);
         }

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
      if (authLoading || status === "loading") return;
      if (!autoRun) return;

      if (!ranEffect.current) {
         ranEffect.current = true;
         handleGetCartDetail();
      }
   }, [authLoading, status]);

   return {
      addItemToCart,
      cart,
      getCartDetail,
      deleteCartItem,
      updateCartItem,
      handleCartData,
      apiLoading,
      initStatus,
   };
}
