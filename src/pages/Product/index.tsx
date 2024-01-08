import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Products.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { ProductItem, QuickFilter, Button, Sort, Filter, Label, ImageSlider } from "../../components";
import NoProduct from "./NoProduct";

import { fetchProducts, selectedAllProduct, getMoreProducts, selectedAllFilter } from "../../store";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton";
import { AppDispatch } from "@/store/store";
import { useApp } from "@/store/AppContext";
import useAppConfig from "@/hooks/useAppConfig";
import Skeleton from "@/components/Skeleton";

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
   const { brands, categories, initLoading, sliders } = useApp();

   // ref
   const firstTimeRender = useRef(true);
   const prevCat = useRef("");

   // use hooks
   const { category_ascii } = useParams<{ category_ascii: string }>();
   const remaining = useMemo(() => count - products.length, [products, category_ascii]);

   const curCategory = useMemo(
      () => categories.find((c) => c.category_ascii === category_ascii),
      [category_ascii, categories]
   );
   const { status: brandApiStatus } = useAppConfig({ curCategory, includeSlider: true });

   const curBrands = useMemo(() => (curCategory ? brands[curCategory.category_ascii] : []), [curCategory, brands]);

   const handleGetMore = () => {
      if (!category_id) return;
      dispatchRedux(getMoreProducts({ category_id, sort, filters, page: page + 1 }));
   };

   const renderProducts = () => {
      return products.map((product, index) => (
         <div key={index} className={cx("col col-4")}>
            <ProductItem data={product} />
         </div>
      ));
   };

   const sliderSkeleton = useMemo(() => <Skeleton className="w-full pt-[25%] rounded-[16px]" />, []);
   const canRenderSlider = useMemo(
      () => curCategory?.category_ascii && !!sliders[curCategory?.category_ascii],
      [sliders, curCategory]
   );

   const ProductsSkeletons = () => {
      return [...Array(6).keys()].map((index) => {
         return (
            <div key={index} className={cx("col col-4")}>
               <ProductSkeleton />
            </div>
         );
      });
   };

   useEffect(() => {
      if (!category_ascii || !curCategory) return;

      if (firstTimeRender.current || prevCat.current !== category_ascii) {
         dispatchRedux(fetchProducts({ category_id: curCategory?.id, filters, page: 1, sort }));
      }

      return () => {
         firstTimeRender.current = false;
         prevCat.current = category_ascii || "";
      };
   }, [categories, category_ascii]);

   // console.log("check status", brandApiStatus, status);

   if (!initLoading && (!curCategory || !curCategory.id)) return <h1>Category not found</h1>;

   return (
      <div className={cx("product-container")}>
         {brandApiStatus === "loading" && sliderSkeleton}
         {brandApiStatus === "success" && canRenderSlider && (
            <ImageSlider data={sliders[curCategory!.category_ascii]} />
         )}

         <div className={cx("product-body", "row")}>
            <div className="col col-9">
               <Label categoryName={curCategory?.category_name} count={count} loading={status === "loading"} />
               <QuickFilter loading={brandApiStatus === "loading"} brands={curBrands} curCategory={curCategory} />
               <Sort loading={status === "loading"} category_id={curCategory?.id} />

               <div className={cx("product-container")}>
                  <div className="row">
                     {(status === "loading" || initLoading || status === "more-loading") && ProductsSkeletons()}
                     {status !== "loading" && (
                        <>{!products.length || status === "error" ? <NoProduct /> : renderProducts()}</>
                     )}
                  </div>
                  {status !== "loading" && !!products.length && (
                     <div className={cx("pagination", { disable: remaining === 0 })}>
                        <Button
                           primary
                           disable={status === "more-loading"}
                           className="text-[16px]"
                           onClick={() => handleGetMore()}
                        >
                           Xem thêm ({remaining}) sản phẩm
                        </Button>
                     </div>
                  )}
               </div>
            </div>

            {<Filter loading={brandApiStatus === "loading"} categoryAscii={curCategory?.category_ascii} />}
         </div>
      </div>
   );
}
