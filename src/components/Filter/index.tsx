import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { fetchProducts, selectedAllProduct } from "../../store/productsSlice";
import { FilterType, selectedAllFilter, storingFilters } from "../../store/filtersSlice";
import { AppDispatch } from "@/store/store";

import classNames from "classnames/bind";
import styles from "./ProductFilter.module.scss";

import Checkbox from "./child/Checkbox";
import Radiobox from "./child/Radiobox";
import Skeleton from "../Skeleton";
import useCurrentCategory from "@/hooks/useCurrentCategory";

const cx = classNames.bind(styles);

function ProductFilter() {
   const dispatch = useDispatch<AppDispatch>();
   const { sort, filters: filtersInStore } = useSelector(selectedAllFilter);
   const { status, category_id } = useSelector(selectedAllProduct);

   const { currentCategory, status: categoryStatus } = useCurrentCategory();

   const brandsByCategory = useMemo(
      () => currentCategory?.brands || [],
      [currentCategory]
   );
   const priceRangesByCategory = useMemo(
      () => currentCategory?.price_ranges || [],
      [currentCategory]
   );

   const showFilteredResults = (filters: FilterType) => {
      dispatch(fetchProducts({ page: 1, sort, category_id, filters, replace: true }));
   };

   interface FilterField {
      by: keyof typeof filtersInStore;
   }

   interface BrandFilter extends FilterField {
      value: Brand[];
      by: "brands";
   }

   interface PriceRangeFilter extends FilterField {
      value: PriceRange | undefined;
      by: "price";
   }

   const handleFilter = ({ by, value }: BrandFilter | PriceRangeFilter) => {
      let newFilters = { ...filtersInStore };

      if (by === "brands") {
         newFilters["brands"] = value;
      } else if (by === "price") {
         newFilters["price"] = value;
      }

      // >>> api
      showFilteredResults(newFilters);
      // >>> local
      dispatch(storingFilters({ sort, filters: newFilters }));
   };

   const BrandSkeleton = useMemo(() => {
      return [...Array(5).keys()].map((index) => (
         <Skeleton key={index} className="filter-brand-skeleton" />
      ));
   }, []);

   const PriceSkeleton = useMemo(() => {
      return [...Array(5).keys()].map((index) => (
         <Skeleton key={index} className="filter-price-skeleton" />
      ));
   }, []);

   return (
      <div className={cx("product-filter", { disable: status === "loading" })}>
         <div className={cx("filter-section")}>
            <h1 className={cx("filter-title")}>Brands</h1>
            <div className={cx("filter-list")}>
               {categoryStatus === "loading" ? (
                  BrandSkeleton
               ) : (
                  <Checkbox
                     data={brandsByCategory}
                     filters={filtersInStore}
                     handleFilter={(brands) =>
                        handleFilter({ by: "brands", value: brands })
                     }
                  />
               )}
            </div>
         </div>
         <div className={cx("filter-section")}>
            <h1 className={cx("filter-title")}>Prices</h1>
            <div className={cx("filter-list")}>
               {categoryStatus === "loading" ? (
                  PriceSkeleton
               ) : (
                  <Radiobox
                     data={priceRangesByCategory}
                     filters={filtersInStore}
                     handleFilter={(priceRange) =>
                        handleFilter({ by: "price", value: priceRange })
                     }
                  />
               )}
            </div>
         </div>
      </div>
   );
}

export default ProductFilter;
