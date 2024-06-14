import { ReactNode } from "react";

type Props = {
   children: ReactNode;
   className?: string;
};

export default function Title({ children, className }: Props) {
   return (
      <div
         className={`flex space-x-[8px] items-center text-[#cd1818] text-[20px] leading-[1.2]  font-[500] ${
            className || ""
         }`}
      >
         {children}
      </div>
   );
}
