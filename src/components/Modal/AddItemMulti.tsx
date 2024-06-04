import { FormEvent, useEffect, useState, useRef, useMemo, ReactNode } from "react";
import Input from "../ui/Input";
import ModalHeader from "./ModalHeader";
import { generateId } from "@/utils/appHelper";
import PushButton from "../ui/PushButton";

export type FieldType = (string | { label: string; placeholder: string })[];

type Props = {
   close: () => void;
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
}[] => {
   return fields.map((f) => {
      if (typeof f === "object")
         return {
            name: f.label,
            name_ascii: generateId(f.label),
            placeholder: f.placeholder,
         };

      return { name: f, name_ascii: generateId(f), placeholder: f };
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
   close,
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

   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   const handleInput = (value: string, name: string) => {
      setFieldData({ ...fieldData, [name]: value });
   };

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      cb(fieldData);
   };

   return (
      <div className="w-[300px] bg-[#fff]">
         <ModalHeader close={close} title={title} />
         <form action="" onSubmit={handleSubmit}>
            {inputFields.map((item, index) => (
               <div key={index} className=" mb-[15px]">
                  <label
                     className="font-semibold text-[16px] h-[30px] mb-[4px] flex items-end"
                     htmlFor={item.name_ascii}
                  >
                     {item.name}
                  </label>
                  <Input
                     key={index}
                     className="w-full"
                     ref={index === 0 ? inputRef : undefined}
                     id={item.name_ascii}
                     placeholder={item.placeholder}
                     value={fieldData[item.name_ascii]}
                     cb={(value) => handleInput(value, item.name_ascii)}
                  />
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
