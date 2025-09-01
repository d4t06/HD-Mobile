import { Modal } from "@/components";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import useBrandAction from "../../_hooks/uesBrandAction";
import ConfirmModal from "@/components/Modal/Confirm";
import { generateId } from "@/utils/appHelper";
import AddItem from "@/components/Modal/AddItem";
import ItemRightCta from "@/pages/Dashboard/_components/ItemRightCta";

type Props = {
   categoryIndex: number;
   index: number;
   brand: Brand;
};

type Modal = "edit" | "delete";

export default function BrandItem({ brand, categoryIndex, index }: Props) {
   const [openModal, setOpenModal] = useState<Modal | "">("");

   const { actions, isFetching } = useBrandAction();

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
            const brandSchema: BrandSchema = {
               ...brand,
               name: props.value,
               name_ascii: generateId(props.value),
            };

            await actions({
               type: "Edit",
               brand: brandSchema,
               index,
               id: brand.id,
               categoryIndex,
            });
            break;
         }

         case "Delete": {
            await actions({
               type: "Delete",
               id: brand.id,
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
                  title={`Edit brand '${brand.name}'`}
                  initValue={brand.name}
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
                  label={`Delete category '${brand.name}'`}
               />
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [openModal, isFetching]);

   return (
      <>
         <ItemRightCta>
            <span>{brand.name}</span>

            <div>
               <button className="" onClick={() => setOpenModal("edit")}>
                  <PencilIcon className="w-5" />
               </button>
               <button onClick={() => setOpenModal("delete")}>
                  <TrashIcon className="w-5" />
               </button>
            </div>
         </ItemRightCta>

         {openModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}
