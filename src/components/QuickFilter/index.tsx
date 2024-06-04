import { useMemo } from "react";

import classNames from "classnames/bind";
import styles from "./BrandSort.module.scss";

import BrandList from "./BrandList";
import SelectedSort from "./SelectedSort";

import { useDispatch, useSelector } from "react-redux";
import {
   selectedAllProduct,
   selectedAllFilter,
   fetchProducts,
   storingFilters,
} from "../../store";
import { FilterType } from "@/store/filtersSlice";
import { AppDispatch } from "@/store/store";

import Skeleton from "../Skeleton";
import useCurrentCategory from "@/hooks/useCurrentCategory";

const cx = classNames.bind(styles);

type Props = {
   admin?: boolean;
};

export default function QuickFilter({ admin }: Props) {
   const dispatchRedux = useDispatch<AppDispatch>();
   const { page, category_id } = useSelector(selectedAllProduct);
   const { filters: filtersInStore, sort } = useSelector(selectedAllFilter);

   // hooks
   const { currentCategory, status } = useCurrentCategory();

   const isFiltered = useMemo(
      () => !!filtersInStore.brands.length || !!filtersInStore.price,
      [filtersInStore]
   );

   const brandsByCategory = useMemo(
      () => currentCategory?.brands || [],
      [currentCategory]
   );

   const showFilteredResults = async (filters: FilterType) => {
      await dispatchRedux(fetchProducts({ page, sort, category_id, filters, admin }));
   };

   const handleFilter = (brands: Brand[], by: keyof FilterType | "clear") => {
      let newFilters: FilterType = { ...filtersInStore };

      switch (by) {
         case "brands":
            newFilters["brands"] = brands;
            break;
         case "price":
            newFilters["price"] = undefined;
            break;
         case "clear":
            newFilters.brands = [];
            newFilters.price = undefined;
            break;
         default:
            throw new Error("case not found");
      }

      dispatchRedux(storingFilters({ sort, filters: newFilters }));

      showFilteredResults(newFilters);
   };

   const BrandSkeleton = useMemo(() => {
      return [...Array(5).keys()].map((index) => (
         <Skeleton key={index} className="brand-skeleton" />
      ));
   }, []);

   const BrandsRemaining = useMemo(() => {
      if (status === "loading" || !currentCategory) return [];
      if (!admin) return brandsByCategory;

      return brandsByCategory.filter((b) => {
         const existing = filtersInStore.brands.map((e) => e.brand_ascii);
         return !existing.includes(b.brand_ascii);
      });
   }, [currentCategory, filtersInStore, status === "loading"]);

   const classes = {
      brandList: "space-x-[10px] md:space-x-0 md:gap-[10px]",
   };
   return (
      <>
         <div className={cx("container", { disable: status === "loading", admin })}>
            {status === "loading" && (
               <div className={cx("brand-list", `${classes.brandList}`)}>
                  {BrandSkeleton}
               </div>
            )}

            {status === "success" && brandsByCategory && (
               <>
                  {!admin && (
                     <div className={cx("brand-list", `${classes.brandList}`)}>
                        {isFiltered ? (
                           <SelectedSort
                              data={filtersInStore}
                              handleFilter={handleFilter}
                           />
                        ) : (
                           <BrandList
                              data={BrandsRemaining}
                              handleFilter={handleFilter}
                           />
                        )}
                     </div>
                  )}

                  {admin && (
                     <>
                        {isFiltered && (
                           <div className={cx("brand-list", `${classes.brandList}`)}>
                              <SelectedSort
                                 data={filtersInStore}
                                 handleFilter={handleFilter}
                              />
                           </div>
                        )}
                        {!!BrandsRemaining.length && (
                           <div className={cx("brand-list", `${classes.brandList}`)}>
                              <BrandList
                                 admin
                                 filtersInStore={filtersInStore}
                                 data={BrandsRemaining}
                                 handleFilter={handleFilter}
                              />
                           </div>
                        )}
                     </>
                  )}
               </>
            )}
         </div>
      </>
   );
}
