import { selectProduct } from "@/store/productSlice";
import { useSelector } from "react-redux";
import Table from "@/components/Table";
import CombineItem from "./child/CombineItem";

type Props = {
   mainClasses: LayoutClasses;
};

export default function Combine({ mainClasses }: Props) {
   const { product } = useSelector(selectProduct);

   if (!product) return <></>;
   return (
      <>
         <div className="flex-1 space-y-[30px]">
            <h1 className={mainClasses.label}>Quantity & Price</h1>
            <Table colList={["Name", "Quantity", "Price", ""]}>
               {product.variants.length && product.colors.length ? (
                  product.variants.map((item, index) =>
                     product.colors.map((color) => (
                        <CombineItem
                           key={item.name_ascii + color.name_ascii}
                           color={color}
                           variantIndex={index}
                           variant={item}
                        />
                     ))
                  )
               ) : (
                  <tr className="!text-center">
                     <td colSpan={3}>¯\_(ツ)_/¯</td>
                  </tr>
               )}
            </Table>
         </div>
      </>
   );
}
