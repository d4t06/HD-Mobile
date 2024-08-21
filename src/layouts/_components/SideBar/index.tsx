import { Link, useLocation } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./SideBar.module.scss";
import {
   ArchiveBoxArrowDownIcon,
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

const cx = classNames.bind(styles);

function Sidebar() {
   const location = useLocation();
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
            <Link
               to="/dashboard"
               className={cx(
                  { active: location.pathname === "/dashboard" },
                  "sidebar__item"
               )}
            >
               <ComputerDesktopIcon className="w-[24px]" />
               {expand && <>Dashboard</>}
            </Link>
            <Link
               to="/dashboard/product"
               className={cx(
                  { active: location.pathname === "/dashboard/product" },
                  "sidebar__item"
               )}
            >
               <DevicePhoneMobileIcon className="w-[24px]" />
               {expand && <>Product</>}
            </Link>

            <Link
               className={cx(
                  { active: location.pathname === "/dashboard/category" },
                  "sidebar__item"
               )}
               to="/dashboard/category"
            >
               <BookmarkSquareIcon className="w-[24px]" />
               {expand && <>Category</>}
            </Link>

            <Link
               className={cx(
                  { active: location.pathname === "/dashboard/banner" },
                  "sidebar__item"
               )}
               to="/dashboard/banner"
            >
               <PhotoIcon className="w-[24px]" />
               {expand && <>Banner</>}
            </Link>

            <Link
               className={cx(
                  { active: location.pathname === "/dashboard/rating" },
                  "sidebar__item"
               )}
               to="/dashboard/rating"
            >
               <StarIcon className="w-[24px]" />
               {expand && <>Rating</>}
            </Link>

            <Link
               target="blank"
               className={cx({ active: location.pathname === "" }, "sidebar__item")}
               to="/"
            >
               <BuildingStorefrontIcon className="w-[24px]" />
               {expand && <>My shop</>}
            </Link>
         </div>

         <div className="hidden sm:block absolute bottom-[20px] right-0 translate-x-[50%] z-[10]">
            <Button
               colors={"third"}
               onClick={handleExpand}
               size={"clear"}
               className="p-[4px]"
            >
               {expand ? (
                  <ChevronLeftIcon className="w-[24px] " />
               ) : (
                  <ChevronRightIcon className="w-[24px]" />
               )}
            </Button>
         </div>
      </div>
   );
}

export default Sidebar;
