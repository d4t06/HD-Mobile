import { useToast } from "@/store/ToastContext";
import { storingProducts } from "@/store/productsSlice";
import { privateRequest } from "@/utils/request";
import { useState } from "react";
import { useDispatch } from "react-redux";

type JsonProduct = {
   name: string;
   category_id: number;
   brand_id: number;
   colors: string[];
   variants: string[];
   attributes: { category_attribute_id: number; value: string }[];
   image: string;
   sliders: string[];
};

const IMPORT_URL = "/product-management/json-import";

export default function useJsonImport() {
   const dispatch = useDispatch();

   const [status, setStatus] = useState<
      "input" | "fetching" | "error" | "finish"
   >("input");
   const [currentIndex, setCurrentIndex] = useState(0);

   const { setErrorToast, setSuccessToast } = useToast();

   const submit = async (value: string) => {
      try {
         setStatus("fetching");

         const json: JsonProduct[] = JSON.parse(value);

         let counter = 0;
         const products: Product[] = [];
         for (const jsonProduct of json) {
            setCurrentIndex(counter);

            const res = await privateRequest.post(IMPORT_URL, {
               data: jsonProduct,
            });

            if (res.data.data) products.push(res.data.data);

            counter++;
         }

         dispatch(storingProducts({ products }));

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
   };
}
