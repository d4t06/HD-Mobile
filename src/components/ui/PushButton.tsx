import { VariantProps, cva } from "class-variance-authority";
import { ButtonHTMLAttributes, MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router-dom";

const classes = {
   base: "rounded-[8px] translate-y-[2px]",
   font: "transition-transform flex items-center justify-center rounded-[8px] translate-y-[-4px] active:!translate-y-[-2px] sm:hover:translate-y-[-6px]",
   basePrimaryColor: "bg-[#8f1313]",
   fontPrimaryColor: "bg-[#cd1818] text-white",
   baseSecondColor: "bg-[#ccc]",
   fontSecondColor: "bg-[#f1f1f1] text-black",
};

const BaseVariant = cva(classes.base, {
   variants: {
      colors: {
         primary: classes.basePrimaryColor,
         second: classes.baseSecondColor,
      },
   },
   defaultVariants: {
      colors: "primary",
   },
});

const FontVariant = cva(classes.font, {
   variants: {
      colors: {
         primary: classes.fontPrimaryColor,
         second: classes.fontSecondColor,
      },
      size: {
         primary: "px-[24px] py-[6px]",
         full: "w-full py-[6px]",
         clear: "",
      },
      weight: {
         primary: "font-[600]",
         semi: "font-[500]",
         clear: "",
      },
   },

   defaultVariants: {
      colors: "primary",
      size: "primary",
      weight: "primary",
   },
});

interface Props
   extends ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof BaseVariant>,
      VariantProps<typeof FontVariant> {
   children: ReactNode;
   loading?: boolean;
   onClick?: MouseEventHandler;
   baseClassName?: string;
   to?: string;
}

export default function PushButton({
   children,
   loading,
   onClick,
   colors,
   size,
   className,
   type,
   baseClassName,
   disabled,
   weight,
   to,
}: Props) {
   return (
      <button
         onClick={onClick}
         type={type || "button"}
         disabled={loading || disabled}
         className={`${BaseVariant({ colors, className: baseClassName })}`}
      >
         {to ? (
            <Link
               className={`${FontVariant({ colors, size, weight, className })}`}
               to={to}
            >
               {children}
            </Link>
         ) : (
            <span className={`${FontVariant({ colors, size, weight, className })}`}>
               {children}
            </span>
         )}
      </button>
   );
}
