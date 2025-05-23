import { Button, ImageSlider, Modal } from "@/components";
import Skeleton from "@/components/Skeleton";
import { useMemo, useState } from "react";
import useGetDefaultCombine from "../_hooks/useGetDefaultCombine";
import { moneyFormat } from "@/utils/appHelper";

import styles from "./DetailTop.module.scss";
import classNames from "classnames/bind";
import useCartAction from "@/hooks/useCartAction";
import { useAuth } from "@/store/AuthContext";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ModalHeader from "@/components/Modal/ModalHeader";
import PushFrame from "@/components/ui/PushFrame";
const cx = classNames.bind(styles);

type Props = {
   loading: boolean;
   product: ProductDetail | null;
};

export default function DetailTop({ loading, product }: Props) {
   const { auth } = useAuth();

   const [color, setColor] = useState<ProductColor>();
   const [variant, setVariant] = useState<ProductVariant>();
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [slider, setSlider] = useState<Slider>();

   // hooks
   const { actions, isFetching } = useCartAction();
   useGetDefaultCombine({ product, setColor, setVariant });

   const currentCombine = useMemo(() => {
      if (!color || !variant || !product) return;

      return product.combines.find(
         (c) => c.color_id === color.id && c.variant_id === variant.id,
      );
   }, [color, variant]);

   const isDefaultVariant =
      product &&
      product.variants.length === 1 &&
      product.variants[0].name_ascii === "default";

   const isDefaultColor =
      product &&
      product.colors.length === 1 &&
      product.colors[0].name_ascii === "default";

   useMemo(() => {
      if (!color) return;
      if (color?.product_slider.slider.slider_images.length)
         setSlider(color.product_slider.slider);
   }, [color]);

   const closeModal = () => setIsOpenModal(false);

   const findDefaultCombineOfVariant = (variant: ProductVariant) => {
      if (!product) return;

      return product.combines.find((c) => c.id === variant.default_combine.combine_id);
   };

   const handleAddCartItem = async () => {
      if (!auth) {
         setIsOpenModal(true);
         return;
      }

      if (!color || !variant || !auth || !product) return;

      const schema: CartItemSchema = {
         amount: 1,
         color_id: color?.id,
         product_id: product.id,
         username: auth.username,
         variant_id: variant.id,
      };

      await actions({ variant: "add", cartItem: schema });
   };

   const BoxSkeleton = [...Array(3).keys()].map((item) => (
      <div key={item} className={cx(`item`)}>
         <Skeleton className="h-[60px]" />
      </div>
   ));

   const ProductInfoSkeleton = (
      <>
         <Skeleton className="w-[300px] h-[30px] " />

         <PushFrame>
            <div className="">
               <Skeleton className="w-[70px] h-[20px] mb-[6px]" />
               <div className={cx("list")}>{BoxSkeleton}</div>
            </div>

            <div className="">
               <Skeleton className="w-[70px] h-[20px] mt-[14px] mb-[6px]" />
               <div className={cx("list")}>{BoxSkeleton}</div>
            </div>

            <div className="">
               <Skeleton className="w-[70px] h-[20px] mt-[14px] mb-[6px]" />
               <Skeleton className="w-[200px] h-[34px] my-[6px]" />
               <Skeleton className="w-[160px] h-[24px] my-[6px]" />
            </div>
         </PushFrame>
         <Skeleton className="w-full h-[40px]" />
      </>
   );

   const classes = {
      proName: "text-[26px] font-[500] leading-[1.2]",
      price: "text-[30px] md:text-[34px] text-[#cd1818] font-[600] leading-[1.4]",
   };

   const productName = useMemo(() => {
      if (!product) return;

      const content = (
         <h1 className={classes.proName}>
            {product.name}
            {auth && auth.role === "ADMIN" && (
               <PencilSquareIcon className="w-[24px] inline-block ml-[6px]" />
            )}
         </h1>
      );

      if (auth?.role === "ADMIN")
         return (
            <Link target="_blank" to={`/dashboard/product/${product.id}`}>
               {content}
            </Link>
         );

      return content;
   }, [product]);

   return (
      <>
         <div className="md:flex flex-wrap md:mx-[-12px]">
            <div className="md:w-7/12 md:px-[12px]">
               {loading && (
                  <Skeleton className="w-full pt-[60%] sm:pt-[75%] rounded-[16px]" />
               )}
               {!loading && (
                  <ImageSlider
                     sticky
                     size={1}
                     className="pt-[65%] md:pt-[75%]"
                     data={slider?.slider_images || []}
                  />
               )}
            </div>
            <div className={"mt-[40px] md:mt-0 md:w-5/12 md:px-[12px]"}>
               <div className="space-y-[20px]">
                  {loading && ProductInfoSkeleton}
                  {!loading && product && (
                     <>
                        {productName}
                        {currentCombine && (
                           <>
                              <PushFrame>
                                 <div className="space-y-[14px]">
                                    {isDefaultVariant ? (
                                       <></>
                                    ) : (
                                       <div className="">
                                          <h5 className={cx("label")}>Variant</h5>
                                          <div className={cx("list")}>
                                             {product.variants.map((variant, index) => {
                                                const defaultCombine =
                                                   findDefaultCombineOfVariant(variant);
                                                if (defaultCombine)
                                                   return (
                                                      <div
                                                         key={index}
                                                         className={cx("item")}
                                                      >
                                                         <Button
                                                            colors={"second"}
                                                            className="h-[60px] !flex-col px-[4px] w-full"
                                                            onClick={() =>
                                                               setVariant(variant)
                                                            }
                                                            active={
                                                               variant.id ===
                                                               currentCombine.variant_id
                                                            }
                                                         >
                                                            <span>{variant.name}</span>
                                                            <span className="text-[14px] font-[500]">
                                                               {moneyFormat(
                                                                  defaultCombine.price,
                                                               )}
                                                               đ
                                                            </span>
                                                         </Button>
                                                      </div>
                                                   );
                                                else return <></>;
                                             })}
                                          </div>
                                       </div>
                                    )}

                                    {isDefaultColor ? (
                                       <></>
                                    ) : (
                                       <div className="">
                                          <h5 className={cx("label")}>Color</h5>
                                          <div className={cx("list")}>
                                             {product.colors.map((color, index) => (
                                                <div key={index} className={cx("item")}>
                                                   <Button
                                                      colors={"second"}
                                                      className="h-[60px] !flex-col px-[4px] w-full"
                                                      onClick={() => setColor(color)}
                                                      active={
                                                         color.id ===
                                                         currentCombine.color_id
                                                      }
                                                   >
                                                      <span>{color.name}</span>
                                                   </Button>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    )}

                                    <div className={cx("price")}>
                                       <p className={cx("label")}>Price</p>
                                       <p className={cx("cur-price")}>
                                          {currentCombine.price
                                             ? moneyFormat(currentCombine.price) + "₫"
                                             : "Contact"}
                                       </p>
                                       <span className={cx("vat-tag")}>
                                          {currentCombine.price ? "VAT included" : "---"}
                                       </span>
                                    </div>
                                 </div>
                              </PushFrame>
                              <Button
                                 disabled={isFetching}
                                 className="h-[40px] w-full font-semibold"
                                 colors={"third"}
                                 loading={isFetching}
                                 onClick={handleAddCartItem}
                              >
                                 BUY NOW
                              </Button>
                           </>
                        )}
                        {!currentCombine && (
                           <div className={cx("price")}>
                              <p className={cx("label")}>Price</p>
                              <p className={cx("cur-price")}>Contact</p>
                           </div>
                        )}
                     </>
                  )}
               </div>
            </div>
         </div>

         {isOpenModal && (
            <Modal zIndexClass="z-[999]" closeModal={closeModal}>
               <div className="w-[400px] ">
                  <ModalHeader title="SOS!" closeModal={closeModal} />
                  <img
                     className="mx-auto"
                     src="https://zalo-api.zadn.vn/api/emoticon/sticker/webpc?eid=46970&size=130"
                     alt=""
                  />
                  <p className="font-medium mt-3">Không đăng nhập rối sao mua hả ?</p>
                  <Button onClick={closeModal} className="mt-5" colors={"third"}>
                     Cút
                  </Button>
               </div>
            </Modal>
         )}
      </>
   );
}
