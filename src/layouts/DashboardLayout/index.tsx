import Header from "../_components/DashboardHeader";
import DashboardSideBar from "../_components/SideBar";
import { ReactNode, useRef } from "react";
import UploadImagePortal from "@/components/UploadImagePortal";
import UploadImageProvider from "@/store/ImageContext";
import useGetCategory from "@/hooks/useGetCategory";

function DashboardLayout({ children }: { children: ReactNode }) {
   const dashboardRef = useRef<HTMLDivElement>(null);

   // hooks
   useGetCategory();

   // useEffect(() => {
   //    const isOnMobile = window.innerWidth < 768;

   //    const handleResize = () => {
   //       const contentEle = dashboardRef.current as HTMLDivElement;
   //       contentEle.style.maxHeight = window.innerHeight + "px";
   //    };

   //    if (isOnMobile) {
   //       window.addEventListener("resize", handleResize);
   //    }

   //    return () => {
   //       window.removeEventListener("resize", handleResize);
   //    };
   // }, []);

   return (
      <UploadImageProvider>
         <div className="app">
            <div className="flex flex-nowrap fixed top-0 bottom-0 w-full overflow-hidden">
               <DashboardSideBar />
               <div className="relative flex-grow overflow-hidden flex flex-col">
                  <Header dashboardRef={dashboardRef} />

                  <div
                     ref={dashboardRef}
                     className="dashboard-content flex-grow overflow-auto no-scrollbar bg-[#f1f1f1] p-[15px] sm:p-[30px] !pt-[60px]"
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
