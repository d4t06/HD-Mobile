import { ArrowPathIcon, PlusIcon } from "@heroicons/react/16/solid";
import { ReactNode } from "react";

type Props = {
   onClick?: () => void;
   children?: ReactNode;
   className?: string;
   loading?: boolean;
   fontClassName?: string;
   pushAble?: boolean;
};
export default function Empty({
   onClick,
   children,
   className,
   fontClassName,
   loading,
   pushAble = true,
}: Props) {
   const classes = {
      container: `group relative pt-[100%] rounded-[12px] border-[2px] border-[#ccc] overflow-hidden bg-[#ccc] ${
         !children ? "cursor-pointer hover:bg-black/15" : ""
      }`,
      font: "absolute inset-0 flex transition-transform rounded-[12px] items-center justify-center bg-[#f9f9f9]",
      pushAble: "translate-y-[-4px] group-active:translate-y-[-2x]",
   };

   return (
      <div onClick={onClick} className={`${classes.container} ${className}`}>
         <div
            className={`${classes.font} ${fontClassName} ${
               pushAble ? classes.pushAble : ""
            }`}
         >
            {children || (
               <>
                  {loading ? (
                     <ArrowPathIcon className="w-[30px]  animate-spin" />
                  ) : (
                     <PlusIcon className="select-none w-[24px]" />
                  )}
               </>
            )}
         </div>
      </div>
   );
}
