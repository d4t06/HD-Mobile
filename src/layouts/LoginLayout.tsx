import { HomeIcon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export default function LoginLayout({ children }: { children: ReactNode }) {
  const classes = {
    btnContainer:
      "absolute z-[99] bottom-[15px] transition-[padding,opacity] left-[15px] bg-[#cd1818] sm:hover:pb-[6px] rounded-[6px] p-[2px] pb-[4px] active:pb-[2px] ",
    button: " p-[4px] rounded-[3px] bg-[#fff] text-black block",
  };

  const location = useLocation();
  const from = location?.state?.from || "/";

  return (
    <div className="absolute inset-0">
      <div className="container relative h-full">
        <div className={classes.btnContainer}>
          <Link to={from || "/"} className={`${classes.button}`}>
            <HomeIcon className="w-[24px]"/>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
