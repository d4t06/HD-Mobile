
import { useState } from "react";
import { usePrivateRequest } from ".";
import { useToast } from "@/store/ToastContext";
import { sleep } from "@/utils/appHelper";
import { useProductContext } from "@/store/ProductDataContext";

type Props = {
   close: () => void;
};

const MANAGE_PRODUCT_URL = "/product-management";

export default function useVariantAction({ close }: Props) {
   const { storages_data, colors_data, setEditorData } = useProductContext();
   const [apiLoading, setApiLoading] = useState(false);

   const privateRequest = usePrivateRequest();
   const { setSuccessToast, setErrorToast } = useToast();

   const deleteStorage = async (curIndex?: number) => {
      try {
         if (curIndex === undefined) throw new Error("no have id");
         const curStorage = storages_data[curIndex];
         setApiLoading(true);

         if (import.meta.env.DEV) await sleep(300);
         await privateRequest.delete(`${MANAGE_PRODUCT_URL}/storages/${curStorage.id}`);

         const newStorages = storages_data.filter((c) => c.id !== curStorage.id);
         setEditorData((prev) => ({ ...prev, storages_data: newStorages } as Product));

         setSuccessToast(`Delete storage '${curStorage.storage}' successful`);
      } catch (error) {
         console.log({ message: error });
         setSuccessToast(`Delete storage fail`);
      } finally {
         setApiLoading(false);
         close();
      }
   };

   const addStorage = async (
      storage: ProductStorage,
      type: "Add" | "Edit",
      curIndex?: number,
      id?: number
   ) => {
      try {
         switch (type) {
            case "Add":
               setApiLoading(true);
               if (import.meta.env.DEV) await sleep(300);
               const res = await privateRequest.post(
                  `${MANAGE_PRODUCT_URL}/storages`,
                  storage
               );

               const newStorageData = res.data as ProductStorage;
               // setStorages((prev) => [...prev, newStorageData]);
               setEditorData((prev) => ({
                  ...prev,
                  storages_data: [...prev.storages_data, newStorageData],
               }));

               break;
            case "Edit":
               if (curIndex === undefined || id === undefined)
                  throw new Error("missing current index");
               setApiLoading(true);

               if (import.meta.env.DEV) await sleep(300);
               await privateRequest.put(`${MANAGE_PRODUCT_URL}/storages/${id}`, storage);

               const newStorages = [...storages_data];
               newStorages[curIndex] = storage;
               // setStorages(newStorages);
               setEditorData((prev) => ({ ...prev, storages_data: newStorages }));
         }
         setSuccessToast(`${type} storage successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${type} storage fail`);
      } finally {
         setApiLoading(false);
         close();
      }
   };

   const addColor = async (
      color: ProductColor,
      type: "Add" | "Edit",
      curIndex?: number,
      id?: number
   ) => {
      try {
         switch (type) {
            case "Add":
               setApiLoading(true);

               if (import.meta.env.DEV) await sleep(300);
               const res = await privateRequest.post(
                  `${MANAGE_PRODUCT_URL}/colors`,
                  color
               );

               const newColorData = res.data as ProductColor;
               // setColors((prev) => [...prev, newColorData]);
               setEditorData((prev) => ({
                  ...prev,
                  colors_data: [...prev.colors_data, newColorData],
               }));

               break;

            case "Edit":
               if (curIndex === undefined || id === undefined)
                  throw new Error("missing current index");
               setApiLoading(true);

               if (import.meta.env.DEV) await sleep(300);
               await privateRequest.put(`${MANAGE_PRODUCT_URL}/colors/${id}`, color);

               const newColors = [...colors_data];
               newColors[curIndex] = color;
               // setColors(newColors);
               setEditorData((prev) => ({ ...prev, colors_data: newColors }));
         }
         setSuccessToast(`${type} Color successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${type} Color fail`);
      } finally {
         setApiLoading(false);
         close();
      }
   };

   const deleteColor = async (curIndex?: number) => {
      try {
         if (curIndex === undefined) throw new Error("no have id");
         const targetColor = colors_data[curIndex];

         setApiLoading(true);
         if (import.meta.env.DEV) await sleep(300);
         await privateRequest.delete(`${MANAGE_PRODUCT_URL}/colors/${targetColor.id}`);

         const newColors = colors_data.filter((c) => c.id !== targetColor.id);

         // setColors(newColors);
         setEditorData((prev) => ({ ...prev, colors_data: newColors }));

         setSuccessToast(`Delete Color '${targetColor.color}' successful`);
      } catch (error) {
         console.log({ message: error });
         setSuccessToast(`Delete Color fail`);
      } finally {
         setApiLoading(false);
         close();
      }
   };

   return { deleteColor, deleteStorage, addStorage, addColor, apiLoading };
}
