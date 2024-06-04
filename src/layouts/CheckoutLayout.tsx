import { ReactNode } from "react";
import Header from "./_components/Header";
import useGetCategory from "@/hooks/useGetCategory";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
   useGetCategory({ autoRun: true });

   const classes = {
      container:
         "container md:max-w-[800px] mx-auto !pb-[150px] !mt-[110px] md:!pb-[100px] md:!mt-[20px] px-[10px]",
   };

   return (
      <div>
         <Header />
         <div className={classes.container}>{children}</div>
      </div>
   );
}
