import useGalleryAction from "@/hooks/useGalleryActiont";
import { useImageContext } from "@/store/ImageContext";
import { useEffect, useMemo, useRef, useState } from "react";
import Skeleton from "../Skeleton";
import Modal, { ModalContentWrapper, ModalRef } from "../Modal";
import { Button } from "..";
import { ArrowPathIcon, ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import GalleryItem from "./GalleryItem";
import ChooseBtn from "./ChooseImageBtn";
import Image from "../ui/Image";
import { formatSize } from "@/utils/appHelper";
import { Link } from "react-router-dom";
import ChooseImageModal from "@/pages/Dashboard/_components/ChooseImageModal";

type Props = {
   setImageUrl: (images: ImageType[]) => void;
   closeModal: () => void;
   multiple?: boolean;
   width?: number;
   height?: number;
};

function Gallery({ setImageUrl, closeModal, multiple, ...props }: Props) {
   const { images, uploadingImages, page, shoudFetchingImage } = useImageContext();

   const [choseList, setChoseList] = useState<ImageType[]>([]);
   const [activeImage, setActiveImage] = useState<ImageType>();

   const modalRef = useRef<ModalRef>(null);

   const { actions, status } = useGalleryAction();

   const ableToChosenImage = !!activeImage;

   const handleSelect = (image: ImageType) => {
      const newChoseList = [...choseList];
      const index = newChoseList.findIndex((i) => i.id === image.id);

      if (index === -1) newChoseList.push(image);
      else newChoseList.splice(index, 1);

      setChoseList(newChoseList);
   };

   const handleSubmit = () => {
      if (multiple) {
         if (choseList.length) setImageUrl(choseList);
      } else {
         if (activeImage) setImageUrl([activeImage]);
      }

      closeModal();
   };

   // const handleImageLoaded: ReactEventHandler<HTMLImageElement> = (e) => {
   //   const target = e.target as HTMLImageElement;
   //   if (imageSizeRef.current) {
   //     imageSizeRef.current.innerText = `${target.naturalWidth} x ${target.naturalHeight}`;
   //   }
   // };

   const classes = {
      galleryTop: "flex justify-between border-b border-[--a-5-cl] mb-[10px] pb-[10px]",
      galleryBody: "flex-grow overflow-hidden flex mx-[-10px]",
      bodyLeft: "w-full sm:w-2/3 overflow-auto px-[10px]",
      bodyRight:
         "hidden sm:block pb-1 overflow-auto px-[10px] w-1/3 border-l border-[--a-5-cl] space-y-3",
   };

   const imageSkeleton = useMemo(
      () =>
         [...Array(12).keys()].map((item) => (
            <div key={item} className={"w-1/3 sm:w-1/6 px-[4px] mt-[8px]"}>
               <Skeleton className="pt-[100%]" />
            </div>
         )),
      [],
   );

   useEffect(() => {
      if (shoudFetchingImage.current) {
         shoudFetchingImage.current = false;
         actions({
            variant: "get-image",
            page: 1,
         });
      }
   }, []);

   return (
      <>
         <ModalContentWrapper className="w-[900px] h-[500px]">
            <div className={classes.galleryTop}>
               <div className={"flex items-center"}>
                  <p className="text-lg sm:text-xl font-bold">Gallery</p>
                  <Button
                     onClick={() => modalRef.current?.open()}
                     colors={"second"}
                     size={"clear"}
                     className="ml-3 p-1.5"
                  >
                     <ArrowUpTrayIcon className="w-5" />
                  </Button>
               </div>

               <Button
                  disabled={!ableToChosenImage}
                  onClick={handleSubmit}
                  colors={'third'}
               >
                  Select
               </Button>
            </div>
            <div className={classes.galleryBody}>
               <div className={classes.bodyLeft}>
                  <div className="flex flex-wrap mt-[-8px] overflow-x-hidden overflow-y-auto mx-[-4px]">
                     {uploadingImages.map((item, index) => (
                        <GalleryItem variant="upload" image={item} key={index}>
                           <ArrowPathIcon className="animate-spin absolute duration-1000 w-6" />
                        </GalleryItem>
                     ))}

                     {images.map((item, index) => (
                        <GalleryItem
                           variant="gallery-item"
                           key={index}
                           image={item}
                           active={activeImage?.id === item.id}
                           setActive={() => setActiveImage(item)}
                        >
                           {multiple && (
                              <ChooseBtn
                                 index={choseList.findIndex((i) => i.id === item.id)}
                                 select={() => handleSelect(item)}
                              />
                           )}
                        </GalleryItem>
                     ))}

                     {status === "get-image" && imageSkeleton}
                  </div>

                  {!!images.length && status !== "get-image" && (
                     <div className="text-center mt-[14px]">
                        <Button
                           colors={"second"}
                           onClick={() =>
                              actions({ variant: "get-image", page: page + 1 })
                           }
                        >
                           More
                        </Button>
                     </div>
                  )}
               </div>
               <div className={classes.bodyRight}>
                  {activeImage && (
                     <>
                        <Image
                           className="w-full rounded-lg"
                           src={activeImage.image_url}
                        />

                        <div className="[&_span]:ml-2 [&_span]:text-gray-600 text-sm ">
                           <p className="break-words text-lg font-bold">
                              {activeImage.name}
                           </p>
                           <p className="truncate">
                              Link:
                              <span>
                                 <Link
                                    className="hover:underline"
                                    to={activeImage.image_url}
                                    target="_blank"
                                 >
                                    {activeImage.image_url}
                                 </Link>
                              </span>
                           </p>
                           <p>
                              Size:
                              <span>{formatSize(activeImage.size)}</span>
                           </p>
                        </div>

                        <Button
                           loading={status === "delete-image"}
                           onClick={() =>
                              actions({
                                 variant: "delete-image",
                                 image: activeImage,
                              })
                           }
                           colors={'second'}
                        >
                           Delete
                        </Button>
                     </>
                  )}
               </div>
            </div>
         </ModalContentWrapper>

         <Modal variant="animation" ref={modalRef}>
            <ChooseImageModal {...props} title="Upload image" modalRef={modalRef} />
         </Modal>
      </>
   );
}

export default Gallery;
