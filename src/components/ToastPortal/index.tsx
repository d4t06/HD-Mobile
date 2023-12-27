import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import ToastItem from "./ToastItem";
import { useToast } from "@/store/ToastContext";
import classNames from "classnames/bind";

import styles from "./ToastPortal.module.scss";

interface Props {
   time?: number;
   autoClose: boolean;
}

const cx = classNames.bind(styles);

const ToastPortal = ({ time = 6000, autoClose }: Props) => {
   const { setToasts, toasts } = useToast();
   const [removing, setRemoving] = useState("");

   const removeToast = (id: string) => {
      setToasts((t) => t.filter((toast) => toast.id != id));
   };

   useEffect(() => {
      if (removing) {
         // console.log("set toast");
         setToasts((t) => t.filter((toast) => toast.id != removing));
      }
   }, [removing]);

   // problem
   // 3 time add toast => run useEffect 3 times, generate setToast time out 3 in background
   // when each setToast time out finish
   // toasts change lead to useEffect run trigger setToast time out after that;
   useEffect(() => {
      if (!autoClose || !toasts.length) return;
      // console.log("run main useEffect");

      const id = toasts[toasts.length - 1].id;
      setTimeout(() => {
         // console.log("run time out check id ", id);
         setRemoving(id);
      }, time);
   }, [toasts]);

   return (
      <>
         {createPortal(
            <div className={cx("container")}>
               <div className={cx("content-wrapper")}>
                  {!!toasts.length &&
                     toasts.map((toast, index) => <ToastItem onClick={removeToast} key={index} toast={toast} />)}
               </div>
            </div>,
            document.getElementById("portals")!
         )}
      </>
   );
};

export default ToastPortal;
