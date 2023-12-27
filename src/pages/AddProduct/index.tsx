import { useRef, useState } from "react";

import { generateId, initProductObject, initStorageObject } from "@/utils/appHelper";
import { Button, Gallery, Modal } from "@/components";
import usePrivateRequest from "@/hooks/usePrivateRequest";

import classNames from "classnames/bind";
import { Product } from "@/types";
import Empty from "@/components/ui/Empty";
import styles from "@/pages/Login/Login.module.scss";
import stylesMain from "./AddProduct.module.scss";
import useAppConfig from "@/hooks/useApp";
const cx = classNames.bind(styles);
const cy = classNames.bind(stylesMain);

function AddProduct() {
   const [productData, setProductData] = useState<Product>(initProductObject({}));
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [loading, setLoading] = useState(false);

   const nameRef = useRef<HTMLInputElement>(null);
   // use hook
   const privateRequest = usePrivateRequest();
   const { brands, categories, status } = useAppConfig({ curCat: productData.category_name_ascii });

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
      // eliminate storages_data
      const { storages_data, ...props } = productData;

      try {
         setLoading(true);
         const controller = new AbortController();
         await privateRequest.post("/product-management", props, {
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
         });

         const defaultStorage = initStorageObject({
            storage: "default",
            storage_ascii: "default",
            base_price: 0,
            default: true,
            product_name_ascii: productData.product_name_ascii,
         });

         await privateRequest.post("/storage-management", defaultStorage, {
            headers: { "Content-Type": "application/json" },
            signal: controller.signal,
         });

         return () => {
            controller.abort();
         };
      } catch (error) {
         console.log({ message: error });
      } finally {
         setLoading(false);
      }
   };

   if (status === "error") return <h1>Some thing went wrong</h1>;

   return (
      <>
         <div className={cx("form", "full", { disable: status === "loading" || loading })}>
            <h1>ADD PRODUCT</h1>
            <div className="row mt-15">
               <div className="col col-4">
                  <div className={cx("form-group")}>
                     {!productData.image_url && <Empty onClick={() => setIsOpenModal(true)} />}
                     {productData.image_url && (
                        <>
                           <img src={productData.image_url} />
                           <Button
                              fill
                              rounded
                              className={cy("preview-image-btn")}
                              onClick={() => setIsOpenModal(true)}
                           >
                              Change
                           </Button>
                        </>
                     )}
                  </div>
               </div>
               <div className="col col-8">
                  <div className={cx("form-group", "large")}>
                     <div className="group">
                        <label className={cx("label")} htmlFor="">
                           Tên sản phẩm
                        </label>
                        <input
                           ref={nameRef}
                           name="name"
                           type="text"
                           value={productData.product_name}
                           onChange={(e) => handleInput("product_name", e.target.value)}
                        />
                     </div>

                     <div className="group">
                        <label className={cx("label")} htmlFor="">
                           Danh mục
                        </label>
                        <select
                           name="category"
                           value={productData.category_name_ascii}
                           onChange={(e) => handleInput("category_name_ascii", e.target.value)}
                        >
                           <option value="">- - -</option>
                           {!!categories.length &&
                              categories.map((category, index) => (
                                 <option key={index} value={category.category_name_ascii}>
                                    {category.category_name}
                                 </option>
                              ))}
                        </select>
                     </div>

                     <div className="group">
                        <label className={cx("label")} htmlFor="">
                           Hãng sản xuất
                        </label>
                        <select name="brand" onChange={(e) => handleInput("brand_name_ascii", e.target.value)}>
                           <option value="">- - -</option>
                           {!!brands.length &&
                              brands.map((brand, index) => (
                                 <option key={index} value={brand.brand_name_ascii}>
                                    {brand.brand_name}
                                 </option>
                              ))}
                        </select>
                     </div>
                  </div>
               </div>
            </div>

            <Button onClick={handleSubmit} fill rounded className={cx("mt-15")}>
               Create
            </Button>
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
