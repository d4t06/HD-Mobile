import { Modal } from "@/components";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import ConfirmModal from "@/components/Modal/Confirm";
import usePriceRangeActions from "../../_hooks/usePriceRangeAction";
import AddItemMulti, { FieldType } from "@/components/Modal/AddItemMulti";

type FIELD_KEYS = "Label" | "From" | "To";

type Props = {
   categoryIndex: number;
   index: number;
   priceRange: PriceRange;
   getValue: (value: Record<string, string>, name: FIELD_KEYS) => string;
};

type Modal = "edit" | "delete";

const PRICE_FIELDS: FieldType = [
   "Label",
   { label: "From", placeholder: "1 = 1.000.000đ" },
   { label: "To", placeholder: "1 = 1.000.000đ" },
];

export default function PriceRangeItem({
   priceRange,
   categoryIndex,
   index,
   getValue,
}: Props) {
   const [openModal, setOpenModal] = useState<Modal | "">("");

   const { actions, isFetching } = usePriceRangeActions();

   const closeModal = () => setOpenModal("");

   type Edit = {
      type: "Edit";
      value: Record<string, string>;
   };

   type Delete = {
      type: "Delete";
   };

   const handlePriceRangeActions = async (props: Edit | Delete) => {
      switch (props.type) {
         case "Edit": {
            const schema: PriceRangeSchema = {
               ...priceRange,
               from: +getValue(props.value, "From"),
               to: +getValue(props.value, "To"),
               label: getValue(props.value, "Label"),
            };

            await actions({
               type: "Edit",
               priceRange: schema,
               index,
               id: priceRange.id,
               categoryIndex,
            });
            break;
         }

         case "Delete": {
            await actions({
               type: "Delete",
               id: priceRange.id,
               categoryIndex,
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
               <AddItemMulti
                  loading={isFetching}
                  title="Add category"
                  cb={(value) => handlePriceRangeActions({ type: "Edit", value })}
                  closeModal={closeModal}
                  intiFieldData={{
                     label: priceRange.label,
                     from: priceRange.from + "",
                     to: priceRange.to + "",
                  }}
                  fields={PRICE_FIELDS}
               />
            );

         case "delete":
            return (
               <ConfirmModal
                  callback={() => handlePriceRangeActions({ type: "Delete" })}
                  loading={isFetching}
                  closeModal={closeModal}
                  label={`Delete category '${priceRange.label}'`}
               />
            );
         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [openModal, isFetching]);

   const classes = {
      container:
         "flex px-[16px] py-[8px] bg-[#f1f1f1] select-none rounded-[8px] border border-black/15",
      ctaContainer:
         "flex items-center space-x-[6px] ml-[10px]  pl-[10px] border-l-[1px] border-black/15",
      button: "text-[#3f3f3f] hover:text-[#cd1818] hover:scale-[1.1]",
   };

   return (
      <>
         <div className={classes.container}>
            <div className="text-center">
               <p>{priceRange.label}</p>
               <p className="font-[500] text-[#333]">
                  ({priceRange.from} - {priceRange.to})
               </p>
            </div>

            <div className={classes.ctaContainer}>
               <button
                  className={classes.button}
                  onClick={() => setOpenModal("edit")}
               >
                  <PencilSquareIcon className="w-[22px]" />
               </button>
               <button
                  className={classes.button}
                  onClick={() => setOpenModal("delete")}
               >
                  <TrashIcon className="w-[22px]" />
               </button>
            </div>
         </div>

         {openModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}
