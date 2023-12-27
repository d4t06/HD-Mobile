import Footer from './Footer';
import Header from './Header';
import classNames from "classnames/bind";
import styles from "./DefaultLayout.module.scss";
import { ReactNode } from "react";
import {ScrollTop} from "@/components";
const cx = classNames.bind(styles);

type Props = {
   children: ReactNode;
};

function DefaultLayout({ children }: Props) {
   return (
      <div className={cx("app")}>
         <Header />
         <div className={cx("page-wrapper", "container")}>{children}</div>
         <ScrollTop />
         <Footer />
      </div>
   );
}

export default DefaultLayout;
