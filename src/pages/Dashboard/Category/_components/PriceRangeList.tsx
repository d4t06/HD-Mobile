import { inputClasses } from "@/components/ui/Input";
import { useMemo, useState } from "react";
import { generateId } from "@/utils/appHelper";
import { Modal } from "@/components";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import AddItemMulti, { FieldType } from "@/components/Modal/AddItemMulti";
import PriceRangeItem from "./child/PriceRangeItem";
import usePriceRangeActions from "../_hooks/usePriceRangeAction";
import Button from "@/components/ui/Button";
import { PlusIcon } from "@heroicons/react/16/solid";

type FIELD_KEYS = "Label" | "From" | "To";

const PRICE_FIELDS: FieldType = [
   "Label",
   { label: "From", placeholder: "1 = 1.000.000đ" },
   { label: "To", placeholder: "1 = 1.000.000đ" },
];

type Props = {
   mainClasses: LayoutClasses;
};

export default function PriceRangeList({ mainClasses }: Props) {
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
         <h1 className={mainClasses.label}>Price Range</h1>
         <div className={mainClasses.group}>
            <div className="flex justify-between">
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

               <Button
                  colors={"third"}
                  size={"clear"}
                  className="p-[4px] px-[12px]"
                  disabled={!currentCategory}
                  onClick={() => setOpenModal(true)}
               >
                  <PlusIcon className="w-5" />
                  <span className="hidden sm:inline-block ml-1">Add Price Range</span>
               </Button>
            </div>

            {currentCategoryIndex !== undefined && currentCategory && (
               <div className="mt-[14px]">
                  <div className={`${mainClasses.flexContainer}`}>
                     {currentCategory.price_ranges.map((item, index) => (
                        <div key={index} className={`${mainClasses.flexCol}`}>
                           <PriceRangeItem
                              priceRange={item}
                              index={index}
                              categoryIndex={currentCategoryIndex}
                              getValue={getFieldValue}
                           />
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
         {openModal && (
            <Modal closeModal={closeModal}>
               <AddItemMulti
                  loading={isFetching}
                  title="Add price range"
                  fields={PRICE_FIELDS}
                  cb={(value) => handleAddPriceRange(value)}
                  closeModal={closeModal}
               />
            </Modal>
         )}
      </>
   );
}
