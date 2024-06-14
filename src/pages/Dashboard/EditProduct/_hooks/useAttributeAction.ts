import { useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch } from "react-redux";
import { setAttribute } from "@/store/productSlice";
import { sleep } from "@/utils/appHelper";

const URL = "/product-attributes";

export default function useAttributeAction() {
   const [isFetching, setIsFetching] = useState(false);
   const dispatch = useDispatch();

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   type Edit = {
      type: "Edit";
      attribute: ProductAttributeSchema;
      index: number;
      id: number;
   };

   type Add = {
      type: "Add";
      attribute: ProductAttributeSchema;
   };

   const actions = async ({ ...props }: Add | Edit) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         switch (props.type) {
            case "Edit":
               const { attribute, id, index } = props;
               await privateRequest.put(`${URL}/${id}`, attribute);

               dispatch(setAttribute({ type: "update", attribute, index }));
               break;
            case "Add":
               const res = await privateRequest.post(URL, props.attribute);
               dispatch(setAttribute({ type: "add", attribute: res.data.data }));
            // break;
         }

         setSuccessToast(`${props.type} Update attribute successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`Update attribute fail`);
      } finally {
         setIsFetching(false);
      }
   };

   return { isFetching, actions };
}
