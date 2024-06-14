import { Modal } from ".";
import { Link } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import useLogout from "@/hooks/useLogout";
import { ArchiveBoxIcon, TagIcon } from "@heroicons/react/24/outline";
import PushButton from "./ui/PushButton";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";

type Props = {
   isOpen: boolean;
   closeSidebar: () => void;
};

export default function Sidebar({ isOpen, closeSidebar }: Props) {
   const { categories } = useSelector(selectCategory);
   const { auth } = useAuth();

   const logout = useLogout();

   const singOut = async () => {
      await logout();
      closeSidebar();
   };

   const classes = {
      container: `fixed z-[299] top-[105px] left-0 bottom-0 w-[260px] max-w-[60vw] bg-[#fff] hidden max-[768px]:block transition-[transform, opacity] duration-[.3s]`,
      open: "translate-x-0 opacity-[1]",
      hide: "translate-x-[-100%] opacity-[.5]",
      closeBtn: "absolute right-[10px] top-[10px]",
   };

   return (
      <>
         <div className={`${classes.container} ${isOpen ? classes.open : classes.hide}`}>
            <ul className="py-[14px] px-[10px]">
               {categories.map((c, index) => !c.hidden && (
                  <Link
                     onClick={closeSidebar}
                     key={index}
                     to={`/${c.category_ascii}`}
                     className="flex items-center space-x-[4px] h-[34px] text-[#333]"
                  >
                     <TagIcon className="w-[24px]" />
                     <span className="text-[16px] font-[500]">{c.category}</span>
                  </Link>
               ))}

               {auth?.username && (
                  <Link
                     onClick={closeSidebar}
                     to={`/order`}
                     className="flex items-center  space-x-[4px] h-[34px] text-[#333]"
                  >
                     <ArchiveBoxIcon className="w-[24px]" />
                     <span className="text-[16px] font-[500]">My order</span>
                  </Link>
               )}
            </ul>

            <div className="text-center mt-auto absolute bottom-[30px] left-[50%] translate-x-[-50%]">
               {auth?.token ? (
                  <PushButton onClick={singOut}>Log out</PushButton>
               ) : (
                  <PushButton to="/login">Login</PushButton>
               )}
            </div>
         </div>

         {isOpen && <Modal closeModal={closeSidebar} />}
      </>
   );
}
