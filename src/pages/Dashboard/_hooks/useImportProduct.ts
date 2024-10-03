import { setProducts } from "@/store/productsSlice";
import { useToast } from "@/store/ToastContext";
import { privateRequest } from "@/utils/request";
import { useState } from "react";
import { useDispatch } from "react-redux";

const IMPORT_URL = "/product-management/json-import";

export default function useImportProduct() {
   const dispatch = useDispatch();

   const [status, setStatus] = useState<
      "input" | "fetching" | "error" | "finish"
   >("input");
   const [currentIndex, setCurrentIndex] = useState(0);

   const { setErrorToast, setSuccessToast } = useToast();

   const submit = async (value: string) => {
      try {
         setStatus("fetching");

         const json = JSON.parse(value);

         let counter = 0;
         const products: Product[] = [];
         for (const jsonProduct of json) {
            setCurrentIndex(counter);

            const res = await privateRequest.post(IMPORT_URL, {
               data: jsonProduct,
            });

            const newProduct: Product = res.data.data;
            if (newProduct) products.push(res.data.data);

            counter++;
         }

         dispatch(setProducts({ variant: "storing", payload: { products } }));

         setStatus("finish");

         setSuccessToast("Import product successful");
      } catch (error) {
         console.log(error);

         setStatus("error");
         setErrorToast("");
      }
   };

   return {
      status,
      submit,
      currentIndex,
      setStatus,
   };
}
