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
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import OverlayCTA from "../ui/OverlayCTA";

type OpenType = "Edit" | "Add";

type AddProduct = {
   type: "Add";
   setIsOpenModalParent: Dispatch<SetStateAction<boolean>>;
   curCategory?: Category;
};

type EditProduct = {
   type: "Edit";
   setIsOpenModalParent: Dispatch<SetStateAction<boolean>>;
   product: Product;
   currentIndex: number;
};

type Props = AddProduct | EditProduct;

const runInitProductData = (props: Props) => {
   switch (props.type) {
      case "Add":
         return initProductObject({ category_id: props.curCategory?.id });
      case "Edit":
         const { product } = props;
         return initProductObject({
            image_url: product.image_url,
            product_name: product.product_name,
            product_ascii: product.product_ascii,
            brand_id: product.brand_id,
            category_id: product.category_id,
         });
   }
};

const runInitCategory = (props: Props) => {
   if (props.type === "Add") {
      if (props.curCategory) return props.curCategory;
   }
};

export default function AddProductModal({ ...props }: Props) {
   const [productData, setProductData] = useState<ProductSchema>(() => runInitProductData(props));
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [selectedCat, setSelectedCat] = useState<Category | undefined>(() => runInitCategory(props));

   const nameRef = useRef<HTMLInputElement>(null);
   // use hook
   const { brands, categories } = useApp();
   const { status: appStatus } = useAppConfig({ curCategory: selectedCat });
   const { setErrorToast } = useToast();
   const { addProduct, apiLoading } = useProductAction({
      setIsOpenModal: props.setIsOpenModalParent,
   });

   const brandsByCategory = useMemo(() => {
      if (appStatus === "loading" || !brands || !selectedCat) return [];
      return brands[selectedCat.category_ascii] || [];
   }, [brands, selectedCat, appStatus]);

   const handleInput = (field: keyof ProductSchema, value: any) => {
      // also set product_ascii
      if (field === "product_name") {
         return setProductData({
            ...productData,
            [field]: value,
            product_ascii: generateId(value),
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
      () =>
         !!productData.product_name &&
         productData.category_id !== undefined &&
         productData.brand_id !== undefined,
      [productData]
   );

   const handleSubmit = async () => {
      if (!ableToCreateProduct) {
         setErrorToast();
         return;
      }
      switch (props.type) {
         case "Add":
            await addProduct({ type: "Add", product: productData });
            break;
         case "Edit":
            await addProduct({
               type: "Edit",
               currentIndex: 1,
               product: productData,
               product_id: props.product.id,
            });
            break;
         default:
            console.log("click");
      }
   };

   if (appStatus === "error") return <h1>Some thing went wrong</h1>;

   const tileMap: Record<OpenType, string> = {
      Add: "Thêm sản phẩm mới",
      Edit: `Chỉnh sửa sản phẩm '${productData?.product_name}'`,
   };

   return (
      <div className="w-[700px] max-w-[90vw]">
         <ModalHeader
            setIsOpenModal={props.setIsOpenModalParent}
            title={`${tileMap[props.type]}`}
         />
         <div
            className={
               appStatus === "loading" || apiLoading ? "opacity-60 pointer-events-none" : ""
            }
         >
            <div className="row mb-[30px]">
               <div className="col w-1/3">
                  <div className="group relative">
                     {!productData.image_url && (
                        <Empty
                           fontClassName="bg-[#f1f1f1]"
                           onClick={() => setIsOpenModal(true)}
                        ></Empty>
                     )}
                     {productData.image_url && (
                        <>
                           <img
                              className="rounded-[8px] border border-black/15"
                              src={productData.image_url}
                           />
                           <OverlayCTA
                              data={[
                                 {
                                    cb: () => setIsOpenModal(true),
                                    icon: <ArrowPathIcon className="w-[24px]" />,
                                 },
                              ]}
                           />
                        </>
                     )}
                  </div>
               </div>
               <div className="col w-2/3 space-y-[14px]">
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

                  <div className="flex flex-col">
                     <label className={"text-[18px] mb-[4px]"} htmlFor="">
                        IMEI
                     </label>
                     <Input
                        ref={nameRef}
                        name="imei"
                        type="text"
                        value={productData.imei}
                        cb={(value) => handleInput("imei", value)}
                     />
                  </div>

                  <div className="flex flex-col">
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

                  <div className="flex flex-col">
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

            <p className="text-center">
               <Button
                  disable={!ableToCreateProduct}
                  isLoading={apiLoading}
                  className="font-[600]"
                  onClick={handleSubmit}
                  primary
               >
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
