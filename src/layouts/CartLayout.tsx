import { ReactNode } from "react";
import Header from "./_components/Header";
import useGetCategory from "@/hooks/useGetCategory";

export default function CartLayout({ children }: { children: ReactNode }) {
   useGetCategory();

   const classes = {
      container:
         "container lg:max-w-[800px] mx-auto pb-[200px] mt-[110px] md:pb-[160px] md:mt-[20px]",
   };

   return (
      <div>
         <Header />
         <div className={classes.container}>{children}</div>
      </div>
   );
}
