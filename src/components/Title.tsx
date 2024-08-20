import { ReactNode } from "react";

type Props = {
   children: ReactNode;
   className?: string;
};

export default function Title({ children, className }: Props) {
   return (
      <div
         className={`flex space-x-2 items-center text-[#cd1818] text-xl font-[500] ${
            className || ""
         }`}
      >
         {children}
      </div>
   );
}
