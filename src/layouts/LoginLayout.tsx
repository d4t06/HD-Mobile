import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

export default function LoginLayout({ children }: { children: ReactNode }) {
  const classes = {
    btnContainer:
      "absolute z-[99] bottom-[15px] transition-[padding,opacity] left-[15px] bg-[#cd1818] hover:pb-[6px] rounded-[6px] p-[2px] pb-[4px] active:pb-[2px] ",
    button: "p-[5px] rounded-[3px] bg-[#fff] w-[30px] text-[#333] block",
  };

  const location = useLocation();
  const from = location?.state?.from || "/";

  return (
    <div className="absolute inset-0">
      <div className="container relative h-full">
        <div className={classes.btnContainer}>
          <Link to={from || "/"} className={`${classes.button}`}>
            <svg
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 576 512"
            >
              <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z" />
            </svg>
          </Link>
        </div>
        {children}
      </div>
    </div>
  );
}
