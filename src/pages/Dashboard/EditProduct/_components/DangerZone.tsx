import { Modal } from "@/components";
import ConfirmModal from "@/components/Modal/Confirm";
import PushButton from "@/components/ui/PushButton";
import useProductAction from "@/hooks/useProductAction";
import { useState } from "react";

type Props = {
   productAscii: string;
};

export default function DangerZone({ productAscii }: Props) {
   const [openModal, setOpenModal] = useState(false);
   const closeModal = () => setOpenModal(false);

   const { deleteProduct, isFetching } = useProductAction({closeModal});

   const handleDeleteProduct = async () => {
      await deleteProduct(productAscii);
   };

   return (
      <>
         <h5 className={` text-red-500 mt-[30px] label font-semibold`}>DANGER ZONE</h5>
         <div className="border-red-500 border rounded-[16px] p-[14px]">
            <PushButton onClick={() => setOpenModal(true)}>Delete Product</PushButton>
         </div>

         {openModal && (
            <Modal closeModal={closeModal}>
               <ConfirmModal
                  label="Delete product ?"
                  callback={handleDeleteProduct}
                  closeModal={closeModal}
                  loading={isFetching}
               />
            </Modal>
         )}
      </>
   );
}
