import { Button, Empty, Gallery, Modal } from "@/components";
import { PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useRef, useState } from "react";
import useProductSliderAction from "../../_hooks/useProductSliderAction";
import ConfirmModal from "@/components/Modal/Confirm";
import ItemRightCta from "@/pages/Dashboard/_components/ItemRightCta";

type Props = {
   colorIndex: number;
   color: ProductColor;
};

type Modal = "edit" | "add" | "delete";

export default function ProductSliderItem({ color, colorIndex }: Props) {
   const [openModal, setOpenModal] = useState<Modal | "">("");

   const { actions, isFetching } = useProductSliderAction();

   const currentSliderImageIndexRef = useRef<number>();
   const currentSliderImage = useMemo(
      () =>
         currentSliderImageIndexRef.current !== undefined
            ? color.product_slider.slider.slider_images[
                 currentSliderImageIndexRef.current
              ]
            : undefined,
      [openModal],
   );

   const isAddingSliderImages = useMemo(() => {
      return isFetching && currentSliderImageIndexRef.current === undefined;
   }, [isFetching, openModal]);

   const isEditingSliderImages = useMemo(
      () => isFetching && currentSliderImageIndexRef.current !== undefined,
      [isFetching],
   );

   const closeModal = () => setOpenModal("");

   type Edit = {
      type: "Edit";
      image: ImageType;
   };

   type Add = {
      type: "Add";
      images: ImageType[];
   };

   type Delete = {
      type: "Delete";
   };

   const handleSliderActions = async (props: Add | Edit | Delete) => {
      switch (props.type) {
         case "Edit": {
            const { image } = props;

            if (!currentSliderImage || currentSliderImageIndexRef.current === undefined)
               return;

            if (image.id === currentSliderImage.image_id) return;

            const schema: SliderImageSchema = {
               image_id: image.id,
               link_to: currentSliderImage.link_to,
               slider_id: currentSliderImage.slider_id,
            };

            await actions({
               type: "Edit",
               sliderImage: schema,
               index: currentSliderImageIndexRef.current,
               colorIndex,
               image,
               id: currentSliderImage.id,
            });
            break;
         }

         case "Add":
            await actions({ type: "Add", colorIndex, images: props.images, color });

            break;

         case "Delete": {
            if (!currentSliderImage || currentSliderImageIndexRef.current === undefined)
               return;

            await actions({
               type: "Delete",
               colorIndex,
               id: currentSliderImage.id,
               index: currentSliderImageIndexRef.current,
            });
            break;
         }
      }

      closeModal();
   };

   const renderModal = useMemo(() => {
      if (!openModal) return;
      switch (openModal) {
         case "edit":
            return (
               <Gallery
                  closeModal={closeModal}
                  setImageUrl={(images) =>
                     handleSliderActions({ type: "Edit", image: images[0] })
                  }
               />
            );
         case "add":
            return (
               <Gallery
                  closeModal={closeModal}
                  setImageUrl={(images) => handleSliderActions({ type: "Add", images })}
                  multiple
               />
            );
         case "delete":
            return (
               <ConfirmModal
                  callback={() => handleSliderActions({ type: "Delete" })}
                  closeModal={closeModal}
                  loading={isEditingSliderImages}
                  label="Delete Slider Image ?"
               />
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [openModal, isFetching]);

   return (
      <>
         <div className="">
            <div className="flex justify-between">
               <p className="text-lg">{color.name}</p>
               <Button
                  loading={isAddingSliderImages}
                  onClick={() => setOpenModal("add")}
                  colors={"third"}
               >
                  <PlusIcon className="w-6" />
                  <span>Add image</span>
               </Button>
            </div>
            <div className="flex flex-wrap mt-3">
               {color.product_slider.slider.slider_images.map((sI, index) => (
                  <div key={index} className="p-1 w-1/2 sm:w-1/4 lg:w-1/6 text-center">
                     <Empty
                        className={`pt-[55%] ${
                           isEditingSliderImages &&
                           currentSliderImageIndexRef.current === index
                              ? "disable"
                              : ""
                        } `}
                        fontClassName="bg-[#f6f6f6]"
                     >
                        <img src={sI.image.image_url} className="w-full" alt="" />
                     </Empty>

                     <ItemRightCta className="inline-flex mt-2" margin={false}>
                        <div className="border-none !m-0 !p-0">
                           <button className="" onClick={() => setOpenModal("edit")}>
                              <PhotoIcon className="w-5" />
                           </button>
                           <button onClick={() => setOpenModal("delete")}>
                              <TrashIcon className="w-5" />
                           </button>
                        </div>
                     </ItemRightCta>
                  </div>
               ))}
            </div>
         </div>

         {openModal && (
            <Modal noWrap closeModal={closeModal}>
               {renderModal}
            </Modal>
         )}
      </>
   );
}
