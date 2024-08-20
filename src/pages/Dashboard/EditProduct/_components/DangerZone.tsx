import { Modal } from "@/components";
import ConfirmModal from "@/components/Modal/Confirm";
import Button from "@/components/ui/Button";
import useProductAction from "@/hooks/useProductAction";
import { useState } from "react";

type Props = {
   productId: number;
};

export default function DangerZone({ productId }: Props) {
   const [openModal, setOpenModal] = useState(false);
   const closeModal = () => setOpenModal(false);

   const { deleteProduct, isFetching } = useProductAction({ closeModal });

   const handleDeleteProduct = async () => {
      await deleteProduct(productId);
   };

   return (
      <>
         <h5 className={` text-red-500 mt-[30px] label font-semibold`}>DANGER ZONE</h5>
         <div className="border-red-500 border rounded-[16px] p-[14px]">
            <Button colors={"third"} onClick={() => setOpenModal(true)}>
               Delete Product
            </Button>
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
