import { inputClasses } from "@/components/ui/Input";
import "../../layout.scss";
import { useMemo, useState } from "react";
import { generateId } from "@/utils/appHelper";
import { Modal } from "@/components";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import AddItemMulti, { FieldType } from "@/components/Modal/AddItemMulti";
import PriceRangeItem from "./child/PriceRangeItem";
import usePriceRangeActions from "../_hooks/usePriceRangeAction";
import PushButton from "@/components/ui/PushButton";

type FIELD_KEYS = "Label" | "From" | "To";

const PRICE_FIELDS: FieldType = [
   "Label",
   { label: "From", placeholder: "1 = 1.000.000đ" },
   { label: "To", placeholder: "1 = 1.000.000đ" },
];

export default function PriceRangeList() {
   const { categories } = useSelector(selectCategory);
   const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>();

   const [openModal, setOpenModal] = useState(false);

   //    hooks
   const { actions, isFetching } = usePriceRangeActions();

   const currentCategory = useMemo(
      () =>
         currentCategoryIndex != undefined ? categories[currentCategoryIndex] : undefined,
      [categories, currentCategoryIndex]
   );

   const closeModal = () => setOpenModal(false);

   const getFieldValue = (value: Record<string, string>, name: FIELD_KEYS) => {
      return value[generateId(name)];
   };

   const handleAddPriceRange = async (value: Record<string, string>) => {
      if (currentCategoryIndex === undefined) return;

      const schema: PriceRangeSchema = {
         from: +getFieldValue(value, "From"),
         to: +getFieldValue(value, "To"),
         label: getFieldValue(value, "Label"),
         category_id: currentCategory!.id,
      };

      await actions({
         type: "Add",
         priceRange: schema,
         categoryIndex: currentCategoryIndex,
      });
      closeModal();
   };

   return (
      <>
         .<h1 className="label">Price Range</h1>
         <div className="group-container">
            <div className="flex justify-between">
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

               <PushButton disabled={!currentCategory} onClick={() => setOpenModal(true)}>
                Add Price Range
               </PushButton>
            </div>

            {currentCategoryIndex !== undefined && currentCategory && (
               <div className="flex-container mt-[16px]">
                  {currentCategory.price_ranges.map((item, index) => (
                     <PriceRangeItem
                        priceRange={item}
                        index={index}
                        categoryIndex={currentCategoryIndex}
                        getValue={getFieldValue}
                     />
                  ))}
               </div>
            )}
         </div>
         {openModal && (
            <Modal close={closeModal}>
               <AddItemMulti
                  loading={isFetching}
                  title="Add price range"
                  fields={PRICE_FIELDS}
                  cb={(value) => handleAddPriceRange(value)}
                  close={close}
               />
            </Modal>
         )}
      </>
   );
}
