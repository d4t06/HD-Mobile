import {
   fetchProducts,
   selectedAllFilter,
   selectedAllProduct,
   storingFilters,
} from "@/store";
import { selectCategory } from "@/store/categorySlice";
import { setProductStatus } from "@/store/productSlice";
import { AppDispatch } from "@/store/store";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelper";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
   setCurCategory: Dispatch<SetStateAction<Category | undefined>>;
   curCategory: Category | undefined;
};

export default function useDashBoardProduct({ setCurCategory, curCategory }: Props) {
   const dispatch = useDispatch<AppDispatch>();

   const { filters, sort } = useSelector(selectedAllFilter);
   const { categories } = useSelector(selectCategory);

   const {
      page,
      productState: { count, products },
      status,
      category_id,
   } = useSelector(selectedAllProduct);

   const [isInitCategory, setIsInitCategory] = useState(false);

   const getMore = () => {
      dispatch(
         fetchProducts({ category_id, sort, filters, page: page + 1, replace: false })
      );
   };

   useEffect(() => {
      if (!isInitCategory) return;

      if (category_id !== curCategory?.id || !products.length) {
         if (!curCategory) setLocalStorage("categoryId", "");
         else setLocalStorage("categoryId", curCategory.id);

         console.log("fetch");

         dispatch(
            fetchProducts({
               category_id: curCategory?.id || undefined,
               filters,
               page: 1,
            })
         );
      } else {
         console.log("already exist");
         dispatch(setProductStatus("successful"));
      }

      return () => {
         dispatch(storingFilters());
      };
   }, [curCategory, isInitCategory]);

   useEffect(() => {
      if (!categories.length) return;
      const localStorage = getLocalStorage();

      const categoryId = localStorage.categoryId;
      const foundedCategory = categoryId
         ? categories.find((c) => c.id === categoryId)
         : undefined;

      if (!foundedCategory) {
         setIsInitCategory(true);
         return;
      }

      setCurCategory(foundedCategory);
      setIsInitCategory(true);
   }, [categories]);

   return { count, products, status, categories, getMore };
}
