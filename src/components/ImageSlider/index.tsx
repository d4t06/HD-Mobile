import classNames from "classnames/bind";
import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./ImageSlider.module.scss";
import useSlider from "@/hooks/useSlider";
import Image from "../Image";

const cx = classNames.bind(styles);

type Props = {
   banner?: boolean;
   data: string[];
};

function ImageSlider({ banner, data }: Props) {
   const imageSliderRef = useRef<HTMLDivElement>(null);

   // use hooks
   const { attributeObj, curIndex, imageWidth, next, previous } = useSlider({
      imageSliderRef,
      data,
   });

   const classes = cx("image-slider", {
      banner,
   });

   return (
      <div className={cx("image-slider-frame")} {...attributeObj}>
         <div className={classes} ref={imageSliderRef}>
            <div
               className={cx("left-arrow", "slider-control")}
               onMouseDown={(e) => e.stopPropagation()}
               onClick={previous}
            >
               <i className="material-icons">arrow_back</i>
            </div>
            <div
               className={cx("right-arrow", "slider-control")}
               onMouseDown={(e) => e.stopPropagation()}
               onClick={next}
            >
               <i className="material-icons">arrow_forward</i>
            </div>
            <div className={cx("slider-index")}>
               <span>{curIndex}</span> / <span>{data.length}</span>
            </div>
            {!!data.length &&
               data.map((src, index) => {
                  return (
                     <div key={index} style={{ width: imageWidth }} className={cx("slider-item")}>
                        <Image src={src} />
                     </div>
                  );
               })}
         </div>
      </div>
   );
}

export default ImageSlider;
