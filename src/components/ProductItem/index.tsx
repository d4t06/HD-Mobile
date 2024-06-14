import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ProductItem.module.scss";
import { moneyFormat } from "../../utils/appHelper";

import { useEffect, useState } from "react";
import { Button } from "..";

const cx = classNames.bind(styles);

type Props = {
   product: Product;
};

export default function ProductItem({ product }: Props) {
   const [activeVariant, setActiveVariant] = useState<ProductVariantDetail>();

   const findDefaultStorage = (): ProductVariantDetail | undefined => {
      return product.variants.find((v) => v.id === product.default_variant.variant_id);
   };

   useEffect(() => {
      const founded = findDefaultStorage();
      setActiveVariant(founded);
   }, []);

   return (
      <div className={cx("product-item")}>
         <Link
            to={`/product/${product.product_ascii}`}
            className={cx("product-item-frame")}
         >
            <img
               className={cx("product-item-image")}
               src={product.image_url || "https://placehold.co/300X400"}
            />
         </Link>

         <div className={cx("product-item-body", "space-y-[14px]")}>
            <h4 className={cx("product-item_name")}>{product.product}</h4>

            {!!product.variants.length ? (
               <>
                  <div className={cx("variant-box", "mx-[-2px] md:mx-[-4px]")}>
                     {product.variants.map((v, index) => {
                        const isActive = activeVariant?.id === v.id;
                        return (
                           <div key={index} className="w-[50%] sm:w-1/3 px-[2px] md:px-[4px]">
                              <Button
                                 onClick={() => setActiveVariant(v)}
                                 className={`text-[14px] w-full ${
                                    isActive ? "active" : ""
                                 }`}
                                 colors={"second"}
                                 active={isActive}
                              >
                                 {v.variant}
                              </Button>
                           </div>
                        );
                     })}
                  </div>
                  <div className={cx("product-item_price")}>
                     <h1 className={cx("product-item_price--current")}>
                        {moneyFormat(activeVariant?.default_combine.combine.price || "")}đ
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
