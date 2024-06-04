import { useEffect, useState } from "react";
import { Button } from "..";
import { ArrowUpIcon } from "@heroicons/react/16/solid";

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
      base: "fixed z-[99] p-[6px] bottom-[30px] transition-[padding,opacity,transform] right-[30px]",
      hide: "opacity-0 translate-y-[30px]",
      show: "translate-y-[0] opacity-[1]",
   };

   return (
      <Button
         className={`${classes.base} ${show ? classes.show : classes.hide}`}
         size={'clear'}
         onClick={show ? scrollToTop : () => {}}
      >
         <ArrowUpIcon className="w-[22px] " />
      </Button>
   );
}
