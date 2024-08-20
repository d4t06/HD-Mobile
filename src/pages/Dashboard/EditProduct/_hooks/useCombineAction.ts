import { useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import {
   selectProduct,
   setCombine,
   setDefaultVariant,
   setVariant,
} from "@/store/productSlice";
import { sleep } from "@/utils/appHelper";

const COMBINE_URL = "/product-combines";
const DEFAULT_COMBINE_URL = "/default-variant-combines";
const DEFAULT_STORAGE_URL = "/default-product-variants";

export default function useCombineAction() {
   const dispatch = useDispatch();
   const { product } = useSelector(selectProduct);

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   const [isFetching, setIsFetching] = useState(false);

   const findLowestCombineIdOfVariant = (
      newCombine: ProductCombine,
      variant: ProductVariant
   ) => {
      if (!product) throw new Error("");

      let MAX_VAL = 999999999;
      let lowestPriceCombineId = newCombine.id;

      for (let c of product.combines) {
         const sameStorage = c.variant_id === variant.id;

         if (sameStorage) {
            if (!c.price) continue;

            const isNewCombine = c.id === newCombine.id;

            const isLowerPrice = isNewCombine
               ? newCombine.price < MAX_VAL
               : c.price < MAX_VAL;

            if (isLowerPrice) {
               MAX_VAL = isNewCombine ? newCombine.price : c.price;
               lowestPriceCombineId = c.id;
            }
         }
      }

      const newDefaultCombine: DefaultVariantCombine = {
         id: variant.default_combine.id,
         variant_id: variant.id,
         combine_id: lowestPriceCombineId,
      };

      return { newDefaultCombine, lowestPrice: MAX_VAL };
   };

   const findLowestProductVariant = (
      lowestPriceOfStorage: number,
      variant: ProductVariant
   ) => {
      if (!product) throw new Error("");

      let MAX_VAL = lowestPriceOfStorage;
      let lowestPriceStorageId = variant.id;

      product.variants.forEach((s) => {
         const otherStorage = s.id !== variant.id;

         if (otherStorage) {
            if (s.default_combine.combine_id) {
               const defaultCombineOfStorage = product!.combines.find(
                  (c) => c.id === s.default_combine.combine_id
               );

               if (!defaultCombineOfStorage) throw new Error("");
               if (defaultCombineOfStorage.price < MAX_VAL) {
                  lowestPriceStorageId = defaultCombineOfStorage.variant_id;
               }
            }
         }
      });

      const newDefaultVariant: DefaultVariant = {
         id: product.default_variant.id,
         product_id: product.id,
         variant_id: lowestPriceStorageId,
      };

      return newDefaultVariant;
   };

   type Props = {
      newCombine: ProductCombine;
      variant: ProductVariant;
      variantIndex: number;
      combineIndex: number;
   };

   const updateCombine = async ({
      newCombine,
      variantIndex,
      variant,
      combineIndex,
   }: Props) => {
      try {
         if (!newCombine.price) throw new Error("Combine must have price");

         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         // local logic check
         const { newDefaultCombine, lowestPrice } = findLowestCombineIdOfVariant(
            newCombine,
            variant
         );
         const newDefaultVariant = findLowestProductVariant(lowestPrice, variant);

         // update currentCombine
         await privateRequest.put(`${COMBINE_URL}/${newCombine.id}`, newCombine);

         // update lowest combines of storage if it had changed
         const isHasNewDefaultCombine =
            newDefaultCombine.combine_id !== variant.default_combine.combine_id;
         if (isHasNewDefaultCombine) {
            await privateRequest.put(
               `${DEFAULT_COMBINE_URL}/${newDefaultCombine.id}`,
               newDefaultCombine
            );

            dispatch(
               setVariant({
                  type: "update",
                  index: variantIndex,
                  variant: { default_combine: newDefaultCombine },
               })
            );
            // product.storages[storageIndex].default_combine = newDefaultCombine;
         }

         // update storage of product if it had changed
         const isHasNewDefaultVariant =
            product?.default_variant.variant_id !== newDefaultVariant.variant_id;
         if (isHasNewDefaultVariant) {
            await privateRequest.put(
               `${DEFAULT_STORAGE_URL}/${newDefaultVariant.id}`,
               newDefaultVariant
            );

            dispatch(setDefaultVariant(newDefaultVariant));
            // product.default_storage = newDefaultVariant;
         }

         dispatch(
            setCombine({ type: "update", combine: newCombine, index: combineIndex })
         );
         //  product.combines[foundedCombineIndex.value] = newCombine;

         setSuccessToast(`Update quantity & price successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`quantity & price attribute fail`);
      } finally {
         setIsFetching(false);
      }
   };

   return { isFetching, updateCombine };
}
