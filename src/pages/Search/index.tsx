import classNames from "classnames/bind";
import styles from "../Product/Products.module.scss";
import { Button, ProductItem } from "../../components";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectedAllProduct, selectedAllFilter, getMoreProducts } from "../../store";

import { Sort } from "@/components";
import NoProduct from "../Product/NoProduct";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton";
import { AppDispatch } from "@/store/store";

const cx = classNames.bind(styles);

function SearchResultPage() {
   const dispatch = useDispatch<AppDispatch>();
   const { sort, filters } = useSelector(selectedAllFilter);
   const {
      page,
      category,
      status,
      productState: { count, products },
   } = useSelector(selectedAllProduct);

   // state

   // use hooks
   let { key } = useParams();
   const remaining = useMemo(() => count - products.length, [products]);

   const renderProducts = () => {
      return products.map((product, index) => {
         return (
            <div key={index} className={cx("col col-3")}>
               <ProductItem key={index} data={product} />
            </div>
         );
      });
   };

   const renderSkeletons = () => {
      return [...Array(8).keys()].map((index) => {
         return (
            <div key={index} className={cx("col col-3")}>
               <ProductSkeleton />
            </div>
         );
      });
   };

   const handleGetMore = () => {
      // dùng extra reducer thay vì dùng action
      dispatch(getMoreProducts({ category, sort, page: page + 1, filters }));
   };

   useEffect(() => {
      dispatch(fetchProducts({ category: `search=${key}`, sort, filters, page }));
   }, [key]);

   return (
      <div className={cx("product-container")}>
         <div className={cx("product-body", "row")}>
            <div className="col col-full">
               {status !== "loading" ? (
                  <h1 className={cx("search-page-title")}>
                     Tìm thấy <span style={{ color: "#cd1818" }}>{count || 0}</span> kết quả cho từ khóa "{key}"
                  </h1>
               ) : (
                  <h1>Kết quả tìm kiếm cho từ khóa "{key}"</h1>
               )}

               {status === "loading" && <i className={cx("material-icons", "loading-btn", "mt-10")}></i>}

               <Sort loading={status === "loading"} category={category} />
               <div className="products-container">
                  <div className="row">
                     {status !== "loading" && <>{!!products.length ? renderProducts() : <NoProduct />}</>}
                     {(status === "loading" || status === "more-loading") && renderSkeletons()}
                  </div>
               </div>
               {!products.length && (
                  <div className={cx("pagination", { disable: remaining === 0 })}>
                     <Button
                        disable={status === "loading"}
                        outline
                        rounded
                        mgauto
                        count={remaining}
                        onClick={() => handleGetMore()}
                        describe="sản phẩm"
                     >
                        Xem thêm
                     </Button>
                  </div>
               )}
            </div>
         </div>
         {!products.length && status !== "loading" && <NoProduct />}
      </div>
   );
}
export default SearchResultPage;
