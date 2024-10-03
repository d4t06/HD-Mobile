import { Empty, Modal } from "@/components";
import { selectProduct } from "@/store/productSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import OverlayCTA from "@/components/ui/OverlayCTA";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import Image from "@/components/ui/Image";
import AddProductModal from "@/components/Modal/AddProductModal";

export default function ProductInfo() {
   const { product } = useSelector(selectProduct);

   const [openModal, setOpenModal] = useState(false);
   const closeModal = () => setOpenModal(false);

   if (!product) return;
   return (
      <div className="flex flex-col sm:flex-row ">
         <div className="w-3/5 max-w-[200px] mx-auto sm:m-0 sm:w-1/3">
            {product.image_url ? (
               <Empty className="pt-[100%]">
                  <Image src={product.image_url} />
                  <OverlayCTA
                     data={[
                        {
                           cb: () => setOpenModal(true),
                           icon: <ArrowPathIcon className="w-[24px]" />,
                        },
                     ]}
                  />
               </Empty>
            ) : (
               <Empty
                  onClick={() => setOpenModal(true)}
                  fontClassName="bg-white"
                  className="pt-[125%]"
               />
            )}
         </div>
         <div className="text-xl font-[500] mt-3 sm:ml-3 sm:mt-0">
            {product.name}
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
      </div>
   );
}
