import { ReactNode, useState } from "react";
import ModalHeader from "./ModalHeader";
import { inputClasses } from "../ui/Input";
import { Button } from "..";

type Props = {
   status: "input" | "error" | "fetching" | "successful" | "finish";
   closeModal: () => void;
   children?: ReactNode;
   submit: (v: string) => void;
   title?: string;
};

export default function JsonInput({
   closeModal,
   status,
   children,
   submit,
   title,
}: Props) {
   const [value, setValue] = useState("");
   const [json, setJson] = useState<JSON>();

   const handleInputChange = (value: string) => {
      try {
         setValue(value);
         const json = JSON.parse(value);

         setJson(json);
      } catch (error) {
         setJson(undefined);
      }
   };

   return (
      <div className="w-[500px] max-w-[90vw]">
         <ModalHeader closeModal={closeModal} title={title || "Json import"} />

         {status === "input" && (
            <textarea
               value={value}
               placeholder="[ { } ]"
               onChange={(e) => handleInputChange(e.target.value)}
               className={`${inputClasses.input} min-h-[150px] ${
                  !json && value ? "border-red-500" : ""
               }`}
            />
         )}

         {children}

         {/* {status === "fetching" && json && (
            <div className="text-[#333]">
               <p className="text-xl font-[500]">
                  {(currentIndex || 0) + 1} of {json?.length}
               </p>
               <div className="flex justify-between mt-3">
                  <p className="font-[500] text-lg">
                     {json[currentIndex || 0].name}
                  </p>
                  <ArrowPathIcon className="w-6 animate-spin" />
               </div>
            </div>
         )} */}

         {status === "finish" && <p className="text-lg">Import successful</p>}

         <p className="text-left mt-3">
            {status === "input" && (
               <Button
                  disabled={!json || !value}
                  colors={"third"}
                  onClick={() => submit(value)}
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
