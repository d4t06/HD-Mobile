import classNames from "classnames/bind";
import styles from "./ImageSlider.module.scss";
import useSlider from "@/hooks/useSlider";

import Image from "../ui/Image";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";

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
                        <Image src={sliderImage.image.image_url} />
                     </div>
                  );
               })}
         </div>
         <div
            className={cx("left-arrow", "slider-control")}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={previous}
         >
            <ArrowLeftIcon className="w-[24px]" />
         </div>
         <div
            className={cx("right-arrow", "slider-control")}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={next}
         >
            <ArrowRightIcon className="w-[24px]" />
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
