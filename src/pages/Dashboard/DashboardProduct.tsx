import { useState, useMemo, useRef } from "react";
import { Button, Modal, Search } from "@/components";
import Table from "@/components/Table";

import AddProductModal from "@/components/Modal/AddProductModal";

import { PlusIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import useDashBoardProduct from "./_hooks/useDashboardProduct";
import DashboardProductCta from "@/components/DashboardProductCta";
import { ModalRef } from "@/components/Modal";
import Popover, {
   PopoverContent,
   PopoverTrigger,
   TriggerRef,
} from "@/components/Popover";
import { CodeBracketIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import JsonImport from "./_components/JsonImport";

type Modal = "Form" | "Json";

export default function Dashboard() {
   const [modal, setModal] = useState<Modal | "">("");
   const [curCategory, setCurCategory] = useState<Category>();

   const modalRef = useRef<ModalRef>(null);
   const triggerRef = useRef<TriggerRef>(null);

   const closeModal = () => modalRef.current?.close();

   // hooks
   const { categories, getMore, count, products, status } = useDashBoardProduct(
      {
         setCurCategory,
         curCategory,
      }
   );

   const remaining = useMemo(() => count - products.length, [products]);

   const handleGetMore = () => {
      getMore();
   };

   const handleOpenModal = (modal: Modal) => {
      setModal(modal);
      triggerRef.current?.close();
      modalRef.current?.open();
   };

   const renderProducts = (
      <Table colList={["Name", ""]}>
         {status !== "loading" && (
            <>
               {!!products.length ? (
                  <>
                     {products.map((p, index) => {
                        return (
                           <tr key={index}>
                              <td className="font-[500]">{p.name}</td>
                              {/* loop here */}
                              <td className="!text-right">
                                 <DashboardProductCta
                                    index={index}
                                    product={p}
                                 />
                              </td>
                           </tr>
                        );
                     })}
                  </>
               ) : (
                  <tr>
                     <td colSpan={2}>
                        <p className="text-center">¯\_(ツ)_/¯</p>
                     </td>
                  </tr>
               )}
            </>
         )}
      </Table>
   );

   const renderModal = () => {
      switch (modal) {
         case "Form":
            return (
               <AddProductModal
                  type="Add"
                  curCategory={curCategory}
                  closeModal={closeModal}
               />
            );
         case "Json":
            return <JsonImport closeModal={closeModal} />;
      }
   };

   const classes = {
      tab: "px-[12px] sm:px-[24px] py-1 ml-[8px] mt-[8px]",
      menuItem:
         "px-3 py-1 flex font-[500] items-center hover:text-[#cd1818] space-x-1 hover:bg-[#e1e1e1]",
   };

   if (status === "error")
      return <p className="text-center">Some thing went wrong</p>;

   return (
      <>
         <div className="text-lg sm:text-2xl mb-[30px]">Product</div>

         <div className="flex justify-between">
            <Search variant="dashboard" />
            <Popover>
               <PopoverTrigger ref={triggerRef}>
                  <Button
                     className="flex-shrink-0 h-full px-2"
                     colors={"third"}
                     size={"clear"}
                  >
                     <PlusIcon className="w-[24px]" />
                     <span className="hidden sm:block ml-[6px]">
                        Add product
                     </span>
                  </Button>
               </PopoverTrigger>
               <PopoverContent
                  className="right-0 translate-y-[8px]"
                  appendTo="parent"
               >
                  <div className="w-[100px] overflow-hidden relative flex flex-col rounded-lg py-3 bg-[#fff] shadow-[4px_2px_15px_0_rgba(0,0,0,.15)] text-[#333]">
                     <button
                        onClick={() => handleOpenModal("Json")}
                        className={classes.menuItem}
                     >
                        <CodeBracketIcon className="w-5" />
                        <span>Json</span>
                     </button>

                     <button
                        onClick={() => handleOpenModal("Form")}
                        className={classes.menuItem}
                     >
                        <DocumentTextIcon className="w-5" />
                        <span>Form</span>
                     </button>
                  </div>
               </PopoverContent>
            </Popover>
         </div>

         <div className="flex flex-wrap mt-3 ml-[-8px] mb-[10px]">
            <Button
               colors={"second"}
               onClick={() => setCurCategory(undefined)}
               active={!curCategory}
               size={"clear"}
               className={classes.tab}
            >
               All
            </Button>
            {categories.map((cat, index) => {
               if (cat.hidden) return;
               const active = curCategory?.name_ascii === cat.name_ascii;
               return (
                  <Button
                     colors={"second"}
                     key={index}
                     size={"clear"}
                     className={classes.tab}
                     onClick={() => setCurCategory(cat)}
                     active={active}
                  >
                     {cat.name}
                     {status === "successful" && active && " (" + count + ")"}
                  </Button>
               );
            })}
         </div>

         <div className="mt-4">
            {renderProducts}
            {status === "loading" && (
               <p className="mt-[30px] text-center w-full">
                  <ArrowPathIcon className="w-[24px] animate-spin inline-block" />
               </p>
            )}
            {status !== "loading" && !!products.length && (
               <p className="text-center mt-[30px]">
                  <Button
                     colors={"second"}
                     disabled={remaining <= 0 || status === "more-loading"}
                     loading={status === "more-loading"}
                     onClick={() => handleGetMore()}
                  >
                     More
                  </Button>
               </p>
            )}
         </div>

         <Modal ref={modalRef} variant="animation">
            {renderModal()}
         </Modal>
      </>
   );
}
