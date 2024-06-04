import classNames from "classnames/bind";
import styles from "./Modal.module.scss";
import { ReactNode } from "react";
import { createPortal } from "react-dom";
const cx = classNames.bind(styles);

type Props = {
   children?: ReactNode;
   close: () => void;
   child?: boolean;
   z?: string;
};

function Modal({ children, close, child, z }: Props) {
   return (
      <>
         {createPortal(
            <>
               <div
                  className={cx("overlay", { child }, `${z ?? ""}`)}
                  onClick={close}
               ></div>
               {children && <div className={cx("modal", z ?? "")}>{children}</div>}
            </>,
            document.querySelector("#portals")!
         )}
      </>
   );
}

export default Modal;
