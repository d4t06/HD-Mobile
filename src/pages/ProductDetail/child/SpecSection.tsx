
import "../styles.scss";
import Image from "@/components/ui/Image";
import Skeleton from "@/components/Skeleton";
import PushFrame from "@/components/ui/PushFrame";

type Props = {
   product: Product;
   loading: boolean;
};

export default function SpecSection({ product, loading }: Props) {
   const { attributes_data, category_data } = product;

   const attributeOrder = category_data.attribute_order.split("_") || [];

   const SpecSkeleton = (
      <>
         <Skeleton className="pt-[100%] rounded-[8px] mb-[20px]" />
         {[...Array(6).keys()].map((item) => (
            <Skeleton key={item} className="w-full h-[34px] rounded-[4px] mb-[10px]" />
         ))}
      </>
   );

   const content = (
      <>
         <Image classNames="h-full max-h-[40vh] w-auto mx-auto" src={product.image_url} />
         <div className="mt-[20px] mb-[10px]">
            <table className="w-full">
               <tbody>
                  {attributeOrder.map((item, index) => {
                     const foundedCategoryAttribute = product.category_data.attributes.find(
                        (cat) => cat.attribute_ascii === item
                     );

                     if (!foundedCategoryAttribute) return <p>Wrong index</p>;

                     const foundedProductAttribute = attributes_data.find(
                        (attr) => attr.category_attr_id == foundedCategoryAttribute.id
                     );

                     return (
                        <tr key={index}>
                           <td className="w-[40%]">{foundedCategoryAttribute.attribute}</td>
                           <td className="leading-[1.6]">{foundedProductAttribute?.value || "..."}</td>
                        </tr>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </>
   );

   return (
      <PushFrame>
         {loading && SpecSkeleton}
         {!loading && product && content}
      </PushFrame>
   );
}
