import { Dispatch, Ref, SetStateAction, forwardRef, useImperativeHandle, useRef, useState } from "react";

import Empty from "@/components/ui/Empty";
import { Slider, SliderImage, SliderImageSchema, SliderSchema } from "@/types";

import { usePrivateRequest } from "@/hooks";
import { Gallery, Modal } from "@/components";
import { useToast } from "@/store/ToastContext";
import OverlayCTA from "@/components/ui/OverlayCTA";
import Image from "@/components/Image";
// import { sleep } from "@/utils/appHelper";
// import { sleep } from "@/utils/appHelper";

// const cy = paddings.bind(stylesMain);

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
   const [sliderImages, setSlideImages] = useState<SliderImage[]>(initSlider.images || []);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [error, setError] = useState(false);
   const curIndex = useRef(0);
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
      if (!initSlider.images.length) newSliderImages = sliderImages;
      else
         sliderImages.forEach((UKImage) => {
            const exist = initSlider.images.find((existImage) => existImage.image_url === UKImage.image_url);
            if (!exist) newSliderImages.push(UKImage);
         });

      let removeSliderImages: number[] = [];
      if (initSlider.images.length) {
         // slider image alway include id when have init sliderI images
         initSlider.images.forEach((existImage) => {
            const exist = sliderImages.find((UKImage) => existImage.id === UKImage.id);
            if (!exist) removeSliderImages.push(existImage.id as number);
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
         console.log("check image new =", newSliderImages, "remove =", removeSliderImages);

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

            await privateRequest.post(`${SLIDER_URL}/images`, sliderImages, {
               headers: { "Content-Type": "application/json" },
            });
         }

         if (removeSliderImages.length) {
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

   return (
      <>
         <div className="row">
            {sliderImages.map((sI, index) => (
               <div key={index} className={`col ${width ?? "w-2/12"}`}>
                  <Empty pushAble={false} className={paddingRatio ?? "pt-[50%]"}>
                     <Image src={sI.image_url} />
                     <OverlayCTA
                        data={[
                           {
                              cb: () => handleRemoveSliderImage(index),
                              icon: "delete",
                           },
                           {
                              cb: () => handleOpenModal("change", index),
                              icon: "sync",
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
