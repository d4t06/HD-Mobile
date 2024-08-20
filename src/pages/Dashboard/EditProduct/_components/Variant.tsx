import { Empty, Modal } from "@/components";
import { selectProduct } from "@/store/productSlice";
import { useSelector } from "react-redux";
import useVariantAction from "../_hooks/useVariantAction";
import { useState } from "react";
import AddItem from "@/components/Modal/AddItem";
import VariantItem from "./child/VariantItem";
import { generateId } from "@/utils/appHelper";

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
         <h1 className={mainClasses.label}>Variant</h1>
         <div className={mainClasses.group}>
            <div
               className={`${mainClasses.flexContainer} ${isFetching ? "disable" : ""}`}
            >
               {product.variants.map((item, index) => (
                  <div key={index} className={`${mainClasses.flexCol} w-1/2 sm:w-1/6`}>
                     <VariantItem index={index} variant={item} />
                  </div>
               ))}
               <div className={`${mainClasses.flexCol} w-1/2 sm:w-1/6`}>
                  <Empty
                     fontClassName="bg-[#f1f1f1]"
                     onClick={() => setOpenModal(true)}
                  />
               </div>
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
