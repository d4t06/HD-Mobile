import { Button, Modal } from "@/components";
import { selectProduct } from "@/store/productSlice";
import { useSelector } from "react-redux";
import useVariantAction from "../_hooks/useVariantAction";
import { useState } from "react";
import AddItem from "@/components/Modal/AddItem";
import VariantItem from "./child/VariantItem";
import { generateId } from "@/utils/appHelper";
import { PlusIcon } from "@heroicons/react/24/outline";

type Props = {
   mainClasses: LayoutClasses;
};

export default function Variant({ mainClasses }: Props) {
   const { product } = useSelector(selectProduct);

   const [openModal, setOpenModal] = useState(false);

   const { actions, isFetching } = useVariantAction();

   const closeModal = () => setOpenModal(false);

   const handleAddVariant = async (value: string) => {
      if (!product) return;

      const schema: ProductVariantSchema = {
         name: value,
         name_ascii: generateId(value),
         product_id: product.id,
      };

      await actions({
         type: "Add",
         variant: schema,
      });
      closeModal();
   };

   if (!product) return <></>;

   return (
      <>
         <div className="flex justify-between">
            <h1 className={mainClasses.label}>Variant</h1>

            <Button onClick={() => setOpenModal(true)} colors={"third"}>
               <PlusIcon className="w-6" />
               <span>Add variant</span>
            </Button>
         </div>
         <div className={mainClasses.group}>
            <div
               className={`${mainClasses.flexContainer} ${isFetching ? "disable" : ""}`}
            >
               {product.variants.map((item, index) => (
                  <VariantItem index={index} variant={item} />
               ))}
            </div>
         </div>

         {openModal && (
            <Modal closeModal={closeModal}>
               <AddItem
                  cbWhenSubmit={(value) => handleAddVariant(value)}
                  closeModal={closeModal}
                  title="Add variant"
                  loading={isFetching}
               />
            </Modal>
         )}
      </>
   );
}
