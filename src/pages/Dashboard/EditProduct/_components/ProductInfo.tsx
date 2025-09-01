import { Button, Modal } from "@/components";
import { selectProduct } from "@/store/productSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import AddProductModal from "@/components/Modal/AddProductModal";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export default function ProductInfo() {
   const { product } = useSelector(selectProduct);

   const [openModal, setOpenModal] = useState(false);
   const closeModal = () => setOpenModal(false);

   if (!product) return;
   return (
      <>
         <div className="flex justify-between">
            <p className="text-xl">{product.name}</p>
            <Button onClick={() => setOpenModal(true)} colors="third">
               <Cog6ToothIcon className="w-6" />
               <span>Edit</span>
            </Button>
         </div>

         {openModal && (
            <Modal closeModal={closeModal}>
               <AddProductModal
                  type="Edit-Detail"
                  closeModal={closeModal}
                  product={product}
               />
            </Modal>
         )}
      </>
   );
}
