import { Button } from "@/components";
import ModalHeader from "@/components/Modal/ModalHeader";
import { inputClasses } from "@/components/ui/Input";
import { useToast } from "@/store/ToastContext";
import { privateRequest } from "@/utils/request";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { useState } from "react";
import useJsonImport from "../_hooks/useJsonImport";

type Props = {
   closeModal: () => void;
};

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

export default function JsonImport({ closeModal }: Props) {
   const [value, setValue] = useState("");
   const [jsonProducts, setJsonProducts] = useState<JsonProduct[]>();

   const { currentIndex, status, submit } = useJsonImport();

   const classes = {
      input: "min-h-[150px]",
   };

   const handleInputChange = (value: string) => {
      try {
         setValue(value);
         const json = JSON.parse(value);

         setJsonProducts(json);
      } catch (error) {
         setJsonProducts(undefined);
      }
   };

   const handleSubmit = async () => {
      await submit(value);

      setValue("");
      setJsonProducts(undefined);
   };

   return (
      <div className="w-[500px] max-w-[90vw]">
         <ModalHeader closeModal={closeModal} title="Json importer" />

         {status === "input" && (
            <textarea
               value={value}
               placeholder="[ { } ]"
               onChange={(e) => handleInputChange(e.target.value)}
               className={`${inputClasses.input} ${classes.input} ${
                  !jsonProducts && value ? "border-red-500" : ""
               }`}
            />
         )}

         {status === "fetching" && jsonProducts && (
            <div className="text-[#333]">
               <p className="text-xl font-[500]">
                  {(currentIndex || 0) + 1} of{" "}
                  <span className="text-[#cd1818]">{jsonProducts?.length}</span>
               </p>
               <div className="flex justify-between mt-3">
                  <p className="font-[500] text-lg">
                     {jsonProducts[currentIndex || 0].name}
                  </p>
                  <ArrowPathIcon className="w-6 animate-spin" />
               </div>
            </div>
         )}

         {status === "finish" && <p className="text-lg">Import successful</p>}

         <p className="text-left mt-3">
            {status === "input" && (
               <Button
                  disabled={!jsonProducts || !value}
                  colors={"third"}
                  onClick={handleSubmit}
               >
                  Submit
               </Button>
            )}

            {status === "finish" ||
               (status === "error" && (
                  <Button colors={"third"} onClick={closeModal}>
                     Close
                  </Button>
               ))}
         </p>
      </div>
   );
}
