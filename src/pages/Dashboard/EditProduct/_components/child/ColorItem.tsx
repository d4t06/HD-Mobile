import { Empty, Modal } from "@/components";
import OverlayCTA from "@/components/ui/OverlayCTA";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import ConfirmModal from "@/components/Modal/Confirm";
import { generateId } from "@/utils/appHelper";
import AddItem from "@/components/Modal/AddItem";
import useColorAction from "../../_hooks/useColorAction";

type Props = {
   index: number;
   color: ProductColor;
};

type Modal = "edit" | "delete";

export default function ColorItem({ color, index }: Props) {
   const [openModal, setOpenModal] = useState<Modal | "">("");

   const { actions, isFetching } = useColorAction();

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
            const schema: ProductColorSchema = {
               name: props.value,
               name_ascii: generateId(props.value),
               product_id: color.product_id,
            };

            await actions({
               type: "Edit",
               color: schema,
               index,
               id: color.id,
            });
            break;
         }

         case "Delete": {
            await actions({
               type: "Delete",
               id: color.id,
               index,
            });
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
                  title={`Edit color '${color.name}'`}
                  initValue={color.name}
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
                  label={`Delete color '${color.name}'`}
               />
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [openModal, isFetching]);

   return (
      <>
         <Empty fontClassName="bg-[#f6f6f6]">
            <span className="font-semibold">{color.name}</span>
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
