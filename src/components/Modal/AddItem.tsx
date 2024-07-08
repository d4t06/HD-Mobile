import {
   FormEvent,
   useEffect,
   useState,
   useRef,
   ReactNode,
} from "react";
import Input, { inputClasses } from "../ui/Input";
import ModalHeader from "./ModalHeader";
import PushButton from "../ui/PushButton";

type Props = {
   closeModal: () => void;
   cbWhenSubmit: (value: string) => void;
   title: string;
   initValue?: string;
   children?: ReactNode;
   loading?: boolean;
   variant?: "input" | "text-area";
};

export default function AddItem({
   closeModal,
   cbWhenSubmit,
   title,
   initValue,
   loading,
   variant = "input",
   children,
}: Props) {
   const [value, setValue] = useState(initValue || "");
   const inputRef = useRef<HTMLInputElement>(null);

   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   const handleSubmit = (e: FormEvent) => {
      e.preventDefault();
      cbWhenSubmit(value);
   };

   return (
      <div className="w-[400px] max-w-[85vw] bg-[#fff]">
         <ModalHeader closeModal={closeModal} title={title} />
         <form action="" onSubmit={handleSubmit}>
            {variant === "input" && (
               <Input
                  className="w-full"
                  ref={inputRef}
                  placeholder="name..."
                  value={value}
                  cb={(value) => setValue(value)}
               />
            )}

            {variant === "text-area" && (
               <textarea
                  className={`${inputClasses.input} w-full min-h-[100px]`}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
               />
            )}

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
