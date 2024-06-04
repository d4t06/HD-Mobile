import { useState } from "react";
import { usePrivateRequest } from ".";
import { useToast } from "@/store/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { selectedAllProduct } from "@/store";
import { setProducts, storingProducts } from "@/store/productsSlice";

type Props = {
   close: () => void;
};

const PRODUCT_URL = "/products";

export default function useProductAction({ close }: Props) {
   const dispatch = useDispatch();
   const [apiLoading, setApiLoading] = useState(false);

   // use hooks
   const {
      productState: { products },
   } = useSelector(selectedAllProduct);
   const privateRequest = usePrivateRequest();
   const { setErrorToast, setSuccessToast } = useToast();

   const updateProducts = (
      products: Product[],
      product: ProductSchema,
      index: number
   ) => {
      const newProducts = [...products];
      newProducts[index] = { ...newProducts[index], ...product };

      return newProducts;
   };

   type AddProduct = {
      type: "Add";
      product: ProductSchema;
   };

   type EditProduct = {
      type: "Edit";
      product: ProductSchema;
      currentIndex: number;
      product_id: number;
   };

   const addProduct = async ({ ...props }: AddProduct | EditProduct) => {
      try {
         if (!props.product) throw new Error("Product data error");

         switch (props.type) {
            case "Add":
               setApiLoading(true);
               const res = await privateRequest.post(`${PRODUCT_URL}`, props.product);

               // const newProductData = {
               //    ...res.data.data,
               //    colors_data: [],
               //    combines_data: [],
               // } as Product;

               dispatch(storingProducts({ products: [res.data.data] }));
               break;

            case "Edit":
               setApiLoading(true);
               const { currentIndex, product, product_id } = props;

               await privateRequest.put(
                  `${PRODUCT_URL}/products/${product_id}`,
                  product,
                  {
                     headers: { "Content-Type": "application/json" },
                  }
               );

               const newProductsUpdate: Product[] = updateProducts(
                  products,
                  product,
                  currentIndex
               );
               dispatch(setProducts({ products: newProductsUpdate }));
         }
         setSuccessToast(`${props.type} product successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.type} product fail`);
      } finally {
         setApiLoading(false);
         close();
      }
   };

   const deleteProduct = async (id: number | undefined, proName: string) => {
      try {
         if (id === undefined) throw new Error("Product data error");
         setApiLoading(true);

         await privateRequest.delete(`${PRODUCT_URL}/products/${id}`);
         // for await (const slider of product.sliders_data) {
         //    await privateRequest.delete(`${SLIDER_URL}/${slider.slider_data.id}`);
         // }

         const newProducts = products.filter((p) => p.id !== id);
         dispatch(setProducts({ products: newProducts }));
         setSuccessToast(`Delete '${proName}' successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast("Delete product fail");
      } finally {
         setApiLoading(false);
         close();
      }
   };

   return { apiLoading, addProduct, deleteProduct };
}
