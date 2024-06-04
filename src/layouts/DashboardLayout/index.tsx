import Header from "../_components/DashboardHeader";
import DashboardSideBar from "../_components/SideBar";
import classNames from "classnames/bind";
import styles from "./DashboardLayout.module.scss";
import { ReactNode, useRef } from "react";
import UploadImagePortal from "@/components/UploadImagePortal";
import UploadImageProvider from "@/store/ImageContext";
import useGetCategory from "@/hooks/useGetCategory";

const cx = classNames.bind(styles);

function DashboardLayout({ children }: { children: ReactNode }) {
   const dashboardRef = useRef<HTMLDivElement>(null);

   // hooks
   useGetCategory();

   return (
      <UploadImageProvider>
         <div className="app">
            <div className="flex flex-nowrap overflow-hidden h-[100vh]">
               <DashboardSideBar />
               <div className="relative flex-grow overflow-hidden">
                  <Header dashboardRef={dashboardRef} />
                  <div
                     ref={dashboardRef}
                     className={cx("dashboard_wrapper", "no-scrollbar")}
                  >
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
