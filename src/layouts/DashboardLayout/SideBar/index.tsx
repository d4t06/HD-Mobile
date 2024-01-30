import { Link, useLocation } from "react-router-dom";
import classNames from "classnames/bind";

import styles from "./SideBar.module.scss";
import { Button } from "@/components";
import {
   ArchiveBoxArrowDownIcon,
   BookmarkSquareIcon,
   BuildingStorefrontIcon,
   ChatBubbleBottomCenterIcon,
   ChevronLeftIcon,
   ChevronRightIcon,
   DevicePhoneMobileIcon,
   PhotoIcon,
   StarIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import logo from "@/assets/images/logo.png";

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
               <DevicePhoneMobileIcon className="w-[24px]" />
               {expand && <>Product</>}
            </Link>

            <Link
               className={cx(
                  { active: location.pathname === "/dashboard/brand" },
                  "sidebar__item"
               )}
               to="/dashboard/brand"
            >
               <BookmarkSquareIcon className="w-[24px]" />
               {expand && <>Asset</>}
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
                  { active: location.pathname === "/dashboard/order" },
                  "sidebar__item"
               )}
               to="/dashboard/order"
            >
               <ArchiveBoxArrowDownIcon className="w-[24px]" />
               {expand && <>Order</>}
            </Link>

            <div className="m-[10px] border-t border-black/10"></div>

            <Link
               className={cx(
                  { active: location.pathname === "/dashboard/message" },
                  "sidebar__item"
               )}
               to="/dashboard/message"
            >
               <ChatBubbleBottomCenterIcon className="w-[24px]" />
               {expand && <>Message</>}
            </Link>

            <Link
               className={cx(
                  { active: location.pathname === "/dashboard/review" },
                  "sidebar__item"
               )}
               to="/dashboard/review"
            >
               <StarIcon className="w-[24px]" />
               {expand && <>Review</>}
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

         <Button
            onClick={handleExpand}
            backClass="absolute bottom-[20px] right-0 translate-x-[50%] z-[10]"
            className="!p-[4px]"
            primary
         >
            {expand ? (
               <ChevronLeftIcon className="w-[24px] " />
            ) : (
               <ChevronRightIcon className="w-[24px]" />
            )}
         </Button>
      </div>
   );
}

export default Sidebar;
