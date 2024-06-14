import { ProductItem } from "@/components";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton";
import NoProduct from "@/pages/Product/NoProduct";
import { fetchProducts, selectedAllProduct } from "@/store";
import { AppDispatch } from "@/store/store";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
   loading: boolean;
};

export default function NewProduct({ loading }: Props) {
   const dispatch = useDispatch<AppDispatch>();

   const {
      status,
      productState: { products },
   } = useSelector(selectedAllProduct);

   const ProductsSkeletons = useMemo(
      () =>
         [...Array(6).keys()].map((index) => (
            <div key={index} className="px-[4px] mt-[8px] w-1/2 md:w-1/3">
               <ProductSkeleton />
            </div>
         )),
      []
   );

   useEffect(() => {
      if (loading) return;

      dispatch(fetchProducts({ category_id: undefined, page_size: 6 }));
   }, [loading]);

   return (
      <div className="">
         <h5 className="text-[18px] font-[500] mb-[8px]">Sản phẩm mới</h5>
         <div className="flex mx-[-4px] mt-[-8px] flex-wrap">
            {status === "loading" && ProductsSkeletons}

            {status !== "loading" && (
               <>
                  {products.length ? (
                     products.map((product, index) => (
                        <div key={index} className="px-[4px] w-1/2 lg:w-1/3 mt-[8px]">
                           <ProductItem product={product} />
                        </div>
                     ))
                  ) : (
                     <NoProduct />
                  )}
               </>
            )}
         </div>
      </div>
   );
}
