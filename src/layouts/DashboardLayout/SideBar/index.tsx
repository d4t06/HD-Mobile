import { Link, useLocation } from "react-router-dom";
// import { useState } from "react";
import classNames from "classnames/bind";
// import ReactDom from "react-dom";
// import { Gallery, Modal } from "@/components";

import styles from "./SideBar.module.scss";
const cx = classNames.bind(styles);

function Sidebar() {
   const location = useLocation();

   return (
      <div className={cx("sidebar")}>
         <h1 className={cx("logo")}>
            HD <span className="text-[#cd1818]">Dashboard</span>
         </h1>
         <div>
            <Link to="/dashboard" className={cx({ active: location.pathname === "/dashboard" }, "sidebar__item")}>
               <i className="material-icons">phonelink</i>
               Product
            </Link>

            <Link
               className={cx({ active: location.pathname === "/dashboard/brand" }, "sidebar__item")}
               to="/dashboard/brand"
            >
               <i className="material-icons">class</i>
               Asset
            </Link>

            <Link
               className={cx({ active: location.pathname === "/dashboard/banner" }, "sidebar__item")}
               to="/dashboard/banner"
            >
               <i className="material-icons">slideshow</i>
               Banner
            </Link>

            <Link
               className={cx({ active: location.pathname === "/dashboard/order" }, "sidebar__item")}
               to="/dashboard/order"
            >
               <i className="material-icons">redeem</i>
               Order
            </Link>

            <div className="m-[10px] border-t border-black/10"></div>

            <Link
               className={cx({ active: location.pathname === "/dashboard/message" }, "sidebar__item")}
               to="/dashboard/message"
            >
               <i className="material-icons">message</i>
               Message
            </Link>

            <Link
               className={cx({ active: location.pathname === "/dashboard/review" }, "sidebar__item")}
               to="/dashboard/review"
            >
               <i className="material-icons">star</i>
               Review
            </Link>

            <Link target="blank" className={cx({ active: location.pathname === "" }, "sidebar__item")} to="/">
               <i className="material-icons">store</i>
               My shop
            </Link>
         </div>
      </div>
   );
}

export default Sidebar;
