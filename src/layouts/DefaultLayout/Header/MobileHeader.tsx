import PushFrame from "@/components/ui/PushFrame";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

type Props = {
   setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
};

export default function MobileHeader({ setIsOpenSidebar }: Props) {
   const classes = {
      container: "relative justify-center items-center h-[50px] hidden max-[768px]:flex",
   };

   return (
      <>
         <div className={`${classes.container}`}>
            <div className="absolute left-0 translate-y-[2px]">
               <PushFrame  type="translate">
                  <button onClick={() => setIsOpenSidebar(true)} className="block text-[#333] p-[2px]">
                     <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-[22px]"
                     >
                        <path
                           strokeLinecap="round"
                           strokeLinejoin="round"
                           d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                        />
                     </svg>
                  </button>
               </PushFrame>
            </div>

            <Link to={"/"}>
               <h1 className="text-[20px] font-[500]">
                  HD <span className="text-[#cd1818]">Mobile</span>
               </h1>
            </Link>
         </div>
      </>
   );
}
