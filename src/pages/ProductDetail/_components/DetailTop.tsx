import { Button, ImageSlider } from "@/components";
import Skeleton from "@/components/Skeleton";
import { useMemo, useState } from "react";
import useGetDefaultCombine from "../_hooks/useGetDefaultCombine";
import PushButton from "@/components/ui/PushButton";
import { moneyFormat } from "@/utils/appHelper";

import styles from "./DetailTop.module.scss";
import classNames from "classnames/bind";
import Title from "@/components/Title";
import Policy from "./Policy";
import { TagIcon } from "@heroicons/react/16/solid";
import useCartAction from "@/hooks/useCartAction";
import { useAuth } from "@/store/AuthContext";
const cx = classNames.bind(styles);

type Props = {
   loading: boolean;
   product: ProductDetail | null;
};

export default function DetailTop({ loading, product }: Props) {
   const { auth } = useAuth();

   const [color, setColor] = useState<ProductColor>();
   const [variant, setVariant] = useState<ProductVariant>();

   // hooks
   const { actions, isFetching } = useCartAction();
   useGetDefaultCombine({ product, setColor, setVariant });

   const currentCombine = useMemo(() => {
      if (!color || !variant || !product) return;

      return product.combines.find(
         (c) => c.color_id === color.id && c.variant_id === variant.id
      );
   }, [color, variant]);

   const currentSliderImages = useMemo(() => {
      if (!color) return [];

      return color.product_slider.slider.slider_images;
   }, [color]);

   const findDefaultCombineOfVariant = (variant: ProductVariant) => {
      if (!product) return;

      return product.combines.find((c) => c.id === variant.default_combine.combine_id);
   };

   const handleAddCartItem = async () => {
      if (!color || !variant || !auth || !product) return;

      const schema: CartItemSchema = {
         amount: 1,
         color_id: color?.id,
         product_ascii: product.product_ascii,
         username: auth.username,
         variant_id: variant.id,
      };

      await actions({ variant: "add", cartItem: schema });
   };

   const BoxSkeleton = [...Array(2).keys()].map((item) => (
      <div key={item} className={cx(`item`)}>
         <Skeleton className="h-[60px] rounded-[6px]" />
      </div>
   ));

   const ProductInfoSkeleton = (
      <>
         <Skeleton className="w-[300px] h-[30px] rounded-[6px] " />
         <div className="">
            <Skeleton className="w-[70px] h-[20px] rounded-[6px] mb-[6px]" />
            <div className={cx("list")}>{BoxSkeleton}</div>
         </div>

         <div className="">
            <Skeleton className="w-[70px] h-[20px] rounded-[6px] mt-[14px] mb-[6px]" />
            <div className={cx("list")}>{BoxSkeleton}</div>
         </div>

         <div className="">
            <Skeleton className="w-[70px] h-[20px] rounded-[6px] mt-[14px] mb-[6px]" />
            <Skeleton className="w-[200px] h-[34px] rounded-[6px] my-[6px]" />
            <Skeleton className="w-[160px] h-[24px] rounded-[6px] my-[6px]" />
         </div>
      </>
   );

   const classes = {
      proName: "text-[26px] font-[500] leading-[1.2]",
      price: "text-[30px] md:text-[34px] text-[#cd1818] font-[600] leading-[1.4]",
   };

   return (
      <div className="md:flex flex-wrap md:mx-[-12px]">
         <div className="md:w-7/12 md:px-[12px]">
            {loading && <Skeleton className="w-full pt-[50%] rounded-[16px]" />}
            {!loading && (
               <ImageSlider className="pt-[60%] md:pt-[50%]" data={currentSliderImages} />
            )}
         </div>

         <div className={"mt-[40px] md:mt-0 md:w-5/12 md:px-[12px]"}>
            <div className="space-y-[20px]">
               {loading && ProductInfoSkeleton}
               {!loading && product && (
                  <>
                     <h1 className={classes.proName}>{product.product}</h1>

                     {currentCombine && (
                        <>
                           <div className="space-y-[14px]">
                              <div className="space-y-[4px]">
                                 <h5 className={cx("label")}>Phiên bản</h5>
                                 <div className={cx("list")}>
                                    {product.variants.map((variant, index) => {
                                       const defaultCombine =
                                          findDefaultCombineOfVariant(variant);

                                       if (defaultCombine)
                                          return (
                                             <div key={index} className={cx("item")}>
                                                <Button
                                                   colors={"second"}
                                                   className="h-[60px] !flex-col px-[4px] w-full"
                                                   onClick={() => setVariant(variant)}
                                                   active={
                                                      variant.id ===
                                                      currentCombine.variant_id
                                                   }
                                                >
                                                   <span>{variant.variant}</span>
                                                   <span className="text-[14px] font-[500]">
                                                      {moneyFormat(defaultCombine.price)}đ
                                                   </span>
                                                </Button>
                                             </div>
                                          );
                                       else return <></>;
                                    })}
                                 </div>
                              </div>

                              <div className="space-y-[4px]">
                                 <h5 className={cx("label")}>Màu</h5>
                                 <div className={cx("list")}>
                                    {product.colors.map((color, index) => (
                                       <div key={index} className={cx("item")}>
                                          <Button
                                             colors={"second"}
                                             className="h-[60px] !flex-col px-[4px] w-full"
                                             onClick={() => setColor(color)}
                                             active={color.id === currentCombine.color_id}
                                          >
                                             <span>{color.color}</span>
                                          </Button>
                                       </div>
                                    ))}
                                 </div>
                              </div>
                           </div>

                           <div className={cx("price")}>
                              <p className={cx("label")}>Giá bán</p>
                              <p className={cx("cur-price")}>
                                 {currentCombine.price
                                    ? moneyFormat(currentCombine.price) + "₫"
                                    : "Liên hệ"}
                              </p>
                              <span className={cx("vat-tag")}>
                                 {currentCombine.price ? "Đã bao gồm 10% VAT" : "---"}
                              </span>
                           </div>

                           <PushButton
                              disabled={isFetching}
                              baseClassName="w-full"
                              className="h-[40px]"
                              size={"clear"}
                              loading={isFetching}
                              onClick={handleAddCartItem}
                           >
                              Mua Ngay
                           </PushButton>
                        </>
                     )}

                     {!currentCombine && (
                        <div className={cx("price")}>
                           <p className={cx("label")}>Giá bán</p>
                           <p className={cx("cur-price")}>Contact</p>
                        </div>
                     )}
                  </>
               )}
            </div>

            {currentCombine && (
               <div className="mt-[30px]">
                  <Title className="mb-[10px]">
                     <TagIcon className="w-[24px]" />
                     <span>Chính sách bảo hành</span>
                  </Title>
                  <Policy loading={loading} />
               </div>
            )}
         </div>
      </div>
   );
}
