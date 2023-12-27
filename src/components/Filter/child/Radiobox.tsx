import { useMemo } from "react";
import classNames from "classnames/bind";
import styles from "../ProductFilter.module.scss";
import { FilterType } from "@/store/filtersSlice";
const cx = classNames.bind(styles);

import { price } from "@/assets/data";

type Props = {
   handleFilter: (sort: any) => void;
   // data: T[];
   category: string;
   filters: FilterType;
   // render: (item: T) => ReactNode;
};

export default function Radiobox({ handleFilter, filters, category }: Props) {
   const priceList = useMemo(() => price[category], [category]);

   const handleToggle = (array: number[]) => {
      if (JSON.stringify(array) === JSON.stringify(filters.price)) return;
      handleFilter(array);
   };

   if (!priceList) return "Data is not array";

   return (
      <>
         {priceList.map((item, index) => {
            const isChecked = JSON.stringify(filters.price) === JSON.stringify(item.array) ? true : false;
            return (
               <div key={index} className={cx("filter-item")}>
                  {/* <a href={"/ddtd"}> */}
                  <input
                     type="radio"
                     id={item.text + index}
                     checked={isChecked}
                     onChange={() => handleToggle(item.array)}
                  />
                  <label className={cx("label")} htmlFor={item.text + index}>
                     {item.text}
                  </label>
                  {/* </a> */}
               </div>
            );
         })}
      </>
   );
}
