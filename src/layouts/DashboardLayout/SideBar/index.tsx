import { Link } from "react-router-dom";
// import { useState } from "react";
import classNames from "classnames/bind";
// import ReactDom from "react-dom";
// import { Gallery, Modal } from "@/components";

import styles from "./SideBar.module.scss";
const cx = classNames.bind(styles);

function Sidebar() {
   // const [showModal, setShowModal] = useState(false);
   return (
      <div className={cx("sibebar")}>
         <h1 className={cx("logo")}>HD Dashboard</h1>
         <div>
            <Link to="/dashboard" className={cx("sibebar__item")}>
               <i className="material-icons">phonelink</i>
               Products
            </Link>

            <Link className={cx("sibebar__item")} to="/dashboard/add-product">
               <i className="material-icons">add</i>
               Add product
            </Link>

            <Link className={cx("sibebar__item")} to="/dashboard/brand">
               <i className="material-icons">store</i>
               Brand
            </Link>
         </div>
      </div>
   );
}

export default Sidebar;
