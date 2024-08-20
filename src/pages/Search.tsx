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
import { selectCategory } from "@/store/categorySlice";
import Skeleton from "@/components/Skeleton";

export default function SearchResultPage() {
   const dispatch = useDispatch<AppDispatch>();
   const { sort, filters } = useSelector(selectedAllFilter);
   const {
      page,
      status,
      productState: { count, products },
   } = useSelector(selectedAllProduct);

   // use hooks
   const { status: categoryStatus } = useSelector(selectCategory);
   let { key } = useParams<{ key: string }>();
   const remaining = useMemo(() => count - products.length, [products]);

   const renderProducts = () => {
      return products.map((product, index) => {
         return (
            <div key={index} className={"px-[4px] w-1/2 lg:w-1/4 mt-[8px]"}>
               <ProductItem key={index} product={product} />
            </div>
         );
      });
   };

   const renderSkeletons = () => {
      return [...Array(8).keys()].map((index) => {
         return (
            <div key={index} className={"px-[4px] w-1/2 lg:w-1/4 mt-[8px]"}>
               <ProductSkeleton />
            </div>
         );
      });
   };

   const handleGetMore = () => {
      if (key && remaining)
         dispatch(
            searchProducts({
               category_id: undefined,
               sort,
               page: page + 1,
               filters,
               key,
               status: "more-loading",
               replace: false,
            })
         );
   };

   useEffect(() => {
      if (categoryStatus === "loading") return;
      if (key) {
         dispatch(
            searchProducts({
               sort,
               filters,
               page,
               key,
               category_id: undefined,
               replace: true,
            })
         );
      }
   }, [key, categoryStatus]);

   return (
      <div className={""}>
         <div className={"flex"}>
            <div className="col w-full">
               <h1 className="text-[24px]  ">
                  {status !== "loading" ? (
                     <>
                        Tìm thấy <span className="text-[#cd1818]">{count || 0}</span> kết
                        quả cho từ khóa '{key}'
                     </>
                  ) : (
                     <>
                        <Skeleton className="h-[36px] w-[300px] max-w-[80vw] rounded-[8px] " />
                     </>
                  )}
               </h1>

               <Sort searchKey={key} />
               <div className="products-container mt-[14px]">
                  <div className="flex mx-[-4px] mt-[-8px] flex-wrap">
                     {status !== "loading" && (
                        <>{!!products.length ? renderProducts() : <NoProduct />}</>
                     )}
                     {(status === "loading" || status === "more-loading") &&
                        renderSkeletons()}
                  </div>
               </div>
               {!!products.length && (
                  <p className="text-center mt-[30px]">
                     <Button
                        colors={"third"}
                        loading={status === "more-loading"}
                        disabled={status === "loading" || remaining === 0}
                        onClick={() => handleGetMore()}
                     >
                        Xem thêm
                     </Button>
                  </p>
               )}
            </div>
         </div>
      </div>
   );
}
