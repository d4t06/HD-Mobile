import { useAuth } from "@/store/AuthContext";
import { useToast } from "@/store/ToastContext";
import { Cart, Cart_Item } from "@/types";
import { publicRequest } from "@/utils/request";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CART_URL = "/carts";

export default function useCart() {
  const { auth } = useAuth();

  const [cart, setCart] = useState<Cart>();

  const [apiLoading, setApiLoading] = useState(false);

  const { setSuccessToast, setErrorToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const getCartDetail = async () => {
    try {
      if (!auth?.username) throw new Error("auth is undefined");

      setApiLoading(true);
      const res = await publicRequest.get(`${CART_URL}/${auth.username}`);
      const cartData = res.data;

      if (cartData) {
        setCart(cartData);
      }
      setApiLoading(false);
    } catch (error) {
      console.log(error);
      setErrorToast();
    }
  };

  const addItemToCart = async (cartItem: Cart_Item) => {
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
      setApiLoading(false)
    }
  };
  return { addItemToCart, cart, getCartDetail, apiLoading };
}
