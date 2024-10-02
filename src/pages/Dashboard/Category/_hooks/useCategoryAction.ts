import { RefObject, useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import { selectCategory, setCategory } from "@/store/categorySlice";
import { ModalRef } from "@/components/Modal";
import { sleep } from "@/utils/appHelper";
import Category from "..";

const CATEGORY_URL = "/categories";

type Props = {
   modalRef: RefObject<ModalRef>;
};

export default function useCategoryAction({ modalRef }: Props) {
   const dispatch = useDispatch();
   const { categories } = useSelector(selectCategory);
   const [isFetching, setIsFetching] = useState(false);

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   type Add = {
      type: "Add";
      category: CategorySchema;
   };

   type Edit = {
      type: "Edit";
      category: CategorySchema;
      curIndex: number;
      category_id: number;
   };

   type Delete = {
      type: "Delete";
      category: Category;
   };

   type Props = Add | Edit | Delete;

   const closeModal = async () => {
      modalRef.current?.close();
      await sleep(200);
   };

   const actions = async ({ ...props }: Props) => {
      try {
         switch (props.type) {
            case "Add":
               const { category } = props;
               // add category
               const res = await privateRequest.post(
                  `${CATEGORY_URL}`,
                  category
               );

               const newCategory = res.data.data as Category;

               await closeModal();

               dispatch(
                  setCategory({ type: "add", categories: [newCategory] })
               );
               break;
            case "Edit": {
               const { category, curIndex } = props;

               await privateRequest.put(
                  `${CATEGORY_URL}/${props.category_id}`,
                  category
               );

               await closeModal();

               dispatch(
                  setCategory({
                     type: "update",
                     category: category,
                     index: curIndex,
                  })
               );

               break;
            }

            case "Delete": {
               await privateRequest.delete(
                  `${CATEGORY_URL}/${props.category.id}`
               );

               await closeModal();

               const newCategories = categories.filter(
                  (c) => c.id !== props.category.id
               );

               dispatch(
                  setCategory({ type: "replace", categories: newCategories })
               );
            }
         }
         setSuccessToast(`${props.type} category successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.type} category fail`);
      } finally {
         setIsFetching(false);
      }
   };

   return { isFetching, actions };
}
