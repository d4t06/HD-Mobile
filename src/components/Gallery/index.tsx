import { useEffect, useState, useRef, Dispatch, SetStateAction, useMemo } from "react";
import classNames from "classnames/bind";

import { Button } from "../";

import styles from "./Gallery.module.scss";
import usePrivateRequest from "@/hooks/usePrivateRequest";

import { formatSize, sleep } from "@/utils/appHelper";
import { useImage } from "@/store/ImageContext";
import Skeleton from "../Skeleton";
import { ArrowPathIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import PushButton from "../ui/PushButton";

const cx = classNames.bind(styles);

type Props = {
   setImageUrl: (image_url: string[]) => void;
   close: () => void;
   multiple?: boolean;
};

type getImagesRes = {
   page: number;
   images: ImageType[];
   pageSize: number;
   count: number;
};

const IMAGE_URL = "/image-management/images";

function Gallery({ setImageUrl, close, multiple = false }: Props) {
   const [choseList, setChoseList] = useState<string[]>([]);
   const [active, setActive] = useState<ImageType>();
   const [status, setStatus] = useState<
      "fetching" | "loadingImages" | "success" | "error"
   >("loadingImages");
   const [apiLoading, setApiLoading] = useState(false);

   const ranUseEffect = useRef(false);

   // hooks
   const privateRequest = usePrivateRequest();
   const {
      imageStore: { currentImages, tempImages, page, count, pageSize },
      storeImages,
   } = useImage();

   const isLoading = status === "fetching" || status === "loadingImages";

   const ableToChosenImage = useMemo(
      () => (multiple ? !!choseList.length : !!active) && !isLoading,
      [active, choseList]
   );
   const isRemaining = useMemo(() => count - page * pageSize > 0, [currentImages]);
   const isNoHaveImage = !currentImages.length && !tempImages.length && !isLoading;

   const handleSubmit = () => {
      switch (multiple) {
         case true:
            if (!choseList.length) return;

            setImageUrl(choseList);
            break;
         case false:
            if (!active) return;
            setImageUrl([active.image_url]);
      }
      close();
   };

   const handleSelect = (image: ImageType) => {
      const newChoseList = [...choseList];
      const index = newChoseList.indexOf(image.image_url);

      if (index === -1) newChoseList.push(image.image_url);
      else newChoseList.splice(index, 1);

      setChoseList(newChoseList);
   };

   const handleDeleteImage = async () => {
      try {
         if (!active || !active.public_id) return;

         setApiLoading(true);
         const controller = new AbortController();

         await privateRequest.delete(
            `${IMAGE_URL}/${encodeURIComponent(active.public_id)}`
         );

         const newImages = currentImages.filter(
            (image) => image.public_id !== active.public_id
         );
         storeImages({ currentImages: newImages });

         return () => {
            controller.abort();
         };
      } catch (error) {
         console.log({ message: error });
      } finally {
         setApiLoading(false);
      }
   };

   const getImages = async (page: number) => {
      try {
         const res = await privateRequest.get(`${IMAGE_URL}?page=${page}`); //res.data
         const data = res.data as getImagesRes;
         const newImages = [...currentImages, ...data.images];

         storeImages({
            count: data.count,
            pageSize: data.pageSize,
            page: data.page,
            currentImages: newImages,
         });

         if (import.meta.env.DEV) await sleep(300);
         setStatus("success");
      } catch (error) {
         console.log({ message: error });
         setStatus("error");
      }
   };

   const imageSkeleton = useMemo(
      () =>
         [...Array(8).keys()].map((item) => (
            <div key={item} className={cx("w-1/5", "px-[4px] gallery-item")}>
               <Skeleton className="pt-[100%] w-[100% rounded-[6px]" />
            </div>
         )),
      []
   );

   const renderImages = useMemo(() => {
      return currentImages.map((item, index) => {
         const indexOf = choseList.indexOf(item.image_url);
         const isInChoseList = indexOf !== -1;

         return (
            <div key={index} className={cx("w-1/5 px-[4px]")}>
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
      });
   }, [active, currentImages, choseList]);

   const renderTempImages = useMemo(
      () =>
         !!tempImages.length &&
         tempImages?.map((item, index) => {
            return (
               <div key={index} className={cx("w-1/5")}>
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

   useEffect(() => {
      if (currentImages.length) {
         setTimeout(() => {
            setStatus("success");
         }, 300);
         return;
      }

      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getImages(1);
      }
   }, []);

   return (
      <div className={cx("gallery")}>
         <div className={cx("gallery__top")}>
            <div className={cx("left")}>
               <h1 className="text-[22px] font-semibold">Images ({count})</h1>
               <div>
                  <label
                     className={cx("input-label", {
                        disable: isLoading,
                     })}
                     htmlFor="image_upload"
                  >
                     <span>
                        <ArrowUpTrayIcon className="w-[22px] mr-[6px]" />
                        Upload
                     </span>
                  </label>
               </div>
            </div>

            <PushButton disabled={!ableToChosenImage} onClick={handleSubmit}>
               Chọn
            </PushButton>
         </div>
         <div className={cx("gallery__body", "flex mx-[-8px]")}>
            <div className={cx("w-2/3 px-[8px] no-scrollbar", "left")}>
               <div className="flex flex-wrap gap-y-[8px]">
                  {status === "error" && <p>Some thing went wrong</p>}
                  {status !== "error" && (
                     <>
                        {renderTempImages}
                        {isNoHaveImage ? (
                           <p className="text-[16px]">No have image jet...</p>
                        ) : (
                           renderImages
                        )}
                     </>
                  )}

                  {status === "loadingImages" && imageSkeleton}
               </div>

               {!!currentImages.length && isRemaining && (
                  <div className="text-center mt-[14px]">
                     <PushButton onClick={() => getImages(page + 1)}>Thêm</PushButton>
                  </div>
               )}
            </div>
            <div className={cx("col w-1/3 px-[8px] overflow-hidden border-l-[2px]")}>
               {active && (
                  <div className={cx("image-info")}>
                     <h2 className="break-words">{active.name}</h2>
                     <ul>
                        <li>
                           <h4 className="font-semibold">Image path:</h4>{" "}
                           <a target="blank" href={active.image_url}>
                              {active.image_url}
                           </a>
                        </li>
                        <li>
                           <h4 className="font-semibold">Size:</h4>{" "}
                           {formatSize(active.size)}
                        </li>
                     </ul>
                     <PushButton loading={apiLoading} onClick={handleDeleteImage}>
                        Xóa
                     </PushButton>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
}

export default Gallery;
