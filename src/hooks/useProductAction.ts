import { useState } from "react";
import { usePrivateRequest } from ".";
import { useToast } from "@/store/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { selectedAllProduct } from "@/store";
import {
   addProduct,
   setProducts,
   updateProduct as updateProductList,
} from "@/store/productsSlice";
import { sleep } from "@/utils/appHelper";
import { updateProduct } from "@/store/productSlice";

type Props = {
   closeModal: () => void;
};

const URL = "/products";
const MANAGEMENT_PRO_URL = "/product-management";

export default function useProductAction({ closeModal }: Props) {
   const dispatch = useDispatch();
   const [isFetching, setIsFetching] = useState(false);

   // use hooks
   const { products } = useSelector(selectedAllProduct);
   const privateRequest = usePrivateRequest();
   const { setErrorToast, setSuccessToast } = useToast();

   type AddProduct = {
      variant: "Add";
      product: ProductSchema;
   };

   type DuplicateProduct = {
      variant: "Duplicate";
      product: Product;
   };

   type EditProductList = {
      variant: "Edit";
      product: Partial<ProductSchema>;
      index: number;
      productId: number;
      target: "list";
   };

   type EditProductDetail = {
      variant: "Edit";
      product: Partial<ProductSchema>;
      productId: number;
      target: "one";
   };

   const actions = async ({
      ...props
   }: AddProduct | EditProductList | EditProductDetail | DuplicateProduct) => {
      try {
         if (!props.product) throw new Error("Product data error");
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         switch (props.variant) {
            case "Add":
               const res = await privateRequest.post(`${URL}`, props.product);
               if (res.data.data)
                  dispatch(
                     setProducts({
                        variant: "insert",
                        payload: { products: [res.data.data] },
                     }),
                  );
               closeModal();

               break;

            case "Edit":
               const { product, productId, target } = props;

               await privateRequest.put(`${URL}/${productId}`, product);

               if (target === "list") {
                  dispatch(
                     updateProductList({
                        index: props.index,
                        product,
                     }),
                  );
               }
               if (target === "one") dispatch(updateProduct(product));

               closeModal();
               break;
            case "Duplicate": {
               const res = await privateRequest.get(
                  `${MANAGEMENT_PRO_URL}/duplicate/${props.product.id}`,
               );

               dispatch(addProduct([res.data.data]));
            }
         }
         setSuccessToast(`${props.variant} product successful`);
      } catch (error: any) {
         console.log({ message: error });

         if (error?.response?.status === 409) setErrorToast(`Product name already taken`);
         else setErrorToast(`${props.variant} product fail`);
      } finally {
         setIsFetching(false);
      }
   };

   const deleteProduct = async (id: number) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         await privateRequest.delete(`${URL}/${id}`);

         const newProducts = products.filter((p) => p.id !== id);
         dispatch(
            setProducts({
               payload: { products: newProducts },
               variant: "replace",
            }),
         );

         setSuccessToast(`Delete product successful`);
         closeModal();
      } catch (error) {
         console.log({ message: error });
         setErrorToast("Delete product fail");
      } finally {
         setIsFetching(false);
      }
   };

   return { isFetching, actions, deleteProduct };
}
