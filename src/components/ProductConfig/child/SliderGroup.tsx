import { Ref, forwardRef, useImperativeHandle, useState } from "react";

import Empty from "@/components/ui/Empty";
import { Slider } from "@/types";

import { usePrivateRequest } from "@/hooks";
import { Gallery, Modal } from "@/components";
// import { sleep } from "@/utils/appHelper";
// import { sleep } from "@/utils/appHelper";

// const cy = classNames.bind(stylesMain);

const SLIDER_URL = "/slider-management";

type SliderGroupProps = {
   initSlider: Slider;
   isExist: boolean;
   color_ascii: string;
};

export type SliderRef = {
   submit: () => Promise<{ id: number; color_ascii: string } | undefined>;
   validate: () => boolean;
};

function SliderGroup({ initSlider, isExist, color_ascii }: SliderGroupProps, ref: Ref<SliderRef>) {
   const [images, setImages] = useState<Slider["images"]>(initSlider.images);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [error, setError] = useState(false);

   const privateRequest = usePrivateRequest();

   const handleAddSliderImage = (imageUrl: string) => {
      setImages((prev) => [...prev, { image_url: imageUrl, slider_id: 99 }]);
      setError(false);
   };

   const handleRemoveSliderImage = (imageUrl: string) => {
      const newImages = images.filter((item) => item.image_url != imageUrl);
      setImages(newImages);
   };

   const trackingSliderImages = () => {
      let newImages: Slider["images"] = [];
      if (!initSlider.images.length) newImages = images;
      else
         images.forEach((UKImage) => {
            const exist = initSlider.images.find((existImage) => existImage.image_url === UKImage.image_url);
            if (!exist) newImages.push(UKImage);
         });

      let removeImages: string[] = [];
      initSlider.images.forEach((existImage) => {
         const exist = images.find((UKImage) => existImage.image_url === UKImage.image_url);
         if (!exist) removeImages.push(existImage.image_url);
      });

      return { newImages, removeImages };
   };

   const validate = () => {
      if (!images.length) {
         setError(true);
         return true;
      } else return false;
   };

   const submit = async () => {
      try {
         console.log(">>> submit slider");
         const sliderData = {
            slider_name: initSlider.slider_name,
         };

         let newSlider: { id: number; color_ascii: string } | undefined = undefined;

         if (!isExist) {
            console.log(">> submit add slider");
            const res = await privateRequest.post(SLIDER_URL, sliderData, {
               headers: { "Content-Type": "application/json" },
            });

            const newSliderData = res.data as Slider & { id: number };
            newSlider = { id: newSliderData.id, color_ascii };
         }

         const { newImages, removeImages } = trackingSliderImages();
         console.log("check image new =", newImages, "remove =", removeImages);

         if (newImages.length) {
            if (!newSlider?.id) {
               throw new Error("New slider don't have id");
            }

            console.log(">>> submit add images");
            const newImagesWithId = newImages.map((image) => ({ ...image, slider_id: newSlider!.id }));

            await privateRequest.post(SLIDER_URL + "/image", newImagesWithId, {
               headers: { "Content-Type": "application/json" },
            });
         }

         return newSlider;
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
         <div className="col col-9">
            <div className="row">
               {images.map((image, index) => (
                  <div key={index} className="col col-2">
                     <div
                        className="relative border rounded-[8px] overflow-hidden group"
                        onClick={() => handleRemoveSliderImage(image.image_url)}
                     >
                        <img src={image.image_url} alt="" />
                        <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center">
                           <button className="rounded-[99px] text-white hover:text-red-700">
                              <i className="material-icons  text-[40px]">close</i>
                           </button>
                        </div>
                     </div>
                  </div>
               ))}
               <div className="col col-2">
                  <Empty isError={error} onClick={() => setIsOpenModal(true)} />
               </div>
            </div>
         </div>

         {isOpenModal && (
            <Modal setShowModal={setIsOpenModal}>
               <Gallery setImageUrl={handleAddSliderImage} setIsOpenModal={setIsOpenModal} />
            </Modal>
         )}
      </>
   );
}

export default forwardRef(SliderGroup);
