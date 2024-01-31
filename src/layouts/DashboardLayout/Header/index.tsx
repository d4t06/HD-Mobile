import { useAuth } from "@/store/AuthContext";
import classNames from "classnames/bind";
import styles from "./Header.module.scss";
import { RefObject, useEffect, useState } from "react";

const cx = classNames.bind(styles);

function Header({ dashboardRef }: { dashboardRef: RefObject<HTMLDivElement> }) {
   const [scroll, setScroll] = useState(false);

   const { auth } = useAuth();

   const handleScroll = () => {
      const dashboardEle = dashboardRef.current;
      if (!dashboardEle) return;

      if (dashboardEle.scrollTop > 10) setScroll(true);
      else setScroll(false);
   };

   useEffect(() => {
      const dashboardEle = dashboardRef.current;
      if (!dashboardEle) return;

      dashboardEle.addEventListener("scroll", handleScroll);
      return () => dashboardEle.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <div className={cx("header__wrapper")}>
         <div className={cx("header", { shadow: scroll })}>
            <div className={cx("header-main")}>
               <p>Hello {auth ? auth?.username : "no persist"} !</p>
            </div>
            <div className="bg-opacity-[0.8] backdrop-blur-[8px] z-[-1] absolute inset-0 bg-[#f1f1f1] "></div>
         </div>
      </div>
   );
}

export default Header;
