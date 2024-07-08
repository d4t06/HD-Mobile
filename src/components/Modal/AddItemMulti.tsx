import {
   FormEvent,
   useEffect,
   useState,
   useRef,
   useMemo,
   ReactNode,
   HTMLAttributes,
} from "react";
import Input from "../ui/Input";
import ModalHeader from "./ModalHeader";
import { generateId, moneyFormat } from "@/utils/appHelper";
import PushButton from "../ui/PushButton";

export type FieldType = (
   | string
   | { label: string; placeholder: string; type?: "price" | "text" }
)[];

type Props = {
   closeModal: () => void;
   cb: ({}: Record<string, string>) => void;
   title: string;
   fields: FieldType;
   intiFieldData?: Record<string, string>;
   children?: ReactNode;
   loading: boolean;
};

const initState = (
   fields: Props["fields"]
): {
   name: string;
   name_ascii: string;
   placeholder: string;
   type: "price" | "text";
}[] => {
   return fields.map((f) => {
      if (typeof f === "object")
         return {
            name: f.label,
            name_ascii: generateId(f.label),
            placeholder: f.placeholder,
            type: f.type || "text",
         };

      return { name: f, name_ascii: generateId(f), placeholder: f, type: "text" };
   });
};

const intiFieldDataState = (inputFields: ReturnType<typeof initState>) => {
   let data: Record<string, string> = {};
   inputFields.forEach((item) => {
      data[item.name_ascii] = "";
   });

   return data;
};

export default function AddItemMulti({
   closeModal,
   cb,
   title,
   fields,
   loading,
   intiFieldData,
   children,
}: Props) {
   const inputFields = useMemo(() => {
      return initState(fields);
   }, [fields]);

   const [fieldData, setFieldData] = useState(
      intiFieldData || intiFieldDataState(inputFields)
   );

   const inputRef = useRef<HTMLInputElement>(null);

   const handleInput = (value: string, name: string) => {
      setFieldData({ ...fieldData, [name]: value });
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      cb(fieldData);
   };

   const priceInputProps: HTMLAttributes<HTMLInputElement> = {
      onBlur: (e) => {
         // handleInput(moneyFormat(fieldData[itemAscii]), itemAscii);
         e.target.value = e.target.value ? moneyFormat(e.target.value) : "";
      },
      onFocus: (e) => {
         e.target.value = e.target.value ? e.target.value.replaceAll(",", "") : "";
      },
   };

   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   return (
      <div className="w-[400px] max-w-[85vw] bg-[#fff]">
         <ModalHeader closeModal={closeModal} title={title} />
         <form action="" onSubmit={handleSubmit}>
            {inputFields.map((item, index) => (
               <div key={index} className="mb-[15px] space-y-[6px]">
                  <label
                     className="font-semibold"
                     htmlFor={item.name_ascii}
                  >
                     {item.name}
                  </label>
                  {item.type === "price" ? (
                     <Input
                        key={index}
                        className="w-full"
                        ref={index === 0 ? inputRef : undefined}
                        id={item.name_ascii}
                        placeholder={item.placeholder}
                        value={fieldData[item.name_ascii]}
                        cb={(value) =>
                           Number.isNaN(+value) ? {} : handleInput(value, item.name_ascii)
                        }
                        {...priceInputProps}
                     />
                  ) : (
                     <Input
                        key={index}
                        className="w-full"
                        ref={index === 0 ? inputRef : undefined}
                        id={item.name_ascii}
                        placeholder={item.placeholder}
                        value={fieldData[item.name_ascii]}
                        cb={(value) => handleInput(value, item.name_ascii)}
                     />
                  )}
               </div>
            ))}

            {children}

            <p className="text-right mt-[20px]">
               <PushButton loading={loading} type="submit">
                  Save
               </PushButton>
            </p>
         </form>
      </div>
   );
}
