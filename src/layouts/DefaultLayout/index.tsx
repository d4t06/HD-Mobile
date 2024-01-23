import Footer from "./Footer";
import Header from "./Header";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import { ReactNode, useEffect, useRef } from "react";
import { ScrollTop } from "@/components";
import useAppConfig from "@/hooks/useAppConfig";
const cx = classNames.bind(styles);

type Props = {
   children: ReactNode;
};

export default function DefaultLayout({ children }: Props) {
   const { status, getCategories } = useAppConfig({});

   const ranUseEffect = useRef(false);

   useEffect(() => {
      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         console.log("default layout run get category");

         getCategories();
      }
   }, []);

   return (
      <div className={cx("app")}>
         <Header />
         <div className={cx("page-wrapper", "container")}>
            {status === "error" ? <h1 className="text-2xl">Something went wrong</h1> : children}
         </div>
         <ScrollTop />
         <Footer />
      </div>
   );
}
