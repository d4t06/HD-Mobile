import { inputClasses } from "@/components/ui/Input";
import { useMemo, useState } from "react";
import BrandItem from "./child/BrandItem";
import useBrandAction from "../_hooks/uesBrandAction";
import { Empty, Modal } from "@/components";
import AddItem from "@/components/Modal/AddItem";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";

type Props = {
   mainClasses: LayoutClasses;
};

export default function BrandList({ mainClasses }: Props) {
   const { categories } = useSelector(selectCategory);
   const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>();

   const [openModal, setOpenModal] = useState(false);

   //    hooks
   const { actions, isFetching } = useBrandAction();

   const currentCategory = useMemo(
      () =>
         currentCategoryIndex != undefined ? categories[currentCategoryIndex] : undefined,
      [categories, currentCategoryIndex]
   );

   const closeModal = () => setOpenModal(false);

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
      closeModal();
   };

   return (
      <>
         <h1 className={mainClasses.label}>Brand</h1>
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
                           )
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

                  <div className={`${mainClasses.flexCol}  w-1/2 sm:w-1/6`}>
                     <Empty
                        fontClassName="bg-[#f1f1f1]"
                        onClick={() => setOpenModal(true)}
                     />
                  </div>
               </div>
            )}
         </div>

         {openModal && (
            <Modal closeModal={closeModal}>
               <AddItem
                  loading={isFetching}
                  title="Add brand"
                  cbWhenSubmit={(value) => handleAddBrand(value)}
                  closeModal={closeModal}
               />
            </Modal>
         )}
      </>
   );
}
