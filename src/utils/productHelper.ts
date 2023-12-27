import { ProductColor, ProductStorage } from "@/types";
import { generateId, initColorObject, initStorageObject } from "./appHelper";

export const initStorageData = (storage: string, product_name_ascii: string, isDefault: boolean = false) => {
   return initStorageObject({
      storage,
      storage_ascii: generateId(storage),
      base_price: 999999,
      default: isDefault,
      product_name_ascii: product_name_ascii,
   });
};

export const initColorsData = (color: string, product_name_ascii: string, isDefault: boolean = false) => {
   return initColorObject({
      color,
      color_ascii: generateId(color),
      product_name_ascii: product_name_ascii,
      default: isDefault,
   });
};

export const trackingColors = (stockColors: ProductColor[], currentColors: ProductColor[]) => {
   const newColors: ProductColor[] = [];
   currentColors.forEach((item) => {
      const existingItem = stockColors.find((stockItem) => stockItem.color_ascii === item.color_ascii);
      if (!existingItem) return newColors.push(item);
   });

   const removedColorIds: number[] = [];
   stockColors.forEach((stockItem) => {
      const existingItem = currentColors.find((item) => item.color_ascii === stockItem.color_ascii);
      if (!existingItem) return removedColorIds.push(stockItem.id as number);
   });

   return { newColors, removedColorIds };
};

export const trackingStorages = (stockStorages: ProductStorage[], currentStorages: ProductStorage[]) => {
   const newStorages: ProductStorage[] = [];
   currentStorages.forEach((item) => {
      const existingItem = stockStorages.find((stockItem) => stockItem.storage_ascii === item.storage_ascii);
      if (!existingItem) return newStorages.push(item);
   });

   const removedStorageIds: number[] = [];
   stockStorages.forEach((stockItem) => {
      const existingItem = currentStorages.find((item) => item.storage_ascii === stockItem.storage_ascii);
      if (!existingItem) return removedStorageIds.push(stockItem.id as number);
   });

   return { newStorages, removedStorageIds };
};
