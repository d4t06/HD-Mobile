// import classNames from "classnames/bind";
// import styles from "../Product/Products.module.scss";
import { Button, ProductItem } from "@/components";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { selectedAllProduct, selectedAllFilter } from "@/store";

import { Sort } from "@/components";
import NoProduct from "./Product/NoProduct";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton";
import { AppDispatch } from "@/store/store";
import { searchProducts } from "@/store/productsSlice";
import { useApp } from "@/store/AppContext";

function SearchResultPage() {
   const dispatch = useDispatch<AppDispatch>();
   const { sort, filters } = useSelector(selectedAllFilter);
   const {
      page,
      status,
      productState: { count, products },
   } = useSelector(selectedAllProduct);

   // state

   // use hooks
   const { initLoading } = useApp();
   let { key } = useParams<{ key: string }>();
   const remaining = useMemo(() => count - products.length, [products]);

   const renderProducts = () => {
      return products.map((product, index) => {
         return (
            <div key={index} className={"col col-3"}>
               <ProductItem key={index} data={product} />
            </div>
         );
      });
   };

   const renderSkeletons = () => {
      return [...Array(8).keys()].map((index) => {
         return (
            <div key={index} className={"col col-3"}>
               <ProductSkeleton />
            </div>
         );
      });
   };

   const handleGetMore = () => {
      if (key && remaining) dispatch(searchProducts({ category_id: undefined, sort, page: page + 1, filters, key }));
   };

   useEffect(() => {
      if (initLoading) return;
      if (key) {
         dispatch(searchProducts({ sort, filters, page, key, category_id: undefined, replace: true }));
      }
   }, [key, initLoading]);

   return (
      <div className={"pt-[30px]"}>
         <div className={"row"}>
            <div className="col col-full">
               <h1 className="text-[18px] font-semibold  ">
                  {status !== "loading" ? (
                     <>
                        Tìm thấy <span className="text-[#cd1818]">{count || 0}</span> kết quả cho từ khóa '{key}'
                     </>
                  ) : (
                     <>
                        Kết quả tìm kiếm cho từ khóa "{key}"
                        <i className={"animate-spin ml-[8px] material-icons"}>sync</i>
                     </>
                  )}
               </h1>

               <Sort searchKey={key} loading={status === "loading"} />
               <div className="products-container">
                  <div className="row">
                     {(status === "loading" || status === "more-loading") && renderSkeletons()}
                     {status !== "loading" && <>{!!products.length ? renderProducts() : <NoProduct />}</>}
                  </div>
               </div>
               {!products.length && (
                  <p className="text-center">
                     <Button primary disable={status === "loading" || remaining === 0} onClick={() => handleGetMore()}>
                        Xem thêm
                     </Button>
                  </p>
               )}
            </div>
         </div>
         {!products.length && status !== "loading" && <NoProduct />}
      </div>
   );
}
export default SearchResultPage;
