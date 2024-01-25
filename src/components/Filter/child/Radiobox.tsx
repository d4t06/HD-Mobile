import { FilterType } from "@/store/filtersSlice";
import { PriceRange } from "@/types";

import style from "../ProductFilter.module.scss";
import classNames from "classnames/bind";
import PushFrame from "@/components/ui/PushFrame";

type Props = {
   handleFilter: (sort: PriceRange | undefined) => void;
   data: PriceRange[];
   filters: FilterType;
};

const cx = classNames.bind(style);

export default function Radiobox({ filters, handleFilter, data }: Props) {
   const handleToggle = (item: PriceRange | "clear") => {
      if (item === "clear") {
         handleFilter(undefined);
      } else if (item) {
         handleFilter(item);
      }
   };

   if (!data) return "Data is undefined";

   return (
      <>
         <div className={cx("filter-item", { active: filters.price === undefined })}>
            {/* <input
               type="radio"
               id={"all-price"}
               checked={filters.price === undefined}
               onChange={() => handleToggle("clear")}
            />
            <label className={cx("label")} htmlFor={"all-price"}>
               All
            </label> */}
            <PushFrame active={filters.price === undefined} type="translate">
               <button onClick={() => handleToggle("clear")}>Tất cả</button>
            </PushFrame>
         </div>
         {data.map((item, index) => {
            const isChecked = filters.price === undefined ? false : item.id === filters.price.id;

            return (
               <div key={index} className={cx("filter-item", { active: isChecked })}>
                  {/* <input type="radio" id={item.id + ""} checked={isChecked} onChange={() => handleToggle(item)} />
                  <label className={cx("label")} htmlFor={item.id + ""}>
                     {item.label}
                  </label> */}
                  <PushFrame active={isChecked} type="translate">
                     <button onClick={() => handleToggle(item)}>{item.label}</button>
                  </PushFrame>
               </div>
            );
         })}
      </>
   );
}
