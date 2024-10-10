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
   sticky?: boolean;
   size?: number;
};

function ImageSlider({
   data,
   className = "pt-[32%]",
   autoSlide,
   sticky,
   size = 2,
}: Props) {
   // use hooks
   const { attributeObj, sliderRef, next, previous } = useSlider({
      data,
      autoSlide,
      size,
   });

   if (!data.length) return <></>;

   return (
      <div className={`${sticky ? "sm:sticky top-3" : ""} relative`}>
         <div
            className={`${cx("image-slider", `size-${size}`)} `}
            {...attributeObj}
            ref={sliderRef}
         >
            {!!data.length &&
               data.map((sliderImage, index) => {
                  return (
                     <div key={index} className={`${cx("slider-item")} `}>
                        <div className={`${className} w-full relative`}>
                           <Image src={sliderImage.image.image_url} />
                        </div>
                     </div>
                  );
               })}
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

            {/* <div className={cx("slider-index")}>
            <span>{data.length ? curIndex : 0}</span>
            <span>/</span>
            <span>{data.length}</span>
         </div> */}
         </div>
      </div>
   );
}

export default ImageSlider;
