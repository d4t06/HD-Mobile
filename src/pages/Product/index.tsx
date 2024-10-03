import { useEffect, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./Products.module.scss";
import { useSelector, useDispatch } from "react-redux";
import {
   ProductItem,
   Sort,
   Filter,
   Label,
   ImageSlider,
} from "../../components";

import {
   fetchProducts,
   selectedAllProduct,
   selectedAllFilter,
} from "../../store";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton";
import { AppDispatch } from "@/store/store";
import Skeleton from "@/components/Skeleton";
import Button from "@/components/ui/Button";
import useCurrentCategory from "@/hooks/useCurrentCategory";
import NoResult from "@/components/NoResult";

const cx = classNames.bind(styles);

export default function Product() {
   const dispatchRedux = useDispatch<AppDispatch>();
   const { status, page, count, products, category_id } =
      useSelector(selectedAllProduct);
   const { filters, sort } = useSelector(selectedAllFilter);

   // use hooks
   const { currentCategory, status: categoriesStatus } = useCurrentCategory();

   const remaining = useMemo(() => count - products.length, [products]);

   const handleGetMore = () => {
      if (!category_id) return;
      dispatchRedux(
         fetchProducts({
            category_id,
            sort,
            filters,
            page: page + 1,
            status: "more-loading",
         })
      );
   };

   const sliderSkeleton = useMemo(
      () => <Skeleton className="w-full pt-[25%] rounded-[16px]" />,
      []
   );

   const isLoading = useMemo(
      () =>
         categoriesStatus === "loading" ||
         status === "loading" ||
         status === "more-loading",
      [status, categoriesStatus]
   );

   const ProductsSkeletons = useMemo(() => {
      const count = window.innerWidth < 1024 ? 2 : 3;
      return [...Array(count).keys()].map((index) => (
         <div key={index} className={cx("px-[4px] mt-[8px] w-1/2 lg:w-1/3")}>
            <ProductSkeleton />
         </div>
      ));
   }, []);

   useEffect(() => {
      if (!currentCategory) return;

      dispatchRedux(
         fetchProducts({
            page: 1,
            category_id: currentCategory.id,
            replace: true,
         })
      );
   }, [currentCategory]);

   if (categoriesStatus === "error") return <h1>Category not found</h1>;

   return (
      <div className={cx("product-container")}>
         {/* mobile category */}

         {categoriesStatus === "loading" ? (
            sliderSkeleton
         ) : (
            <ImageSlider
               data={
                  currentCategory?.category_slider.slider.slider_images || []
               }
            />
         )}

         <div className={cx("product-body", "flex mx-[-8px]")}>
            <div className="px-[8px] w-full md:w-3/4 ">
               <Label
                  categoryName={currentCategory?.name}
                  count={count}
                  loading={status === "loading"}
               />

               <div className="block md:hidden">
                  <Filter />
               </div>

               <Sort />

               <div className={"mt-[15px]"}>
                  <div
                     className={cx(
                        "product-list flex mx-[-4px] mt-[-8px] flex-wrap"
                     )}
                  >
                     {/* init loading is category loading */}
                     {/* loading is first get product (at page 1) */}

                     {status !== "loading" && (
                        <>
                           {status === "error" ? (
                              <p className="text-center w-full my-[30px]">
                                 Some things went wrong
                              </p>
                           ) : (
                              <>
                                 {!!products.length ? (
                                    products.map((product, index) => (
                                       <div
                                          key={index}
                                          className={cx(
                                             "px-[4px] w-1/2 lg:w-1/3 mt-[8px]"
                                          )}
                                       >
                                          <ProductItem product={product} />
                                       </div>
                                    ))
                                 ) : (
                                    <NoResult />
                                 )}
                              </>
                           )}
                        </>
                     )}

                     {isLoading && ProductsSkeletons}
                  </div>
                  {status !== "error" &&
                     status != "loading" &&
                     !!products.length && (
                        <div
                           className={cx("pagination", {
                              disable: remaining === 0,
                           })}
                        >
                           <Button
                              colors={"third"}
                              disabled={status === "more-loading"}
                              onClick={() => handleGetMore()}
                           >
                              More ({remaining}) products
                           </Button>
                        </div>
                     )}
               </div>
            </div>

            <div className="px-[8px] w-1/4 max-[768px]:hidden">
               {<Filter />}
            </div>
         </div>
      </div>
   );
}
