"use client";

import useDrag from "@/hooks/useDragItem";
import { ReactNode } from "react";

type Props = {
   className?: string;
   children: ReactNode;
   index: number;
   handleDragEnd: (start: number, end: number) => void;
};
export default function DragAbleItem({
   children,
   index,
   className,
   handleDragEnd,
}: Props) {
   const { parentProps, isDrag } = useDrag({
      index,
      handleDragEnd,
   });

   return (
      <div className={`draggable`} {...parentProps} draggable>
         <div className={className}>
            <div
               className="child-zone"
               style={{ pointerEvents: `${isDrag ? "none" : "auto"}` }}
            >
               {children}
            </div>
         </div>
      </div>
   );
}
