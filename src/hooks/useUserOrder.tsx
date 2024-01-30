import { useAuth } from "@/store/AuthContext";
import { useToast } from "@/store/ToastContext";
import { Order, OrderSchema } from "@/types";
import { privateRequest } from "@/utils/request";
import { useEffect, useRef, useState } from "react";

const USER_ORDER_URL = "/orders";

type Props = { autoRun?: boolean; id?: string };

export default function useUserOrder({ autoRun = false, id }: Props) {
   const [orders, setOrders] = useState<Order[]>();
   const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
   const [apiLoading, setApiLoading] = useState(false);
   const [orderDetail, setOrderDetail] = useState<Order>();

   const ranEffect = useRef(false);

   const { auth } = useAuth();
   const { setErrorToast } = useToast();

   const apiGetAllUserOrders = async () => {
      if (!auth?.username) throw new Error("auth is undefined");

      const res = await privateRequest.get(`${USER_ORDER_URL}?username=${auth.username}`);

      return res.data as Order[];
   };

   // const apiGetOrderDetail = async () => {
   //    if (!auth?.username || !id || Number.isNaN(+id)) throw new Error("auth is undefined or is wrong");
   //    const res = await privateRequest.get(`${USER_ORDER_URL}/${+id}`);

   //    return res.data as Order;
   // };

   const getAllUserOrders = async () => {
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

   const getOrderDetail = async () => {
      try {
         if (!auth?.username || !id || Number.isNaN(+id)) throw new Error("auth is undefined or is wrong");
         const res = await privateRequest.get(`${USER_ORDER_URL}/${+id}`);

         if (res.data) {
            setOrderDetail(res.data);
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
         getAllUserOrders();
      }
   }, [auth]);

   useEffect(() => {
      if (id) {
         if (!ranEffect.current) {
            ranEffect.current = true;
            getOrderDetail();
         }
      }
   }, [id]);

   return {
      orders,
      orderDetail,
      apiLoading,
      status,
      getAllUserOrders,
      addNewOrder,
   };
}
