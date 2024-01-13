import { ProductAttribute } from "@/types";
import "../styles.scss";

type Props = {
   attrs: ProductAttribute[];
};

export default function SpecTable({ attrs }: Props) {
   return (
      <table className="spec-table">
         <tbody>
            {attrs.map((attr) => (
               <tr>
                  <td className="max-w-[50%]">{attr.attribute_data.attribute}</td>
                  <td>{attr.value}</td>
               </tr>
            ))}
         </tbody>
      </table>
   );
}
