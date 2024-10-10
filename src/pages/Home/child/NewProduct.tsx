import { ProductItem } from "@/components";
import NoResult from "@/components/NoResult";
import ProductSkeleton from "@/components/Skeleton/ProductSkeleton";
import { fetchProducts, selectedAllProduct } from "@/store";
import { AppDispatch } from "@/store/store";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
   loading: boolean;
};

export default function NewProduct({ loading }: Props) {
   const dispatch = useDispatch<AppDispatch>();

   const { status, products } = useSelector(selectedAllProduct);

   const ProductsSkeletons = useMemo(
      () =>
         [...Array(5).keys()].map((index) => (
            <div key={index} className="px-[4px] mt-[8px] w-1/2 md:w-1/5">
               <ProductSkeleton />
            </div>
         )),
      []
   );

   useEffect(() => {
      if (loading) return;

      dispatch(
         fetchProducts({ category_id: undefined, size: 10, replace: true })
      );
   }, [loading]);

   return (
      <div className="">
         <div className="text-xl font-[500] mb-3">New Products</div>
         <div className="flex mx-[-4px] mt-[-8px] flex-wrap">
            {status === "loading" && ProductsSkeletons}

            {status !== "loading" && (
               <>
                  {products.length ? (
                     products.map((product, index) => (
                        <div
                           key={index}
                           className="px-[4px] w-1/2 md:w-1/5 mt-[8px]"
                        >
                           <ProductItem product={product} />
                        </div>
                     ))
                  ) : (
                     <NoResult />
                  )}
               </>
            )}
         </div>
      </div>
   );
}
