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
            <div className="flex flex-nowrap overflow-hidden h-[100vh]">
               <DashboardSideBar />
               <div className="relative flex-grow overflow-hidden">
                  <Header />
                  <div className={cx("dashboard_wrapper", "no-scrollbar")}>
                     {children}
                  </div>
               </div>
            </div>

            <UploadImagePortal />
         </div>
      </UploadImageProvider>
   );
}

export default DashboardLayout;
