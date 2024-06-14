import { useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch } from "react-redux";
import { setPriceRanges } from "@/store/categorySlice";
import { sleep } from "@/utils/appHelper";

const URL = "/category-price-ranges";

export default function usePriceRangeActions() {
   const dispatch = useDispatch();
   const [isFetching, setIsFetching] = useState(false);

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   type Add = {
      type: "Add";
      priceRange: PriceRangeSchema;
      categoryIndex: number;
   };

   type Edit = {
      type: "Edit";
      priceRange: PriceRangeSchema;
      index: number;
      categoryIndex: number;
      id: number;
   };

   type Delete = {
      type: "Delete";
      categoryIndex: number;
      id: number;
      index: number;
   };

   type Props = Add | Edit | Delete;

   const actions = async ({ ...props }: Props) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(5000);

         switch (props.type) {
            case "Add":
               const { priceRange, categoryIndex } = props;
               const res = await privateRequest.post(`${URL}`, priceRange);

               dispatch(
                  setPriceRanges({
                     type: "add",
                     categoryIndex,
                     priceRange: res.data.data,
                  })
               );

               break;
            case "Edit": {
               const { priceRange, id, categoryIndex, index } = props;
               await privateRequest.put(`${URL}/${id}`, priceRange);
               dispatch(
                  setPriceRanges({ type: "update", categoryIndex, index, priceRange })
               );

               break;
            }

            case "Delete": {
               const { id, categoryIndex, index } = props;
               await privateRequest.delete(`${URL}/${id}`);

               dispatch(setPriceRanges({ type: "delete", categoryIndex, index }));
            }
         }
         setSuccessToast(`${props.type} price range successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.type} price range fail`);
      } finally {
         setIsFetching(false);
      }
   };

   return { isFetching, actions };
}
