import { ReactNode } from "react";

type Props = {
   children: ReactNode;
   rounded?: string;
   type?: "border" | "translate";
   active?: boolean;
   className?: string;
};

export default function PushFrame({
   children,
   active,
   rounded = "rounded-[8px]",
   type = "border",
   className,
}: Props) {
   if (type === "border")
      return (
         <div className="bg-[#e1e1e1] p-[2px] pb-[6px] rounded-[14px] ">
            <div className={`bg-[#fff] rounded-[12px] overflow-hidden p-[10px] ${className}`}>
               {children}
            </div>
         </div>
      );

   return (
      <div className={`bg-[#e1e1e1] ${rounded}`}>
         <div
            className={`bg-[#fff] active:translate-y-[-1px] transition-transform border-[2px] border-[#ccc] ${rounded} translate-y-[-4px] ${
               active ? "!translate-y-[-2px]" : ""
            }`}
         >
            {children}
         </div>
      </div>
   );
}
