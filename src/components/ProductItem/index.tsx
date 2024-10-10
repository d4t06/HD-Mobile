import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ProductItem.module.scss";
import { moneyFormat } from "../../utils/appHelper";

import { useEffect, useState } from "react";
import { Button } from "..";
import Image from "../ui/Image";

const cx = classNames.bind(styles);

type Props = {
   product: Product;
};

export default function ProductItem({ product }: Props) {
   const [activeVariant, setActiveVariant] = useState<ProductVariantDetail>();

   const findDefaultStorage = (): ProductVariantDetail | undefined => {
      return product.variants.find(
         (v) => v.id === product.default_variant.variant_id
      );
   };

   const isDefaultVariant =
      product.variants.length === 1 &&
      product.variants[0].name_ascii === "default";

   useEffect(() => {
      const founded = findDefaultStorage();
      setActiveVariant(founded);
   }, []);

   return (
      <div className={cx("product-item")}>
         <Link
            to={`/product/${product.id}`}
            className={cx("product-item-frame")}
         >
            <Image src={product.image_url} />
         </Link>

         <div className={cx("product-item-body", "space-y-[14px]")}>
            <h4 className={cx("product-item_name")}>{product.name}</h4>

            {!!product.variants.length && product.default_variant.variant ? (
               <>
                  {isDefaultVariant ? (
                     <></>
                  ) : (
                     <div
                        className={cx("variant-box", "mx-[-2px] md:mx-[-4px]")}
                     >
                        {product.variants.map((v, index) => {
                           const isActive = activeVariant?.id === v.id;
                           return (
                              <div
                                 key={index}
                                 className="w-[50%] sm:w-1/3 px-[2px] md:px-1"
                              >
                                 <Button
                                    onClick={() => setActiveVariant(v)}
                                    className={`w-full text-sm  ${
                                       isActive ? "active" : ""
                                    }`}
                                    colors={"second"}
                                    active={isActive}
                                 >
                                    {v.name}
                                 </Button>
                              </div>
                           );
                        })}
                     </div>
                  )}
                  <div className={cx("product-item_price")}>
                     <h1 className={cx("product-item_price--current")}>
                        {moneyFormat(
                           activeVariant?.default_combine.combine.price || ""
                        )}
                        đ
                     </h1>
                  </div>
               </>
            ) : (
               <div className={cx("product-item_price")}>
                  <h1 className={cx("product-item_price--current")}>Contact</h1>
               </div>
            )}
         </div>
      </div>
   );
}
