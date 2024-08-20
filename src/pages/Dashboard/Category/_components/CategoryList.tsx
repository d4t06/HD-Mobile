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

type Modal = "add" | "edit" | "delete";

type Props = {
   mainClasses: LayoutClasses;
};

export default function CategoryList({ mainClasses }: Props) {
   const { categories } = useSelector(selectCategory);

   const [openModal, setOpenModal] = useState<Modal | "">("");

   const currentCategoryIndex = useRef<number>();

   // hooks
   const { actions, isFetching } = useCategoryAction();

   type AddModal = {
      modal: "add";
   };

   type EditDeleteModal = {
      modal: "edit" | "delete";
      index: number;
   };

   const handleOpenModal = (props: AddModal | EditDeleteModal) => {
      switch (props.modal) {
         case "edit":
         case "delete":
            currentCategoryIndex.current = props.index;
      }

      setOpenModal(props.modal);
   };

   const closeModal = () => setOpenModal("");

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

         closeModal();

         return;
      }

      switch (props.type) {
         case "Add": {
            const categorySchema: CategorySchema = {
               attribute_order: "",
               category: props.value,
               category_ascii: generateId(props.value),
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
               category: props.value,
               category_ascii: generateId(props.value),
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

      closeModal();
   };

   const renderModal = useMemo(() => {
      if (!openModal) return;
      switch (openModal) {
         case "add":
            return (
               <AddItem
                  loading={isFetching}
                  title="Add category"
                  cbWhenSubmit={(value) => handleCategoryActions({ type: "Add", value })}
                  closeModal={closeModal}
               />
            );
         case "edit":
            if (currentCategoryIndex.current === undefined) return "Index not found";
            return (
               <AddItem
                  loading={isFetching}
                  title={`Edit '${categories[currentCategoryIndex.current].category}' `}
                  initValue={categories[currentCategoryIndex.current].category}
                  cbWhenSubmit={(value) => handleCategoryActions({ type: "Edit", value })}
                  closeModal={closeModal}
               />
            );

         case "delete":
            if (currentCategoryIndex.current === undefined) return "Index not found";

            return (
               <ConfirmModal
                  callback={() => handleCategoryActions({ type: "Delete" })}
                  loading={isFetching}
                  closeModal={closeModal}
                  label={`Delete category '${
                     categories[currentCategoryIndex.current].category
                  }'`}
               />
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [openModal, isFetching]);

   return (
      <>
         <h1 className={mainClasses.label}>Category</h1>
         <div className={mainClasses.group}>
            <div
               className={`${mainClasses.flexContainer} ${isFetching ? "disable" : ""}`}
            >
               {categories.map(
                  (item, index) =>
                     !item.hidden && (
                        <div
                           key={index}
                           className={`${mainClasses.flexCol} w-1/2 sm:w-1/6`}
                        >
                           <Empty>
                              <span className="font-[500]">{item.category}</span>
                              <OverlayCTA
                                 data={[
                                    {
                                       cb: () =>
                                          handleOpenModal({ modal: "edit", index }),
                                       icon: <PencilIcon className="w-[24px]" />,
                                    },
                                    {
                                       cb: () =>
                                          handleOpenModal({ modal: "delete", index }),
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

         {!!openModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}
