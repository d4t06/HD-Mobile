import { addIcon, gearIcon } from "@/assets/icons";
import jwtDecode from "jwt-decode";
import { useAuth } from "@/store/AuthContext";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, Modal } from "@/components";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { routes } from "@/routes";
import { publicRequest } from "@/utils/request";
import { Category } from "@/types";
import { useApp } from "@/store/AppContext";

const cx = classNames.bind(styles);

function Header() {
   const { auth } = useAuth();
   const { categories, setCategories } = useApp();
   const [showModal, setShowModal] = useState(false);
   const defaultImage = "src/assets/images/avatar.jpg";

   const ranUseEffect = useRef(false);
   const decode: any = auth?.token ? jwtDecode(auth.token) : undefined;

   const location = useLocation();

   const renderCategories = useMemo(() => {
      if (!categories.length) return;
      return categories.map((cat, index) => (
         <li key={index} className={cx("nav-item", { active: location.pathname === "/" + cat.category_name_ascii })}>
            <Link to={`/${cat.category_name_ascii}`}>
               <i className="material-icons">{cat.icon}</i>
               <p className={cx("nav-text")}>{cat.category_name}</p>
            </Link>
         </li>
      ));
   }, [categories, location]);

   useEffect(() => {
      const getConfig = async () => {
         try {
            const categoriesRes = await publicRequest.get("app/category");
            const categories = categoriesRes.data as Category[];

            if (categories.length > 0) {
               setCategories(categoriesRes.data || []);
            }
         } catch (error) {
            console.log({ message: error });
         }
      };

      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getConfig();
      }
   }, []);

   return (
      <>
         <div className={cx("header")}>
            <div className={cx("header-banner")}>
               <img
                  src="https://img.tgdd.vn/imgt/f_webp,fit_outside,quality_100/https://cdn.tgdd.vn/2023/02/banner/1200-44-1200x44-8.png"
                  alt=""
               />
            </div>
            <div className={cx("header-top")}>
               <div className={cx("container", "header-top-wrap")}>
                  <Link className={cx("brand")} to={"/"}>
                     HD Shop
                  </Link>
                  <Search setShowModal={setShowModal} />

                  <div className={cx("user-cta")}>
                     {decode?.username && (
                        <>
                           <span className={cx("user-name")}>{decode.username}</span>
                           <Link to="/account" className={cx("image-frame")}>
                              {decode.avatar ? (
                                 <img className={cx("user-image")} src={decode.avatar} alt="" />
                              ) : (
                                 <div className={cx("avatar-placeholder")}>{decode.username.charAt(0)}</div>
                              )}
                           </Link>
                        </>
                     )}
                  </div>
               </div>
            </div>
            <div className={cx("header-nav")}>
               <div className={cx("container", "header-nav-wrap")}>
                  <ul className={cx("nav-list")}>{renderCategories}</ul>
                  {!decode?.username && (
                     <ul className={cx("nav-list", "left-nav-list")}>
                        <li className={cx("nav-item")}>
                           <Link to={routes.LOGIN}>
                              <p className={cx("nav-text")}>Đăng nhập</p>
                           </Link>
                        </li>
                        <li className={cx("nav-item")}>
                           <Link to={routes.REGISTER}>
                              <p className={cx("nav-text")}>Đăng Ký</p>
                           </Link>
                        </li>
                     </ul>
                  )}
                  {decode?.role_code === "R1" && (
                     <ul className={cx("nav-list")}>
                        <li className={cx("nav-item", { active: location.pathname == "" })}>
                           <Link to={"/create"}>
                              {addIcon}
                              <p className={cx("nav-text")}>Thêm sản phẩm</p>
                           </Link>
                        </li>
                        <li className={cx("nav-item")}>
                           <Link to={"/admin"}>
                              {gearIcon}
                              <p className={cx("nav-text")}>Trang quản lí</p>
                           </Link>
                        </li>
                     </ul>
                  )}
               </div>
            </div>
         </div>
         {/* {showModal && <Modal showModal={showModal} setShowModal={setShowModal}></Modal>} */}
      </>
   );
}
export default Header;
