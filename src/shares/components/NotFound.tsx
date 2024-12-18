import { ReactNode } from "react";
import simonCat from "@/assets/images/not-found.png";

export default function NotFound({ children }: { children?: ReactNode }) {
   return (
      <div className="text-center space-y-2 text-[#3f3f3f] font-medium w-full">
         <img src={simonCat} className="w-auto h-auto mx-auto" alt="" />
         {children || <p>No result found, ¯\_(ツ)_/¯</p>}
      </div>
   );
}
