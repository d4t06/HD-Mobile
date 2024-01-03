import classNames from "classnames/bind";
import styles from "../ProductFilter.module.scss";
import { FilterType } from "@/store/filtersSlice";
import { useMemo } from "react";
import { useApp } from "@/store/AppContext";
import { Brand } from "@/types";

const cx = classNames.bind(styles);

type Props = {
   handleFilter: (brand: any) => void;
   filters: FilterType;
   categoryAscii: string | undefined;
};

export default function Checkbox({ handleFilter, filters, categoryAscii }: Props) {
   const { brands } = useApp();
   const brandList = useMemo(() => (categoryAscii ? brands[categoryAscii] : []), [categoryAscii]);

   const handleToggle = (value: Brand | "clear") => {
      let newBrands = [...filters.brands];

      if (value === "clear") newBrands = [];
      else {
         const index = newBrands.indexOf(value);

         if (index === -1) newBrands.push(value);
         else newBrands.splice(index, 1);
      }

      handleFilter(newBrands);
   };

   if (!brandList) return "Data it not array";

   return (
      <>
         <div className={cx("filter-item")}>
            <input
               id="all-brand"
               type="checkbox"
               checked={!filters.brands.length}
               onChange={() => handleToggle("clear")}
            />
            <label htmlFor={"all-brand"} className={cx("label")}>
               All
            </label>
         </div>
         {brandList.map((item, index) => {
            const i = filters.brands.findIndex((b) => b.id === item.id);
            const isChecked = i !== -1;
            return (
               <div key={index} className={cx("filter-item")}>
                  <input
                     id={item.brand_ascii}
                     type="checkbox"
                     checked={isChecked}
                     onChange={() => handleToggle(item)}
                  />
                  <label htmlFor={item.brand_ascii} className={cx("label")}>
                     {item.brand_name}
                  </label>
               </div>
            );
         })}
      </>
   );
}
