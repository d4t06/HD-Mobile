import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import classNames from "classnames/bind";
import styles from "../Login/Login.module.scss";
import stylesMain from "../AddProduct/AddProduct.module.scss";

import { initProductSlider, sleep } from "@/utils/appHelper";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import ProductConfig, { ConfigRef } from "@/components/ProductConfig";
import { Product, ProductColor, ProductStorage } from "@/types";
import Empty from "@/components/ui/Empty";
import { Button, Modal } from "@/components";
import ProductDataProvider from "@/store/ProductDataContext";
import { initColorsData, initStorageData, trackingColors, trackingStorages } from "@/utils/productHelper";
import { useToast } from "@/store/ToastContext";
import AddItem from "@/components/Modal/AddItem";

const cx = classNames.bind(styles);

const STORAGE_URL = "/storage-management";
const COLOR_URL = "/color-management";
const PRODUCT_SLIDER_URL = "/product-slider-management";
const COMBINE_URL = "/combine-management";

function EditProduct() {
   const [productData, setProductData] = useState<Product>();

   const [storages, setStorages] = useState<ProductStorage[]>([]);
   const [colors, setColors] = useState<ProductColor[]>([]);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

   const ranUseEffect = useRef(false);
   const ProductConfigRef = useRef<ConfigRef>(null);

   const stockStorages = useRef<(ProductStorage & { id: number })[]>([]);
   const stockColors = useRef<(ProductColor & { id: number })[]>([]);

   const storageRef = useRef<HTMLInputElement>(null);
   const colorRef = useRef<HTMLInputElement>(null);

   // use hook
   const { id } = useParams();
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   const handleAddVariant = (target: "color" | "storage", value: string | undefined) => {
      if (!value) return;
      switch (target) {
         case "color":
            const newColor = initColorsData(value, productData!.product_name_ascii, colors.length === 0);
            setColors((prev) => [...prev, newColor]);
            return (colorRef.current!.value = "");
         case "storage":
            const newStorage = initStorageData(value, productData!.product_name_ascii, storages.length === 0);
            setStorages((prev) => [...prev, newStorage]);
            return (storageRef.current!.value = "");
      }
   };

   const handleRemoveVariant = (target: "color" | "storage", index: number) => {
      switch (target) {
         case "color":
            const newColors = [...colors];
            newColors.splice(index, 1);
            return setColors(newColors);
         case "storage":
            const newStorages = [...storages];
            return setStorages(newStorages);
      }
   };

   const initProductData = (type: "color" | "storage", storagesData: ProductStorage[], colorsData: ProductColor[]) => {
      switch (type) {
         case "storage":
            setStorages(storagesData);
            stockStorages.current = storagesData as (ProductStorage & { id: number })[];
            break;
         case "color":
            setColors(colorsData);
            stockColors.current = colorsData as (ProductColor & { id: number })[];
      }
   };

   const addProductSlider = (
      newSliders: { id: number; color_ascii: string }[],
      newColors: (ProductColor & { id: number })[]
   ) => {
      const data = newSliders.map((slider) => {
         const colorItem = newColors.find((color) => color.color_ascii === slider.color_ascii);
         if (colorItem?.id && slider) {
            return initProductSlider(slider.id, colorItem?.id, productData!.product_name_ascii);
         }
      });

      return data || [];
   };

   const handleSubmit = async () => {
      try {
         if (!productData || !productData.product_name_ascii) return;

         ProductConfigRef.current?.validate();

         const { newStorages, removedStorageIds } = trackingStorages(stockStorages.current, storages);
         const { newColors, removedColorIds } = trackingColors(stockColors.current, colors);

         // >>> storage
         console.log("tracking storage new =", newStorages, "remove =", removedStorageIds);

         let newStoragesData: ProductStorage[] = [];

         // return;
         if (newStorages.length) {
            const res = await privateRequest.post(STORAGE_URL, newStorages, {
               headers: { "Content-Type": "application/json" },
            });
            newStoragesData = res.data as ProductStorage[];
         }

         if (removedStorageIds.length) {
            await privateRequest.post(STORAGE_URL + "/delete", removedStorageIds, {
               headers: { "Content-Type": "application/json" },
            });
         }

         const newSliders = await ProductConfigRef.current!.submitSliders();
         // >>> color
         console.log("tracking new slider", newSliders);
         console.log("tracking color new =", newColors, "remove =", removedColorIds);

         let newColorsData: (ProductColor & { id: number })[] = [];

         if (newColors.length) {
            console.log(">>> submit color");
            const res = await privateRequest.post(COLOR_URL, newColors, {
               headers: { "Content-Type": "application/json" },
            });
            newColorsData = res.data as (ProductColor & { id: number })[];

            if (newSliders.length) {
               const newProductSliders = addProductSlider(newSliders, newColorsData);

               console.log(">>> submit product slider check", newProductSliders);
               if (!newProductSliders.length) {
                  throw new Error("product slider error");
               }
               await privateRequest.post(PRODUCT_SLIDER_URL, newProductSliders, {
                  headers: { "Content-Type": "application/json" },
               });
            }
         }
         if (removedColorIds.length) {
            await privateRequest.post(COLOR_URL + "/delete", removedColorIds, {
               headers: { "Content-Type": "application/json" },
            });
         }

         const newCombines = await ProductConfigRef.current!.submitCombines();
         // const canSubmitCombine = () => {
         //    const clLength = newColorsData.length;
         //    const srLength = newStoragesData.length;
         //    if (newCombines.length && clLength && newCombines.length == srLength * clLength) return true;
         //    else return false;
         // };

         // >>> merge
         const storageIdObject: Record<string, number> = {};
         [...storages, ...newStoragesData].forEach((item) => (storageIdObject[item.storage_ascii] = item.id as number));
         const colorIdObject: Record<string, number> = {};
         [...colors, ...newColorsData].forEach((item) => (colorIdObject[item.color_ascii] = item.id as number));

         console.log("check storage id object", storageIdObject);
         console.log("check color id object", colorIdObject);

         if (newCombines.length) {
            const newCombinesWithId = newCombines.map((cb) => {
               // const color = newColorsData.find((cl) => cl.color_ascii == cb.color_ascii);
               // const storage = newStoragesData.find((sr) => sr.storage_ascii == cb.storage_ascii);
               return {
                  ...cb,
                  color_id: colorIdObject[cb.color_ascii as keyof typeof colorIdObject],
                  storage_id: storageIdObject[cb.storage_ascii as keyof typeof storageIdObject],
               };
            });

            console.log(">>> submit combine check", newCombinesWithId);

            await privateRequest.post(COMBINE_URL, newCombinesWithId, {
               headers: { "Content-Type": "application/json" },
            });
         }

         setSuccessToast("Edit product successful");
      } catch (error) {
         console.log({ message: error });
         setErrorToast("Error when edit product");
      }
   };

   useEffect(() => {
      const getProductDetail = async () => {
         try {
            if (!id) throw new Error("missing params");
            const res = await privateRequest.get(`/product-management/dien-thoai/${id}`);
            const data = res.data as Product;

            setProductData(data);
            const storagesData = data.storages_data;
            const colorsData = data.colors_data;
            if (storagesData.length) {
               initProductData("storage", storagesData, []);
            }

            if (colorsData.length) {
               initProductData("color", [], colorsData);
            }

            if (import.meta.env.DEV) {
               await sleep(300);
            }

            setStatus("success");
         } catch (error) {
            setStatus("error");
         }
      };

      if (!ranUseEffect.current) {
         getProductDetail();
         ranUseEffect.current = true;
      }
   }, []);

   if ((!productData && status === "success") || status === "error") return <h1>Some thing went wrong</h1>;

   return (
      <>
         <div className="">
            <h1 className="text-[30px] font-[900] mb-[30px]">{productData?.product_name}</h1>

            <div className="row mb-[30px]">
               <div className="col col-6 ">
                  <h5 className={cx("label")}>Storage</h5>
                  <div className="flex bg-[#fff] rounded-[8px] p-[20px]">
                     {!!storages.length &&
                        storages.map((item, index) => {
                           return (
                              <div key={index} className="col col-3">
                                 <Empty onClick={() => handleRemoveVariant("storage", index)}>{item.storage}</Empty>
                                 {item.default && <span>default</span>}
                              </div>
                           );
                        })}
                     <div className="col col-3">
                        <Empty onClick={() => setIsOpenModal(true)} />
                     </div>
                  </div>

                  {/* <div className="row mt-15">
                        <input ref={storageRef} placeholder="64GB..." type="text" />
                        <Button
                           onClick={() => handleAddVariant("storage", storageRef.current?.value)}
                           className="mt-15"
                           fill
                           rounded
                        >
                           Add
                        </Button>
                     </div> */}
               </div>
               <div className="col col-6">
                  <h5 className={cx("label")}>Color</h5>
                  <div className="row bg-[#fff] rounded-[8px] p-[20px]">
                     {!!colors.length &&
                        colors.map((item, index) => (
                           <div key={index} className="col col-3">
                              <Empty onClick={() => handleRemoveVariant("color", index)}>{item.color}</Empty>
                              {item.default && <span>default</span>}
                           </div>
                        ))}
                     <div className="col col-3">
                        <Empty onClick={() => colorRef.current?.focus()} />
                     </div>
                  </div>

                  {/* <div className="row mt-15">
                        <input ref={colorRef} placeholder="Black..." type="text" />
                        <Button
                           onClick={() => handleAddVariant("color", colorRef.current?.value)}
                           className="mt-15"
                           fill
                           rounded
                        >
                           Add
                        </Button>
                     </div> */}
               </div>
            </div>

            {productData && (
               <ProductDataProvider initialState={productData}>
                  <ProductConfig
                     ref={ProductConfigRef}
                     sliders={productData.sliders_data}
                     colors={colors}
                     storages={storages}
                  />
               </ProductDataProvider>
            )}

            <Button onClick={handleSubmit} fill rounded className={cx("mt-15")}>
               Create
            </Button>
         </div>

         {isOpenModal && (
            <Modal setShowModal={setIsOpenModal}>
               <AddItem cb={(value) => handleAddVariant("color", value)} setIsOpenModal={setIsOpenModal} />
            </Modal>
         )}
      </>
   );
}

export default EditProduct;
