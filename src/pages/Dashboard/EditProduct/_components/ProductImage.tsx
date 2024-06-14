import { Empty, Gallery, Modal } from "@/components";
import { selectProduct } from "@/store/productSlice";
import { useState } from "react";
import { useSelector } from "react-redux";
import OverlayCTA from "@/components/ui/OverlayCTA";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import useProductAction from "@/hooks/useProductAction";

export default function ProductImage() {
   const { product } = useSelector(selectProduct);

   const [openModal, setOpenModal] = useState(false);
   const closeModal = () => setOpenModal(false);

   const { isFetching, actions } = useProductAction({ closeModal });

   const handleUpdateImage = async (image: ImageType) => {
      if (!product) return;

      if (image.image_url === product.image_url) return;

      await actions({
         variant: "Edit",
         productAscii: product.product_ascii,
         target: "one",
         product: { image_url: image.image_url },
      });
   };

   if (!product) return;
   return (
      <>
         <div className="w-1/2 max-w-[300px]">
            {product.image_url ? (
               <Empty className="pt-[100%]">
                  <img
                     className={`${isFetching ? "disable" : ""}`}
                     src={product.image_url}
                     alt=""
                  />
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
                  loading={isFetching}
                  fontClassName="bg-white"
                  className="pt-[125%]"
               />
            )}
         </div>

         {openModal && (
            <Modal closeModal={closeModal}>
               <Gallery
                  setImageUrl={(images) => handleUpdateImage(images[0])}
                  closeModal={closeModal}
               />
            </Modal>
         )}
      </>
   );
}
