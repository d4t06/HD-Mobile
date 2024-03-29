import { ArrowPathIcon } from "@heroicons/react/16/solid";
import { ReactNode } from "react";

type Props = {
  onClick?: () => void;
  isLoading?: boolean;
  circle?: boolean;
  primary?: boolean;
  children: ReactNode;
  disable?: boolean;
  className?: string;
  backClass?: string;
  type?: HTMLButtonElement["type"];
};
export default function Button({
  onClick,
  circle,
  isLoading,
  primary,
  disable,
  type = "button",
  children,
  className,
  backClass,
}: Props) {
  const classes = {
    button: `text-[14px] ${
      !primary ? "inline-flex items-center justify-center" : "p-0 group border-0"
    } font-[600]`,
    primary: "rounded-[8px] bg-[#8f1313] text-[white] translate-y-[2px]",
    circle: "rounded-[50%] p-[6px]",
    font: "bg-[#cd1818] transition-transform flex items-center justify-center rounded-[8px] px-[16px] py-[6px] translate-y-[-4px] group-active:translate-y-[-2px] sm:group-hover:translate-y-[-6px]",
  };

  const content = (
    <>
      {isLoading && <ArrowPathIcon className="w-[24px] animate-spin"/> }
      {!isLoading && children}
    </>
  );

  return (
    <button
      type={type || "button"}
      onClick={onClick}
      disabled={isLoading || disable}
      className={`${disable ? "opacity-60 pointer-events-none" : ""} ${classes.button} ${
        primary ? classes.primary : ""
         } ${circle ? classes.circle : ""} ${!primary ? className : ""}
         ${backClass ? backClass : ''}
      `}
    >
      {primary ? (
        <span className={`${classes.font} ${primary ? className : ""}`}>{content}</span>
      ) : (
        content
      )}
    </button>
  );
}
