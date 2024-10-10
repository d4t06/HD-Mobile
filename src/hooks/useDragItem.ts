import { useDragContext } from "@/store/DragContext";
import {
   DOMAttributes,
   DragEvent,
} from "react";

type Props = {
   index: number;
   handleDragEnd: (start: number, end: number) => void;
};

const inActiveStyles: Partial<CSSStyleDeclaration> = {
   borderColor: "rgba(0,0,0,0.15)",
};

const findDraggableItem = (el: HTMLDivElement) => {
   let i = 0;
   let parent = el;
   while (!parent.classList.contains("draggable") && i < 5) {
      parent = parent.parentElement as HTMLDivElement;
      i++;
   }

   if (i == 5) return null;
   return parent;
};

export default function useDrag({
   index,
   handleDragEnd,
}: Props) {

   const {endIndexRef, isDrag, setIsDrag, startIndexRef} = useDragContext()


   const handleDragStart = () => {
      startIndexRef.current = index;
      setIsDrag(true);
   };

   const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
      endIndexRef.current = index;
      const el = e.target as HTMLDivElement;
      setIsDrag(true);
      const parentEl = findDraggableItem(el);

      if (parentEl) {
         if (startIndexRef.current === index) return;

         const moveDir = startIndexRef.current > index ? "up" : "down";

         Object.assign(
            (parentEl.childNodes[0] as HTMLDivElement).style,
            moveDir === "up"
               ? { borderLeftColor: "#cd1818" }
               : { borderRightColor: "#cd1818" }
         );
         parentEl.classList.add("active");
      }
   };

   const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
      const el = e.target as HTMLDivElement;
      const parentEl = findDraggableItem(el);

      console.log("drag over", parentEl);
      if (parentEl) {
         Object.assign(
            (parentEl.childNodes[0] as HTMLDivElement).style,
            inActiveStyles
         );
         parentEl.classList.remove("active");
      }
   };

   const endDrag = () => {
      const activeItem = document.querySelector(
         ".draggable.active"
      ) as HTMLDivElement;

      if (activeItem) {
         Object.assign(
            (activeItem.childNodes[0] as HTMLDivElement).style,
            inActiveStyles
         );
         activeItem.classList.remove("active");
      }

      setIsDrag(false);
      handleDragEnd(startIndexRef.current, endIndexRef.current);
   };

   const parentProps: DOMAttributes<HTMLDivElement> = {
      onDragEnter: (e) => handleDragEnter(e),
      onDragEnd: endDrag,
      onDragOver: (e) => {
         e.preventDefault();
      },
      onDragLeave: (e) => {
         handleDragOver(e);
      },
      onDragStart: handleDragStart,
   };

   return { parentProps, isDrag };
}
