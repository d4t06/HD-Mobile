import classNames from "classnames/bind";
import styles from "./BrandSort.module.scss";
import { price } from "@/assets/data";
import { useMemo } from "react";
import { FilterType } from "@/store/filtersSlice";

const cx = classNames.bind(styles);

type Props = {
   category: string;
   data: { brand: string[]; price: string[] };
   handleFilter: (filters: string[], by: keyof FilterType | "clear") => void;
};

export default function SelectedSort({ category, data, handleFilter }: Props) {
   const handleToggle = (value: string) => {
      let newChecked = [...data.brand];

      newChecked = newChecked.filter((brand) => brand !== value);
      handleFilter(newChecked, "brand");
   };

   const priceList = price[category as keyof typeof price];

   const priceContent =
      priceList.length && priceList.find((item) => JSON.stringify(item.array) === JSON.stringify(data.price));

   const isShowClear = useMemo(() => (!!data.brand.length && !!data.price.length) || data.brand.length >= 2, [data]);

   return (
      <>
         <h2>Bộ lọc:</h2>
         {data.brand &&
            data?.brand?.map((item, index) => {
               return (
                  <div onClick={() => handleToggle(item)} className={cx("filter-item")} key={index}>
                     <p>{item}</p>
                     <i className="material-icons">delete</i>
                  </div>
               );
            })}
         {priceContent && !!data.price.length && (
            <span onClick={() => handleFilter([], "price")} className={cx("filter-item")}>
               {priceContent.text || ""}
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
