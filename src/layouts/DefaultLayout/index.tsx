import Header from "../_components/Header";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import { ReactNode, useEffect } from "react";
import { ScrollTop } from "@/components";
import useGetCategory from "@/hooks/useGetCategory";
import { useLocation } from "react-router-dom";
const cx = classNames.bind(styles);

type Props = {
   children: ReactNode;
};

export default function DefaultLayout({ children }: Props) {
   const location = useLocation();

   useGetCategory();

   useEffect(() => {
      window.scrollTo(0, 0);
   }, [location]);
   return (
      <div className={cx("app")}>
         <Header />
         <div className={cx("page-wrapper", "container mx-auto")}>{children}</div>
         <ScrollTop />
         {/*<Footer />*/}

         <div className="container mx-auto">
            <p className="pt-10 text-sm pb-5 text-center">
               Make with
               <img className="w-4 inline-block mx-1" src="./heart.png" />
               by <a className="underline" href="https://dat-nguyen.vercel.app/" target="_blank">Nguyen Huu Dat</a> <br />© 2025
            </p>
         </div>
      </div>
   );
}
