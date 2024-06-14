import { Empty, Gallery, Modal } from "@/components";
import OverlayCTA from "@/components/ui/OverlayCTA";
import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useRef, useState } from "react";
import useCategorySliderAction from "../_hooks/useCategorySliderAction";
import ConfirmModal from "@/components/Modal/Confirm";

type Props = {
   categoryIndex: number;
   category: Category;
};

type Modal = "edit" | "add" | "delete";

export default function CategorySliderItem({ category, categoryIndex }: Props) {
   const [openModal, setOpenModal] = useState<Modal | "">("");

   const { actions, isFetching } = useCategorySliderAction();

   const currentSliderImageIndexRef = useRef<number>();
   const currentSliderImage = useMemo(
      () =>
         currentSliderImageIndexRef.current !== undefined
            ? category.category_slider.slider.slider_images[
                 currentSliderImageIndexRef.current
              ]
            : undefined,
      [openModal]
   );

   const isAddingSliderImages = useMemo(() => {
      console.log("run", isFetching, currentSliderImageIndexRef.current);

      return isFetching && currentSliderImageIndexRef.current === undefined;
   }, [isFetching, openModal]);

   const isEditingSliderImages = useMemo(
      () => isFetching && currentSliderImageIndexRef.current !== undefined,
      [isFetching]
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
               categoryIndex,
               image,
               id: currentSliderImage.id,
            });
            break;
         }

         case "Add":
            await actions({
               type: "Add",
               categoryIndex,
               images: props.images,
               sliderId: category.category_slider.slider.id,
            });

            break;

         case "Delete": {
            if (!currentSliderImage || currentSliderImageIndexRef.current === undefined)
               return;

            await actions({
               type: "Delete",
               categoryIndex,
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
         <div className="flex items-center">
            <div className="px-[4px] w-2/12">
               <p className="text-center font-[500]">{category.category}</p>
            </div>
            <div className="flex flex-wrap gap-y-[16px] flex-1">
               {category.category_slider.slider.slider_images.map((sI, index) => (
                  <div key={index} className="px-[8px] w-1/2">
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
                        <OverlayCTA
                           data={[
                              {
                                 cb: () => {
                                    currentSliderImageIndexRef.current = index;
                                    setOpenModal("edit");
                                 },
                                 icon: <ArrowPathIcon className="w-[24px]" />,
                              },
                              {
                                 cb: () => {
                                    currentSliderImageIndexRef.current = index;
                                    setOpenModal("delete");
                                 },
                                 icon: <TrashIcon className="w-[24px]" />,
                              },
                           ]}
                        />
                     </Empty>
                  </div>
               ))}

               <div className="px-[8px] w-1/2">
                  <Empty
                     className="pt-[55%]"
                     fontClassName="bg-[#f1f1f1]"
                     loading={isAddingSliderImages}
                     onClick={() => {
                        currentSliderImageIndexRef.current = undefined;
                        setOpenModal("add");
                     }}
                  />
               </div>
            </div>
         </div>

         {openModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}
