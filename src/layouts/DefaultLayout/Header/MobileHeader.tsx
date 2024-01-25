import PushFrame from "@/components/ui/PushFrame";
import { Bars3Icon} from "@heroicons/react/16/solid";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
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
                     <Bars3Icon className="w-[22px]"/>
                  </button>
               </PushFrame>
            </div>

            <Link to={"/"}>
               <h1 className="text-[20px] font-[500]">
                  HD <span className="text-[#cd1818]">Mobile</span>
               </h1>
            </Link>

            <div className="absolute right-0 translate-y-[2px]">
               <PushFrame  type="translate">
                  <Link to={'/check-out'} className="block text-[#333] p-[2px]">
                     <ShoppingBagIcon className="w-[22px]" />
                  </Link>
               </PushFrame>
            </div>
         </div>
      </>
   );
}
