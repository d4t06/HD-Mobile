import { Empty, Modal } from "@/components";
import { selectProduct } from "@/store/productSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import AddItem from "@/components/Modal/AddItem";
import ColorItem from "./child/ColorItem";
import useColorAction from "../_hooks/useColorAction";

type Props = {
   mainClasses: LayoutClasses;
};

export default function Color({ mainClasses }: Props) {
   const { product } = useSelector(selectProduct);

   const [openModal, setOpenModal] = useState(false);

   const { actions, isFetching } = useColorAction();

   const closeModal = () => setOpenModal(false);

   const handleAddColor = async (value: string) => {
      if (!product) return;

      const schema: ProductColorSchema = {
         name: value,
         name_ascii: "",
         product_id: product.id,
      };

      await actions({
         type: "Add",
         color: schema,
      });

      closeModal();
   };

   if (!product) return <></>;

   return (
      <>
         <h1 className={mainClasses.label}>Color</h1>
         <div className={mainClasses.group}>
            <div
               className={`${mainClasses.flexContainer} ${isFetching ? "disable" : ""}`}
            >
               {product.colors.map((item, index) => (
                  <div key={index} className={`${mainClasses.flexCol} w-1/2 sm:w-1/6`}>
                     <ColorItem index={index} color={item} />
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
                  cbWhenSubmit={(value) => handleAddColor(value)}
                  closeModal={closeModal}
                  title="Add color"
                  loading={isFetching}
               />
            </Modal>
         )}
      </>
   );
}
