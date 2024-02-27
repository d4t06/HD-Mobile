import { Dispatch, SetStateAction, useMemo, useRef, useState } from "react";

import { generateId, initProductObject } from "@/utils/appHelper";
import { Button, Gallery, Modal } from "@/components";

import { Category, Product, ProductSchema } from "@/types";
import { Empty, Input } from "@/components";
import { inputClasses } from "@/components/ui/Input";
import ModalHeader from "./ModalHeader";
import useProductAction from "@/hooks/useProductAction";
import { useApp } from "@/store/AppContext";
import useAppConfig from "@/hooks/useAppConfig";
import { useToast } from "@/store/ToastContext";
import { CheckIcon } from "@heroicons/react/24/outline";

type OpenType = "Edit" | "Add";

type Props = {
   setIsOpenModalParent: Dispatch<SetStateAction<boolean>>;
   openType: OpenType;
   curProduct?: Product & { curIndex: number };
   curCategory?: Category;
};

export default function AddProductModal({ curProduct, openType, setIsOpenModalParent, curCategory }: Props) {
   const [productData, setProductData] = useState<ProductSchema>(
      curProduct || initProductObject({ category_id: curCategory?.id })
   );
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [selectedCat, setSelectedCat] = useState(curCategory);

   const nameRef = useRef<HTMLInputElement>(null);
   // use hook
   const { addProduct, apiLoading } = useProductAction({
      setIsOpenModal: setIsOpenModalParent,
   });
   const { brands, categories } = useApp();
   const { status: appStatus } = useAppConfig({ curCategory: selectedCat });
   const { setErrorToast } = useToast();

   const brandsByCategory = useMemo(() => {
      if (appStatus === "loading" || !brands || !selectedCat) return [];
      return brands[selectedCat.category_name_ascii] || [];
   }, [brands, selectedCat, appStatus]);

   const handleInput = (field: keyof typeof productData, value: any) => {
      // also set product_name_ascii
      if (field === "product_name") {
         return setProductData({
            ...productData,
            [field]: value,
            product_name_ascii: generateId(value),
         });
      }

      if (field === "category_id") {
         if (!value) return;
         const category = categories.find((c) => c.id === value);
         if (!category) return setErrorToast("No category found");
         setSelectedCat(category);
      }

      setProductData({ ...productData, [field]: value });
   };

   const handleChoseProductImage = (image_url: string[]) => {
      handleInput("image_url", image_url[0]);
   };

   const ableToCreateProduct = useMemo(
      () => !!productData.product_name && productData.category_id !== undefined && productData.brand_id !== undefined,
      [productData]
   );

   const handleSubmit = async () => {
      if (!ableToCreateProduct) {
         setErrorToast();
         return;
      }
      switch (openType) {
         case "Add":
            await addProduct("Add", productData);
            break;
         case "Edit":
            await addProduct("Edit", productData);
            break;
         default:
            console.log("click");
      }
   };

   if (appStatus === "error") return <h1>Some thing went wrong</h1>;

   const tileMap: Record<OpenType, string> = {
      Add: "Thêm sản phẩm mới",
      Edit: `Chỉnh sửa sản phẩm '${curProduct?.product_name}'`,
   };

   return (
      <div className="w-[700px] max-w-[90vw]">
         <ModalHeader setIsOpenModal={setIsOpenModalParent} title={`${tileMap[openType]}`} />
         <div className={appStatus === "loading" || apiLoading ? "opacity-60 pointer-events-none" : ""}>
            <div className="row mb-[30px]">
               <div className="col w-1/3">
                  <div className="">
                     {!productData.image_url && (
                        <Empty fontClassName="bg-[#f1f1f1]" onClick={() => setIsOpenModal(true)}></Empty>
                     )}
                     {productData.image_url && (
                        <>
                           <img className="rounded-[8px] border border-black/15" src={productData.image_url} />
                           <p className="mt-[15px]">
                              <Button primary onClick={() => setIsOpenModal(true)}>
                                 Change
                              </Button>
                           </p>
                        </>
                     )}
                  </div>
               </div>
               <div className="col w-2/3">
                  <div className="">
                     <div className="flex flex-col">
                        <label className={"text-[18px] mb-[4px]"} htmlFor="">
                           Tên sản phẩm
                        </label>
                        <Input
                           ref={nameRef}
                           name="name"
                           type="text"
                           value={productData.product_name}
                           cb={(value) => handleInput("product_name", value)}
                        />
                     </div>

                     <div className="flex flex-col mt-[14px]">
                        <label className={"text-[18px] mb-[4px]"} htmlFor="">
                           Danh mục
                        </label>
                        <select
                           name="category"
                           value={productData.category_id}
                           onChange={(e) => handleInput("category_id", +e.target.value)}
                           className={inputClasses.input}
                        >
                           <option value={undefined}>- - -</option>
                           {!!categories.length &&
                              categories.map((category, index) => (
                                 <option key={index} value={category.id}>
                                    {category.category_name}
                                 </option>
                              ))}
                        </select>
                     </div>

                     <div className="flex flex-col mt-[14px]">
                        <label className={"text-[18px] mb-[4px]"} htmlFor="">
                           Hãng sản xuất
                        </label>
                        <select
                           name="brand"
                           value={productData.brand_id}
                           onChange={(e) => handleInput("brand_id", +e.target.value)}
                           className={inputClasses.input}
                        >
                           <option value={undefined}>- - -</option>
                           {brandsByCategory.map((brand, index) => (
                              <option key={index} value={brand.id}>
                                 {brand.brand_name}
                              </option>
                           ))}
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            <p className="text-center">
               <Button
                  disable={!ableToCreateProduct}
                  isLoading={apiLoading}
                  className="font-[600]"
                  onClick={handleSubmit}
                  primary
               >
                  <CheckIcon className="w-[24px] mr-[6px]" />
                  Save
               </Button>
            </p>
         </div>

         {isOpenModal && (
            <Modal setShowModal={setIsOpenModal}>
               <Gallery setIsOpenModal={setIsOpenModal} setImageUrl={handleChoseProductImage} />
            </Modal>
         )}
      </div>
   );
}
