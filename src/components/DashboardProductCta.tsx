import {
   Bars3Icon,
   Cog6ToothIcon,
   DocumentDuplicateIcon,
   PencilSquareIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import Popover, { PopoverContent, PopoverTrigger, TriggerRef } from "./Popover";
import Tooltip from "./Tooltip";
import Button from "./ui/Button";
import Modal, { ModalRef } from "./Modal";
import { useRef, useState } from "react";
import useProductAction from "@/hooks/useProductAction";
import AddProductModal from "./Modal/AddProductModal";
import ConfirmModal from "./Modal/Confirm";
import { Link } from "react-router-dom";

type Props = {
   index: number;
   product: Product;
};

type Modal = "Edit" | "Delete";

export default function DashboardProductCta({ index, product }: Props) {
   const [modal, setModal] = useState<Modal | "">("");

   const modalRef = useRef<ModalRef>(null);
   const triggerRef = useRef<TriggerRef>(null);

   const closeModal = () => modalRef.current?.close();

   const { isFetching, deleteProduct, actions } = useProductAction({
      closeModal,
   });

   const handleOpenModal = (modal: Modal) => {
      setModal(modal);
      triggerRef.current?.close();
      modalRef.current?.open();
   };

   const handleDuplicate = async () => {
      await actions({ variant: "Duplicate", product });
      triggerRef.current?.close();
   };

   const renderModal = () => {
      switch (modal) {
         case "Edit":
            return (
               <AddProductModal
                  type="Edit"
                  closeModal={closeModal}
                  product={product}
                  currentIndex={index}
               />
            );
         case "Delete": {
            return (
               <ConfirmModal
                  label={`Delete '${product.name}' ?`}
                  callback={() => deleteProduct(product.id)}
                  closeModal={closeModal}
                  loading={isFetching}
               />
            );
         }
      }
   };

   const classes = {
      menuItem:
         "px-3 py-1 flex font-[500] items-center hover:text-[#cd1818] space-x-1 hover:bg-[#e1e1e1]",
   };

   return (
      <>
         <div className="space-x-2 inline-flex">
            <Tooltip content="Edit">
               <Button
                  onClick={() => handleOpenModal("Edit")}
                  size={"clear"}
                  colors={"second"}
                  className="p-[4px]"
               >
                  <PencilSquareIcon className="w-[24px]" />
               </Button>
            </Tooltip>

            <Popover appendOnPortal>
               <PopoverTrigger ref={triggerRef}>
                  <Tooltip content="Menu">
                     <Button
                        onClick={() => handleOpenModal("Edit")}
                        size={"clear"}
                        colors={"second"}
                        className="p-[4px]"
                     >
                        <Bars3Icon className="w-[24px]" />
                     </Button>
                  </Tooltip>
               </PopoverTrigger>

               <PopoverContent appendTo="portal">
                  <div className="w-[160px] overflow-hidden relative flex flex-col rounded-lg py-3 bg-[#fff] shadow-[1px_1px_10px_0_rgba(0,0,0,.15)] text-[#333]">
                     <div className="w-full px-2 mb-2">
                        <div className="bg-[#f1f1f1] rounded-lg p-2">
                           <p className="font-[500] line-clamp-1">{product.name}</p>
                        </div>
                     </div>

                     <button onClick={handleDuplicate} className={classes.menuItem}>
                        <DocumentDuplicateIcon className="w-5" />
                        <span>Duplicate</span>
                     </button>
                     <Link to={`${product.id}`} className={classes.menuItem}>
                        <Cog6ToothIcon className="w-5" />
                        <span>Go to edit</span>
                     </Link>
                     <button
                        onClick={() => handleOpenModal("Delete")}
                        className={classes.menuItem}
                     >
                        <TrashIcon className="w-5" />
                        <span>Delete</span>
                     </button>

                     {isFetching && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                           <div className="w-[60px] h-[60px] rounded-full border-[2px] border-[#cd1818] border-b-transparent animate-spin"></div>
                        </div>
                     )}
                  </div>
               </PopoverContent>
            </Popover>
         </div>
         <Modal variant="animation" ref={modalRef}>
            {renderModal()}
         </Modal>
      </>
   );
}
