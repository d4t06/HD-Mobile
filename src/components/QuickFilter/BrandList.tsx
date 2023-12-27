import classNames from "classnames/bind";
import styles from "./BrandSort.module.scss";

import { useState } from "react";
import { FilterType } from "@/store/filtersSlice";
import { Brand } from "@/types";
// import useStore from '../../hooks/useStore';
// import {getAll} from '../../store/actions'

const cx = classNames.bind(styles);

type Props = {
   data: Brand[];
   handleFilter: (filters: string[], by: keyof FilterType | "clear") => void;
   admin?: boolean;
};

function BrandList({ data, handleFilter, admin }: Props) {
   const [checked, setChecked] = useState("");

   const handleToggle = (brand: string) => {
      setChecked(brand);
      handleFilter([brand], "brand");
   };

   if (!data) return;

   return (
      <>
         {data.map((item, index) => {
            if (!item.image_url) return;

            if (admin)
               return (
                  <div key={index}>
                     <p className={cx("brand-name")}>( {item.brand_name} )</p>
                     <div
                        key={index}
                        className={cx("sort-item", { active: checked === item.brand_name_ascii })}
                        onClick={() => handleToggle(item.brand_name_ascii)}
                     >
                        <img src={item.image_url} alt="" />
                     </div>
                  </div>
               );
            return (
               <div
                  key={index}
                  className={cx("sort-item", { active: checked === item.brand_name_ascii })}
                  onClick={() => handleToggle(item.brand_name_ascii)}
               >
                  <img src={item.image_url} alt="" />
               </div>
            );
         })}
      </>
   );
}

export default BrandList;
