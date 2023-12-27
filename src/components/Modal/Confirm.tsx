import {
   Dispatch,
   SetStateAction,
 } from "react";
 import { Button } from "@/components";
 
 type Props = {
   callback: () => void;
   label?: string;
   desc?: string;
   buttonLabel?: string;
   loading: boolean;
   className?: string;
   setOpenModal: Dispatch<SetStateAction<boolean>>;
 };
 
 export default function ConfirmModal({
   loading,
   callback,
   label,
   setOpenModal,
   buttonLabel,
 //   reserve,
   desc = "This action cannot be undone",
   className,
 //   children,
 }: Props) {
   return (
     <div
       className={`${className || "w-[400px] max-w-[calc(90vw-40px)]"} ${
         loading ? "opacity-60 pointer-events-none" : ""
       }`}
     >
       <h1 className="text-[20px] font-semibold">{label || "Wait a minute"}</h1>
       {desc && (
         <p className=" text-[16px] font-semibold text-red-500">{desc}</p>
       )}
 
       <div className="flex gap-[10px] mt-[20px]">
         <Button
           onClick={() => setOpenModal(false)}
           className={`bg-[#cd1818] rounded-full text-[14px]`}
         >
           Close
         </Button>
         <Button
           loading={loading}
           className={` text-[#fff] bg-red-500 rounded-full text-[14px] font-bold`}
           onClick={callback}
         >
           {buttonLabel || "Yes please"}
         </Button>
         {/* {children && isValidElement(children) && (
           <>
             {cloneElement(children, {
               ...children.props,
               className: `${theme.content_bg} rounded-full text-[14px]`,
             })}
           </>
         )} */}
       </div>
     </div>
   );
 }
 