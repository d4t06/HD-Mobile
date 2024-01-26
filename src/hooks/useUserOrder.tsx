import { useAuth } from "@/store/AuthContext";
import { useToast } from "@/store/ToastContext";
import { Cart, CartItemSchema, Order, OrderSchema } from "@/types";
import { privateRequest, publicRequest } from "@/utils/request";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const USER_ORDER_URL = "/orders";

export default function useUserOrder({ autoRun }: { autoRun?: boolean }) {
   const [orders, setOrders] = useState<Order[]>();
   const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
   const [apiLoading, setApiLoading] = useState(false);

   const ranEffect = useRef(false);

   const { auth } = useAuth();
   const { setErrorToast } = useToast();
   const navigate = useNavigate();
   const location = useLocation();

   const apiGetAllUserOrders = async () => {
      if (!auth?.username) throw new Error("auth is undefined");

      const res = await privateRequest.get(`${USER_ORDER_URL}?username=${auth.username}`);

      return res.data as Order[];
   };

   const getOrderDetail = async () => {
      try {
         if (!auth?.username) throw new Error("auth is undefined");

         const ordersData = await apiGetAllUserOrders();

         if (ordersData) {
            setOrders(ordersData);
         }

         setStatus("success");
      } catch (error) {
         console.log(error);
         setErrorToast();
         setStatus("error");
      }
   };

   const addNewOrder = async (order: OrderSchema) => {
      try {
         if (!auth?.username) throw new Error("auth is undefined");

         setApiLoading(true);
         await privateRequest.post(`${USER_ORDER_URL}`, order);
         setApiLoading(false);
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
         getOrderDetail();
      }
   }, [auth]);

   return {
      orders,
      apiLoading,
      status,
      getOrderDetail,
      addNewOrder,
   };
}
