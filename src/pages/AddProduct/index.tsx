import { useRef, useState } from "react";

import { generateId, initProductObject, initStorageObject } from "@/utils/appHelper";
import { Button, Gallery, Modal } from "@/components";
import usePrivateRequest from "@/hooks/usePrivateRequest";

import { ProductSchema } from "@/types";
import { Empty, Input } from "@/components";
import useAppConfig from "@/hooks/useAppConfig";
import { inputClasses } from "@/components/ui/Input";
import { useToast } from "@/store/ToastContext";
import useProductAction from "@/hooks/useProductAction";

function AddProduct() {
   const [productData, setProductData] = useState<ProductSchema>(initProductObject({}));
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [loading, setLoading] = useState(false);

   const nameRef = useRef<HTMLInputElement>(null);
   // use hook
   const {addProduct, apiLoading} = useProductAction({})
   // const privateRequest = usePrivateRequest();
   // const { setErrorToast, setSuccessToast } = useToast();
   const { brands, categories, status } = useAppConfig({ curCat: productData.category_id });

   const handleInput = (field: keyof typeof productData, value: any) => {
      // also set product_name_ascii
      if (field === "product_name") {
         setProductData({ ...productData, [field]: value, product_name_ascii: generateId(value) });
         return;
      }
      setProductData({ ...productData, [field]: value });
   };

   const handleChoseProductImage = (image_url: string) => {
      handleInput("image_url", image_url);
   };

   const handleSubmit = async () => {
      await addProduct("Add", productData)
      // try {
      //    setLoading(true);
      //    const controller = new AbortController();
      //    await privateRequest.post("/product-management", productData, {
      //       headers: { "Content-Type": "application/json" },
      //       signal: controller.signal,
      //    });

      //    const defaultStorage = initStorageObject({
      //       storage: "default",
      //       storage_ascii: "default",
      //       base_price: 0,
      //       default: true,
      //       product_name_ascii: productData.product_name_ascii,
      //    });

      //    await privateRequest.post("/storage-management", defaultStorage, {
      //       headers: { "Content-Type": "application/json" },
      //       signal: controller.signal,
      //    });

      //    setSuccessToast("Add product successful");

      //    return () => {
      //       controller.abort();
      //    };
      // } catch (error) {
      //    console.log({ message: error });
      //    setErrorToast("Add product fail");
      // } finally {
      //    setLoading(false);
      // }
   };

   if (status === "error") return <h1>Some thing went wrong</h1>;

   return (
      <>
         <div className={status === "loading" || loading ? "opacity-60 pointer-events-none" : ""}>
            {/* <h1 className="text-3xl font-semibold mb-[30px] text-center uppercase">Add Product</h1> */}
            <div className="row mb-[30px]">
               <div className="col col-4">
                  <div className="bg-white p-[20px] rounded-[8px]">
                     {!productData.image_url && (
                        <Empty onClick={() => setIsOpenModal(true)}>
                           <i className="material-icons">add</i>
                        </Empty>
                     )}
                     {productData.image_url && (
                        <>
                           <img className="rounded-[8px] border border-black/15" src={productData.image_url} />
                           <Button className="mt-[15px]" primary onClick={() => setIsOpenModal(true)}>
                              Change
                           </Button>
                        </>
                     )}
                  </div>
               </div>
               <div className="col col-8">
                  <div className="bg-white h-full p-[20px] rounded-[8px]">
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
                           onChange={(e) => handleInput("category_id", e.target.value)}
                           className={inputClasses.input}
                        >
                           <option value="">- - -</option>
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
                           onChange={(e) => handleInput("brand_id", e.target.value)}
                           className={inputClasses.input}
                        >
                           <option value="">- - -</option>
                           {!!brands.length &&
                              brands.map((brand, index) => (
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
               <Button className="font-[600]" onClick={handleSubmit} primary>
                  <i className="material-icons mr-[6px]">save</i> Save
               </Button>
            </p>
         </div>

         {isOpenModal && (
            <Modal setShowModal={setIsOpenModal}>
               <Gallery setIsOpenModal={setIsOpenModal} setImageUrl={handleChoseProductImage} />
            </Modal>
         )}
      </>
   );
}

export default AddProduct;
