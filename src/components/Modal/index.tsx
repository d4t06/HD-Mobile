import classNames from "classnames/bind";
import styles from "./Modal.module.scss";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { createPortal } from "react-dom";
const cx = classNames.bind(styles);

type Props = {
   children?: ReactNode;
   setShowModal: Dispatch<SetStateAction<boolean>>;
   child?:boolean
   z?: string
};

function Modal({ children, setShowModal, child, z }: Props) {
   return (
      <>
         {createPortal(
            <>
               <div className={cx("overlay", {child}, `${z ?? ''}`)} onClick={() => setShowModal(false)}></div>
               {children && (
                  <div className={cx("modal")}>
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
