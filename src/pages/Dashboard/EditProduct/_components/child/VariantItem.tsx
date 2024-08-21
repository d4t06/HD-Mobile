import { Empty, Modal } from "@/components";
import OverlayCTA from "@/components/ui/OverlayCTA";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import ConfirmModal from "@/components/Modal/Confirm";
import { generateId } from "@/utils/appHelper";
import AddItem from "@/components/Modal/AddItem";
import useVariantAction from "../../_hooks/useVariantAction";

type Props = {
   index: number;
   variant: ProductVariant;
};

type Modal = "edit" | "delete";

export default function VariantItem({ variant, index }: Props) {
   const [openModal, setOpenModal] = useState<Modal | "">("");

   const { actions, isFetching } = useVariantAction();

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
            const schema: ProductVariantSchema = {
               product_id: variant.id,
               name: props.value,
               name_ascii: generateId(props.value),
            };

            await actions({
               type: "Edit",
               variant: schema,
               index,
               id: variant.id,
            });
            break;
         }

         case "Delete": {
            await actions({
               type: "Delete",
               id: variant.id,
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
                  title={`Edit variant '${variant.name}'`}
                  initValue={variant.name}
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
                  label={`Delete variant '${variant.name}'`}
               />
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [openModal, isFetching]);

   return (
      <>
         <Empty fontClassName="bg-[#f6f6f6]">
            <span className="font-medium">{variant.name}</span>
            <OverlayCTA
               data={[
                  {
                     cb: () => setOpenModal("edit"),
                     icon: <PencilIcon className="w-[24px]" />,
                  },
                  {
                     cb: () => setOpenModal("delete"),
                     icon: <TrashIcon className="w-[24px]" />,
                  },
               ]}
            />
         </Empty>

         {openModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}
