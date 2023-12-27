import classNames from "classnames/bind";
import styles from "./Modal.module.scss";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { createPortal } from "react-dom";
import { Popup } from "..";

const cx = classNames.bind(styles);

type Props = {
   children: ReactNode;
   setShowModal: Dispatch<SetStateAction<boolean>>;
};

function Modal({ children, setShowModal }: Props) {
   return (
      <>
         {createPortal(
            <>
               <div className={cx("overlay")} onClick={() => setShowModal(false)}></div>
               {children && (
                  <div className={cx("modal")}>
                     <Popup>
                     {children}
                  </div>
               )}
            </>,
            document.querySelector("#portals")!
         )}
      </>
   );
}

export default Modal;
