import classNames from "classnames/bind";

import styles from "./SideBar.module.scss";
import {
   BookmarkSquareIcon,
   BuildingStorefrontIcon,
   ComputerDesktopIcon,
   DevicePhoneMobileIcon,
   PhotoIcon,
   StarIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import logo from "@/assets/images/logo.png";
import Button from "@/components/ui/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import MyLink from "@/shares/components/MyLink";

const cx = classNames.bind(styles);

function Sidebar() {
   const [expand, setExpand] = useState(false);

   const handleExpand = () => {
      setExpand((prev) => !prev);
   };

   return (
      <div className={cx("sidebar", { expand })}>
         <div className={cx("head")}>
            {expand ? (
               <h1 className={cx("logo-text")}>
                  HD <span className="text-[#cd1818]">Dashboard</span>
               </h1>
            ) : (
               <img className={cx("logo-image")} src={logo} />
            )}
         </div>
         <div>
            <MyLink
               to="/dashboard"
               activeClass={cx("active")}
               className={cx("sidebar__item")}
            >
               <ComputerDesktopIcon className="w-6" />
               {expand && <>Dashboard</>}
            </MyLink>

            <MyLink
               to="/dashboard/product"
               activeClass={cx("active")}
               className={cx("sidebar__item")}
            >
               <DevicePhoneMobileIcon className="w-6" />
               {expand && <>Product</>}
            </MyLink>

            <MyLink
               to="/dashboard/category"
               activeClass={cx("active")}
               className={cx("sidebar__item")}
            >
               <BookmarkSquareIcon className="w-6" />
               {expand && <>Category</>}
            </MyLink>

            <MyLink
               to="/dashboard/banner"
               activeClass={cx("active")}
               className={cx("sidebar__item")}
            >
               <PhotoIcon className="w-6" />
               {expand && <>Banner</>}
            </MyLink>

            <MyLink
               to="/dashboard/rating"
               activeClass={cx("active")}
               className={cx("sidebar__item")}
            >
               <StarIcon className="w-6" />
               {expand && <>Rating</>}
            </MyLink>

            <MyLink to="/" target="_blank" className={cx("sidebar__item")}>
               <BuildingStorefrontIcon className="w-6" />
               {expand && <>My shop</>}
            </MyLink>
         </div>

         <div className="hidden sm:block absolute bottom-[20px] right-0 translate-x-[50%] z-[10]">
            <Button
               colors={"third"}
               onClick={handleExpand}
               size={"clear"}
               className="p-[4px]"
            >
               {expand ? (
                  <ChevronLeftIcon className="w-6 " />
               ) : (
                  <ChevronRightIcon className="w-6" />
               )}
            </Button>
         </div>
      </div>
   );
}

export default Sidebar;
