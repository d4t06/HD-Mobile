import useCategoryAction from "../_hooks/useCategoryAction";
import { useRef, useState } from "react";
import { Button, Empty, Modal } from "@/components";
import OverlayCTA from "@/components/ui/OverlayCTA";
import { generateId } from "@/utils/appHelper";
import AddItem from "@/components/Modal/AddItem";
import ConfirmModal from "@/components/Modal/Confirm";

import { CodeBracketIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import { ModalRef } from "@/components/Modal";
import JsonInput from "@/components/Modal/JsonInput";
import { useImportCategory } from "../_hooks/useImportCategory";

type Modal = "add" | "edit" | "delete" | "import";

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
   const { status, submit } = useImportCategory();

   type AddModal = {
      modal: "add";
   };

   type EditDeleteModal = {
      modal: "edit" | "delete";
      index: number;
   };

   type ImportModal = {
      modal: "import";
   };

   const closeModal = () => modalRef.current?.close();

   const handleOpenModal = (props: AddModal | EditDeleteModal | ImportModal) => {
      switch (props.modal) {
         case "edit":
         case "delete":
            setCurrentCategoryIndex(props.index);
            break;
         case "add":
            setCurrentCategoryIndex(undefined);
      }

      setModal(props.modal);
      modalRef.current?.open();
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

   type Import = {
      type: "Import";
      value: string;
   };

   const handleCategoryActions = async (props: Add | Edit | Delete | Import) => {
      if (props.type === "Delete" || props.type === "Edit") {
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

         case "Import": {
            await submit(props.value);
         }
      }
   };

   const renderModal = () => {
      if (!modal) return;

      if (modal === "edit" || modal === "delete") {
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
                     cbWhenSubmit={(value) =>
                        handleCategoryActions({ type: "Edit", value })
                     }
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
      }

      switch (modal) {
         case "add":
            return (
               <AddItem
                  loading={isFetching}
                  title="Add category"
                  cbWhenSubmit={(value) => handleCategoryActions({ type: "Add", value })}
                  closeModal={closeModal}
               />
            );
         case "import":
            return (
               <JsonInput
                  status={status}
                  title="Import category"
                  closeModal={closeModal}
                  submit={(v) => handleCategoryActions({ type: "Import", value: v })}
               >
                  {status === "fetching" && <p className="text-lg">... Importing</p>}
               </JsonInput>
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   };

   return (
      <>
         <div className="flex justify-between">
            <h1 className={mainClasses.label}>Category</h1>

            <Button
               onClick={() => handleOpenModal({ modal: "import" })}
               className="space-x-1"
               colors={"third"}
            >
               <CodeBracketIcon className="w-6" />
               <span>Import Json</span>
            </Button>
         </div>
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
