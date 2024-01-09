import { gearIcon } from "@/assets/icons";
import jwtDecode from "jwt-decode";
import { useAuth } from "@/store/AuthContext";
import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Modal, Button } from "@/components";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { routes } from "@/routes";
import { useApp } from "@/store/AppContext";
import Skeleton from "@/components/Skeleton";
import Image from "@/components/Image";

import defaultUser from "@/assets/images/user-default.png";

const cx = classNames.bind(styles);

function Header() {
   const { auth, loading } = useAuth();
   const [isOpenSidebar, setIsOpenSidebar] = useState(false);
   const [showModal, setShowModal] = useState(false);

   // use hooks
   const location = useLocation();
   const { categories, initLoading } = useApp();
   const decode: { username: string; role?: string } = auth?.token ? jwtDecode(auth.token) : { username: "", role: "" };

   const renderCategories = useMemo(() => {
      if (!categories.length) return <h1>Not category found</h1>;
      return categories.map((cat, index) => (
         <li
            key={index}
            className={cx("nav-item", { active: !showModal && location.pathname === `/${cat.category_ascii}` })}
         >
            <Link to={`/${cat.category_ascii}`}>
               <i className="material-icons">{cat.icon}</i>
               <p className={cx("nav-text")}>{cat.category_name}</p>
            </Link>
         </li>
      ));
   }, [categories, location, showModal]);

   const userCta = (
      <div className={cx("user-cta")}>
         {loading && (
            <>
               <Skeleton className="h-[24px] w-[100px] rounded-[4px] mr-[8px]" />
               <Skeleton className="h-[40px] w-[40px] rounded-full" />
            </>
         )}
         {!loading && (
            <>
               <div className={cx("image-frame")}>
                  {decode.username ? (
                     <Link to="/account">
                        <div className={cx("avatar-placeholder")}>{decode.username.charAt(0) || ""}</div>
                     </Link>
                  ) : (
                     <Image classNames="rounded-full" src={defaultUser} />
                  )}
               </div>

               {decode.username ? (
                  <h5 className={cx("user-name")}>{decode.username}</h5>
               ) : (
                  <Link to={routes.LOGIN}>
                     <Button className="hover:text-[#cd1818] mr-[8px]">Đăng nhập</Button>
                  </Link>
               )}
            </>
         )}
      </div>
   );

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
               {/* mobile  */}
               <div className="relative justify-center items-center h-[50px] hidden max-[768px]:flex">
                  <Button onClick={() => setIsOpenSidebar(true)} className="absolute left-0">
                     <i className="material-icons text-[30px]">menu</i>
                  </Button>
                  <Link className={cx("brand")} to={"/"}>
                     HD <span className="text-[#cd1818]">Mobile</span>
                  </Link>
               </div>

               <div className={cx("header-top")}>
                  <div className={cx("header-top-wrap")}>
                     <div className="left w-1/4 max-[768px]:hidden">
                        <Link className={cx("brand")} to={"/"}>
                           HD <span className="text-[#cd1818]">Mobile</span>
                        </Link>
                     </div>
                     <Search setShowModal={setShowModal} />

                     <div className="w-1/4 max-[768px]:hidden">{userCta}</div>
                  </div>
               </div>
               <div className={cx("header-nav")}>
                  <div className={cx("header-nav-wrap")}>
                     {/* render categories */}
                     <ul className={cx("nav-list")}>{!initLoading && renderCategories}</ul>
                     {decode?.role === "ADMIN" && (
                        <ul className={cx("nav-list")}>
                           <li className={cx("nav-item")}>
                              <Link to={"/dashboard"}>
                                 {gearIcon}
                                 <p className={cx("nav-text")}>Dashboard</p>
                              </Link>
                           </li>
                        </ul>
                     )}
                  </div>
               </div>
            </div>
         </div>

         <div
            className={`hidden max-[768px]:block transition-[transform, opacity] duration-[.3s] fixed ${
               isOpenSidebar ? "translate-x-0 opacity-[1]" : "translate-x-[-100%] opacity-[.5]"
            } min-w-[60vw] top-0 left-0 bottom-0 bg-[#f1f1f1] z-[199]`}
         >
            <div className="text-white relative p-[14px] bg-[#cd1818]">
               {userCta}
               <Button onClick={() => setIsOpenSidebar(false)} className="absolute right-[10px] top-[10px]">
                  <i className="material-icons text-[30px] mr-[8px]">close</i>
               </Button>
            </div>
            <ul className="py-[14px] px-[10px]">
               {categories.map((c, index) => (
                  <Link
                     onClick={() => setIsOpenSidebar(false)}
                     key={index}
                     to={`/${c.category_ascii}`}
                     className="flex items-center py-[6px] text-[#333]"
                  >
                     <i className="material-icons text-[30px] mr-[8px]">{c.icon}</i>
                     <span className="text-[18px]">{c.category_name}</span>
                  </Link>
               ))}
            </ul>
         </div>

         {isOpenSidebar && <Modal child setShowModal={setIsOpenSidebar}></Modal>}
         {showModal && <Modal setShowModal={setShowModal}></Modal>}
      </>
   );
}
export default Header;
