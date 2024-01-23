import { useSelector, useDispatch } from "react-redux";

import { fetchProducts, selectedAllProduct } from "../../store/productsSlice";
import { FilterType, selectedAllFilter, storingFilters } from "../../store/filtersSlice";

import classNames from "classnames/bind";
import styles from "./ProductFilter.module.scss";

import Checkbox from "./child/Checkbox";
// import Radiobox from "./child/Radiobox";

import { AppDispatch } from "@/store/store";
import { useMemo } from "react";
import Skeleton from "../Skeleton";
import { Brand, PriceRange } from "@/types";
import Radiobox from "./child/Radiobox";

const cx = classNames.bind(styles);

const initialPriceRange: PriceRange[] = [
  {
    id: 0,
    from: 2,
    to: 3,
    label: "Từ 2-3 triệu",
    category_id: 0,
  },
  {
    id: 1,
    from: 3,
    to: 4,
    label: "Từ 3-4 triệu",
    category_id: 0,
   },
   {
      id: 2,
      from: 20,
      to: 99,
      label: "Trên 20 củ",
      category_id: 0,
    },
];

type Props = { categoryAscii: string | undefined; loading: boolean };

function ProductFilter({ categoryAscii, loading }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { sort, filters: filtersInStore } = useSelector(selectedAllFilter);
  const { status, category_id } = useSelector(selectedAllProduct);

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
        <h1 className={cx("filter-title")}>Hãng sản xuất</h1>
        <div className={cx("filter-list")}>
          {/* phai render data lay ra tu checkbox component
                  tại vì mỗi checkbook có một state riêng, state lấy dữ liệu từ nhiều item, nhưng không thể render nhiều checkbox
                  ban đầu render nhiều checkbox
                  fix: chỉ có mỗi checkbox nhưng trong checkbox có nhiều item */}
          {loading ? (
            BrandSkeleton
          ) : (
            <Checkbox
              filters={filtersInStore}
              handleFilter={(brands) => handleFilter({ by: "brands", value: brands })}
              categoryAscii={categoryAscii}
            />
          )}

          {/* truyền handleFilter vào cop Checkbox, chực hiện sau trể về đối số là filter sau đó tt*/}
        </div>
      </div>
      <div className={cx("filter-section")}>
        <h1 className={cx("filter-title")}>Mức giá</h1>
        <div className={cx("filter-list", "price")}>
          {loading ? (
            PriceSkeleton
          ) : (
            <Radiobox
              data={initialPriceRange}
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
