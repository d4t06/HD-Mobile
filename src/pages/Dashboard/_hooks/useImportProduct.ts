import { setProducts } from "@/store/productsSlice";
import { useToast } from "@/store/ToastContext";
import { privateRequest } from "@/utils/request";
import { useState } from "react";
import { useDispatch } from "react-redux";

const IMPORT_URL = "/product-management/json-import";

export default function useImportProduct() {
   const dispatch = useDispatch();

   const [status, setStatus] = useState<"input" | "fetching" | "error" | "finish">(
      "input",
   );
   const [currentIndex, setCurrentIndex] = useState(0);

   const { setErrorToast, setSuccessToast } = useToast();

   const submit = async (value: string) => {
      try {
         setStatus("fetching");

         const json = JSON.parse(value);

         let products: Product[] = [];
         for (let i = 0; i < json.length; i++) {
            const ele = json[i];
            setCurrentIndex(i);

            const res = await privateRequest.post(IMPORT_URL, {
               data: ele,
            });

            const newProduct: Product = res.data.data;
            if (newProduct) {
               products = [newProduct, ...products];
            }
         }

         dispatch(setProducts({ variant: "insert", payload: { products } }));

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
