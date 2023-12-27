import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./Products.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { ProductItem, QuickFilter, Button, Sort, Filter, Label } from "../../components";
import NoProduct from "./NoProduct";

import { fetchProducts, selectedAllProduct, getMoreProducts, selectedAllFilter } from "../../store";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton";
import { AppDispatch } from "@/store/store";
import { Brand } from "@/types";
import { publicRequest } from "@/utils/request";
import { useApp } from "@/store/AppContext";
import { sleep } from "@/utils/appHelper";
import Skeleton from "@/components/Skeleton";

const cx = classNames.bind(styles);

export default function Product() {
   const dispatchRedux = useDispatch<AppDispatch>();
   const {
      status,
      page,
      productState: { count, products },
   } = useSelector(selectedAllProduct);
   const { filters, sort } = useSelector(selectedAllFilter);
   const { brands, setBrands } = useApp();

   const [apiLoading, setApiLoading] = useState(true);

   // ref
   const firstTimeRender = useRef(true);
   const prevCat = useRef("");

   // use hooks
   const { category = "dien-thoai" } = useParams<{ category: string }>();
   const remaining = useMemo(() => count - products.length, [products]);

   const handleGetMore = () => {
      if (!category) return;
      dispatchRedux(getMoreProducts({ category, sort, filters, page: page + 1 }));
   };

   const renderProducts = () => {
      return products.map((product, index) => {
         return (
            <div key={index} className={cx("col col-4")}>
               <ProductItem data={product} />
            </div>
         );
      });
   };
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
      if (!category) return;

      if (firstTimeRender.current || prevCat.current !== category) {
         dispatchRedux(fetchProducts({ category, filters, page: 1, sort }));
      }

      const getBrands = async () => {
         try {
            setApiLoading(true);
            if (!brands[category]) {
               const brandsRes = await publicRequest.get("app/brand" + "?category=" + category);
               const brandsData = brandsRes.data as Brand[];

               const newBrands = { ...brands };
               newBrands[category] = brandsData;
               setBrands(newBrands);
            } else {
               await sleep(300);
            }
         } catch (error) {
            console.log({ message: error });
         } finally {
            setApiLoading(false);
         }
      };

      if (category) {
         getBrands();
      }

      return () => {
         firstTimeRender.current = false;
         prevCat.current = category || "";
      };
   }, [category]);

   return (
      <div className={cx("product-container")}>
         {/* <ImageSlider banner data={banner[category]} /> */}

         <div className={cx("product-body", "row")}>
            <div className="col col-9">
               <Label category={category} count={count} loading={status === "loading"} />
               <QuickFilter loading={apiLoading} brands={brands[category]} category={category} />
               <Sort loading={status === "loading"} category={category} />

               <div className={cx("product-container")}>
                  <div className="row">
                     {status !== "loading" && <>{!!products.length ? renderProducts() : <NoProduct />}</>}
                     {(status === "loading" || status === "more-loading") && ProductsSkeletons()}
                  </div>
                  {status !== "loading" && !!products.length && (
                     <div className={cx("pagination", { disable: remaining === 0 })}>
                        <Button
                           disable={status === "more-loading"}
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

            {<Filter loading={apiLoading} category={category} />}
         </div>
      </div>
   );
}
