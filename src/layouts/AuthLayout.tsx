import { Button } from "@/components";
import { HomeIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export default function LoginLayout({ children }: { children: ReactNode }) {
   const classes = {
      button:
         "!absolute z-[99] bottom-[15px] left-[15px] p-[6px]",
   };

   const location = useLocation();
   const from = location?.state?.from || "/";

   return (
      <div className="absolute inset-0">
         <div className="container mx-auto relative h-full">
            <Button size={'clear'} to={from || "/"} className={`${classes.button}`}>
               <HomeIcon className="w-[22px]" />
            </Button>
            {children}
         </div>
      </div>
   );
}
