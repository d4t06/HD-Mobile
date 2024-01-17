import { CategoryAttribute, ProductAttribute } from "@/types";
import "../styles.scss";

type Props = {
   proAttrs: ProductAttribute[];
   catAttrs: CategoryAttribute[];
};


export default function SpecTable({ catAttrs, proAttrs }: Props) {

   return (
      <table className="spec-table">
         <tbody>
            {catAttrs.map((catAttr, index) => {
               const founded = proAttrs.find((attr) => attr.id == catAttr.id);
               return (
                  <tr key={index}>
                     <td className="max-w-[50%]">{catAttr.attribute}</td>
                     <td>{founded?.value || "..."  }</td>
                  </tr>
               ); 
            })}
         </tbody>
      </table>
   );
}
