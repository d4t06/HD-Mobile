import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { SortType, selectedAllFilter, storingFilters } from "../../store/filtersSlice";
import classNames from "classnames/bind";
import styles from "./ProductSort.module.scss";

import { fetchProducts, searchProducts, selectedAllProduct } from "../../store/productsSlice";
import { AppDispatch } from "@/store/store";
import useCurrentCategory from "@/hooks/useCurrentCategory";
import { Button } from "..";
const cx = classNames.bind(styles);

const continents = [
   {
      id: 1,
      value: "Newest",
      column: "",
      type: "asc",
   },
   {
      id: 2,
      value: "Low price",
      column: "price",
      type: "ASC",
   },
   {
      id: 3,
      value: "Hight price",
      column: "price",
      type: "DESC",
   },
];

type Props = { searchKey?: string };
function ProductSort({ searchKey }: Props) {
   const dispatch = useDispatch<AppDispatch>();
   const { filters } = useSelector(selectedAllFilter);
   const [checked, setChecked] = useState(1);

   const {status} = useSelector(selectedAllProduct)

   // hooks
   const { currentCategory } = useCurrentCategory();


   useEffect(() => {
      if (checked === 1) return;
      setChecked(1);
   }, [currentCategory]);

   const handleSort = (id: number) => {
      if (!currentCategory) return;

      const newSort: SortType = {
         column: "",
         type: "acs",
      };
      if (id) {
         setChecked(id);

         newSort.column = continents[id - 1].column;
         newSort.type = continents[id - 1].type as SortType["type"];

         dispatch(storingFilters({ filters, sort: newSort }));
         if (searchKey)
            dispatch(
               searchProducts({
                  page: 1,
                  category_id: currentCategory.id,
                  filters,
                  sort: newSort,
                  key: searchKey,
                  replace: true,
               })
            );
         else
            dispatch(
               fetchProducts({
                  page: 1,
                  category_id: currentCategory.id,
                  replace: true,
                  filters,
                  sort: newSort,
               })
            );
      }
   };

   const handleToggle = (id: number) => {
      console.log("checked = ", checked);
      if (id !== checked) {
         handleSort(id);
      }
   };

   return (
      <div className={cx("product-sort")}>
         <p className="font-medium">Sort</p>

         <div className={cx("btn-group", { disable: status === "loading" })}>
            {continents.map((item, index) => {
               return (
                  <Button
                     key={index}
                     active={index + 1 === checked}
                     onClick={() => handleToggle(item.id)}
                     colors={"second"}
                     size={"clear"}
                     fontWeight={"thin"}
                     border={"thin"}
                     className="py-[2px] px-[9px]"
                  >
                     {item.value}
                  </Button>
               );
            })}
         </div>
      </div>
   );
}

export default ProductSort;
