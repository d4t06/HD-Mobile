import { useMemo } from "react";

import classNames from "classnames/bind";
import styles from "./BrandSort.module.scss";

import BrandList from "./BrandList";
import SelectedSort from "./SelectedSort";

import { useDispatch, useSelector } from "react-redux";
import { selectedAllProduct, selectedAllFilter, fetchProducts, storingFilters } from "../../store";
import { FilterType } from "@/store/filtersSlice";
import { AppDispatch } from "@/store/store";
import { Brand } from "@/types";
import Skeleton from "../Skeleton";

const cx = classNames.bind(styles);

type Props = { category: string; admin?: boolean; brands: Brand[]; loading: boolean };

export default function QuickFilter({ category, brands, admin, loading }: Props) {
   const dispatchRedux = useDispatch<AppDispatch>();
   const { page } = useSelector(selectedAllProduct);
   const { filters: filtersInStore, sort } = useSelector(selectedAllFilter);

   const isFiltered = useMemo(() => !!filtersInStore?.brand.length || !!filtersInStore?.price.length, [filtersInStore]);

   const showFilteredResults = (filters: FilterType) => {
      dispatchRedux(fetchProducts({ page, sort, category, filters }));
   };

   const handleFilter = (filters: string[], by: keyof FilterType | "clear") => {
      let newFilters = { ...filtersInStore };

      if (by === "clear") {
         newFilters.brand = [];
         newFilters.price = [];
      } else {
         newFilters[by] = filters;
      }

      // >>> api
      showFilteredResults(newFilters);
      // >>> local
      dispatchRedux(storingFilters({ sort, filters: newFilters }));
   };

   const BrandSkeleton = useMemo(() => {
      return [...Array(5).keys()].map((index) => <Skeleton key={index} className="brand-skeleton" />);
   }, []);

   return (
      <>
         <div className={cx("container", { disable: loading })}>
            {loading && BrandSkeleton}

            {!loading && (
               <>
                  {!admin && (
                     <>
                        {isFiltered ? (
                           <SelectedSort category={category!} data={filtersInStore} handleFilter={handleFilter} />
                        ) : (
                           <BrandList data={brands} handleFilter={handleFilter} />
                        )}
                     </>
                  )}

                  {admin && <BrandList admin={admin} data={brands} handleFilter={() => {}} />}
               </>
            )}
         </div>
      </>
   );
}
