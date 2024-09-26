import useCategoryAction from "../_hooks/useCategoryAction";
import { useMemo, useRef, useState } from "react";
import { Empty, Modal } from "@/components";
import OverlayCTA from "@/components/ui/OverlayCTA";
import { generateId } from "@/utils/appHelper";
import AddItem from "@/components/Modal/AddItem";
import ConfirmModal from "@/components/Modal/Confirm";

import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import { ModalRef } from "@/components/Modal";

type Modal = "add" | "edit" | "delete";

type Props = {
   mainClasses: LayoutClasses;
};

export default function CategoryList({ mainClasses }: Props) {
   const { categories } = useSelector(selectCategory);

   const [modal, setModal] = useState<Modal | "">("");
   const modalRef = useRef<ModalRef>(null);

   const currentCategoryIndex = useRef<number>();

   // hooks
   const { actions, isFetching } = useCategoryAction({ modalRef });

   type AddModal = {
      modal: "add";
   };

   type EditDeleteModal = {
      modal: "edit" | "delete";
      index: number;
   };

   const toggleModal = () => modalRef.current?.toggle();

   const handleOpenModal = (props: AddModal | EditDeleteModal) => {
      switch (props.modal) {
         case "edit":
         case "delete":
            currentCategoryIndex.current = props.index;
      }

      setModal(props.modal);
      toggleModal();
   };

   type Add = {
      type: "Add";
      value: string;
   };

   type Edit = {
      type: "Edit";
      value: string;
   };

   type Delete = {
      type: "Delete";
   };

   const handleCategoryActions = async (props: Add | Edit | Delete) => {
      if (props.type === "Delete") {
         if (currentCategoryIndex.current === undefined) return;
         await actions({
            type: "Delete",
            category: categories[currentCategoryIndex.current],
         });

         toggleModal();

         return;
      }

      switch (props.type) {
         case "Add": {
            const categorySchema: CategorySchema = {
               attribute_order: "",
               name: props.value,
               name_ascii: generateId(props.value),
               hidden: false,
            };

            await actions({ type: "Add", category: categorySchema });
            break;
         }
         case "Edit": {
            if (currentCategoryIndex.current === undefined) return;

            const target = categories[currentCategoryIndex.current];

            const categorySchema: CategorySchema = {
               attribute_order: target.attribute_order,
               hidden: false,
               name: props.value,
               name_ascii: generateId(props.value),
            };

            await actions({
               type: "Edit",
               category: categorySchema,
               curIndex: currentCategoryIndex.current,
               category_id: target.id,
            });
            break;
         }
      }

      // toggleModal();
   };

   const renderModal = () => {
      if (!modal) return;

      if (modal === "edit" || modal === "delete") {
         if (
            currentCategoryIndex.current === undefined ||
            !categories[currentCategoryIndex.current]
         )
            return;

         const currentCat = categories[currentCategoryIndex.current];

         switch (modal) {
            case "edit":
               return (
                  <AddItem
                     loading={isFetching}
                     title={`Edit '${currentCat.name}' `}
                     initValue={currentCat.name}
                     cbWhenSubmit={(value) =>
                        handleCategoryActions({ type: "Edit", value })
                     }
                     closeModal={toggleModal}
                  />
               );

            case "delete":
               return (
                  <ConfirmModal
                     callback={() => handleCategoryActions({ type: "Delete" })}
                     loading={isFetching}
                     closeModal={toggleModal}
                     label={`Delete category '${currentCat.name}'`}
                  />
               );
         }
      }

      switch (modal) {
         case "add":
            return (
               <AddItem
                  loading={isFetching}
                  title="Add category"
                  cbWhenSubmit={(value) =>
                     handleCategoryActions({ type: "Add", value })
                  }
                  closeModal={toggleModal}
               />
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   };

   return (
      <>
         <h1 className={mainClasses.label}>Category</h1>
         <div className={mainClasses.group}>
            <div
               className={`${mainClasses.flexContainer} ${
                  isFetching ? "disable" : ""
               }`}
            >
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
                                       icon: (
                                          <PencilIcon className="w-[24px]" />
                                       ),
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
                     )
               )}
               <div className={`${mainClasses.flexCol} w-1/2 sm:w-1/6`}>
                  <Empty
                     fontClassName="bg-[#f1f1f1]"
                     onClick={() => handleOpenModal({ modal: "add" })}
                  />
               </div>
            </div>
         </div>

         <Modal ref={modalRef} variant="animation">
            {renderModal()}
         </Modal>
      </>
   );
}
