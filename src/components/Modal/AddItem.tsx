import { Dispatch, FormEvent, SetStateAction, useEffect, useState, useRef } from "react";
//  import ModalHeader from "./ModalHeader";
import { Button } from "@/components";
import Input from "../ui/Input";

type Props = {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
   cb: (value: string) => void;
};

export default function AddItem({ setIsOpenModal }: Props) {
   const [value, setValue] = useState<string>("");
   const [error, setError] = useState(false);

   const inputRef = useRef<HTMLInputElement>(null);

   const handleAddPlaylist = async (e: FormEvent) => {
      e.preventDefault();
      if (error) return;
   };

   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   return (
      <div className="w-[300px] bg-[#fff]">
         {/* <ModalHeader setIsOpenModal={setIsOpenModal} title="Add playlist" /> */}
         <form action="" onSubmit={handleAddPlaylist}>
            <Input
               ref={inputRef}
               // className={`${
               //    error ? "border border-red-500" : ""
               // } px-[20px] rounded-full outline-none mt-[10px] text-[16px]  h-[35px] w-full`}
               placeholder="name..."
               value={value}
               cb={(value) => setValue(value)}
            />

            <p className="text-right mt-[20px]">
               <Button className={`bg-[#cd1818] rounded-full ${error ? "opacity-[.6] pointer-events-none" : ""}`}>
                  Save
               </Button>
            </p>
         </form>
      </div>
   );
}
