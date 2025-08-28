import { useAuth } from "@/store/AuthContext";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Avatar } from "@/components";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "./MobileHeader";
import { ShoppingBagIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import MyLink from "@/shares/components/MyLink";
const cx = classNames.bind(styles);

function Header() {
   const { auth } = useAuth();
   const [isOpenSidebar, setIsOpenSidebar] = useState(false);
   const [showSearchModal, setShowSearchModal] = useState(false);

   const closeSidebar = () => {
      setIsOpenSidebar(false);
      setShowSearchModal(false);
   };

   // use hooks
   const location = useLocation();
   const { categories, status } = useSelector(selectCategory);

   const renderCategories = useMemo(() => {
      if (!categories.length) return;
      return categories.map(
         (cat, index) =>
            !cat.hidden && (
               <MyLink
                  key={index}
                  className={cx("nav-item")}
                  activeClass={cx("active")}
                  to={`/${cat.name_ascii}`}
               >
                  {cat.name}
               </MyLink>
            ),
      );
   }, [categories, location, showSearchModal]);

   return (
      <>
         <div className={cx("header")}>
            {/*<div className={cx("header-banner")}>
               <img
                  src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2024/01/banner/Big-steak-1200-44-1200x44.png"
                  alt=""
               />
            </div>*/}
            <div className="container mx-auto relative">
               {/* mobile header */}
               <MobileHeader
                  isOpenSidebar={isOpenSidebar}
                  setIsOpenSidebar={setIsOpenSidebar}
               />

               <div className={cx("header-top")}>
                  <div className={cx("header-top-wrap")}>
                     <div className="left w-1/4 max-[768px]:hidden">
                        <div className="flex items-center">
                           <div className="bg-[#cd1818] flex-shrink-0 w-8 flex h-8 rounded-md justify-center items-center">
                              <span className="text-white text-xl font-bold translate-y-[1px]">
                                 :D
                              </span>
                           </div>
                           <span className="ml-2 font-bold">Dstore</span>
                        </div>
                     </div>
                     <Search variant="home" closeSidebar={closeSidebar} />

                     <div className="w-1/4 max-[768px]:hidden">
                        <Avatar />
                     </div>
                  </div>
               </div>
               <div className={cx("header-nav")}>
                  <div className={cx("header-nav-wrap")}>
                     {/* render categories */}
                     <div className={cx("nav-list")}>
                        {status === "success" && renderCategories}
                     </div>
                     <ul className={cx("nav-list")}>
                        {auth && (
                           <>
                              <li className={cx("nav-item")}>
                                 <Link to={"/check-out"}>
                                    <span className={cx("nav-text")}>Cart</span>
                                    <ShoppingBagIcon className="w-[24px]" />
                                 </Link>
                              </li>
                           </>
                        )}
                        {auth?.role === "ADMIN" && (
                           <li className={cx("nav-item")}>
                              <Link target="_blank" to={"/dashboard"}>
                                 <p className={cx("nav-text")}>Dashboard</p>
                                 <Cog6ToothIcon className="w-[24px]" />
                              </Link>
                           </li>
                        )}
                     </ul>
                  </div>
               </div>
            </div>
         </div>

         <Sidebar isOpen={isOpenSidebar} closeSidebar={closeSidebar} />
      </>
   );
}
export default Header;
