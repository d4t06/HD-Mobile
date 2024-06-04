import {
   FormEvent,
   useEffect,
   useState,
   useRef,
   ReactNode,
} from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ModalHeader from "./ModalHeader";
import PushButton from "../ui/PushButton";

type Props = {
   close: () => void;
   cbWhenSubmit: (value: string) => void;
   title: string;
   initValue?: string;
   children?: ReactNode;
   loading?: boolean;
};

export default function AddItem({
   close,
   cbWhenSubmit,
   title,
   initValue,
   loading,
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
      <div className="w-[400px] bg-[#fff]">
         <ModalHeader close={close} title={title} />
         <form action="" onSubmit={handleSubmit}>
            <Input
               className="w-full"
               ref={inputRef}
               placeholder="name..."
               value={value}
               cb={(value) => setValue(value)}
            />

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
