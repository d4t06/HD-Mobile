import { useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch } from "react-redux";
import { setBrand } from "@/store/categorySlice";

const URL = "/category-brands";

export default function useBrandAction() {
   const [isFetching, setIsFetching] = useState(false);
   const dispatch = useDispatch();

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   type Add = {
      type: "Add";
      brand: BrandSchema;
      categoryIndex: number;
   };

   type Edit = {
      type: "Edit";
      brand: BrandSchema;
      categoryIndex: number;
      index: number;
      id: number;
   };

   type Delete = {
      type: "Delete";
      id: number;
      categoryIndex: number;
      index: number;
   };

   type Props = Add | Edit | Delete;

   const actions = async ({ ...props }: Props) => {
      try {
         switch (props.type) {
            case "Add":
               const { brand, categoryIndex } = props;

               const res = await privateRequest.post(URL, brand);
               dispatch(setBrand({ categoryIndex, brand: res.data.data, type: "add" }));

               break;
            case "Edit": {
               const { brand, id, index, categoryIndex } = props;
               await privateRequest.put(`${URL}/${id}`, brand);

               dispatch(setBrand({ type: "update", brand, categoryIndex, index: index }));

               break;
            }

            case "Delete": {
               const { id, index, categoryIndex } = props;

               await privateRequest.delete(`${URL}/${id}`);
               dispatch(setBrand({ type: "delete", categoryIndex, index: index }));
            }
         }
         setSuccessToast(`${props.type} brand successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.type} brand fail`);
      } finally {
         setIsFetching(false);
         close();
      }
   };

   const sortAttribute = async () => {};

   return { isFetching, actions, sortAttribute };
}
