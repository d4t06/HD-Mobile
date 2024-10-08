import { useMemo, useState } from "react";
import { generateId } from "@/utils/appHelper";
import AddItem from "@/components/Modal/AddItem";
import ConfirmModal from "@/components/Modal/Confirm";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Modal } from "@/components";
import useAttributeActions from "../../_hooks/useAttributeAction";

// import "../../category.scss";

type Props = {
   categoryIndex: number;
   index: number;
   attribute: CategoryAttribute;
};

type Modal = "edit" | "delete";

export default function nameItem({ attribute, categoryIndex, index }: Props) {
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
               name: props.value,
               name_ascii: generateId(props.value),
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
                  title={`Edit name '${attribute.name}'`}
                  initValue={attribute.name}
                  cbWhenSubmit={(value) => handleBrandActions({ type: "Edit", value })}
                  closeModal={closeModal}
               />
            );

         case "delete":
            return (
               <ConfirmModal
                  callback={() => handleBrandActions({ type: "Delete" })}
                  loading={isFetching}
                  closeModal={closeModal}
                  label={`Delete category '${attribute.name}'`}
               />
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [openModal, isFetching]);

   const classes = {
      container: "flex px-[16px] py-[8px] bg-[#f1f1f1] select-none ",
      ctaContainer:
         "flex items-center space-x-[6px] ml-[10px]  pl-[10px] border-l-[1px] border-black/15",
      button: "text-[#3f3f3f] hover:text-[#cd1818] hover:scale-[1.1]",
   };

   return (
      <>
         <div className={classes.container}>
            <p>{attribute.name}</p>
            <div className={classes.ctaContainer}>
               <button className={classes.button} onClick={() => setOpenModal("edit")}>
                  <PencilSquareIcon className="w-[22px]" />
               </button>
               <button className={classes.button} onClick={() => setOpenModal("delete")}>
                  <TrashIcon className="w-[22px]" />
               </button>
            </div>
         </div>

         {openModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}
