import { ReactNode } from "react";

type Props = {
   onClick?: () => void;
   children?: ReactNode;
   className?: string;
   fontClassName?: string;
   pushAble?:boolean
};
export default function Empty({ onClick, children, className, fontClassName, pushAble = true }: Props) {
   const classes = {
      container: `group relative pt-[100%] rounded-[12px] border border-[#ccc] overflow-hidden bg-[#ccc] ${
         !children ? "cursor-pointer hover:bg-black/15" : ""
      }`,
      font: "absolute inset-0 flex transition-transform rounded-[12px] items-center justify-center",
      pushAble: 'translate-y-[-6px] group-hover:translate-y-[-8px] group-active:translate-y-[-4px]'
   };

   return (
      <div onClick={onClick} className={`${classes.container} ${className}`}>
         <div className={`${classes.font} ${fontClassName} ${pushAble ? classes.pushAble : ''}`}>
            {children || <i className="material-icons select-none">add</i>}
         </div>
      </div>
   );
}
