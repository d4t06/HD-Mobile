import { inputClasses } from "@/components/ui/Input";
import "../../layout.scss";
import { useMemo, useRef, useState } from "react";
import BrandItem from "./child/BrandItem";
import useBrandAction from "../_hooks/uesBrandAction";
import { generateId } from "@/utils/appHelper";
import { Empty, Modal } from "@/components";
import AddItem from "@/components/Modal/AddItem";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";

export default function BrandList() {
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
         brand: value,
         brand_ascii: generateId(value),
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
         <h1 className="label">Brand</h1>
         <div className="group-container">
            <div className="flex-container inline-flex items-center">
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
                     categories.map((category, index) => (
                        <option key={index} value={index}>
                           {category.category}
                        </option>
                     ))}
               </select>
            </div>

            {currentCategoryIndex !== undefined && currentCategory && (
               <div className="flex-container mt-[16px]">
                  {currentCategory.brands.map((item, index) => (
                     <div key={index} className="w-2/12">
                        <BrandItem
                           brand={item}
                           index={index}
                           categoryIndex={currentCategoryIndex}
                        />
                     </div>
                  ))}

                  <div className="w-2/12">
                     <Empty
                        fontClassName="bg-[#f1f1f1]"
                        onClick={() => setOpenModal(true)}
                     />
                  </div>
               </div>
            )}
         </div>

         {openModal && (
            <Modal close={closeModal}>
               <AddItem
                  loading={isFetching}
                  title="Add brand"
                  cbWhenSubmit={(value) => handleAddBrand(value)}
                  close={closeModal}
               />
            </Modal>
         )}
      </>
   );
}
