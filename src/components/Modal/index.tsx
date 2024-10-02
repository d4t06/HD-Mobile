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

type BaseProps = {
   className?: string;
   zIndexClass?: string;
   children?: ReactNode;
};

type NoAnimation = BaseProps & {
   variant?: "default";
   closeModal: () => void;
};

type WithAnimation = BaseProps & {
   variant?: "animation";
   onClose?: () => void;
};

type Props = NoAnimation | WithAnimation;

export type ModalRef = {
   open: () => void;
   close: () => void;
};

function Modal(
   { children, className, zIndexClass, ...props }: Props,
   ref: Ref<ModalRef>
) {
   const variant = props.variant || "default";

   const [isOpen, setIsOpen] = useState(variant === "default" ? true : false);
   const [isMounted, setIsMounted] = useState(variant === "default" ? true : false);

   const open = () => setIsOpen(true);
   const close = () => setIsMounted(false);

   const handleOverlayClick: MouseEventHandler = (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (variant === "default") {
         // @ts-ignore
         props.closeModal ? props.closeModal() : "";
      }

      if (props.variant === "animation") {
         close();
         props.onClose ? props.onClose() : "";
      }
   };

   useImperativeHandle(ref, () => ({
      open,
      close,
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
               <div className={`fixed inset-0 ${zIndexClass || "z-[99]"} `}>
                  <div
                     onClick={handleOverlayClick}
                     className={`transition-opacity duration-300 absolute bg-black/60 inset-0 z-[90]
                             ${isMounted ? classes.mountedLayer : classes.unMountedLayer}
                        `}
                  ></div>
                  {children && (
                     <div
                        className={`absolute ${
                           zIndexClass || "z-[99]"
                        }  duration-300 transition-[transform,opacity] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            ${
                               isMounted
                                  ? classes.mountedContent
                                  : classes.unMountedContent
                            }
                        `}
                     >
                        <div
                           className={`bg-white p-6 sm:p-5 rounded-lg ${className || ""}`}
                        >
                           {children}
                        </div>
                     </div>
                  )}
               </div>,
               document.getElementById("portals")!
            )}
      </>
   );
}

export default forwardRef(Modal);
