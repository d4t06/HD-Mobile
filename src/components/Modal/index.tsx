import {
   forwardRef,
   MouseEventHandler,
   ReactNode,
   Ref,
   useEffect,
   useImperativeHandle,
   useState,
} from "react";
import { createPortal } from "react-dom";

type NoAnimation = {
   variant?: "default";
   children: ReactNode;
   closeModal: () => void;
   className?: string;
};

type WithAnimation = {
   variant?: "animation";
   children: ReactNode;
   className?: string;
};

type Props = NoAnimation | WithAnimation;

export type ModalRef = {
   toggle: () => void;
};

function Modal({ children, className, ...props }: Props, ref: Ref<ModalRef>) {
   const variant = props.variant || "default";

   const [isOpen, setIsOpen] = useState(variant === "default" ? true : false);
   const [isMounted, setIsMounted] = useState(
      variant === "default" ? true : false
   );

   const toggle = () => {
      if (isMounted) setIsMounted(false);
      if (!isOpen) setIsOpen(true);
   };

   const handleOverlayClick: MouseEventHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (variant === "default") {
         // @ts-ignore
         props.closeModal ? props.closeModal() : "";
      }

      if (variant === "animation") toggle();
   };

   useImperativeHandle(ref, () => ({
      toggle,
   }));

   useEffect(() => {
      if (variant === "default") return;

      if (!isMounted) {
         setTimeout(() => {
            setIsOpen(false);
         }, 400);
      }
   }, [isMounted]);

   useEffect(() => {
      if (variant === "default") return;

      if (isOpen) {
         setTimeout(() => {
            setIsMounted(true);
         }, 100);
      }
   }, [isOpen]);

   const classes = {
      unMountedContent: "opacity-0 scale-[.95]",
      mountedContent: "opacity-100 scale-[1]",
      unMountedLayer: "opacity-0",
      mountedLayer: "opacity-60",
   };

   return (
      <>
         {isOpen &&
            createPortal(
               <div className="fixed inset-0 z-[99]">
                  <div
                     onClick={handleOverlayClick}
                     className={`transition-opacity duration-300 absolute bg-black/60 inset-0 z-[90]
                             ${
                                isMounted
                                   ? classes.mountedLayer
                                   : classes.unMountedLayer
                             }
                        `}
                  ></div>
                  <div
                     className={`absolute duration-300 transition-[transform,opacity] z-[99] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            ${
                               isMounted
                                  ? classes.mountedContent
                                  : classes.unMountedContent
                            }
                        `}
                  >
                     <div className={`bg-white p-6 sm:p-5 rounded-lg ${className || ""}`}>
                        {children}
                     </div>
                  </div>
               </div>,
               document.getElementById("portals")!
            )}
      </>
   );
}

export default forwardRef(Modal);
