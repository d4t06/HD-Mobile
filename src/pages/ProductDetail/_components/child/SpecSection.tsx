import Image from "@/components/ui/Image";
import Skeleton from "@/components/Skeleton";
import PushFrame from "@/components/ui/PushFrame";

import styles from "./SpecSection.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

type Props = {
   product: ProductDetail | null;
   loading: boolean;
};

export default function SpecSection({ product, loading }: Props) {
   const attributeOrder = product?.category.attribute_order
      ? product.category.attribute_order.split("_")
      : [];

   const SpecSkeleton = (
      <>
         <Skeleton className="pt-[100%] rounded-[12px] mb-[20px]" />
         {[...Array(5).keys()].map((item) => (
            <Skeleton key={item} className="w-full h-[34px] rounded-[8px] mb-[10px]" />
         ))}
      </>
   );

   return (
      <PushFrame>
         {loading && SpecSkeleton}
         {!loading && product && (
            <div className={"spec-table"}>
               {product.image_url ? (
                  <Image
                     classNames="max-w-[60%] w-[250px] mx-auto"
                     src={product.image_url}
                  />
               ) : (
                  <img
                     src="https://d4t06.github.io/Vue-Mobile/assets/search-empty-ChRLxitn.png"
                     className="mx-auto"
                     alt=""
                  />
               )}
               <div className="mt-[20px] mb-[10px]">
                  <table className={cx("table")}>
                     <tbody>
                        {attributeOrder.length ? (
                           attributeOrder.map((id, index) => {
                              const foundedCategoryAttribute =
                                 product.category.attributes.find(
                                    (catAttr) => catAttr.id === +id
                                 );

                              if (!foundedCategoryAttribute) return <p>Wrong index</p>;

                              const foundedProductAttribute = product.attributes.find(
                                 (attr) =>
                                    attr.category_attribute_id ==
                                    foundedCategoryAttribute.id
                              );

                              return (
                                 <tr key={index}>
                                    <td className="w-[40%]">
                                       {foundedCategoryAttribute.name}
                                    </td>
                                    <td className="leading-[1.6]">
                                       {foundedProductAttribute?.value || "..."}
                                    </td>
                                 </tr>
                              );
                           })
                        ) : (
                           <tr className="text-center">
                              <td colSpan={2}>¯\_(ツ)_/¯</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         )}
      </PushFrame>
   );
}
