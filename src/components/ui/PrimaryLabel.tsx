import { ReactNode } from "react";

export default function PrimaryLabel({
   children,
   title,
   className,
}: {
   children?: ReactNode;
   title: string;
   className?: string;
}) {
   return (
      <div className={`flex items-center text-[#cd1818] space-x-[6px] ${className}`}>
         {children}
         <h1 className={`text-[20px] font-semibold text-[#cd1818]`}>{title}</h1>
      </div>
   );
}
