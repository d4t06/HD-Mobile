import { ReactNode, useEffect, useRef } from "react";
import Header from "./DefaultLayout/Header";
import useAppConfig from "@/hooks/useAppConfig";

export default function CheckoutLayout({ children }: { children: ReactNode }) {
   const { status, getCategories } = useAppConfig({});
   const ranUseEffect = useRef(false);

   const classes = {
      container: "container md:max-w-[800px] mx-auto !pb-[150px] !mt-[110px] md:!pb-[100px] md:!mt-[20px] px-[10px]",
   };

   useEffect(() => {
      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getCategories();
      }
   }, []);

   return (
      <div>
         <Header />
         <div className={classes.container}>
            {status === "error" ? (
               <h1 className="text-2xl">Something went wrong</h1>
            ) : (
               children
            )}
         </div>
      </div>
   );
}
