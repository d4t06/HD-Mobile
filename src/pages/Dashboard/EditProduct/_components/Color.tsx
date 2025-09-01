import { Button, Modal } from "@/components";
import { selectProduct } from "@/store/productSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import AddItem from "@/components/Modal/AddItem";
import ColorItem from "./child/ColorItem";
import useColorAction from "../_hooks/useColorAction";
import { PlusIcon } from "@heroicons/react/24/outline";

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
         <div className="flex justify-between">
            <h1 className={mainClasses.label}>Color</h1>

            <Button onClick={() => setOpenModal(true)} colors={"third"}>
               <PlusIcon className="w-6" />
               <span>Add color</span>
            </Button>
         </div>
         <div className={mainClasses.group}>
            <div
               className={`${mainClasses.flexContainer} ${isFetching ? "disable" : ""}`}
            >
               {product.colors.map((item, index) => (
                  <ColorItem index={index} color={item} />
               ))}
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
