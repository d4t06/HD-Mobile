import { useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch } from "react-redux";
import { setVariant } from "@/store/productSlice";
import { sleep } from "@/utils/appHelper";

const URL = "/product-variants";

export default function useVariantAction() {
   const [isFetching, setIsFetching] = useState(false);
   const dispatch = useDispatch();

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   type Add = {
      type: "Add";
      variant: ProductVariantSchema;
   };

   type Edit = {
      type: "Edit";
      variant: ProductVariantSchema;
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
               const { variant } = props;

               const res = await privateRequest.post(URL, variant);
               const data = res.data.data as {
                  variant: ProductVariantDetail;
                  combines: ProductCombine[];
               };

               dispatch(
                  setVariant({
                     type: "add",
                     variant: data.variant,
                     combines: data.combines,
                  })
               );

               break;
            case "Edit": {
               const { variant, id, index } = props;
               await privateRequest.put(`${URL}/${id}`, variant);

               dispatch(setVariant({ type: "update", variant, index }));

               break;
            }

            case "Delete": {
               const { id, index } = props;

               await privateRequest.delete(`${URL}/${id}`);
               dispatch(setVariant({ type: "delete", index: index }));
            }
         }
         setSuccessToast(`${props.type} variant successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.type} variant fail`);
      } finally {
         setIsFetching(false);
      }
   };

   const sortAttribute = async () => {};

   return { isFetching, actions, sortAttribute };
}
