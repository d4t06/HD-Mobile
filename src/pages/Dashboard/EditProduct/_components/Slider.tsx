import { selectProduct } from "@/store/productSlice";
import { useSelector } from "react-redux";
import ProductSliderItem from "./child/ProductSliderItem";

type Props = {
   mainClasses: LayoutClasses;
};

export default function Slider({mainClasses}: Props) {
   const { product } = useSelector(selectProduct);

   if (!product) return <></>;
   return (
      <>
         <h1 className={mainClasses.label}>Slider</h1>
         {product.colors.length ? (
            product.colors.map((item, index) => (
               <div className={mainClasses.group} key={index}>
                  <ProductSliderItem color={item} colorIndex={index} />
               </div>
            ))
         ) : (
            <div className={mainClasses.group}>
               <p className="text-center">¯\_(ツ)_/¯ </p>
            </div>
         )}
      </>
   );
}
