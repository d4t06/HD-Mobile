import { inputClasses } from "@/components/ui/Input";
import { useMemo, useRef, useState } from "react";
import BrandItem from "./child/BrandItem";
import useBrandAction from "../_hooks/uesBrandAction";
import { Button, Modal } from "@/components";
import AddItem from "@/components/Modal/AddItem";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import { PlusIcon } from "@heroicons/react/24/outline";
import { ModalRef } from "@/components/Modal";

type Props = {
   mainClasses: LayoutClasses;
};

export default function BrandList({ mainClasses }: Props) {
   const { categories } = useSelector(selectCategory);
   const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>();

   const modalRef = useRef<ModalRef>(null);

   //    hooks
   const { actions, isFetching } = useBrandAction();

   const currentCategory = useMemo(
      () =>
         currentCategoryIndex != undefined ? categories[currentCategoryIndex] : undefined,
      [categories, currentCategoryIndex],
   );

   const handleAddBrand = async (value: string) => {
      if (currentCategoryIndex === undefined) return;

      const schema: BrandSchema = {
         name: value,
         name_ascii: "",
         category_id: currentCategory!.id,
         image_url: "",
      };

      await actions({
         type: "Add",
         brand: schema,
         categoryIndex: currentCategoryIndex,
      });
      modalRef.current?.close();
   };

   return (
      <>
         <div className="flex items-center justify-between">
            <h1 className={mainClasses.label}>Brand</h1>

            <Button
               colors={"third"}
               disabled={!currentCategory}
               onClick={() => modalRef.current?.open()}
            >
               <PlusIcon className="w-6" />
               <span className="hidden sm:inline-block ml-1">Add new brand</span>
            </Button>
         </div>
         <div className={mainClasses.group}>
            <div className="inline-flex gap-[16px] items-center">
               <span>Category: </span>
               <select
                  className={`${inputClasses.input} min-w-[100px]`}
                  name="category"
                  onChange={(e) => {
                     setCurrentCategoryIndex(+e.target.value as number);
                  }}
               >
                  <option value={undefined}>---</option>
                  {!!categories.length &&
                     categories.map(
                        (category, index) =>
                           !category.hidden && (
                              <option key={index} value={index}>
                                 {category.name}
                              </option>
                           ),
                     )}
               </select>
            </div>

            {currentCategoryIndex !== undefined && currentCategory && (
               <div className={`${mainClasses.flexContainer} mt-[16px]`}>
                  {currentCategory.brands.map((item, index) => (
                     <div
                        key={index}
                        className={`${mainClasses.flexCol}  w-1/2 sm:w-1/6`}
                     >
                        <BrandItem
                           brand={item}
                           index={index}
                           categoryIndex={currentCategoryIndex}
                        />
                     </div>
                  ))}
               </div>
            )}
         </div>

         <Modal variant="animation" ref={modalRef}>
            <AddItem
               loading={isFetching}
               title="Add brand"
               cbWhenSubmit={(value) => handleAddBrand(value)}
               closeModal={() => modalRef.current?.close()}
            />
         </Modal>
      </>
   );
}
