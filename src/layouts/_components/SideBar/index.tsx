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
import Button from "@/components/ui/Button";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/16/solid";
import MyLink from "@/shares/components/MyLink";
import Logo from "@/components/ui/Logo";

const cx = classNames.bind(styles);

function Sidebar() {
   const [expand, setExpand] = useState(false);

   const handleExpand = () => {
      setExpand((prev) => !prev);
   };

   const classes = {
      linkList:
         `${!expand ? '[&>a]:justify-center' : ''} hover:[&>a]:bg-[--a-5-cl] [&>a]:px-3 [&>a]:py-2 [&>a]:w-full [&>a]:space-x-2 [&>a]:text-sm [&>a]:flex [&_svg]:w-6 [&_svg]:flex-shrink-0  [&_span]:font-semibold [&_span]:whitespace-nowrap`,
   };

   return (
      <div className={cx("sidebar", { expand })}>
         <div className={cx("head")}>
            <Logo showName={false} />
         </div>
         <div className={classes.linkList}>
            <MyLink to="/dashboard" activeClass={cx("active")}>
               <ComputerDesktopIcon />
               {expand && <span>Dashboard</span>}
            </MyLink>

            <MyLink to="/dashboard/product" activeClass={cx("active")}>
               <DevicePhoneMobileIcon />
               {expand && <span>Product</span>}
            </MyLink>

            <MyLink to="/dashboard/category" activeClass={cx("active")}>
               <BookmarkSquareIcon />
               {expand && <span>Category</span>}
            </MyLink>

            <MyLink to="/dashboard/banner" activeClass={cx("active")}>
               <PhotoIcon />
               {expand && <span>Banner</span>}
            </MyLink>

            <MyLink to="/dashboard/rating" activeClass={cx("active")}>
               <StarIcon />
               {expand && <span>Rating</span>}
            </MyLink>

            <MyLink to="/" target="_blank">
               <BuildingStorefrontIcon />
               {expand && <span>My shop</span>}
            </MyLink>
         </div>

         <div className="hidden sm:block absolute bottom-[20px] right-0 translate-x-[50%] z-[10]">
            <Button
               colors={"third"}
               onClick={handleExpand}
               size={"clear"}
               className="p-[4px] [&_svg]:w-6"
            >
               {expand ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </Button>
         </div>
      </div>
   );
}

export default Sidebar;
