import { Link } from "react-router-dom";
import classNames from "classnames/bind";
import styles from "./ProductItem.module.scss";
import { moneyFormat } from "../../utils/appHelper";
import { Product, ProductCombine, ProductStorage } from "@/types";
import { useState } from "react";
import PushFrame from "../ui/PushFrame";
//

const cx = classNames.bind(styles);

type Props = {
   data: Product;
};

const findActiveVar = (storages: ProductStorage[] | undefined, combines: ProductCombine[] | undefined) => {
   if (!storages || !combines) return undefined;
   return storages.find((s) => s.id === combines[0].storage_id);
};

export default function ProductItem({ data }: Props) {
   const [activeVar, setActiveVar] = useState(findActiveVar(data.storages_data, data.combines_data));

   return (
      <div className={cx("product-item")}>
         <Link
            to={`/${data.category_data.category_ascii}/${data.product_name_ascii}?${activeVar?.storage_ascii || ""}`}
            className={cx("product-item-frame")}
         >
            <img className={cx("product-item-image")} src={data.image_url || "https://placehold.co/300X400"} />
         </Link>

         {data.installment && (
            <div className={cx("product-item-installment")}>
               <span>Trả góp 0%</span>
            </div>
         )}
         <div className={cx("product-item-body", "space-y-[14px]")}>
            <h4 className={cx("product-item_name")}>{data.product_name || "Example"}</h4>

            {data.storages_data ? (
               <>
                  <ul className={cx("variant-box")}>
                     {data.storages_data.map((v, index) => {
                        const isActive = activeVar?.storage_ascii === v.storage_ascii;
                        return (
                           <li className={cx("item", { active: isActive })} key={index} onClick={() => setActiveVar(v)}>
                              <PushFrame active={isActive} type="translate">
                                 <p>{v.storage}</p>
                              </PushFrame>
                           </li>
                        );
                     })}
                  </ul>
                  <div className={cx("product-item_price")}>
                     <h1 className={cx("product-item_price--current")}>{moneyFormat(activeVar!.base_price)}đ</h1>
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
