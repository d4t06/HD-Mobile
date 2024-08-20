import { useState, useMemo, useRef } from "react";
import { Button, Modal, Search } from "@/components";
import Table from "@/components/Table";

import AddProductModal from "@/components/Modal/AddProductModal";
import { Cog6ToothIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import { ArrowPathIcon } from "@heroicons/react/16/solid";
import useDashBoardProduct from "./_hooks/useDashboardProduct";
import ConfirmModal from "@/components/Modal/Confirm";
import useProductAction from "@/hooks/useProductAction";

type ModelTarget = "Add" | "Edit" | "Delete";

type OpenAddModal = {
   type: "Add";
};

type OpenEditModal = {
   type: "Edit" | "Delete";
   product: Product;
   currentIndex: number;
};

export default function Dashboard() {
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [curCategory, setCurCategory] = useState<Category>();

   const currentProduct = useRef<Product>();
   const currentProductIndex = useRef<number>();
   const openModalTarget = useRef<ModelTarget | "">("");

   // hooks
   const { categories, getMore, count, products, status } = useDashBoardProduct({
      setCurCategory,
      curCategory,
   });
   const closeModal = () => setIsOpenModal(false);
   const { isFetching, deleteProduct } = useProductAction({ closeModal });

   const remaining = useMemo(() => count - products.length, [products]);

   const handleGetMore = () => {
      getMore();
   };

   const handleOpenModal = ({ ...props }: OpenAddModal | OpenEditModal) => {
      openModalTarget.current = props.type;
      switch (props.type) {
         case "Delete":
         case "Edit":
            currentProduct.current = props.product;
            currentProductIndex.current = props.currentIndex;
      }
      setIsOpenModal(true);
   };

   const renderProducts = (
      <Table colList={["Tên", ""]}>
         {status !== "loading" && (
            <>
               {!!products.length ? (
                  <>
                     {products.map((productItem, index) => {
                        return (
                           <tr key={index}>
                              <td className="font-[500]">{productItem.name}</td>
                              {/* loop here */}
                              <td className="!text-right">
                                 <Button
                                    onClick={() =>
                                       handleOpenModal({
                                          type: "Edit",
                                          currentIndex: index,
                                          product: productItem,
                                       })
                                    }
                                    size={"clear"}
                                    colors={"second"}
                                    className="p-[4px]"
                                 >
                                    <PencilSquareIcon className="w-[24px]" />
                                 </Button>
                                 <Button
                                    to={`${productItem.id}`}
                                    size={"clear"}
                                    className="p-[4px] ml-[8px]"
                                    colors={"second"}
                                 >
                                    <Cog6ToothIcon className="w-[24px]" />
                                 </Button>
                                 <Button
                                    onClick={() =>
                                       handleOpenModal({
                                          type: "Delete",
                                          currentIndex: index,
                                          product: productItem,
                                       })
                                    }
                                    size={"clear"}
                                    className="p-[4px] ml-[8px]"
                                    colors={"second"}
                                 >
                                    <TrashIcon className="w-[24px]" />
                                 </Button>
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

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;
      switch (openModalTarget.current) {
         case "Add":
            return (
               <AddProductModal
                  type="Add"
                  curCategory={curCategory}
                  closeModal={closeModal}
               />
            );
         case "Edit":
            if (!currentProduct.current || currentProductIndex.current === undefined)
               return <p>Some thing went wrong</p>;

            return (
               <AddProductModal
                  type="Edit"
                  closeModal={closeModal}
                  product={currentProduct.current}
                  currentIndex={currentProductIndex.current}
               />
            );
         case "Delete": {
            const p = currentProduct.current;
            if (p)
               return (
                  <ConfirmModal
                     label={`Delete '${currentProduct.current!.name}' ?`}
                     callback={() => deleteProduct(p.id)}
                     closeModal={closeModal}
                     loading={isFetching}
                  />
               );

            break;
         }
         default:
            return <h1 className="text-2xl">Noting to show</h1>;
      }
   }, [isOpenModal, curCategory, isFetching]);

   const classes = {
      tab: "px-[12px] sm:px-[24px] py-[8px] ml-[8px] mt-[8px]",
   };

   if (status === "error") return <p className="text-center">Some thing went wrong</p>;

   return (
      <>
         <div className="flex items-start justify-between ">
            <Search variant="dashboard" />
            <Button
               className="flex-shrink-0 ml-[10px] px-[12px] py-[7px]"
               colors={"third"}
               size={"clear"}
               onClick={() => handleOpenModal({ type: "Add" })}
            >
               <PlusIcon className="w-[24px]" />
               <span className="hidden sm:block ml-[6px]">Thêm sản phẩm</span>
            </Button>
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
                     Xem thêm
                  </Button>
               </p>
            )}
         </div>

         {isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}
