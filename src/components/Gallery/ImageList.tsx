import classNames from "classnames/bind";
import styles from "./Gallery.module.scss";

type Props = {
   active: ImageType | null;
   choseList: ImageType[];
   images: ImageType[];
   multiple?: boolean;
   setActive: (i: ImageType) => void;
   handleSelect: (i: ImageType) => void;
};

const cx = classNames.bind(styles);

export default function ImageList({
   active,
   choseList,
   images,
   handleSelect,
   setActive,
   multiple,
}: Props) {
   return (
      <>
         {images.map((item) => {
            const indexOf = choseList.findIndex((i) => i.id === item.id);
            const isInChoseList = indexOf !== -1;

            return (
               <div key={item.image_url} className={cx("w-1/3 sm:w-1/5 mt-[8px] px-[4px]")}>
                  <div className={cx("image-container", "group")}>
                     <div
                        onClick={() => setActive(item)}
                        className={cx("image-frame", {
                           active: active ? active.id === item.id : false,
                        })}
                     >
                        <img src={item.image_url} alt="img" />
                     </div>
                     {multiple && (
                        <button
                           onClick={() => handleSelect(item)}
                           className={`${
                              isInChoseList
                                 ? "bg-[#cd1818] "
                                 : "bg-[#ccc] hover:bg-[#cd1818]"
                           } z-10 h-[24px] w-[24px] absolute rounded-[6px] text-[white] left-[10px] bottom-[10px]`}
                        >
                           {isInChoseList && (
                              <span className="text-[18px] font-semibold leading-[1]">
                                 {indexOf + 1}
                              </span>
                           )}
                        </button>
                     )}
                  </div>
               </div>
            );
         })}
      </>
   );
}
