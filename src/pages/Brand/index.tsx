import classNames from "classnames/bind";
import styles from "./Brand.module.scss";
import { useMemo, useRef, useState } from "react";
import { Category, CategorySchema, GetArrayType } from "@/types";
// import { usePrivateRequest } from "@/hooks";
import { Modal, Empty } from "@/components";
import { inputClasses } from "@/components/ui/Input";
import { generateId } from "@/utils/appHelper";
import AddItemMulti from "@/components/Modal/AddItemMulti";
import { useToast } from "@/store/ToastContext";
import OverlayCTA from "@/components/ui/OverlayCTA";
import ConfirmModal from "@/components/Modal/Confirm";
import useBrandAction from "@/hooks/useBrand";
import EditBrand from "./child/EditBrand";
import useAppConfig from "@/hooks/useAppConfig";
import { useApp } from "@/store/AppContext";
import AttributeGroup from "./child/AttributeGroup";
import PriceRangeGroup from "./child/PriceRangeGroup";
import {
   ArrowPathIcon,
   PencilIcon,
   PencilSquareIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";

const cx = classNames.bind(styles);

const CAT_FIELDS: ["Name"] = ["Name"];

type ModalTarget =
   | "add-brand"
   | "add-category"
   | "edit-category"
   | "delete-category"
   | "delete-brand"
   | "edit-brand";

export default function CategoryBrand() {
   const [curCategory, setCurCategory] = useState<Category | undefined>();
   const [isOpenModal, setIsOpenModal] = useState(false);

   const openModalTarget = useRef<ModalTarget | "">("");
   const curCatIndex = useRef<number>();
   const curBrandIndex = useRef<number>();

   // hooks
   const { categories, initLoading } = useApp();
   const { status: appConfigStatus, curBrands } = useAppConfig({
      curCategory: curCategory,
      autoRun: true,
      admin: true,
   });
   const { deleteBrand, deleteCategory, addCategory, addBrand, apiLoading } = useBrandAction({
      setIsOpenModal,
      curCategory,
      curBrands,
   });
   const { setErrorToast } = useToast();

   const handleOpenModal = (target: typeof openModalTarget.current, index?: number) => {
      openModalTarget.current = target;
      if (target === "add-brand" && curCatIndex === undefined) return;
      switch (target) {
         case "edit-category":
         case "delete-category":
            curCatIndex.current = index ?? undefined;
            break;

         case "edit-brand":
         case "delete-brand":
            curBrandIndex.current = index ?? undefined;
            break;
      }
      setIsOpenModal(true);
   };

   const getFieldValue = (
      value: Record<string, string>,
      name: GetArrayType<typeof CAT_FIELDS> | "default"
   ) => {
      return value[generateId(name)];
   };

   const handleAddCategory = async (value: Record<string, string>, type: "Add" | "Edit") => {
      if (!value[generateId("Name")].trim()) {
         setErrorToast("Must have category name");
         return;
      }

      const newCategory: CategorySchema = {
         category_name: getFieldValue(value, "Name"),
         category_ascii: generateId(getFieldValue(value, "Name")),
         hidden: false,
         attribute_order: "",
      };

      if (type === "Edit") {
         if (curCatIndex.current === undefined || !curCategory || curCategory.id === undefined) {
            setErrorToast("Current index not found");
            return;
         }

         return await addCategory({
            type: "Edit",
            category: newCategory,
            curIndex: curCatIndex.current,
            category_id: curCategory.id,
         });
      }

      await addCategory({
         type: "Add",
         category: newCategory,
      });
   };

   const handleDeleteCategory = async () => {
      if (curCatIndex.current === undefined) return setErrorToast();
      await deleteCategory(categories[curCatIndex.current]);
   };

   const handleDeleteBrand = async () => {
      await deleteBrand(curBrandIndex.current);
   };

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;
      switch (openModalTarget.current) {
         case "add-brand":
            if (curCategory?.id === undefined) return;
            console.log(curCategory);

            return (
               <EditBrand
                  type={"Add"}
                  addBrand={addBrand}
                  apiLoading={apiLoading}
                  setIsOpenModalParent={setIsOpenModal}
                  catId={curCategory.id}
               />
            );
         case "add-category":
            return (
               <AddItemMulti
                  loading={apiLoading}
                  fields={CAT_FIELDS}
                  title="Add category"
                  cb={(value) => handleAddCategory(value, "Add")}
                  setIsOpenModal={setIsOpenModal}
               />
            );
         case "edit-brand":
            if (
               curBrandIndex.current === undefined ||
               curBrands === undefined ||
               curCategory?.id === undefined
            )
               return "Index not found";
            return (
               <EditBrand
                  type={"Edit"}
                  addBrand={addBrand}
                  apiLoading={apiLoading}
                  setIsOpenModalParent={setIsOpenModal}
                  curBrand={{
                     ...curBrands[curBrandIndex.current],
                     curIndex: curBrandIndex.current,
                  }}
                  catId={curCategory?.id}
               />
            );

         case "edit-category":
            if (curCatIndex.current === undefined) return "Index not found";
            return (
               <AddItemMulti
                  loading={apiLoading}
                  fields={CAT_FIELDS}
                  title="Edit category"
                  cb={(value) => handleAddCategory(value, "Edit")}
                  setIsOpenModal={setIsOpenModal}
                  intiFieldData={{
                     name: categories[curCatIndex.current].category_name,
                  }}
               />
            );
         case "delete-category":
            if (curCatIndex.current === undefined) return "Index not found";

            return (
               <ConfirmModal
                  callback={handleDeleteCategory}
                  loading={apiLoading}
                  setOpenModal={setIsOpenModal}
                  label={`Delete category '${categories[curCatIndex.current].category_name}'`}
               />
            );
         case "delete-brand":
            if (curBrandIndex.current === undefined || curBrands === undefined)
               return "Index not found";

            return (
               <ConfirmModal
                  callback={handleDeleteBrand}
                  loading={apiLoading}
                  setOpenModal={setIsOpenModal}
                  label={`Delete brand '${curBrands[curBrandIndex.current].brand_name}'`}
               />
            );

         default:
            return <h1 className="text-3xl">Not thing to show</h1>;
      }
   }, [isOpenModal, apiLoading]);

   const content = (
      <>
         <h1 className={cx("page-title")}>Category</h1>
         <div
            className={`row bg-white p-[20px] rounded-[8px] mb-[30px] ${apiLoading && "disable"}`}
         >
            {categories.map((item, index) => (
               <div key={index} className="col w-2/12">
                  <Empty fontClassName="bg-[#f1f1f1] text-[#333]">
                     <span className="text-[16px] font-semibold">{item.category_name}</span>
                     <OverlayCTA
                        data={[
                           {
                              cb: () => handleOpenModal("delete-category", index),
                              icon: <PencilIcon className="w-[24px]" />,
                           },
                           {
                              cb: () => handleOpenModal("edit-category", index),
                              icon: <TrashIcon className="w-[24px]" />,
                           },
                        ]}
                     />
                  </Empty>
               </div>
            ))}
            <div className="col w-2/12">
               <Empty
                  fontClassName="bg-[#f1f1f1]"
                  onClick={() => handleOpenModal("add-category")}
               />
            </div>
         </div>

         <h1 className={cx("page-title")}>Price Range</h1>
         <PriceRangeGroup categories={categories} />

         <h1 className={cx("page-title")}>Category Attribute</h1>
         <AttributeGroup categories={categories} />

         <h1 className={cx("page-title")}>Brand</h1>

         <div className="bg-[#fff] rounded-[8px] p-[20px]">
            <div className="mb-[15px] flex items-center">
               <p className={cx("input-label", "mr-[10px]")}>Category: </p>
               <div className="bg-[#ccc] rounded-[12px]">
                  <select
                     disabled={!categories.length}
                     className={`${inputClasses.input} min-w-[100px]`}
                     name="category"
                     onChange={(e) => setCurCategory(categories[+e.target.value as number])}
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
            <div className={`row  ${appConfigStatus === "loading" || apiLoading ? "disable" : ""}`}>
               {curBrands &&
                  curBrands.map((brand, index) => (
                     <div key={index} className="col w-2/12">
                        <Empty fontClassName="bg-[#f1f1f1]">
                           <div className="">
                              <p className="text-[14px] text-center">{brand.brand_name}</p>
                              <img src={brand.image_url} alt="" />
                           </div>
                           <OverlayCTA
                              data={[
                                 {
                                    cb: () => handleOpenModal("delete-brand", index),
                                    icon: <TrashIcon className="w-[24px]" />,
                                 },
                                 {
                                    cb: () => handleOpenModal("edit-brand", index),
                                    icon: <PencilSquareIcon className="w-[24px]" />,
                                 },
                              ]}
                           />
                        </Empty>
                     </div>
                  ))}

               <div
                  className={`col w-2/12 ${!curCategory ? "opacity-40 pointer-events-none" : ""}`}
               >
                  <Empty
                     fontClassName="bg-[#f1f1f1]"
                     onClick={() => handleOpenModal("add-brand")}
                  />
               </div>
            </div>
         </div>
      </>
   );

   return (
      <div className="pb-[30px]">
         {initLoading && <ArrowPathIcon className="w-[24px] animate-spin" />}

         {!initLoading && content}

         {appConfigStatus === "error" && <h1 className="text-[18px]">Some thing went wrong</h1>}

         {isOpenModal && <Modal setShowModal={setIsOpenModal}>{renderModal}</Modal>}
      </div>
   );
}
