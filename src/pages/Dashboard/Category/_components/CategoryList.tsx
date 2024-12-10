import useCategoryAction from "../_hooks/useCategoryAction";
import { useRef, useState } from "react";
import { Empty, Modal } from "@/components";
import OverlayCTA from "@/components/ui/OverlayCTA";
import { generateId } from "@/utils/appHelper";
import AddItem from "@/components/Modal/AddItem";
import ConfirmModal from "@/components/Modal/Confirm";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import { ModalRef } from "@/components/Modal";
import AddCategoryBtn from "./child/AddCategoryBtn";

type Modal = "edit" | "delete";

type Props = {
   mainClasses: LayoutClasses;
};

export default function CategoryList({ mainClasses }: Props) {
   const { categories } = useSelector(selectCategory);

   const [modal, setModal] = useState<Modal | "">("");
   const modalRef = useRef<ModalRef>(null);

   /** don't work when open using modalRef
    *  the value id reference but the code don't rerun
    */
   // const currentCategoryIndex = useRef<number>();

   const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>();

   // hooks
   const { actions, isFetching } = useCategoryAction({ modalRef });

   type OpenModalProps = {
      modal: "edit" | "delete";
      index: number;
   };

   const closeModal = () => modalRef.current?.close();

   const handleOpenModal = (props: OpenModalProps) => {
      setCurrentCategoryIndex(props.index);
      setModal(props.modal);
      modalRef.current?.open();
   };

   type Edit = {
      type: "Edit";
      value: string;
   };

   type Delete = {
      type: "Delete";
   };

   const handleCategoryActions = async (props: Edit | Delete) => {
      if (currentCategoryIndex === undefined) return;
      const currentCategory = categories[currentCategoryIndex];

      if (!currentCategory) return;

      switch (props.type) {
         case "Delete": {
            await actions({
               type: "Delete",
               category: categories[currentCategoryIndex],
            });

            break;
         }

         case "Edit": {
            const categorySchema: CategorySchema = {
               attribute_order: currentCategory.attribute_order,
               hidden: false,
               name: props.value,
               name_ascii: generateId(props.value),
            };

            await actions({
               type: "Edit",
               category: categorySchema,
               curIndex: currentCategoryIndex,
               category_id: currentCategory.id,
            });
            break;
         }
      }
   };

   const renderModal = () => {
      if (!modal) return;

      if (currentCategoryIndex === undefined) return;
      const currentCat = categories[currentCategoryIndex];
      if (!currentCat) return;

      switch (modal) {
         case "edit":
            return (
               <AddItem
                  loading={isFetching}
                  title={`Edit '${currentCat.name}' `}
                  initValue={currentCat.name}
                  cbWhenSubmit={(value) => handleCategoryActions({ type: "Edit", value })}
                  closeModal={closeModal}
               />
            );

         case "delete":
            return (
               <ConfirmModal
                  callback={() => handleCategoryActions({ type: "Delete" })}
                  loading={isFetching}
                  closeModal={closeModal}
                  label={`Delete category '${currentCat.name}'`}
               />
            );
      }
   };

   return (
      <>
         <div className="flex justify-between">
            <h1 className={mainClasses.label}>Category</h1>

            <AddCategoryBtn />
         </div>
         <div className={mainClasses.group}>
            {!!(categories.length - 1) ? (
               <div
                  className={`${mainClasses.flexContainer} ${isFetching ? "disable" : ""}`}
               >
                  <>
                     {categories.map(
                        (item, index) =>
                           !item.hidden && (
                              <div
                                 key={index}
                                 className={`${mainClasses.flexCol} w-1/2 sm:w-1/6`}
                              >
                                 <Empty>
                                    <span className="font-[500]">{item.name}</span>
                                    <OverlayCTA
                                       data={[
                                          {
                                             cb: () =>
                                                handleOpenModal({
                                                   modal: "edit",
                                                   index,
                                                }),
                                             icon: <PencilIcon className="w-[24px]" />,
                                          },
                                          {
                                             cb: () =>
                                                handleOpenModal({
                                                   modal: "delete",
                                                   index,
                                                }),
                                             icon: <TrashIcon className="w-[24px]" />,
                                          },
                                       ]}
                                    />
                                 </Empty>
                              </div>
                           ),
                     )}
                  </>
               </div>
            ) : (
               <p className="text-center">¯\_(ツ)_/¯</p>
            )}
         </div>

         <Modal ref={modalRef} variant="animation">
            {renderModal()}
         </Modal>
      </>
   );
}
