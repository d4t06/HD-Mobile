import classNames from "classnames/bind";
import styles from "../ProductFilter.module.scss";
import { FilterType } from "@/store/filtersSlice";
import { Brand } from "@/types";
import PushFrame from "@/components/ui/PushFrame";

const cx = classNames.bind(styles);

type Props = {
   handleFilter: (brand: FilterType["brands"]) => void;
   filters: FilterType;
   data: Brand[];
};

export default function Checkbox({ handleFilter, filters, data }: Props) {
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

   if (!data) return "Data it not array";

   return (
      <>
         <div className={cx("filter-item", { active: !filters.brands.length })}>
            {/* <input
               id="all-brand"
               type="checkbox"
               checked={!filters.brands.length}
               onChange={() => handleToggle("clear")}
            />
            <label htmlFor={"all-brand"} className={cx("label")}>
               All
            </label> */}
            <PushFrame active={!filters.brands.length} type="translate">
               <button onClick={() => handleToggle("clear")}>Tất cả</button>
            </PushFrame>
         </div>
         {data.map((item, index) => {
            const i = filters.brands.findIndex((b) => b.id === item.id);
            const isChecked = i !== -1;
            return (
               <div key={index} className={cx("filter-item", { active: isChecked })}>
                  {/* <input
                     id={item.brand_ascii}
                     type="checkbox"
                     checked={isChecked}
                     onChange={() => handleToggle(item)}
                  />
                  <label htmlFor={item.brand_ascii} className={cx("label")}>
                     {item.brand_name}
                  </label> */}
                  <PushFrame active={isChecked} type="translate">
                     <button onClick={() => handleToggle(item)}>{item.brand_name}</button>
                  </PushFrame>
               </div>
            );
         })}
      </>
   );
}
