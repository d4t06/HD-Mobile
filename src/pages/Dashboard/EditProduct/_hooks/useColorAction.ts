import { useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch } from "react-redux";
import { setColor } from "@/store/productSlice";
import { sleep } from "@/utils/appHelper";

const URL = "/product-colors";

export default function useColorAction() {
   const [isFetching, setIsFetching] = useState(false);
   const dispatch = useDispatch();

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   type Add = {
      type: "Add";
      color: ProductColorSchema;
   };

   type Edit = {
      type: "Edit";
      color: ProductColorSchema;
      index: number;
      id: number;
   };

   type Delete = {
      type: "Delete";
      id: number;
      index: number;
   };

   type Props = Add | Edit | Delete;

   const actions = async ({ ...props }: Props) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         switch (props.type) {
            case "Add":
               const { color } = props;

               const res = await privateRequest.post(URL, color);
               const data = res.data.data as {
                  color: ProductColor;
                  combines: ProductCombine[];
               };

               dispatch(
                  setColor({ type: "add", color: data.color, combines: data.combines })
               );

               break;
            case "Edit": {
               const { color, id, index } = props;
               await privateRequest.put(`${URL}/${id}`, color);

               dispatch(setColor({ type: "update", color, index }));

               break;
            }

            case "Delete": {
               const { id, index } = props;

               await privateRequest.delete(`${URL}/${id}`);
               dispatch(setColor({ type: "delete", index: index }));
            }
         }
         setSuccessToast(`${props.type} color successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.type} color fail`);
      } finally {
         setIsFetching(false);
      }
   };

   return { isFetching, actions };
}
