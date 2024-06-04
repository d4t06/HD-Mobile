
import { privateRequest } from "@/utils/request";
import { useEffect, useRef, useState } from "react";

const MANAGE_ORDER_URL = "/order-management";

type StateType = {
   orders: Order[];
   page_size: number;
   page: number;
   count: number;
};

export default function useManageOrder({
   currentTab,
}: {
   currentTab: Order["status"] | "";
}) {
   const [state, setState] = useState<StateType>();
   const [status, setStatus] = useState<"loading" | "error" | "success" | "more-loading">(
      "loading"
   );

   const prevTab = useRef<Order["status"] | "">("");

   const ranEffect = useRef(false);

   const getAllOrders = async ({
      page = 1,
      status,
      type,
   }: {
      page: number;
      status: Order["status"] | "";
      type: "replace" | "push";
   }) => {
      try {
         if (type === "push") setStatus("more-loading");
         else setStatus("loading");

         const ordersRes = await privateRequest.get(`${MANAGE_ORDER_URL}/orders`, {
            params: {
               page,
               status,
            },
         });

         const data = ordersRes.data as StateType;

         if (data) {
            switch (type) {
               case "replace":
                  setState(data);
                  break;
               case "push":
                  const { orders, ...rest } = data;
                  setState((prev) => {
                     if (!prev) return prev;
                     return {
                        ...prev,
                        ...rest,
                        orders: [...prev.orders, ...data.orders],
                     };
                  });
                  break;
            }
         }

         setStatus("success");
      } catch (error) {
         console.log(error);
         setStatus("error");
      }
   };

   useEffect(() => {
      if (!ranEffect.current) {
         ranEffect.current = true;
         getAllOrders({ page: 1, type: "replace", status: "" });
      }
   }, []);

   useEffect(() => {
      if (prevTab.current === currentTab) return;

      prevTab.current = currentTab;
      getAllOrders({ page: 1, type: "replace", status: currentTab });
   }, [currentTab]);

   return {
      state,
      status,
      getAllOrders,
   };
}
