import { ReactNode, useMemo } from "react";
import { Button } from "..";

type Props = {
   data: {
      cb: () => void;
      icon: ReactNode;
      className?: string;
   }[];
   children?: ReactNode;
};

const classes = {
   container:
      "transition-[opacity,transform] flex absolute bottom-0 w-full h-[40%] items-center justify-center gap-[12px]",
   button:
      "text-[#333] bg-[#ccc] hover:text-white hover:bg-[#cd1818] hover:scale-[1.1] rounded-[6px] p-[6px] transition-transform",
   hide: "opacity-0 translate-y-[10px]",
   show: "group-hover:!translate-y-[0] group-hover:!opacity-[1]",
};

export default function OverlayCTA({ data }: Props) {
   const CTA = useMemo(() => {
      return data.map((item, index) => {
         const { cb, icon, className } = item;

         return (
            <button
               key={index}
               onClick={cb}
               className={`${classes.button} ${className ? className : ""}`}
            >
               {icon}
            </button>
         );
      });
   }, [data]);
   return (
      <div className={`${classes.container} ${classes.hide} ${classes.show} `}>{CTA}</div>
   );
}
