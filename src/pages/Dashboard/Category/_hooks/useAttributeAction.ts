import { useMemo, useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import { selectCategory, setAttributes, setCategory } from "@/store/categorySlice";
import { sleep } from "@/utils/appHelper";

const CATEGORY_ATTRIBUTE_URL = "/category-attributes";
const CATEGORY_URL = "/categories";

type Props = {
   currentCategoryIndex: number | undefined;
};

export default function useAttributeActions({ currentCategoryIndex }: Props) {
   const dispatch = useDispatch();
   const { categories } = useSelector(selectCategory);

   const [isFetching, setIsFetching] = useState(false);

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   const currentCategory = useMemo(
      () =>
         currentCategoryIndex !== undefined
            ? categories[currentCategoryIndex]
            : undefined,
      [categories, currentCategoryIndex]
   );

   type Add = {
      type: "Add";
      attribute: CategoryAttributeSchema;
      categoryIndex: number;
   };

   type Edit = {
      type: "Edit";
      attribute: CategoryAttributeSchema;
      index: number;
      id: number;
      categoryIndex: number;
   };

   type Delete = {
      type: "Delete";
      id: number;
      index: number;
      categoryIndex: number;
   };

   type Props = Add | Edit | Delete;

   const actions = async ({ ...props }: Props) => {
      if (!currentCategory) return;

      setIsFetching(true);
      if (import.meta.env.DEV) sleep(500);

      try {
         switch (props.type) {
            case "Add":
               const { attribute, categoryIndex } = props;
               const curAttributeOrder = currentCategory.attribute_order;

               const res = await privateRequest.post(CATEGORY_ATTRIBUTE_URL, attribute);

               const newAttribute = res.data.data;

               // case fist time create category
               const newAttributeOrder = !!curAttributeOrder
                  ? curAttributeOrder + `_${newAttribute.id}`
                  : `${newAttribute.id}`;

               const newCategory: CategorySchema = {
                  attribute_order: newAttributeOrder,
                  name_ascii: currentCategory.name_ascii,
                  name: currentCategory.name,
                  hidden: false,
               };

               // update category
               await privateRequest.put(`/categories/${currentCategory.id}`, newCategory);

               dispatch(
                  setAttributes({ type: "add", categoryIndex, attribute: res.data.data })
               );

               dispatch(
                  setCategory({
                     type: "update",
                     category: newCategory,
                     index: categoryIndex,
                  })
               );

               break;
            case "Edit": {
               const { attribute, id, categoryIndex, index } = props;
               await privateRequest.put(`${CATEGORY_ATTRIBUTE_URL}/${id}`, attribute);

               dispatch(
                  setAttributes({ type: "update", attribute, categoryIndex, index })
               );

               break;
            }

            case "Delete": {
               const { categoryIndex, id, index } = props;
               const curAttributeOrder = currentCategory.attribute_order;
               let newAttributeOrder = "";

               // if last index
               if (curAttributeOrder.includes(`_${id}`)) {
                  newAttributeOrder = curAttributeOrder.replace(`_${id}`, "");
               } else newAttributeOrder = curAttributeOrder.replace(`${id}_`, "");

               await privateRequest.delete(`${CATEGORY_ATTRIBUTE_URL}/${id}`);

               const newCategory: CategorySchema = {
                  attribute_order: newAttributeOrder,
                  name_ascii: currentCategory.name_ascii,
                  name: currentCategory.name,
                  hidden: false,
               };

               // update category
               await privateRequest.put(`/categories/${currentCategory.id}`, newCategory);

               dispatch(setAttributes({ type: "delete", categoryIndex, index }));
               dispatch(
                  setCategory({
                     type: "update",
                     category: newCategory,
                     index: categoryIndex,
                  })
               );
            }
         }
         setSuccessToast(`${props.type} attribute successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.type} attribute fail`);
      } finally {
         setIsFetching(false);
      }
   };

   const sortAttribute = async (startIndex: number, endIndex: number) => {
      try {
         if (
            startIndex === endIndex ||
            !currentCategory ||
            currentCategoryIndex === undefined
         )
            return;

         setIsFetching(true);
         if (import.meta.env.DEV) sleep(500);
         const newOrderArray = currentCategory.attribute_order.split("_");

         let temp = newOrderArray[startIndex];
         newOrderArray[startIndex] = newOrderArray[endIndex];
         newOrderArray[endIndex] = temp;

         const newOrder = newOrderArray.join("_");
         const newCategory: CategorySchema = {
            attribute_order: newOrder,
            name_ascii: currentCategory.name_ascii,
            name: currentCategory.name,
            hidden: false,
         };

         await privateRequest.put(`${CATEGORY_URL}/${currentCategory.id}`, newCategory);

         dispatch(
            setCategory({
               type: "update",
               category: newCategory,
               index: currentCategoryIndex,
            })
         );
      } catch (error) {
         console.log({ message: error });
         setErrorToast("");
      } finally {
         setIsFetching(false);
      }
   };

   return { isFetching, actions, sortAttribute };
}
