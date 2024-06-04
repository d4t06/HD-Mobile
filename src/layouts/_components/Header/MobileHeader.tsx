import PushFrame from "@/components/ui/PushFrame";
import { useAuth } from "@/store/AuthContext";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";
import styles from "./HeaderMobile.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

type Props = {
   setIsOpenSidebar: Dispatch<SetStateAction<boolean>>;
   isOpenSidebar: boolean;
};

export default function MobileHeader({ setIsOpenSidebar, isOpenSidebar }: Props) {
   const { auth } = useAuth();
   const classes = {
      container: "relative justify-center items-center h-[50px] hidden max-[768px]:flex",
   };

   return (
      <>
         <div className={`${classes.container}`}>
            <div className="absolute left-0 translate-y-[2px]">
               <PushFrame type="translate">
                  <button
                     onClick={() => setIsOpenSidebar(!isOpenSidebar)}
                     className={cx("hamburger-menu", { open: isOpenSidebar })}
                  >
                     <span></span>
                     <span></span>
                     <span></span>
                  </button>
               </PushFrame>
            </div>

            <Link to={"/"}>
               <h1 className="text-[20px] font-[500]">
                  HD <span className="text-[#cd1818]">Mobile</span>
               </h1>
            </Link>

            {auth?.username && (
               <div className="absolute right-0 translate-y-[2px]">
                  <PushFrame type="translate">
                     <Link to={"/check-out"} className="block text-[#333] p-[2px]">
                        <ShoppingBagIcon className="w-[22px]" />
                     </Link>
                  </PushFrame>
               </div>
            )}
         </div>
      </>
   );
}
