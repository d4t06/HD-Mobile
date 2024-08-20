import { useState, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./Gallery.module.scss";
import { useImage } from "@/store/ImageContext";
import Skeleton from "../Skeleton";
import { ArrowPathIcon, ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "..";
import useGalleryAction from "@/hooks/useGalleryActiont";
import ImageList from "./ImageList";
import ImageInfo from "./ImageInfo";

const cx = classNames.bind(styles);

type Props = {
   setImageUrl: (image_url: ImageType[]) => void;
   closeModal: () => void;
   multiple?: boolean;
};

function Gallery({ setImageUrl, closeModal, multiple = false }: Props) {
   const { currentImages, tempImages, page, count, page_size } = useImage();

   const [choseList, setChoseList] = useState<ImageType[]>([]);
   const [active, setActive] = useState<ImageType | null>(null);

   // hooks
   const { deleteImage, getImages, fetching, imageStatus } = useGalleryAction();

   const ableToSubmit = useMemo(
      () => (multiple ? !!choseList.length : !!active),
      [active, choseList]
   );
   const isRemaining = useMemo(() => count - page * page_size > 0, [currentImages]);
   const isNoHaveImage =
      !currentImages.length && !tempImages.length && imageStatus !== "fetching";

   const handleSubmit = () => {
      switch (multiple) {
         case true:
            if (!choseList.length) return;

            setImageUrl(choseList);
            break;
         case false:
            if (!active) return;
            setImageUrl([active]);
      }
      closeModal();
   };

   const handleSelect = (image: ImageType) => {
      const newChoseList = [...choseList];
      const index = newChoseList.findIndex((i) => i.id === image.id);

      if (index === -1) newChoseList.push(image);
      else newChoseList.splice(index, 1);

      setChoseList(newChoseList);
   };

   const handleDeleteImage = async () => {
      if (!active || !active.public_id) return;
      await deleteImage(active.public_id);
   };

   const imageSkeleton = useMemo(
      () =>
         [...Array(6).keys()].map((item) => (
            <div
               key={item}
               className={cx("w-1/3 sm:w-1/5 mt-[8px]", "px-[4px] gallery-item")}
            >
               <Skeleton className="pt-[100%] w-[100% rounded-[6px]" />
            </div>
         )),
      []
   );

   const renderTempImages = useMemo(
      () =>
         !!tempImages.length &&
         tempImages?.map((item) => {
            return (
               <div
                  key={item.image_url}
                  className={cx("w-1/3 sm:w-1/5 mt-[8px] px-[4px]")}
               >
                  <div className={cx("image-container")}>
                     <div className={cx("image-frame", "relative")}>
                        <img className="opacity-[.4]" src={item.image_url} alt="img" />
                        <ArrowPathIcon className="animate-spin absolute w-[30px]" />
                     </div>
                  </div>
               </div>
            );
         }),
      [tempImages]
   );

   const classes = {
      galleryTop: "flex justify-between border-b border-[#ccc] mb-[10px] pb-[10px]",
   };

   return (
      <div className={cx("gallery")}>
         <div className={classes.galleryTop}>
            <div className={"flex items-center"}>
               <p className="text-[18px] sm:text-[22px] font-[500]">Gallery</p>
               <Button
                  disabled={!!tempImages.length}
                  colors={"second"}
                  size="clear"
                  className="ml-[10px] h-full"
               >
                  <label
                     className="flex items-center px-[10px] h-full cursor-pointer"
                     htmlFor="image_upload"
                  >
                     <ArrowUpTrayIcon className="w-[20px]" />
                     <span className="hidden sm:block ml-[6px]">Upload</span>
                  </label>
               </Button>
            </div>

            <div className="flex">
               <Button
                  className="mr-[10px]"
                  colors={"third"}
                  disabled={!ableToSubmit}
                  onClick={handleSubmit}
               >
                  Select
               </Button>

               <Button
                  size={"clear"}
                  className="px-[6px]"
                  colors={"second"}
                  onClick={closeModal}
               >
                  <XMarkIcon className="w-[20px]" />
               </Button>
            </div>
         </div>
         <div className={cx("gallery__body", "flex mx-[-8px]")}>
            <div className={cx("px-[8px] no-scrollbar", "left")}>
               <div className="flex flex-wrap mt-[-8px]">
                  {imageStatus === "error" && <p>Some thing went wrong</p>}
                  {imageStatus !== "error" && (
                     <>
                        {renderTempImages}
                        {isNoHaveImage ? (
                           <p className="text-[16px]">No have image jet...</p>
                        ) : (
                           <ImageList
                              active={active}
                              choseList={choseList}
                              handleSelect={handleSelect}
                              images={currentImages}
                              setActive={setActive}
                              multiple={multiple}
                           />
                        )}
                     </>
                  )}

                  {imageStatus === "fetching" && imageSkeleton}
               </div>

               {!!currentImages.length && isRemaining && (
                  <div className="text-center mt-[30px]">
                     <Button
                        disabled={!!tempImages.length}
                        loading={imageStatus === "fetching"}
                        colors={"second"}
                        onClick={() => getImages(page + 1)}
                     >
                        Thêm
                     </Button>
                  </div>
               )}
            </div>
            <ImageInfo
               fetching={fetching}
               handleDeleteImage={handleDeleteImage}
               image={active}
            />
         </div>
      </div>
   );
}

export default Gallery;
