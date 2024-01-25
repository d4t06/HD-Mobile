import classNames from "classnames/bind";
import styles from "./BrandSort.module.scss";
import { useMemo } from "react";
import { FilterType } from "@/store/filtersSlice";
import { Brand } from "@/types";

const cx = classNames.bind(styles);

type Props = {
   data: FilterType;
   handleFilter: (filters: Brand[], by: keyof FilterType | "clear") => void;
};

export default function SelectedSort({ data, handleFilter }: Props) {
   const handleToggle = (brand: Brand) => {
      let newBrands = [...data.brands];

      newBrands = newBrands.filter((b) => b.brand_ascii !== brand.brand_ascii);
      handleFilter(newBrands, "brands");
   };

   const isShowClear = useMemo(() => data.brands.length >= 2, [data]);

   return (
      <>
         <h2 className="text-[16px]">Bộ lọc:</h2>
         {data.brands.map((item, index) => {
            return (
               <div onClick={() => handleToggle(item)} className={cx("selected-item")} key={index}>
                  <p>{item.brand_name}</p>
                  <i className="material-icons">delete</i>
               </div>
            );
         })}
         {data.price && (
            <span onClick={() => handleFilter([], "price")} className={cx("selected-item")}>
               {data.price.label}
               <i className="material-icons">delete</i>
            </span>
         )}
         {isShowClear && (
            <button className={cx("clear-filter")} onClick={() => handleFilter([], "clear")}>
               <i className="material-icons">clear</i>
            </button>
         )}
      </>
   );
}
