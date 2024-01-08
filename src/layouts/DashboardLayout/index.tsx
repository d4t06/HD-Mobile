import Header from "./Header";
import DashboardSideBar from "./SideBar";
import classNames from "classnames/bind";
import styles from "./DashboardLayout.module.scss";
import { ReactNode } from "react";
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

            <UploadImagePortal />
         </div>
      </UploadImageProvider>
   );
}

export default DashboardLayout;
