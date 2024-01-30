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
   button:
      "text-[#333] bg-[#ccc] h-[34px] w-[34px] hover:text-white hover:bg-[#cd1818] hover:scale-[1.1] transition-transform",
   hide: "opacity-0 translate-y-[10px]",
   show: "group-hover:!translate-y-[0] group-hover:!opacity-[1]",
};

export default function OverlayCTA({ data }: Props) {
   const CTA = useMemo(() => {
      return data.map((item, index) => {
         const { cb, icon, className } = item;

         return (
            <Button circle key={index} onClick={cb} className={`${classes.button} ${className ? className : ""}`}>
               {icon}
            </Button>
         );
      });
   }, [data]);
   return <div className={`${classes.hide} ${classes.show} transition-[opacity,transform]  flex absolute bottom-0 h-[40%]  items-center justify-center gap-[12px]`}>{CTA}</div>;
}
