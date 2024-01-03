import Header from "./Header";
import DashboardSideBar from "./SideBar";
import classNames from "classnames/bind";
import styles from "./DashboardLayout.module.scss";
import { ReactNode } from "react";
import ToastPortal from "@/components/ToastPortal";
import UploadImagePortal from "@/components/UploadImagePortal";
import UploadImageProvider from "@/store/ImageContext";

const cx = classNames.bind(styles);

function DashboardLayout({ children }: { children: ReactNode }) {
   return (
      <UploadImageProvider>
         <div className="app">
            <Header />
            <DashboardSideBar />
            <div className={cx("dashboard_wrapper", "bg-[#f1f1f1]")}>{children}</div>

            <ToastPortal autoClose />
            <UploadImagePortal />
         </div>
      </UploadImageProvider>
   );
}

export default DashboardLayout;
