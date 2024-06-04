import { useState, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { moneyFormat } from "@/utils/appHelper";

import { Button, Input, Modal, QuickFilter } from "@/components";
import { useDispatch, useSelector } from "react-redux";
import {
   fetchProducts,
   getMoreProducts,
   selectedAllFilter,
   selectedAllProduct,
   storingFilters,
} from "@/store";
import { AppDispatch } from "@/store/store";
import Table from "@/components/Table";

import AddProductModal from "@/components/Modal/AddProductModal";
import { Cog6ToothIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import PushButton from "@/components/ui/PushButton";
import useCurrentCategory from "@/hooks/useCurrentCategory";
import { selectCategory } from "@/store/categorySlice";

type ModelTarget = "Add" | "Edit";

type OpenAddModal = {
   type: "Add";
};

type OpenEditModal = {
   type: "Edit";
   product: Product;
   currentIndex: number;
};

export default function Dashboard() {
   const dispatch = useDispatch<AppDispatch>();

   const [isOpenModal, setIsOpenModal] = useState(false);
   const [curCategory, setCurCategory] = useState<Category>();

   const currentProduct = useRef<Product>();
   const currentProductIndex = useRef<number>();
   const firstTimeRender = useRef(true);
   const openModalTarget = useRef<ModelTarget | "">("");
   const ranEffect = useRef(false);

   // hooks
   const {
      page,
      productState: { count, products },
      status,
      category_id,
   } = useSelector(selectedAllProduct);
   const { filters, sort } = useSelector(selectedAllFilter);
   const { categories } = useSelector(selectCategory);

   // hooks
   const { currentCategory } = useCurrentCategory();

   const remaining = useMemo(() => count - products.length, [products]);

   const closeModal = () => setIsOpenModal(false);

   const handleGetMore = () => {
      dispatch(
         getMoreProducts({ category_id, sort, filters, page: page + 1, admin: true })
      );
   };

   const handleOpenModal = ({ ...props }: OpenAddModal | OpenEditModal) => {
      switch (props.type) {
         case "Add":
            openModalTarget.current = props.type;
            break;
         case "Edit":
            openModalTarget.current = props.type;
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
                              <td className="font-[500]">{productItem.product}</td>
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
                                    to={`${productItem.product_ascii}`}
                                    size={"clear"}
                                    className="p-[4px] ml-[8px]"
                                    colors={"second"}
                                 >
                                    <Cog6ToothIcon className="w-[24px]" />
                                 </Button>
                              </td>
                           </tr>
                        );
                     })}
                  </>
               ) : (
                  <tr>
                     <td>
                        <h1>No product jet...</h1>
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
               <AddProductModal type="Add" curCategory={curCategory} close={closeModal} />
            );
         case "Edit":
            if (!currentProduct.current || currentProductIndex.current === undefined)
               return <p>Some thing went wrong</p>;

            return (
               <AddProductModal
                  type="Edit"
                  close={closeModal}
                  product={currentProduct.current}
                  currentIndex={currentProductIndex.current}
               />
            );
         default:
            return <h1 className="text-2xl">Noting to show</h1>;
      }
   }, [isOpenModal, curCategory]);

   useEffect(() => {
      if (!ranEffect.current)
         dispatch(
            fetchProducts({
               category_id: curCategory?.id || undefined,
               filters,
               page: 1,
               sort,
               admin: true,
            })
         );

      return () => {
         dispatch(storingFilters());
         ranEffect.current = true;
      };
   }, [curCategory]);

   useEffect(() => {
      if (!categories.length) return;

      if (firstTimeRender.current) {
         firstTimeRender.current = false;
         setCurCategory(categories[0]);
      }
   }, []);

   const classes = {
      tab: "px-[24px] py-[8px]",
   };

   if (status === "error") return <h1 className="text-2xl">Some thing went wrong</h1>;

   return (
      <>
         <div className="flex gap-[8px] mb-[10px]">
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
               const active = curCategory?.category_ascii === cat.category_ascii;
               return (
                  <Button
                     colors={"second"}
                     key={index}
                     size={"clear"}
                     className={classes.tab}
                     onClick={() => setCurCategory(cat)}
                     active={active}
                  >
                     {cat.category}
                     {status === "successful" && active && " (" + count + ")"}
                  </Button>
               );
            })}
         </div>

         {curCategory && <QuickFilter admin />}

         <div className="flex items-center justify-between mt-[30px]">
            <div className="flex items-start">
               <Input placeholder="Product..." cb={(key) => console.log(key)} />
               <p className="ml-[8px]">
                  <PushButton>Tìm</PushButton>
               </p>
            </div>

            <PushButton onClick={() => handleOpenModal({ type: "Add" })}>
               <PlusIcon className="w-[24px]" />
               Thêm sản phẩm
            </PushButton>
         </div>

         <div className="mt-[10px]">
            {renderProducts}
            {status === "loading" && <h1 className="text-3xl text-center">Loading...</h1>}
            {status !== "loading" && !!products.length && (
               <p className="text-center my-[15px]">
                  <PushButton
                     disabled={remaining <= 0 || status === "more-loading"}
                     loading={status === "more-loading"}
                     onClick={() => handleGetMore()}
                  >
                     Xem thêm ({remaining <= 0 ? 0 : remaining}) sản phẩm
                  </PushButton>
               </p>
            )}
         </div>

         {isOpenModal && <Modal close={closeModal}>{renderModal}</Modal>}
      </>
   );
}
