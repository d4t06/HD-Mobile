import { Button } from "@/components";
import { HomeIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";

export default function LoginLayout({ children }: { children: ReactNode }) {
   const classes = {
      button: "!absolute z-[99] bottom-[15px] left-[15px] p-[6px]",
   };

   return (
      <div className="absolute inset-0">
         <div className="container mx-auto relative h-full">
            <Button colors={'third'} size={"clear"} to={"/"} className={`${classes.button}`}>
               <HomeIcon className="w-[22px]" />
            </Button>
            {children}
         </div>
      </div>
   );
}
