import classNames from "classnames/bind";
import styles from "./ImageSlider.module.scss";
import useSlider from "@/hooks/useSlider";
import { SliderImage } from "@/types";
import Image from "../ui/Image";

const cx = classNames.bind(styles);

type Props = {
   data: SliderImage[];
   className?: string;
   autoSlide?: number;
};

function ImageSlider({ data, className = "pt-[25%]", autoSlide }: Props) {
   // use hooks
   const { attributeObj, curIndex, sliderRef, next, previous } = useSlider({
      data,
      autoSlide,
   });

   const classes = cx("image-slider");

   return (
      <div className={`${className} relative`}>
         <div className={`${classes} `} {...attributeObj} ref={sliderRef}>
            {!!data.length &&
               data.map((sliderImage, index) => {
                  return (
                     <div key={index} className={cx("slider-item")}>
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
            <span>{data.length ? curIndex : 0}</span>
            <span>/</span>
            <span>{data.length}</span>
         </div>
      </div>
   );
}

export default ImageSlider;
