import Footer from "./Footer";
import Header from "./Header";
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import { ReactNode } from "react";
import { ScrollTop } from "@/components";
import useAppConfig from "@/hooks/useAppConfig";
const cx = classNames.bind(styles);

type Props = {
   children: ReactNode;
};

export default function DefaultLayout({ children }: Props) {
   const { status } = useAppConfig({ autoRun: true });

   return (
      <div className={cx("app")}>
         <Header />
         <div className={cx("page-wrapper", "container")}>
            {status === "error" ? <h1 className="text-2xl">Something went wrong</h1> : children}
         </div>
         <ScrollTop />
         <Footer />

         <div className="container">
            <p className="py-[10px] text-[14px] text-[#333] font-[500]">
               Make with ❤️ by d4t06 <br/>
               © All rights no reserved ¯\_(ツ)_/¯ 
            </p>
         </div>
      </div>
   );
}
