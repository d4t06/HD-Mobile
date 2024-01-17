import { ReactNode, useMemo } from "react";
import { Button } from "..";

type Props = {
   data: {
      cb: () => void;
      icon: string;
      className?: string;
   }[];
   children?: ReactNode;
};

const classes = {
   button:
      "text-[#333] bg-[#ccc] h-[34px] w-[34px] hover:text-white hover:bg-[#cd1818] hover:scale-[1.1] transition-transform",
};

export default function OverlayCTA({ data }: Props) {
   const CTA = useMemo(() => {
      return data.map((item, index) => {
         const { cb, icon, className } = item;

         return (
            <Button circle key={index} onClick={cb} className={`${classes.button} ${className ? className : ''}`}>
               <i className="material-icons  text-current">{icon}</i>
            </Button>
         );
      });
   }, [data]);
   return (
      <div className="absolute bottom-0 h-[40%] hidden group-hover:flex items-center justify-center gap-[12px]">
         {CTA}
      </div>
   );
}
