import Header from "../_components/DashboardHeader";
import DashboardSideBar from "../_components/SideBar";
import { ReactNode, useRef } from "react";
import UploadImagePortal from "@/components/UploadImagePortal";
import UploadImageProvider from "@/store/ImageContext";
import useGetCategory from "@/hooks/useGetCategory";
import RatingContextProvider from "@/store/ratingContext";

function DashboardLayout({ children }: { children: ReactNode }) {
   const dashboardRef = useRef<HTMLDivElement>(null);

   // hooks
   useGetCategory();

   return (
      <UploadImageProvider>
         <RatingContextProvider>
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
         </RatingContextProvider>
      </UploadImageProvider>
   );
}

export default DashboardLayout;
