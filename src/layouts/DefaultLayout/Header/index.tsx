import { useAuth } from "@/store/AuthContext";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Modal, Avatar } from "@/components";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { useApp } from "@/store/AppContext";
import Sidebar from "@/components/Sidebar";
import MobileHeader from "./MobileHeader";
import { Cog6ToothIcon } from "@heroicons/react/16/solid";
import { ArchiveBoxIcon, ShoppingBagIcon } from "@heroicons/react/24/outline";
const cx = classNames.bind(styles);

function Header() {
   const { auth } = useAuth();
   const [isOpenSidebar, setIsOpenSidebar] = useState(false);
   const [showModal, setShowModal] = useState(false);

   // use hooks
   const location = useLocation();
   const { categories, initLoading } = useApp();

   const renderCategories = useMemo(() => {
      if (!categories.length) return <h1>Not category found</h1>;
      return categories.map((cat, index) => (
         <li
            key={index}
            className={cx("nav-item", {
               active: !showModal && location.pathname === `/${cat.category_ascii}`,
            })}
         >
            <Link to={`/${cat.category_ascii}`}>
               <i className="material-icons">{cat.icon}</i>
               <p className={cx("nav-text")}>{cat.category_name}</p>
            </Link>
         </li>
      ));
   }, [categories, location, showModal]);

   return (
      <>
         <div className={cx("header")}>
            <div className={cx("header-banner")}>
               <img
                  src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2024/01/banner/Big-steak-1200-44-1200x44.png"
                  alt=""
               />
            </div>
            <div className="container">
               {/* mobile header */}
               <MobileHeader setIsOpenSidebar={setIsOpenSidebar} />

               <div className={cx("header-top")}>
                  <div className={cx("header-top-wrap")}>
                     <div className="left w-1/4 max-[768px]:hidden">
                        <Link className={cx("brand")} to={"/"}>
                           HD <span className="text-[#cd1818]">Mobile</span>
                        </Link>
                     </div>
                     <Search setShowModal={setShowModal} />

                     <div className="w-1/4 max-[768px]:hidden">
                        <Avatar revert />
                     </div>
                  </div>
               </div>
               <div className={cx("header-nav")}>
                  <div className={cx("header-nav-wrap")}>
                     {/* render categories */}
                     <ul className={cx("nav-list")}>
                        {!initLoading && renderCategories}
                     </ul>
                     <ul className={cx("nav-list")}>
                        {auth?.username && (
                           <>
                              <li className={cx("nav-item")}>
                                 <Link to={"/check-out"}>
                                    <span className={cx("nav-text")}>Cart</span>
                                    <ShoppingBagIcon className="w-[24px]" />
                                 </Link>
                              </li>

                              <li className={cx("nav-item")}>
                                 <Link to={"/order"}>
                                    <span className={cx("nav-text")}>Order</span>
                                    <ArchiveBoxIcon className="w-[24px]" />
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

         <Sidebar isOpen={isOpenSidebar} setIsOpen={setIsOpenSidebar} />

         {showModal && <Modal setShowModal={setShowModal}></Modal>}
      </>
   );
}
export default Header;
