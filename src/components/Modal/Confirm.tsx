import { Button } from "@/components";
import { ReactNode } from "react";

type Props = {
   callback: () => void;
   label?: string;
   desc?: string;
   buttonLabel?: string;
   loading: boolean;
   className?: string;
   closeModal: () => void;
   children?: ReactNode;
};

export default function ConfirmModal({
   loading,
   callback,
   label,
   closeModal,
   buttonLabel,
   desc = "This action cannot be undone",
   children,
   className,
}: Props) {
   return (
      <div
         className={`${className || "w-[400px] max-w-[calc(90vw-40px)]"} ${
            loading ? "opacity-60 pointer-events-none" : ""
         }`}
      >
         {children}
         
         <h1 className="text-[20px] font-semibold">{label || "Wait a minute"}</h1>
         {desc && <p className=" text-[16px] font-semibold text-red-500">{desc}</p>}

         <div className="flex gap-[10px] mt-[20px]">
            <Button colors="second" onClick={closeModal}>
               Close
            </Button>
            <Button colors={"third"} loading={loading} onClick={callback}>
               {buttonLabel || "Yes please"}
            </Button>
         </div>
      </div>
   );
}
