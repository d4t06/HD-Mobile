import {
   cloneElement,
   ElementRef,
   forwardRef,
   HTMLProps,
   isValidElement,
   ReactNode,
   Ref,
} from "react";
import useTooltip from "@/hooks/useTooltip";

type Props = {
   children: ReactNode;
   className?: string;
   position?: "bottom" | "top";
   content: string;
   onClick?: () => void;
};

function ToolTip(
   {
      children,
      className = "px-2 py-1 text-sm font-[600]",
      position = "top",
      content,
      onClick,
   }: Props,
   _ref: Ref<ElementRef<"button">>
) {
   const { appendOnPortal, isOpen, setTriggerRef, state, triggerRef } =
      useTooltip();

   const _position = position || "top";

   const arrowPositionBaseOnParentMap: Record<typeof _position, string> = {
      top: "before:border-t-[#cd1818] before:bottom-0 before:translate-y-[calc(50%+6px)]",
      bottom: "before:border-b-[#cd1818] before:top-0 before:-translate-y-[calc(50%+6px)]",
   };

   const contentPositionMap: Record<typeof _position, string> = {
      top: "bottom-[calc(100%+8px)]",
      bottom: "top-[calc(100%+8px)]",
   };

   const classes = {
      arrow: `before:content-[''] before:absolute before:-translate-x-1/2 before:left-1/2 before:border-8 before:border-transparent ${arrowPositionBaseOnParentMap[_position]}`,

      content: `absolute z-[99] pointer-events-none border-[2px] border-[#a00000] text-sm font-[600] bg-[#cd1818] text-white whitespace-nowrap ${contentPositionMap[_position]} -translate-x-1/2 left-1/2 rounded-md`,
   };

   const jsxContent = (
      <>
         {isValidElement(children) && (
            <>
               {onClick
                  ? cloneElement(children, {
                       ref: triggerRef,
                       onClick,
                    } as HTMLProps<HTMLButtonElement>)
                  : cloneElement(children, {
                       ref: triggerRef,
                    } as HTMLProps<HTMLButtonElement>)}

               {!state?.isOpen && isOpen && (
                  <div
                     className={`${classes.content} ${classes.arrow} ${className}`}
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
