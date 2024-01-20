import { Product, ProductSchema } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { usePrivateRequest } from ".";
import { useToast } from "@/store/ToastContext";
import { useDispatch, useSelector } from "react-redux";
import { selectedAllProduct } from "@/store";
import { setProducts, storingProducts } from "@/store/productsSlice";

type Props = {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
};

const PRODUCT_URL = "/product-management/products";
// const SLIDER_URL = "/slider-management/sliders";

export default function useProductAction({ setIsOpenModal }: Props) {
   const dispatch = useDispatch();
   const [apiLoading, setApiLoading] = useState(false);

   // use hooks
   const {
      productState: { products },
   } = useSelector(selectedAllProduct);
   const privateRequest = usePrivateRequest();
   const { setErrorToast, setSuccessToast } = useToast();

   const updateProducts = (products: Product[], product: Product, index: number) => {
      const newProducts = [...products];
      newProducts[index] = { ...newProducts[index], ...product };

      return newProducts;
   };

   const addProduct = async (type: "Edit" | "Add", product: ProductSchema & { curIndex?: number; id?: number }) => {
      try {
         if (!product) throw new Error("Product data error");

         switch (type) {
            case "Add":
               setApiLoading(true);
               const res = await privateRequest.post(PRODUCT_URL, product, {
                  headers: { "Content-Type": "application/json" },
               });

               const newProductData = {
                  ...res.data.data,
                  colors_data: [],
                  combines_data: [],
               } as Product;

               return dispatch(storingProducts({ products: [newProductData] }));

            case "Edit":
               if (product.curIndex === undefined || product.id === undefined) throw new Error("No have product index");
               setApiLoading(true);
               const { curIndex, id, ...productProps } = product;

               await privateRequest.put(`${PRODUCT_URL}/${id}`, productProps, {
                  headers: { "Content-Type": "application/json" },
               });

               const newProductsUpdate: Product[] = updateProducts(products, productProps as Product, curIndex);

               dispatch(setProducts({ products: newProductsUpdate }));
               break;
         }

         setSuccessToast(`${type} product successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${type} product fail`);
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const deleteProduct = async (id: number | undefined, proName: string) => {
      try {
         if (id === undefined) throw new Error("Product data error");
         setApiLoading(true);

         await privateRequest.delete(`/product-management/products/${id}`);
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
         setIsOpenModal(false);
      }
   };

   return { apiLoading, addProduct, deleteProduct };
}
