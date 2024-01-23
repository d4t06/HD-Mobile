import { CSSProperties, DOMAttributes, useRef, useState } from "react";

export default function useCollapse() {
   const triggerRef = useRef<HTMLButtonElement>(null);
   const containerRef = useRef<HTMLDivElement>(null);
   const [isCollapse, setIsCollapse] = useState(false);
   // const currentHeight = useRef(0);

   const handleCollapse = () => {
      const newIsCollapse = !isCollapse;
      const containerEle = containerRef.current as HTMLDivElement;
      setIsCollapse(newIsCollapse);

      if (containerEle) {
         if (newIsCollapse) {
            // currentHeight.current = containerEle.offsetHeight;
            containerEle.style.maxHeight = "0";

         } else {
            containerEle.style.maxHeight = "100%";
            // setTimeout(() => {
            // }, 600);
         }
      }
   };

   const triggerProps: DOMAttributes<HTMLButtonElement> = {
      onClick: () => handleCollapse(),
   };

   const containerStyles: CSSProperties = {
      transition: "max-height .5s linear",
      overflow: "hidden",
   };

   return { triggerRef, containerRef, triggerProps, containerStyles, isCollapse };
}
