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

   console.log("chekc decode", decode);

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
               <div className={cx("header-top")}>
                  <div className={cx("header-top-wrap")}>
                     <div className="left w-1/4">
                        <Link className={cx("brand")} to={"/"}>
                           HD <span className="text-[#cd1818]">Mobile</span>
                        </Link>
                     </div>
                     <Search setShowModal={setShowModal} />

                     <div className="w-1/4">
                        <div className={cx("user-cta")}>
                           {loading && (
                              <>
                                 <Skeleton className="h-[24px] w-[100px] rounded-[4px] mr-[8px]" />
                                 <Skeleton className="h-[40px] w-[40px] rounded-full" />
                              </>
                           )}
                           {!loading && (
                              <>
                                 {decode.username ? (
                                    <h5 className={cx("user-name")}>{decode.username}</h5>
                                 ) : (
                                    <Link to={routes.LOGIN}>
                                       <Button className="hover:text-[#cd1818] mr-[8px]">Đăng nhập</Button>
                                    </Link>
                                 )}

                                 <div className={cx("image-frame")}>
                                    {decode.username ? (
                                       <Link to="/account">
                                          <div className={cx("avatar-placeholder")}>
                                             {decode.username.charAt(0) || ""}
                                          </div>
                                       </Link>
                                    ) : (
                                       <Image classNames="rounded-full" src={defaultUser} />
                                    )}
                                 </div>
                              </>
                           )}
                        </div>
                     </div>
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
         {showModal && <Modal setShowModal={setShowModal}></Modal>}
      </>
   );
}
export default Header;
