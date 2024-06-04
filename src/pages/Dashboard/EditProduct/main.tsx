import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { generateId, initColorObject, initStorageObject } from "@/utils/appHelper";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import EditGroup, { ConfigRef } from "./child/EditGroup";

import Empty from "@/components/ui/Empty";
import { Modal } from "@/components";
import { useProductContext } from "@/store/ProductDataContext";
import {
   findMinCombineOfStorage,
   initCombinesForInsert,
   initProductSlidersForInsert,
} from "@/utils/productHelper";
import { useToast } from "@/store/ToastContext";
import AddItem from "@/components/Modal/AddItem";
import OverlayCTA from "@/components/ui/OverlayCTA";
import useVariantAction from "@/hooks/useVariantAction";
import ConfirmModal from "@/components/Modal/Confirm";
import useProductAction from "@/hooks/useProductAction";
import MyEditor, { EditorRef } from "@/components/MyEditor";
import useGetProductDetail from "@/hooks/useGetProductDetail";
import { ArrowPathIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/16/solid";
import PushButton from "@/components/ui/PushButton";

type ModelTarget =
   | "add-storage"
   | "edit-storage"
   | "add-color"
   | "edit-color"
   | "delete-storage"
   | "delete-color"
   | "delete-product";

const MAX_VAL = 999999999;
const MANAGE_PRODUCT_URL = "/product-management";

function EditProductMain() {
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [apiProductLoading, setProductApiLoading] = useState(false);

   const addItemModalTarget = useRef<ModelTarget | "">("");
   // const ranUseEffect = useRef(false);
   const EditGroupRef = useRef<ConfigRef>(null);
   const curColorIndex = useRef<number | undefined>();
   const curStorageIndex = useRef<number | undefined>();
   const editorRef = useRef<EditorRef>();
   const isEditorChange = useRef(false);

   // use hook
   const navigate = useNavigate();
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();
   // >>> context and run get data
   const { status } = useGetProductDetail();
   const {
      isChange,
      setIsChange,
      product_ascii,
      id,
      colors_data,
      storages_data,
      detail,
      combines_data,
      product_name,
   } = useProductContext();

   const closeModal = () => setIsOpenModal(false);

   // >>> actions
   const { deleteProduct } = useProductAction({ close: closeModal });
   const { addColor, addStorage, apiLoading, deleteColor, deleteStorage } =
      useVariantAction({
         close: closeModal,
      });

   const handleOpenModal = (
      type: typeof addItemModalTarget.current,
      curIndex?: number
   ) => {
      addItemModalTarget.current = type;
      switch (type) {
         case "add-color":
         case "edit-color":
         case "delete-color":
            curColorIndex.current = curIndex;
            break;

         case "add-storage":
         case "edit-storage":
         case "delete-storage":
            curStorageIndex.current = curIndex;
            break;
      }
      setIsOpenModal(true);
   };

   const handleAddColor = async (type: "Add" | "Edit", value: string, id?: number) => {
      const newColor = initColorObject({
         color: value,
         color_ascii: generateId(value),
         product_ascii: product_ascii,
      });

      await addColor(newColor, type, curColorIndex.current, id);
   };

   const handleAddStorage = async (type: "Add" | "Edit", value: string, id?: number) => {
      const newStorage = initStorageObject({
         storage: value,
         storage_ascii: generateId(value),
         product_ascii: product_ascii,
      });

      await addStorage(newStorage, type, curStorageIndex.current, id);
   };

   const handleDeleteColor = async () => {
      await deleteColor(curColorIndex.current);
   };

   const handleDeleteStorage = async () => {
      await deleteStorage(curStorageIndex.current);
   };

   const submitSlider = async () => {
      // >>> tracking and submit slider and slider images
      const newSlidersSchema = await EditGroupRef.current!.submitSliders();

      if (colors_data.length) {
         // >>> api add new products sliders
         if (newSlidersSchema.length) {
            const data = initProductSlidersForInsert(
               newSlidersSchema,
               colors_data,
               product_ascii as string
            );
            if (!data.length) {
               throw new Error("product slider error");
            }
            console.log(">>> api submit product slider");
            await privateRequest.post(`${MANAGE_PRODUCT_URL}/product-sliders`, data, {
               headers: { "Content-Type": "application/json" },
            });
         }
      }
   };

   const submitAttributes = async () => {
      if (EditGroupRef.current === null)
         throw new Error("EditGroupRef.current is undefined");
      const newProductAttrs = await EditGroupRef.current.submitAttributes();

      if (newProductAttrs.length) {
         console.log(">>> api submit attributes");
         await privateRequest.post(`${MANAGE_PRODUCT_URL}/attributes`, newProductAttrs);
      }
   };

   const submitDetail = async () => {
      const content = editorRef.current?.getContent();
      if (!content || !product_ascii)
         return console.log("content or product name is undefined");

      const data: ProductDetail = {
         content,
         product_ascii: product_ascii,
      };

      if (!isEditorChange.current) return;

      if (detail === null) {
         console.log(">>> api add new content");
         return await privateRequest.post(`${MANAGE_PRODUCT_URL}/details`, data);
      } else if (detail.id) {
         console.log(">>> api update content");
         return await privateRequest.put(
            `${MANAGE_PRODUCT_URL}/details/${detail.id}`,
            data
         );
      }
   };

   const submitCombines = async (
      newCombines: ProductCombine[],
      updateCombines: ProductCombine[]
   ) => {
      let newCombinesRes: ProductCombine[] = [];

      if (newCombines.length) {
         const storageIdObject: Record<string, number> = {};
         storages_data.forEach((item) => {
            storageIdObject[item.storage_ascii] = item.id as number;
         });

         const colorIdObject: Record<string, number> = {};
         [...colors_data].forEach(
            (item) => (colorIdObject[item.color_ascii] = item.id as number)
         );

         const combinesSchema = initCombinesForInsert(
            newCombines,
            colorIdObject,
            storageIdObject
         );

         const res = await privateRequest.post(
            `${MANAGE_PRODUCT_URL}/combines`,
            combinesSchema,
            {
               headers: { "Content-Type": "application/json" },
            }
         );
         const data = res.data as ProductCombine[];

         newCombinesRes = data;
      }

      if (updateCombines.length) {
         const combinesSchema = updateCombines.map((cb) => {
            let combineSchema: ProductCombineSchema & { id: number };
            const { color_data, storage_data, ...schema } = cb;
            combineSchema = schema as ProductCombineSchema & { id: number };
            return combineSchema;
         });

         // >>> api update combine
         console.log(">>> api update combine");

         for await (const item of combinesSchema) {
            await privateRequest.put(`${MANAGE_PRODUCT_URL}/combines/${item.id}`, item, {
               headers: { "Content-Type": "application/json" },
            });
         }
      }

      return newCombinesRes;
   };

   const handleEditorChange = () => {
      isEditorChange.current = true;
      setIsChange(true);
   };

   const updateStorageBasePrice = async (mergedCombines: ProductCombine[]) => {
      let minCB: ProductCombine | undefined;
      let prevDefaultCb: ProductCombine | undefined;
      let minPriceOfProduct = MAX_VAL;

      for await (const storageItem of storages_data) {
         // loop not removed storage items
         if (storageItem.id === undefined) {
            console.log("no found storage id");
            break;
         }

         const { cb, minPrice, defaultCB } = findMinCombineOfStorage(
            storageItem,
            mergedCombines
         );

         if (defaultCB) prevDefaultCb = defaultCB;
         if (minPriceOfProduct > minPrice) {
            minPriceOfProduct = minPrice;
            minCB = cb;
         }

         // when init, record.base_price = 0
         if (!storageItem.base_price || storageItem.base_price !== minPrice) {
            // assign base price
            storageItem.base_price = minPrice;
            // >>> api update storage
            await privateRequest.put(
               `${MANAGE_PRODUCT_URL}/storages/${storageItem.id}`,
               storageItem,
               {
                  headers: { "Content-Type": "application/json" },
               }
            );
         }
      }

      return { minCB, prevDefaultCb };
   };

   const updateDefaultCombine = async (
      minCB: ProductCombine,
      prevDefaultCb: ProductCombine | undefined
   ) => {
      const updateNewDefaultCB = async () => {
         console.log(">>> api update new default combine", minCB.id);
         privateRequest.put(
            `${MANAGE_PRODUCT_URL}/combines/${minCB!.id}`,
            { default: true },
            {
               headers: { "Content-Type": "application/json" },
            }
         );
      };

      if (!combines_data.length) {
         await updateNewDefaultCB();
      } else {
         if (!prevDefaultCb || !prevDefaultCb?.id)
            throw new Error("Update default error");

         if (prevDefaultCb.id !== minCB.id) {
            console.log(">>> api remove prev combine", prevDefaultCb.id);

            await privateRequest.put(
               `${MANAGE_PRODUCT_URL}/combines/${prevDefaultCb.id}`,
               { default: false },
               { headers: { "Content-Type": "application/json" } }
            );

            await updateNewDefaultCB();
         }
      }
   };

   const submitUpdateCombine = async (combines: ProductCombine[]) => {
      const combinesObject: Record<number, ProductCombine> = {};
      combines.map((cb) => {
         if (!cb.id) return;
         combinesObject[cb.id] = cb;
      });
      const filteredCombines = Object.entries(combinesObject).map(([_key, cb]) => cb);
      // >>> submit update storage base_price
      const { minCB, prevDefaultCb } = await updateStorageBasePrice(filteredCombines);

      if (!minCB) throw new Error("Min cb error");
      // >>> submit update default combine
      await updateDefaultCombine(minCB, prevDefaultCb);
   };

   const handleSubmit = async () => {
      // try {
      //    if (!isChange) throw new Error("unChange");

      //    EditGroupRef.current?.validate();

      //    setProductApiLoading(true);

      //    // >>> submit slider
      //    await submitSlider();

      //    const { newCombines, updateCombines } = EditGroupRef.current!.trackingCombine();

      //    // >>> submit new combine
      //    const newCombinesRes = await submitCombines(newCombines, updateCombines);

      //    const isUpdateOrAddNewCombine = !!newCombines.length || !!updateCombines.length;
      //    if (isUpdateOrAddNewCombine) {
      //       const mergedCombines = [
      //          ...combines_data,
      //          ...newCombinesRes,
      //          ...updateCombines,
      //       ];
      //       // >>> submit update combine
      //       await submitUpdateCombine(mergedCombines);
      //    }

      //    // >>> submit attribute
      //    await submitAttributes();

      //    // >>> submit detail
      //    await submitDetail();

      //    await getProductDetail({ init: false });

      //    setSuccessToast("Edit product successful");
      //    setIsChange(false);
      // } catch (error) {
      //    console.log({ message: error });
      //    setErrorToast("Error when edit product");
      // } finally {
      //    setProductApiLoading(false);
      // }
   };

   const handleDeleteProduct = async () => {
      await deleteProduct(id!, product_name);
      navigate("/dashboard");
   };

   const renderEditGroup = useMemo(() => <EditGroup ref={EditGroupRef} />, []);

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;

      switch (addItemModalTarget.current) {
         case "add-color":
            return (
               <AddItem
                  loading={apiLoading}
                  title={"Add color"}
                  cbWhenSubmit={(value) => handleAddColor("Add", value)}
                  close={close}
               />
            );
         case "edit-color":
            if (curColorIndex.current !== undefined) {
               const currentColor = colors_data[curColorIndex.current];
               return (
                  <AddItem
                     loading={apiLoading}
                     title={"Edit color"}
                     cbWhenSubmit={(value) =>
                        handleAddColor("Edit", value, currentColor.id)
                     }
                     close={close}
                     initValue={currentColor.color}
                  />
               );
            }
            return <h1 className="text-2xl">Cur index not found</h1>;
         case "add-storage":
            return (
               <AddItem
                  loading={apiLoading}
                  title={"Add storage"}
                  cbWhenSubmit={(value) => handleAddStorage("Add", value)}
                  close={close}
               />
            );
         case "edit-storage":
            if (curStorageIndex.current !== undefined) {
               const curStorage = storages_data[curStorageIndex.current];
               return (
                  <AddItem
                     loading={apiLoading}
                     title={"Edit storage"}
                     cbWhenSubmit={(value) =>
                        handleAddStorage("Edit", value, curStorage.id)
                     }
                     close={close}
                     initValue={curStorage.storage}
                  />
               );
            }
            break;
         case "delete-color":
            if (curColorIndex.current === undefined)
               return <h1 className="text-2xl">Cur index not found</h1>;
            return (
               <ConfirmModal
                  label={`Delete color '${colors_data[curColorIndex.current].color} ?'`}
                  loading={apiLoading}
                  callback={handleDeleteColor}
                  setOpenModal={setIsOpenModal}
               />
            );
         case "delete-storage":
            if (curStorageIndex.current === undefined)
               return <h1 className="text-2xl">Cur index not found</h1>;
            return (
               <ConfirmModal
                  label={`Delete storage '${
                     storages_data[curStorageIndex.current].storage
                  } ?'`}
                  loading={apiLoading}
                  callback={handleDeleteStorage}
                  setOpenModal={setIsOpenModal}
               />
            );
         case "delete-product":
            return (
               <ConfirmModal
                  label={`Delete '${product_name}'`}
                  loading={apiLoading}
                  setOpenModal={setIsOpenModal}
                  callback={handleDeleteProduct}
               />
            );
      }
   }, [isOpenModal, apiLoading]);

   const classes = {
      proName: "text-[22px] font-[500]",
      label: "text-[18] font-[500] mb-[8px]",
      group: "rounded-[14px] p-[20px] bg-[#fff]",
      flexContainer: "flex flex-wrap gap-[8px]",
   };

   if (status === "loading") return <ArrowPathIcon className="w-[24px] animate-spin" />;
   if (status === "error")
      return <p className="text-[16px] text-[#333}">Some thing went wrong...</p>;

   return (
      <div className="space-y-[30px]">
         <h1 className={`${classes.proName}`}>{product_name}</h1>

         <div className={classes.flexContainer}>
            <div className="w-1/2">
               <h5 className={classes.label}>Storage</h5>
               <div className={classes.group}>
                  {!!storages_data.length &&
                     storages_data.map((item, index) => {
                        return (
                           <div key={index} className="w-1/3">
                              <Empty fontClassName="bg-[#f1f1f1]" className="group">
                                 <span className="text-center font-semibold text-[16px]">
                                    {item.storage}
                                 </span>
                                 <OverlayCTA
                                    data={[
                                       {
                                          cb: () =>
                                             handleOpenModal("edit-storage", index),
                                          icon: <PencilSquareIcon className="w-[24px]" />,
                                       },
                                       {
                                          cb: () =>
                                             handleOpenModal("delete-storage", index),
                                          icon: <TrashIcon className="w-[24px] " />,
                                       },
                                    ]}
                                 />
                              </Empty>
                           </div>
                        );
                     })}
                  <div className="w-1/3">
                     <Empty
                        fontClassName="bg-[#f1f1f1]"
                        onClick={() => handleOpenModal("add-storage")}
                     />
                  </div>
               </div>
            </div>
            <div className="col w-1/2">
               <h5 className={classes.label}>Color</h5>
               <div className={classes.group}>
                  {!!colors_data.length &&
                     colors_data.map((item, index) => (
                        <div key={index} className="col w-1/3">
                           <Empty fontClassName="bg-[#f1f1f1]">
                              <span className="font-semibold text-[16px]">
                                 {item.color}
                              </span>
                              <OverlayCTA
                                 data={[
                                    {
                                       cb: () => handleOpenModal("edit-color", index),
                                       icon: <PencilSquareIcon className="w-[24px]" />,
                                    },
                                    {
                                       cb: () => handleOpenModal("delete-color", index),
                                       icon: <TrashIcon className="w-[24px] " />,
                                    },
                                 ]}
                              />
                           </Empty>
                        </div>
                     ))}
                  <div className="col w-1/3">
                     <Empty
                        fontClassName="bg-[#f1f1f1]"
                        onClick={() => handleOpenModal("add-color")}
                     />
                  </div>
               </div>
            </div>
         </div>

         {renderEditGroup}

         <h5 className={classes.label}>Description</h5>
         <div className="overflow-hidden">
            <MyEditor
               content={detail ? detail.content : ""}
               ref={(ref) => (editorRef.current = ref!)}
               onUpdate={handleEditorChange}
            />
         </div>

         <p className="text-center mt-[30px]">
            <PushButton
               disabled={!isChange}
               loading={apiProductLoading}
               onClick={handleSubmit}
            >
               <CheckIcon className="w-[24px] mr-[8px]" />
               Save
            </PushButton>
         </p>

         <h5 className={` text-red-500 mt-[30px] ${classes.label} font-semibold`}>
            DANGER ZONE
         </h5>
         <div className="border-red-500 border rounded-[16px] p-[14px]">
            <PushButton onClick={() => handleOpenModal("delete-product")}>
               Delete Product
            </PushButton>
         </div>

         {isOpenModal && <Modal close={closeModal}>{renderModal}</Modal>}
      </div>
   );
}

export default EditProductMain;
