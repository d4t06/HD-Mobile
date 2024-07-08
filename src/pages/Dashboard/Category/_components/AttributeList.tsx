import { inputClasses } from "@/components/ui/Input";
import { useMemo, useRef, useState } from "react";
import { generateId } from "@/utils/appHelper";
import { DragAbleItem, Modal } from "@/components";
import AddItem from "@/components/Modal/AddItem";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import useAttributeActions from "../_hooks/useAttributeAction";
import PushButton from "@/components/ui/PushButton";
import AttributeItem from "./child/AttributeItem";
import { PlusIcon } from "@heroicons/react/16/solid";

type Props = {
   mainClasses: LayoutClasses;
};

export default function AttributeList({ mainClasses }: Props) {
   const { categories } = useSelector(selectCategory);
   const [currentCategoryIndex, setCurrentCategoryIndex] = useState<number>();

   const [openModal, setOpenModal] = useState(false);

   const [isDrag, setIsDrag] = useState(false);
   const endIndexRef = useRef<number>(0);

   //    hooks
   const { actions, isFetching, sortAttribute } = useAttributeActions({
      currentCategoryIndex,
   });

   const currentCategory = useMemo(
      () =>
         currentCategoryIndex !== undefined
            ? categories[currentCategoryIndex]
            : undefined,
      [categories, currentCategoryIndex]
   );

   const attributeOrder =
      currentCategory && currentCategory.attribute_order
         ? currentCategory.attribute_order.split("_")
         : [];

   const closeModal = () => setOpenModal(false);

   const handleAddBrand = async (value: string) => {
      if (currentCategoryIndex === undefined) return;

      const schema: CategoryAttributeSchema = {
         attribute: value,
         attribute_ascii: generateId(value),
         category_id: currentCategory!.id,
      };

      await actions({
         type: "Add",
         attribute: schema,
         categoryIndex: currentCategoryIndex,
      });
      closeModal();
   };

   return (
      <>
         <h1 className={mainClasses.label}>Attribute</h1>
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
                                    {category.category}
                                 </option>
                              )
                        )}
                  </select>
               </div>

               <PushButton
                  size={"clear"}
                  className="py-[4px] px-[12px]"
                  disabled={!currentCategory}
                  onClick={() => setOpenModal(true)}
               >
                  <PlusIcon className="w-[20px]" />
                  <span className="hidden sm:inline-block ml-[6p]">Add Price Range</span>
               </PushButton>
            </div>

            {currentCategoryIndex !== undefined && currentCategory && (
               <div className="flex flex-wrap ml-[-8px] mt-[6px]">
                  {attributeOrder.map((id, index) => {
                     const attributeIndex = currentCategory.attributes.findIndex(
                        (attr) => attr.id === +id
                     );
                     if (attributeIndex === -1) return <p>Attribute not found</p>;

                     const foundedCatAttribute =
                        currentCategory.attributes[attributeIndex];

                     return (
                        <DragAbleItem
                           index={index}
                           key={foundedCatAttribute.attribute_ascii}
                           className={`${
                              isFetching ? "opacity-60 pointer-events-none" : ""
                           } border border-black/15 rounded-[8px] overflow-hidden ml-[8px] mt-[8px]`}
                           setIsDrag={setIsDrag}
                           isDrag={isDrag}
                           handleDragEnd={() => sortAttribute(index, endIndexRef.current)}
                           endIndexRef={endIndexRef}
                        >
                           <AttributeItem
                              attribute={foundedCatAttribute}
                              index={attributeIndex}
                              categoryIndex={currentCategoryIndex}
                           />
                        </DragAbleItem>
                     );
                  })}
               </div>
            )}
         </div>

         {openModal && (
            <Modal closeModal={closeModal}>
               <AddItem
                  loading={isFetching}
                  title="Add attribute"
                  cbWhenSubmit={(value) => handleAddBrand(value)}
                  closeModal={closeModal}
               />
            </Modal>
         )}
      </>
   );
}
