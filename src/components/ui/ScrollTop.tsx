import { useEffect, useState } from "react";
import { Button } from "..";
import { ArrowUpIcon } from "@heroicons/react/24/outline";

export default function ScrollTop() {
  const [show, setShow] = useState(false);

  const scrollToTop = () => {
    setTimeout(() => {
      window?.scroll({
        behavior: "smooth",
        top: 0,
      });
    }, 150);
  };

  const handleShow = () => {
    if (window.scrollY > 100) setShow(true);
    else setShow(false);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleShow);

    return () => window.removeEventListener("scroll", handleShow);
  }, []);

  const classes = {
    container:
      "fixed z-[99] bottom-[30px] transition-[padding,opacity,transform] right-[30px] bg-[#cd1818]  rounded-[6px] p-[2px] pb-[4px] hover:pb-[6px] active:pb-[2px] ",
    button: "p-[5px] rounded-[3px] bg-[#fff]",
    hide: "opacity-0 translate-y-[30px]",
    show: "translate-y-[0] opacity-[1]",
  };

  return (
    <div className={`${classes.container} ${show ? classes.show : classes.hide}`}>
      <Button onClick={show ? scrollToTop : () => {}} className={`${classes.button}`}>
       <ArrowUpIcon className="w-[20px] text-[#333]"/>
      </Button>
    </div>
  );
}
