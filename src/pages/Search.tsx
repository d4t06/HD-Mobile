import { Button, ProductItem } from "@/components";
import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { selectedAllProduct, selectedAllFilter } from "@/store";

import { Sort } from "@/components";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton";
import { AppDispatch } from "@/store/store";
import { searchProducts } from "@/store/productsSlice";
import { selectCategory } from "@/store/categorySlice";
import Skeleton from "@/components/Skeleton";
import NoResult from "@/components/NoResult";

export default function SearchResultPage() {
   const dispatch = useDispatch<AppDispatch>();
   const { sort } = useSelector(selectedAllFilter);
   const { page, status, count, products } = useSelector(selectedAllProduct);

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
               sort,
               page: page + 1,
               q: key,
               status: "more-loading",
            })
         );
   };

   useEffect(() => {
      if (categoryStatus === "loading") return;
      if (key) {
         dispatch(
            searchProducts({
               sort,
               page,
               q: key,
               replace: true,
            })
         );
      }
   }, [key, categoryStatus]);

   return (
      <div className={""}>
         <div className={"flex"}>
            <div className="col w-full">
               <h1 className="text-xl font-[500]  ">
                  {status !== "loading" ? (
                     <>
                        Found{" "}
                        <span className="text-[#cd1818]">{count || 0}</span> results for '{key}'
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
                        <>
                           {!!products.length ? renderProducts() : <NoResult />}
                        </>
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
                        More
                     </Button>
                  </p>
               )}
            </div>
         </div>
      </div>
   );
}
