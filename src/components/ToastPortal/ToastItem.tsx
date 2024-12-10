import { CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { useEffect, useState } from "react";

type Props = {
   toast: Toast;
   onClick?: (id: string) => void;
};

export default function ToastItem({ toast, onClick }: Props) {
   const [isOpen, setIsOpen] = useState(false);

   const classes = {
      icon: `w-6`,
      container: `bg-white transition-[transform,opacity] border-[1px] rounded-md overflow-hidden min-w-[150px] max-w-[250px]`,
      text: `font-[500] text-sm p-2`,
      open: "opacity-[1] translate-x-0",
      init: "opacity-0 translate-x-10",
      header: "border-b-[1px] bg-gray-100 px-2 py-1 flex space-x-1",
   };

   const getColor = () => {
      switch (toast.variant) {
         case "error":
            return "text-red-500";
         case "success":
            return "text-green-500";
      }
   };

   const renderIcon = () => {
      switch (toast.variant) {
         case "success":
            return <CheckIcon className={`${classes.icon}`} />;
         case "error":
            return <XMarkIcon className={`${classes.icon}`} />;
      }
   };

   useEffect(() => {
      setTimeout(() => {
         setIsOpen(true);
      }, 0);
   }, []);

   return (
      <div
         onClick={() => (onClick ? onClick(toast.id) : undefined)}
         className={`${classes.container} ${isOpen ? classes.open : classes.init} `}
      >
         <div className={`${classes.header} ${getColor()}`}>
            {renderIcon()}
            <span>{toast.variant.toUpperCase()}</span>
         </div>

         <p className={classes.text}>{toast.desc}</p>
      </div>
   );
}
