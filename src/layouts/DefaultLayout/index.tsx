import Footer from "../_components/Footer";
import Header from "../_components/Header";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import { ReactNode } from "react";
import { ScrollTop } from "@/components";
import useGetCategory from "@/hooks/useGetCategory";
const cx = classNames.bind(styles);

type Props = {
   children: ReactNode;
};

export default function DefaultLayout({ children }: Props) {
   useGetCategory();

   return (
      <div className={cx("app")}>
         <Header />
         <div className={cx("page-wrapper", "container mx-auto")}>{children}</div>
         <ScrollTop />
         <Footer />

         <div className="container mx-auto">
            <p className="py-[10px] text-[14px] text-[#333] font-[500]">
               Make with ❤️ by Nguyen Huu Dat <br />© All rights no reserve ¯\_(ツ)_/¯
            </p>
         </div>
      </div>
   );
}
