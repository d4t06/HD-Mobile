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
      if (!categories.length) return <h1>Not category found</h1>;
      return categories.map(
         (cat, index) =>
            !cat.hidden && (
               <li
                  key={index}
                  className={cx("nav-item", {
                     active:
                        !showSearchModal &&
                        location.pathname === `/${cat.category_ascii}`,
                  })}
               >
                  <Link to={`/${cat.category_ascii}`}>
                     <p className={cx("nav-text")}>{cat.category}</p>
                  </Link>
               </li>
            )
      );
   }, [categories, location, showSearchModal]);

   return (
      <>
         <div className={cx("header")}>
            <div className={cx("header-banner")}>
               <img
                  src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2024/01/banner/Big-steak-1200-44-1200x44.png"
                  alt=""
               />
            </div>
            <div className="container mx-auto relative">
               {/* mobile header */}
               <MobileHeader
                  isOpenSidebar={isOpenSidebar}
                  setIsOpenSidebar={setIsOpenSidebar}
               />

               <div className={cx("header-top")}>
                  <div className={cx("header-top-wrap")}>
                     <div className="left w-1/4 max-[768px]:hidden">
                        <Link className={cx("brand")} to={"/"}>
                           HD <span className="text-[#cd1818]">Mobile</span>
                        </Link>
                     </div>
                     <Search variant="home" closeSidebar={closeSidebar} />

                     <div className="w-1/4 max-[768px]:hidden">
                        <Avatar revert />
                     </div>
                  </div>
               </div>
               <div className={cx("header-nav")}>
                  <div className={cx("header-nav-wrap")}>
                     {/* render categories */}
                     <ul className={cx("nav-list")}>
                        {status === "success" && renderCategories}
                     </ul>
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
                              <Link to={"/dashboard"}>
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
