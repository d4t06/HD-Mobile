import { useState } from "react";
import { usePrivateRequest } from ".";
import { useToast } from "@/store/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { selectedAllProduct } from "@/store";
import { setProducts, storingProducts } from "@/store/productsSlice";
import { sleep } from "@/utils/appHelper";
import { updateProduct } from "@/store/productSlice";

type Props = {
   closeModal: () => void;
};

const URL = "/products";

export default function useProductAction({ closeModal }: Props) {
   const dispatch = useDispatch();
   const [isFetching, setIsFetching] = useState(false);

   // use hooks
   const {
      productState: { products },
   } = useSelector(selectedAllProduct);
   const privateRequest = usePrivateRequest();
   const { setErrorToast, setSuccessToast } = useToast();

   type AddProduct = {
      variant: "Add";
      product: ProductSchema;
   };

   type EditProductList = {
      variant: "Edit";
      product: Partial<ProductSchema>;
      index: number;
      productAscii: string;
      target: "list";
   };

   type EditProducDetail = {
      variant: "Edit";
      product: Partial<ProductSchema>;
      productAscii: string;
      target: "one";
   };

   const actions = async ({
      ...props
   }: AddProduct | EditProductList | EditProducDetail) => {
      try {
         if (!props.product) throw new Error("Product data error");
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         switch (props.variant) {
            case "Add":
               const res = await privateRequest.post(`${URL}`, props.product);
               dispatch(storingProducts({ products: [res.data.data] }));
               break;

            case "Edit":
               const { product, productAscii, target } = props;

               await privateRequest.put(`${URL}/${productAscii}`, product);

               if (target === "list") {
                  dispatch(
                     setProducts({ variant: "update", index: props.index, product })
                  );
               }
               if (target === "one") dispatch(updateProduct(product));
         }
         setSuccessToast(`${props.variant} product successful`);
         closeModal();
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.variant} product fail`);
      } finally {
         setIsFetching(false);
      }
   };

   const deleteProduct = async (productAscii: string) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         await privateRequest.delete(`${URL}/${productAscii}`);

         const newProducts = products.filter((p) => p.product_ascii !== productAscii);
         dispatch(setProducts({ products: newProducts, variant: "replace" }));

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
