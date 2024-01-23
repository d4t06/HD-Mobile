import { FilterType } from "@/store/filtersSlice";
import { PriceRange } from "@/types";

import style from "../ProductFilter.module.scss";
import classNames from "classnames/bind";

type Props = {
  handleFilter: (sort: PriceRange | undefined) => void;
  data: PriceRange[];
  filters: FilterType;
};

const cx = classNames.bind(style);

export default function Radiobox({ data, filters, handleFilter }: Props) {
  const handleToggle = (item: PriceRange | "clear") => {
    if (item === "clear") {
      handleFilter(undefined);
    } else if (item) {
      handleFilter(item);
    }
  };

  return (
    <>
      <div className={"filter-item"}>
        <input
          type="radio"
          id={"all-price"}
          checked={filters.price === undefined}
          onChange={() => handleToggle("clear")}
        />
        <label className={cx("label")} htmlFor={"all-price"}>
          All
        </label>
      </div>
      {data.map((item, index) => {
        const isChecked = filters.price === undefined ? false : item.id === filters.price.id;

        return (
          <div key={index} className={"filter-item"}>
            <input
              type="radio"
              id={item.id + ""}
              checked={isChecked}
              onChange={() => handleToggle(item)}
            />
            <label className={cx("label")} htmlFor={item.id + ""}>
              {item.label}
            </label>
          </div>
        );
      })}
    </>
  );
}
