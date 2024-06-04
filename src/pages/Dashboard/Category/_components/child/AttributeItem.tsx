import { useMemo, useState } from "react";
import useAttributeActions from "../../_hooks/useAttributeAction";
import { generateId } from "@/utils/appHelper";
import AddItem from "@/components/Modal/AddItem";
import ConfirmModal from "@/components/Modal/Confirm";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Modal } from "@/components";

import "../../category.scss";

type Props = {
   categoryIndex: number;
   index: number;
   attribute: CategoryAttribute;
};

type Modal = "edit" | "delete";

export default function AttributeItem({ attribute, categoryIndex, index }: Props) {
   const [openModal, setOpenModal] = useState<Modal | "">("");

   const { actions, isFetching } = useAttributeActions({
      currentCategoryIndex: categoryIndex,
   });

   const closeModal = () => setOpenModal("");

   type Edit = {
      type: "Edit";
      value: string;
   };

   type Delete = {
      type: "Delete";
   };

   const handleBrandActions = async (props: Edit | Delete) => {
      switch (props.type) {
         case "Edit": {
            const schema: CategoryAttributeSchema = {
               ...attribute,
               attribute: props.value,
               attribute_ascii: generateId(props.value),
            };

            await actions({
               type: "Edit",
               attribute: schema,
               index,
               id: attribute.id,
               categoryIndex,
            });
            break;
         }

         case "Delete": {
            await actions({
               type: "Delete",
               id: attribute.id,
               categoryIndex: categoryIndex,
               index,
            });

            closeModal();
         }
      }

      closeModal();
   };

   const renderModal = useMemo(() => {
      if (!openModal) return;
      switch (openModal) {
         case "edit":
            return (
               <AddItem
                  loading={isFetching}
                  title={`Edit attribute '${attribute.attribute}'`}
                  initValue={attribute.attribute}
                  cbWhenSubmit={(value) => handleBrandActions({ type: "Edit", value })}
                  close={closeModal}
               />
            );

         case "delete":
            return (
               <ConfirmModal
                  callback={() => handleBrandActions({ type: "Delete" })}
                  loading={isFetching}
                  close={closeModal}
                  label={`Delete category '${attribute.attribute}'`}
               />
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [openModal, isFetching]);

   return (
      <>
         <div className="attribute-item">
            <p>{attribute.attribute}</p>
            <div className={"cta"}>
               <button onClick={() => setOpenModal("edit")}>
                  <PencilSquareIcon className="w-[22px]" />
               </button>
               <button onClick={() => setOpenModal("delete")}>
                  <TrashIcon className="w-[22px]" />
               </button>
            </div>
         </div>

         {openModal && <Modal close={closeModal}>{renderModal}</Modal>}
      </>
   );
}
