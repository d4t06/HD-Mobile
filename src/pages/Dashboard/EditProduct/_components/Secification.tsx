import { selectProduct } from "@/store/productSlice";
import { useSelector } from "react-redux";
import Table from "@/components/Table";
import { useMemo } from "react";
import SpecificationItem from "./child/SpecificationItem";

type Props = {
   mainClasses: LayoutClasses;
};

export default function Specification({ mainClasses }: Props) {
   const { product } = useSelector(selectProduct);

   const attributeOrderArray = useMemo(
      () =>
         product && !!product.category?.attribute_order
            ? product.category.attribute_order.split("_")
            : [],
      []
   );

   if (!product) return <></>;
   return (
      <>
         <div className="flex-1 space-y-[30px]">
            <h1 className={mainClasses.label}>Specification</h1>
            <Table colList={["Name", "value", ""]}>
               {attributeOrderArray.length ? (
                  attributeOrderArray.map((id) => (
                     <SpecificationItem key={id} categoryAttributeId={+id} />
                  ))
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
