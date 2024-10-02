import { Button } from "@/components";
import Modal, { ModalRef } from "@/components/Modal";
import AddProductModal from "@/components/Modal/AddProductModal";
import Popover, {
   PopoverContent,
   PopoverTrigger,
   TriggerRef,
} from "@/components/Popover";
import { CodeBracketIcon, DocumentTextIcon } from "@heroicons/react/16/solid";
import { ArrowPathIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import useImportProduct from "../_hooks/useImportProduct";
import JsonInput from "@/components/Modal/JsonInput";

type Props = {
   currentCategory: Category | undefined;
};

type Modal = "Form" | "Json";

type JsonProduct = {
   name: string;
   category_id: number;
   brand_id: number;
   colors: string[];
   variants: string[];
   attributes: { category_attribute_id: number; value: string }[];
   image: string;
   sliders: string[];
};

export default function AddProductBtn({ currentCategory }: Props) {
   const [modal, setModal] = useState<Modal | "">("");
   const [jsonProducts, setJsonProducts] = useState<JsonProduct[]>();

   const modalRef = useRef<ModalRef>(null);
   const triggerRef = useRef<TriggerRef>(null);

   const { currentIndex, status, setStatus, submit } = useImportProduct();

   const handleModalOnClose = () => {
      if (modal === "Json") setTimeout(() => setStatus("input"), 200);
   };

   const closeModal = () => {
      if (modal === "Form") return modalRef.current?.close();

      if (modal === "Json" && status !== "fetching") {
         modalRef.current?.close();
         handleModalOnClose();
      }
   };

   const openModal = (modal: Modal) => {
      setModal(modal);
      triggerRef.current?.close();
      modalRef.current?.open();
   };

   const handleSubmit = async (v: string) => {
      try {
         const json = JSON.parse(v);
         setJsonProducts(json);
      } catch (error) {
         console.log("Something went wrong");
      }

      await submit(v);
   };

   const classes = {
      menuItem:
         "px-3 py-1 flex font-[500] items-center hover:text-[#cd1818] space-x-1 hover:bg-[#e1e1e1]",
   };

   return (
      <>
         <Popover>
            <PopoverTrigger ref={triggerRef}>
               <Button
                  className="flex-shrink-0 h-full px-2"
                  colors={"third"}
                  size={"clear"}
               >
                  <PlusIcon className="w-[24px]" />
                  <span className="hidden sm:block ml-[6px]">Add product</span>
               </Button>
            </PopoverTrigger>
            <PopoverContent
               className="w-full translate-y-[8px]"
               appendTo="parent"
               animationClassName="origin-top"
            >
               <div className="overflow-hidden relative flex flex-col rounded-lg py-3 bg-[#fff] shadow-[2px_2px_10px_0_rgba(0,0,0,.15)] text-[#333]">
                  <button onClick={() => openModal("Json")} className={classes.menuItem}>
                     <CodeBracketIcon className="w-5" />
                     <span>Json</span>
                  </button>

                  <button onClick={() => openModal("Form")} className={classes.menuItem}>
                     <DocumentTextIcon className="w-5" />
                     <span>Form</span>
                  </button>
               </div>
            </PopoverContent>
         </Popover>

         <Modal onClose={handleModalOnClose} ref={modalRef} variant="animation">
            {modal === "Form" && (
               <AddProductModal
                  type="Add"
                  curCategory={currentCategory}
                  closeModal={closeModal}
               />
            )}

            {modal === "Json" && (
               <JsonInput
                  status={status}
                  submit={handleSubmit}
                  title="Import product"
                  closeModal={closeModal}
               >
                  {status === "fetching" && jsonProducts && (
                     <div className="text-[#333]">
                        <p className="text-xl font-[500]">
                           {(currentIndex || 0) + 1} of {jsonProducts?.length}
                        </p>
                        <div className="flex justify-between mt-3">
                           <p className="font-[500] text-lg">
                              {jsonProducts[currentIndex || 0].name}
                           </p>
                           <ArrowPathIcon className="w-6 animate-spin" />
                        </div>
                     </div>
                  )}
               </JsonInput>
            )}
         </Modal>
      </>
   );
}
