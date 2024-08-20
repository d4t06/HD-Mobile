import MyEditor from "@/components/MyEditor";
import { selectProduct } from "@/store/productSlice";
import { useSelector } from "react-redux";
import useDescriptionAction from "../_hooks/useDescriptionAction";

type Props = {
   mainClasses: LayoutClasses;
};''

export default function Description({ mainClasses }: Props) {
   const { product } = useSelector(selectProduct);

   const { isFetching, update } = useDescriptionAction();

   const handleUpdateDescription = async (value: string, restChange: () => void) => {
      if (!product) return;

      const newDescription: DescriptionSchema = {
         content: value,
         product_id: product.id,
      };

      await update(newDescription, product.id, restChange);
   };

   return (
      <>
         <h5 className={mainClasses.label}>Description</h5>
         <div className="overflow-hidden">
            <MyEditor
               className={`${isFetching ? "disable" : ""} `}
               cb={(value, restChange) => handleUpdateDescription(value, restChange)}
               content={product?.description ? product.description.content : ""}
            />
         </div>
      </>
   );
}
