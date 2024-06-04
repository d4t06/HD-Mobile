import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { VariantProps, cva } from "class-variance-authority";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

const classes = {
   active: "before:shadow-none translate-y-[2px] text-[#cd1818]",
   button: "inline-flex relative font-[500] items-center justify-center z-0",
};

const ButtonVariant = cva(classes.button, {
   variants: {
      variant: {
         primary:
            "before:content-[''] before:absolute before:border-[2px] before:z-[-1] before:inset-0 before:rounded-[8px] rounded-[8px] bg-[#fff] active:translate-y-[2px] active:before:shadow-none",
         clear: "",
      },
      size: {
         clear: "",
         primary: "px-[12px] py-[4px]",
      },
      colors: {
         primary: "before:border-[#cd1818] text-[#333] before:shadow-[0_2px_0_#cd1818]",
         second: "before:border-[#ccc] text-[#333] before:shadow-[0_2px_0_#ccc]",
      },
   },
   defaultVariants: {
      size: "primary",
      colors: "primary",
      variant: "primary",
   },
});

interface Props extends VariantProps<typeof ButtonVariant> {
   onClick?: () => void;
   loading?: boolean;
   children: ReactNode;
   disabled?: boolean;
   className?: string;
   type?: HTMLButtonElement["type"];
   to?: string;
   active?: boolean;
}
export default function Button({
   onClick,
   disabled,
   type = "button",
   children,
   loading,
   className,
   size,
   variant,
   colors,
   to,
   active,
}: Props) {
   const content = (
      <>
         {loading && <ArrowPathIcon className="w-[24px] animate-spin" />}
         {!loading && children}
      </>
   );

   return (
      <>
         {to ? (
            <Link
               to={to}
               className={`${ButtonVariant({ variant, size, colors, className })} ${
                  active ? classes.active : ""
               }`}
            >
               {content}
            </Link>
         ) : (
            <button
               type={type || "button"}
               onClick={onClick}
               disabled={loading || disabled}
               className={`${ButtonVariant({ variant, size, colors, className })} ${
                  active ? classes.active : ""
               }`}
            >
               {content}
            </button>
         )}
      </>
   );
}
