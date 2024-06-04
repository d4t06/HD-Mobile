import { useEffect, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./Products.module.scss";
import { useSelector, useDispatch } from "react-redux";
import {
   ProductItem,
   QuickFilter,
   Sort,
   Filter,
   Label,
   ImageSlider,
} from "../../components";
import NoProduct from "./NoProduct";

import {
   fetchProducts,
   selectedAllProduct,
   getMoreProducts,
   selectedAllFilter,
} from "../../store";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton";
import { AppDispatch } from "@/store/store";
import Skeleton from "@/components/Skeleton";
import PushButton from "@/components/ui/PushButton";
import useCurrentCategory from "@/hooks/useCurrentCategory";

const cx = classNames.bind(styles);

export default function Product() {
   const dispatchRedux = useDispatch<AppDispatch>();
   const {
      status,
      page,
      productState: { count, products },
      category_id,
   } = useSelector(selectedAllProduct);
   const { filters, sort } = useSelector(selectedAllFilter);

   // use hooks
   const { currentCategory, status: categoriesStatus } = useCurrentCategory();

   const remaining = useMemo(() => count - products.length, [products]);

   const handleGetMore = () => {
      if (!category_id) return;
      dispatchRedux(getMoreProducts({ category_id, sort, filters, page: page + 1 }));
   };

   const renderProducts = () => {
      return products.map((product, index) => (
         <div key={index} className={cx("col w-1/2 lg:w-1/3")}>
            <ProductItem data={product} />
         </div>
      ));
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

   const ProductsSkeletons = useMemo(
      () =>
         [...Array(6).keys()].map((index) => (
            <div key={index} className={cx("col w-1/2 md:w-1/3")}>
               <ProductSkeleton />
            </div>
         )),
      []
   );

   useEffect(() => {
      if (!currentCategory) return;

      dispatchRedux(
         fetchProducts({ category_id: currentCategory.id, filters, page: 1, sort })
      );
   }, [currentCategory]);

   if (categoriesStatus === "error" || !currentCategory || !currentCategory.id)
      return <h1>Category not found</h1>;

   return (
      <div className={cx("product-container")}>
         {/* mobile category */}

         {categoriesStatus === "loading" ? (
            sliderSkeleton
         ) : (
            <ImageSlider data={currentCategory.category_slider.slider.slider_images} />
         )}

         <div className={cx("product-body", "row")}>
            <div className="col w-full md:w-3/4 ">
               <Label
                  categoryName={currentCategory?.category_name}
                  count={count}
                  loading={status === "loading"}
               />
               <div className="hidden md:block">
                  <QuickFilter />
               </div>

               <div className="block md:hidden">
                  <Filter />
               </div>

               <Sort />

               <div className={"mt-[15px]"}>
                  <div className={cx("row", "product-list")}>
                     {/* init loading is category loading */}
                     {/* loading is first get product (at page 1) */}
                     {categoriesStatus === "success" && status !== "loading" && (
                        <>
                           {!!products.length && renderProducts()}
                           {((!products.length && status === "successful") ||
                              status === "error") && <NoProduct />}
                        </>
                     )}
                     {isLoading && ProductsSkeletons}
                  </div>
                  {status !== "loading" && !!products.length && (
                     <div className={cx("pagination", { disable: remaining === 0 })}>
                        <PushButton
                           disabled={status === "more-loading"}
                           onClick={() => handleGetMore()}
                        >
                           Xem thêm ({remaining}) sản phẩm
                        </PushButton>
                     </div>
                  )}
               </div>
            </div>

            <div className="col w-1/4 max-[768px]:hidden">{<Filter />}</div>
         </div>
      </div>
   );
}
