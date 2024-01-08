import classNames from "classnames/bind";
import { useRef } from "react";
import styles from "./ImageSlider.module.scss";
import useSlider from "@/hooks/useSlider";
import Image from "../Image";
import { SliderImage } from "@/types";

const cx = classNames.bind(styles);

type Props = {
   data: SliderImage[];
   className?: string;
};

function ImageSlider({ data, className = "pt-[25%]" }: Props) {
   const imageSliderRef = useRef<HTMLDivElement>(null);

   // use hooks
   const { attributeObj, curIndex, imageWidth, next, previous } = useSlider({
      imageSliderRef,
      data,
   });

   const classes = cx("image-slider");

   return (
      <div className={`${className} relative`}>
         <div className={`${classes} `} {...attributeObj} ref={imageSliderRef}>
            {!!data.length &&
               data.map((sliderImage, index) => {
                  return (
                     <div key={index} style={{ width: imageWidth }} className={cx("slider-item")}>
                        <Image src={sliderImage.image_url} />
                     </div>
                  );
               })}
         </div>
         <div
            className={cx("left-arrow", "slider-control")}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={previous}
         >
            <i className="material-icons">arrow_back</i>
         </div>
         <div className={cx("right-arrow", "slider-control")} onMouseDown={(e) => e.stopPropagation()} onClick={next}>
            <i className="material-icons">arrow_forward</i>
         </div>
         <div className={cx("slider-index")}>
            <span>{data.length ? curIndex : 0}</span> / <span>{data.length}</span>
         </div>
      </div>
   );
}

export default ImageSlider;
