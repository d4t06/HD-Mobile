import { useSelector, useDispatch } from "react-redux";

import { useApp } from "@/store/AppContext";
import { useMemo } from "react";
import { fetchProducts, selectedAllProduct } from "../../store/productsSlice";
import { FilterType, selectedAllFilter, storingFilters } from "../../store/filtersSlice";
import { AppDispatch } from "@/store/store";
import { Brand, PriceRange } from "@/types";

import classNames from "classnames/bind";
import styles from "./ProductFilter.module.scss";

import Checkbox from "./child/Checkbox";
import Radiobox from "./child/Radiobox";
import Skeleton from "../Skeleton";

const cx = classNames.bind(styles);

type Props = { categoryAscii: string | undefined; loading: boolean };

function ProductFilter({ categoryAscii, loading }: Props) {
   const dispatch = useDispatch<AppDispatch>();
   const { sort, filters: filtersInStore } = useSelector(selectedAllFilter);
   const { status, category_id } = useSelector(selectedAllProduct);

   const { brands, priceRanges } = useApp();

   const curBrands = useMemo(
      () => (categoryAscii && brands[categoryAscii] ? brands[categoryAscii] : []),
      [categoryAscii, brands]
   );
   const curPriceRanges = useMemo(
      () => (categoryAscii && priceRanges[categoryAscii] ? priceRanges[categoryAscii] : []),
      [categoryAscii, priceRanges]
   );

   const showFilteredResults = (filters: FilterType) => {
      dispatch(fetchProducts({ page: 1, sort, category_id, filters }));
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
      return [...Array(5).keys()].map((index) => <Skeleton key={index} className="filter-brand-skeleton" />);
   }, []);

   const PriceSkeleton = useMemo(() => {
      return [...Array(5).keys()].map((index) => <Skeleton key={index} className="filter-price-skeleton" />);
   }, []);

   return (
      <div className={cx("product-filter", { disable: status === "loading" })}>
         <div className={cx("filter-section")}>
            <h1 className={cx("filter-title")}>Hãng sản xuất</h1>
            <div className={cx("filter-list")}>
               {/* phai render data lay ra tu checkbox component
                  ban đầu render nhiều checkbox
                  fix: chỉ có mỗi checkbox nhưng trong checkbox có nhiều item */}
               {loading ? (
                  BrandSkeleton
               ) : (
                  <Checkbox
                     data={curBrands}
                     filters={filtersInStore}
                     handleFilter={(brands) => handleFilter({ by: "brands", value: brands })}
                  />
               )}
            </div>
         </div>
         <div className={cx("filter-section")}>
            <h1 className={cx("filter-title")}>Mức giá</h1>
            <div className={cx("filter-list")}>
               {loading ? (
                  PriceSkeleton
               ) : (
                  <Radiobox
                     data={curPriceRanges}
                     filters={filtersInStore}
                     handleFilter={(priceRange) => handleFilter({ by: "price", value: priceRange })}
                  />
               )}
            </div>
         </div>
      </div>
   );
}

export default ProductFilter;
