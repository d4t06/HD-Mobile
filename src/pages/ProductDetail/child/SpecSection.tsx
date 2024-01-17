import { Product } from "@/types";
import "../styles.scss";
import Image from "@/components/Image";

type Props = {
  product: Product;
};

export default function SpecSection({ product }: Props) {
  return (
    <div className="bg-[#e1e1e1] p-[4px] pb-[12px] rounded-[10px] mt-[20px]">
      <div className="bg-[#fff] rounded-[8px] overflow-hidden p-[10px]">
        <Image classNames="" src={product.image_url} />
        <div className="mt-[20px] mb-[10px]">
          <table className="spec-table">
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
      </div>
    </div>
  );
}
