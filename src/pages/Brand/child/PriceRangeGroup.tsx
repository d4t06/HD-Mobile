import { inputClasses } from "@/components/ui/Input";
import { Category, CategoryAttribute, GetArrayType, PriceRange } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "../Brand.module.scss";
import classNames from "classnames/bind";
import { Button, Modal } from "@/components";
import AddItem from "@/components/Modal/AddItem";
import ConfirmModal from "@/components/Modal/Confirm";
import useBrandAction from "@/hooks/useBrand";
import { generateId } from "@/utils/appHelper";
import PushFrame from "@/components/ui/PushFrame";
import AddItemMulti from "@/components/Modal/AddItemMulti";
const cx = classNames.bind(styles);

type Props = {
   categories: Category[];
};

type ModalTarget = "add-price" | "edit-price" | "delete-price";

const PRICE_FIELDS: ["From", "To", "Label"] = ["From", "To", "Label"];

const getFieldValue = (value: Record<string, string>, name: GetArrayType<typeof PRICE_FIELDS>) => {
   return value[generateId(name)];
};

export default function PriceRangeGroup({ categories }: Props) {
   const [curCategory, setCurCategory] = useState<Category | undefined>();
   const [curCategoryIndex, setCurCategoryIndex] = useState<number>();
   const [isOpenModal, setIsOpenModal] = useState(false);

   const openModalTarget = useRef<ModalTarget | "">("");
   const curPriceIndex = useRef<number>();

   //  hooks
   const { addPriceRange, deletePriceRange, apiLoading } = useBrandAction({
      curCategory,
      setIsOpenModal,
      curBrands: undefined,
   });

   const handleAddPriceRange = async (data: Record<string, string>, type: "Add" | "Edit") => {
      if (curCategory?.id === undefined) throw new Error("curCategory.id is undefined");

      const newPriceRange: PriceRange = {
         id: undefined,
         from: +getFieldValue(data, "From"),
         to: +getFieldValue(data, "To"),
         label: getFieldValue(data, "Label"),
         category_id: curCategory.id,
      };

      if (type === "Edit") {
         if (curPriceIndex.current === undefined || curCategory.price_ranges === undefined) {
            throw new Error("Current index not found");
         }

         newPriceRange.id = curCategory.price_ranges[curPriceIndex.current].id;
      }

      await addPriceRange(newPriceRange, type, curPriceIndex.current);
   };

   const handleDeleteAttr = async () => {
      await deletePriceRange(curPriceIndex.current);
   };

   const handleOpenModal = (target: typeof openModalTarget.current, index?: number) => {
      openModalTarget.current = target;
      switch (target) {
         case "edit-price":
         case "delete-price":
            curPriceIndex.current = index ?? undefined;
            break;
      }
      setIsOpenModal(true);
   };

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;
      switch (openModalTarget.current) {
         case "add-price":
            if (!curCategory) return <p className="text-[16px]">Current category not found</p>;
            return (
               <AddItemMulti
                  loading={apiLoading}
                  title="Add attribute"
                  fields={PRICE_FIELDS}
                  cb={(value) => handleAddPriceRange(value, "Add")}
                  setIsOpenModal={setIsOpenModal}
               />
            );
         case "edit-price":
            if (curPriceIndex.current === undefined || curCategory?.price_ranges == undefined)
               return <h1>Index not found</h1>;

            const curPrice = curCategory.price_ranges[curPriceIndex.current];
            return (
               <AddItemMulti
                  loading={apiLoading}
                  title="Add category"
                  cb={(value) => handleAddPriceRange(value, "Edit")}
                  setIsOpenModal={setIsOpenModal}
                  intiFieldData={{
                     From: curPrice.from + "",
                     To: curPrice.to + "",
                     Label: curPrice.label,
                  }}
                  fields={PRICE_FIELDS}
               />
            );

         case "delete-price":
            if (curPriceIndex.current === undefined || curCategory?.price_ranges == undefined)
               return <h1>Index not found</h1>;

            return <ConfirmModal callback={handleDeleteAttr} loading={apiLoading} setOpenModal={setIsOpenModal} />;

         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [isOpenModal, apiLoading]);

   useEffect(() => {
      if (curCategoryIndex === undefined) return;
      setCurCategory(categories[curCategoryIndex]);
   }, [categories, curCategoryIndex]);

   return (
      <>
         <div className="bg-[#fff]  rounded-[8px] p-[20px] mb-[30px]">
            <div className="flex items-center justify-between">
               <div className="flex items-center">
                  <p className={cx("input-label", "mr-[10px]")}>Category: </p>
                  <div className="bg-[#ccc] rounded-[12px]">
                     <select
                        disabled={!categories.length}
                        className={`${inputClasses.input} min-w-[100px]`}
                        name="category"
                        onChange={(e) => setCurCategoryIndex(+e.target.value)}
                     >
                        <option value={undefined}>---</option>
                        {!!categories.length &&
                           categories.map((category, index) => (
                              <option key={index} value={index}>
                                 {category.category_name}
                              </option>
                           ))}
                     </select>
                  </div>
               </div>

               <Button disable={!curCategory} onClick={() => handleOpenModal("add-price")} primary>
                  <i className="material-icons mr-[8px]">add</i> Add price range
               </Button>
            </div>

            {curCategory?.price_ranges && (
               <div className={`mt-[14px] row gap-[10px] ${apiLoading ? "disable" : ""}`}>
                  {curCategory.price_ranges.map((price, index) => (
                     <PushFrame type="translate" key={index}>
                        <div className={cx("attr-item")}>
                           <div>
                              <p>{price.label}</p>
                              <p>
                                 ({price.from} - {price.to})
                              </p>
                           </div>

                           <div className={cx("cta")}>
                              <Button onClick={() => handleOpenModal("delete-price", index)}>
                                 <i className="material-icons">delete</i>
                              </Button>
                              <Button onClick={() => handleOpenModal("edit-price", index)}>
                                 <i className="material-icons">edit</i>
                              </Button>
                           </div>
                        </div>
                     </PushFrame>
                  ))}
               </div>
            )}
         </div>

         {isOpenModal && <Modal setShowModal={setIsOpenModal}>{renderModal}</Modal>}
      </>
   );
}
