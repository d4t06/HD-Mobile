import { useMemo, useRef, useState } from "react";
import { initProductObject } from "@/utils/appHelper";
import { Button, Gallery, Modal } from "@/components";
import { Empty, Input } from "@/components";
import { inputClasses } from "@/components/ui/Input";
import ModalHeader from "./ModalHeader";
import useProductAction from "@/hooks/useProductAction";
import { useToast } from "@/store/ToastContext";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import OverlayCTA from "../ui/OverlayCTA";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import Image from "../ui/Image";

type AddProduct = {
   type: "Add";
   closeModal: () => void;
   curCategory?: Category;
};

type EditProduct = {
   type: "Edit";
   closeModal: () => void;
   product: Product;
   currentIndex: number;
};

type EditProductDetail = {
   type: "Edit-Detail";
   closeModal: () => void;
   product: ProductDetail;
};

type Props = AddProduct | EditProduct | EditProductDetail;

const runInitProductData = (props: Props) => {
   switch (props.type) {
      case "Add":
         return initProductObject({ category_id: props.curCategory?.id });
      case "Edit-Detail":
      case "Edit":
         const { product } = props;
         return initProductObject({
            image_url: product.image_url,
            name: product.name,
            name_ascii: product.name_ascii,
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
   const { categories } = useSelector(selectCategory);

   const [productData, setProductData] = useState<ProductSchema>(() =>
      runInitProductData(props),
   );
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [selectedCat, setSelectedCat] = useState<Category | undefined>(() =>
      runInitCategory(props),
   );

   const nameRef = useRef<HTMLInputElement>(null);

   const { setErrorToast } = useToast();
   const { actions, isFetching } = useProductAction({
      closeModal: props.closeModal,
   });

   const brandsByCategory = useMemo(() => {
      if (props.type === "Edit") {
         const foundedCategory = categories.find((c) => c.id === productData.category_id);

         if (foundedCategory) return foundedCategory.brands;
         else return [];
      } else {
         return selectedCat?.brands || [];
      }
   }, [selectedCat]);

   const localCloseModal = () => setIsOpenModal(false);

   const handleInput = (field: keyof ProductSchema, value: any) => {
      // also set name_ascii
      if (field === "name") {
         return setProductData({
            ...productData,
            [field]: value,
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

   const handleChoseProductImage = (images: ImageType[]) => {
      handleInput("image_url", images[0].image_url);
   };

   const ableToCreateProduct =
      !!productData.name && productData.category_id && productData.brand_id;

   const handleSubmit = async () => {
      if (!ableToCreateProduct) {
         setErrorToast();
         return;
      }
      switch (props.type) {
         case "Add":
            await actions({ variant: "Add", product: productData });
            break;
         case "Edit":
            const { currentIndex, product } = props;
            await actions({
               variant: "Edit",
               target: "list",
               productId: product.id,
               index: currentIndex,
               product: productData,
            });
            break;
         case "Edit-Detail":
            await actions({
               variant: "Edit",
               target: "one",
               productId: props.product.id,
               product: productData,
            });
      }
   };

   const tileMap: Record<typeof props.type, string> = {
      Add: "Add product",
      Edit: `Edit '${props.type === "Edit" && props.product.name}'`,
      "Edit-Detail": `Edit '${props.type === "Edit-Detail" && props.product.name}'`,
   };

   return (
      <div className="w-[700px] max-h-[90vh] max-w-[80vw] flex flex-col">
         <ModalHeader closeModal={props.closeModal} title={`${tileMap[props.type]}`} />
         <div className="flex-grow overflow-auto">
            <div className="flex flex-col sm:flex-row">
               <div className="sm:w-1/3 sm:mr-[16px]">
                  <div className="group relative rounded-md mx-auto border border-black/15">
                     {!productData.image_url && (
                        <Empty
                           className="pt-[50%] sm:pt-[100%]"
                           fontClassName="bg-[#f1f1f1]"
                           onClick={() => setIsOpenModal(true)}
                        ></Empty>
                     )}
                     {productData.image_url && (
                        <>
                           <Image className="max-h-[200px]" src={productData.image_url} />

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
               <div className="mt-[16px] sm:mt-0 flex-grow space-y-[14px]">
                  <div className="flex flex-col">
                     <label className={"text-[18px] mb-[4px]"} htmlFor="">
                        Name
                     </label>
                     <Input
                        ref={nameRef}
                        name="name"
                        type="text"
                        value={productData.name}
                        cb={(value) => handleInput("name", value)}
                     />
                  </div>

                  {(props.type === "Add" ||
                     (props.type === "Edit" && !props.product.category_id)) && (
                     <div className="flex flex-col">
                        <label className={"text-[18px] mb-[4px]"} htmlFor="">
                           Category
                        </label>
                        <select
                           name="category"
                           value={productData.category_id || ""}
                           onChange={(e) => handleInput("category_id", +e.target.value)}
                           className={inputClasses.input}
                        >
                           <option value={undefined}>- - -</option>
                           {!!categories.length &&
                              categories.map(
                                 (category, index) =>
                                    !category.hidden && (
                                       <option key={index} value={category.id}>
                                          {category.name}
                                       </option>
                                    ),
                              )}
                        </select>
                     </div>
                  )}

                  <div className="flex flex-col">
                     <label className={"text-[18px] mb-[4px]"} htmlFor="">
                        Brand
                     </label>
                     <select
                        name="brand"
                        value={productData.brand_id || ""}
                        onChange={(e) => handleInput("brand_id", +e.target.value)}
                        className={inputClasses.input}
                     >
                        <option value={undefined}>- - -</option>
                        {brandsByCategory.map((brand, index) => (
                           <option key={index} value={brand.id}>
                              {brand.name}
                           </option>
                        ))}
                     </select>
                  </div>
               </div>
            </div>

            <p className="text-center mt-[16px] pb-[4px]">
               <Button
                  colors={"third"}
                  disabled={!ableToCreateProduct}
                  loading={isFetching}
                  className="font-[600]"
                  onClick={handleSubmit}
               >
                  Save
               </Button>
            </p>
         </div>

         {isOpenModal && (
            <Modal closeModal={localCloseModal}>
               <Gallery
                  closeModal={localCloseModal}
                  setImageUrl={handleChoseProductImage}
               />
            </Modal>
         )}
      </div>
   );
}
