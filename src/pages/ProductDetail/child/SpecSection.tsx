import { Product } from "@/types";
import "../styles.scss";
import Image from "@/components/ui/Image";
import Skeleton from "@/components/Skeleton";
import PushFrame from "@/components/ui/PushFrame";

type Props = {
   product: Product;
   loading: boolean;
};

export default function SpecSection({ product, loading }: Props) {
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
                  {product.category_data.attributes.map((catAttr, index) => {
                     const founded = product.attributes_data.find(
                        (attr) => attr.attribute_data.attribute_ascii == catAttr.attribute_ascii
                     );

                     return (
                        <tr key={index}>
                           <td className="w-[40%]">{catAttr.attribute}</td>
                           <td>{founded?.value || "..."}</td>
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
