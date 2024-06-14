import classNames from "classnames/bind";

import styles from "./ToastPortal.module.scss";

import { CheckIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/16/solid";

type Props = {
   toast: Toast;
   onClick?: (id: string) => void;
};

const cx = classNames.bind(styles);

export default function ToastItem({ toast, onClick }: Props) {
   return (
      <div
         onClick={() => (onClick ? onClick(toast.id) : undefined)}
         className={cx("item-container", {
            "bg-red-500 text-white": toast.title === "error",
            "bg-emerald-500 text-white": toast.title === "success",
         })}
      >
         {toast.title && (
            <>
               {toast.title === "success" && <CheckIcon className="w-[24px]" />}
               {toast.title === "error" && <XMarkIcon className="w-[24px]" />}
            </>
         )}
         <p className={cx("text")}>{toast.desc}</p>
      </div>
   );
}
