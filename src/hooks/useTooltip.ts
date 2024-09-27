import { usePopoverContext } from "@/components/Popover";
import { ElementRef, useEffect, useRef, useState } from "react";

export default function useTooltip() {
   const [isOpen, setIsOpen] = useState(false);

   const { setTriggerRef, state, appendOnPortal } = usePopoverContext();

   const triggerRef = useRef<ElementRef<"button">>(null);

   const handleMouseEnter: EventListener = () => {
      setIsOpen(true);
   };

   const handleMouseLeave: EventListener = () => {
      setIsOpen(false);
   };

   useEffect(() => {
      if (!triggerRef.current) return;

      if (setTriggerRef) {
         setTriggerRef(triggerRef.current);
      }

      triggerRef.current.addEventListener("mouseenter", handleMouseEnter);
      triggerRef.current.addEventListener("mouseleave", handleMouseLeave);

      return () => {
         if (!triggerRef.current) return;
         triggerRef.current.removeEventListener("mouseenter", handleMouseEnter);
         triggerRef.current.removeEventListener("mouseleave", handleMouseLeave);
      };
   }, []);

   return {
      isOpen,
      triggerRef,
      setTriggerRef,
      state,
      appendOnPortal,
   };
}
