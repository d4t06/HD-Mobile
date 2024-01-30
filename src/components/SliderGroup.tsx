import { Dispatch, Ref, SetStateAction, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

import Empty from "@/components/ui/Empty";
import { Slider, SliderImage, SliderImageSchema, SliderSchema } from "@/types";

import { usePrivateRequest } from "@/hooks";
import { Gallery, Modal } from "@/components";
import { useToast } from "@/store/ToastContext";
import OverlayCTA from "@/components/ui/OverlayCTA";
import Image from "@/components/ui/Image";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";

const SLIDER_URL = "/slider-management/sliders";

type SliderGroupProps = {
   initSlider: Slider;
   isExist: boolean;
   color_ascii: string;
   paddingRatio?: string;
   width?: string;
   setIsChange?: Dispatch<SetStateAction<boolean>>;
};

export type SliderRef = {
   submit: () => Promise<(SliderSchema & { id: number; color_ascii: string }) | undefined>;
   validate: () => boolean;
};

function SliderGroup(
   { initSlider, isExist, color_ascii, paddingRatio, width, setIsChange }: SliderGroupProps,
   ref: Ref<SliderRef>
) {
   const [sliderImages, setSlideImages] = useState<SliderImage[]>(initSlider.images);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [error, setError] = useState(false);

   const curIndex = useRef(0);
   const ranEffect = useRef(false);
   const openGalleryType = useRef<"add" | "change">("add");

   // hooks
   const { setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   const handleOpenModal = (type: typeof openGalleryType.current, i?: number) => {
      openGalleryType.current = type;
      curIndex.current = i || 0;
      setIsOpenModal(true);
   };
   const filterImages = (image_url: string[]) => {
      return image_url.filter((url) => {
         const currentImageUrls = sliderImages.map((si) => si.image_url);
         return !currentImageUrls.includes(url);
      });
   };

   const handleAddSliderImage = (imageUrlList: string[]) => {
      const filteredImageUrls = filterImages(imageUrlList);
      if (!filterImages.length) return;

      setIsChange && setIsChange(true);
      switch (openGalleryType.current) {
         case "add":
            const initSliderImageArray = filteredImageUrls.map(
               (url) => ({ image_url: url, id: undefined } as SliderImage)
            );
            setSlideImages((prev) => [...prev, ...initSliderImageArray]);
            setError(false);
            break;
         case "change":
            const newImages = [...sliderImages];
            newImages[curIndex.current].image_url = imageUrlList[0];
            setSlideImages(newImages);
      }
   };

   const handleRemoveSliderImage = (index: number) => {
      const newImages = [...sliderImages];
      newImages.splice(index, 1);
      setSlideImages(newImages);
      if (setIsChange) setIsChange(true);
   };

   const trackingSliderImages = () => {
      let newSliderImages: SliderImage[] = [];
      if (!isExist) newSliderImages = sliderImages;
      else
         sliderImages.forEach((UKImage) => {
            const exist = initSlider.images.find((existImage) => existImage.image_url === UKImage.image_url);
            if (!exist) newSliderImages.push(UKImage);
         });

      let removeSliderImages: number[] = [];
      if (isExist) {
         // slider image alway include id when have init sliderI images
         console.log("check slider imag", sliderImages);

         initSlider.images.forEach((existImage) => {
            const mustExistImage = sliderImages.find((imageNeedToDefine) => existImage.id === imageNeedToDefine.id);
            if (!mustExistImage) removeSliderImages.push(existImage.id as number);
         });
      }

      return { newSliderImages, removeSliderImages };
   };

   const validate = () => {
      if (!sliderImages.length || !color_ascii) {
         setError(true);
         return true;
      } else return false;
   };

   const submit = async () => {
      try {
         const sliderData: SliderSchema = {
            slider_name: initSlider.slider_name,
         };

         let sliderDataToReturn: (SliderSchema & { id: number; color_ascii: string }) | undefined = undefined;

         if (!isExist) {
            const res = await privateRequest.post(SLIDER_URL, sliderData, {
               headers: { "Content-Type": "application/json" },
            });

            const sliderRes = res.data as SliderSchema & { id: number };
            sliderDataToReturn = { ...sliderData, id: sliderRes.id, color_ascii };
         }

         const { newSliderImages, removeSliderImages } = trackingSliderImages();

         if (newSliderImages.length) {
            const slider_id = isExist ? initSlider?.id : sliderDataToReturn?.id;
            if (!slider_id) {
               setErrorToast("Error when add slider images");
               return;
            }

            const sliderImages: SliderImageSchema[] = newSliderImages.map((image) => ({
               image_url: image.image_url,
               slider_id,
            }));

            console.log(">>> api add slider images ", sliderImages.length);
            await privateRequest.post(`${SLIDER_URL}/images`, sliderImages, {
               headers: { "Content-Type": "application/json" },
            });
         }

         if (removeSliderImages.length) {
            console.log(">>> api remove slider image ", removeSliderImages.length);

            for await (const id of removeSliderImages) {
               await privateRequest.delete(`${SLIDER_URL}/images/${id}`);
            }
         }

         return sliderDataToReturn;
      } catch (error) {
         console.log({ message: error });
         throw new Error("error");
      }
   };

   useImperativeHandle(ref, () => ({
      submit,
      validate,
   }));

   //  update slider image update to date with product data
   useEffect(() => {
      if (!ranEffect.current) {
         ranEffect.current = true;
         return;
      }

      if (initSlider.images.length) setSlideImages(initSlider.images);
   }, [initSlider]);

   return (
      <>
         <div className="row">
            {sliderImages.map((sI, index) => (
               <div key={index} className={`col ${width ?? "w-2/12"}`}>
                  <Empty pushAble={false} className={paddingRatio ?? "pt-[50%]"}>
                     <Image classNames="object-cover object-center h-full" src={sI.image_url} />
                     <OverlayCTA
                        data={[
                           {
                              cb: () => handleRemoveSliderImage(index),
                              icon: <TrashIcon className="w-[24px]" />,
                           },
                           {
                              cb: () => handleOpenModal("change", index),
                              icon: <ArrowPathIcon className="w-[24px]" />,
                           },
                        ]}
                     />
                  </Empty>
               </div>
            ))}
            <div className={`col ${width ?? "w-2/12"}`}>
               <Empty
                  className={`${paddingRatio ?? "pt-[50%]"}`}
                  fontClassName={`${error ? "bg-red-200" : "bg-[#f1f1f1]"}`}
                  onClick={() => handleOpenModal("add")}
               />
            </div>
         </div>

         {isOpenModal && (
            <Modal setShowModal={setIsOpenModal}>
               <Gallery multiple setImageUrl={handleAddSliderImage} setIsOpenModal={setIsOpenModal} />
            </Modal>
         )}
      </>
   );
}

export default forwardRef(SliderGroup);
