import {
   cloneElement,
   ElementRef,
   forwardRef,
   HTMLProps,
   isValidElement,
   ReactNode,
   Ref,
   useEffect,
   useRef,
   useState,
} from "react";
import { usePopoverContext } from "./Popover";

type Props = {
   children: ReactNode;
   className?: string;
   position?: string;
   content: string;
   onClick?: () => void;
};

function ToolTip(
   {
      children,
      className = "px-2 py-1 text-sm font-[600]",
      position = "bottom-[calc(100%+8px)]",
      content,
      onClick,
   }: Props,
   _ref: Ref<ElementRef<"button">>
) {
   const [open, setOpen] = useState(false);

   const { setTriggerRef, state, appendOnPortal } = usePopoverContext();

   const cloneEleRef = useRef<ElementRef<"button">>(null);

   const handleMouseEnter: EventListener = () => {
      setOpen(true);
   };

   const handleMouseLeave: EventListener = () => {
      setOpen(false);
   };

   useEffect(() => {
      const cloneEle = cloneEleRef.current as HTMLButtonElement;

      if (!cloneEle) return;

      if (setTriggerRef) {
         setTriggerRef(cloneEle);
      }

      cloneEle.addEventListener("mouseenter", handleMouseEnter);
      cloneEle.addEventListener("mouseleave", handleMouseLeave);

      return () => {
         cloneEle.removeEventListener("mouseenter", handleMouseEnter);
         cloneEle.removeEventListener("mouseleave", handleMouseLeave);
      };
   }, []);

   const classes = {
      container: "bg-slate-700 text-white",
   };

   const jsxContent = (
      <>
         {isValidElement(children) && (
            <>
               {onClick
                  ? cloneElement(children, {
                       ref: cloneEleRef,
                       onClick,
                    } as HTMLProps<HTMLButtonElement>)
                  : cloneElement(children, {
                       ref: cloneEleRef,
                    } as HTMLProps<HTMLButtonElement>)}

               {!state?.isOpen && open && (
                  <div
                     className={`${classes.container} absolute whitespace-nowrap -translate-x-1/2 left-1/2 rounded-md ${position} ${className}`}
                  >
                     {content}
                  </div>
               )}
            </>
         )}
      </>
   );

   if (isValidElement(children))
      return (
         <>
            {!!setTriggerRef ? (
               <>
                  {appendOnPortal ? (
                     <div className="relative">{jsxContent}</div>
                  ) : (
                     jsxContent
                  )}
               </>
            ) : (
               <div className="relative">{jsxContent}</div>
            )}
         </>
      );
}

export default forwardRef(ToolTip);
