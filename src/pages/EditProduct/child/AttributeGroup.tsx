import { usePrivateRequest } from "@/hooks";
import { useProductContext } from "@/store/ProductDataContext";
import { CategoryAttribute, ProductAttribute, ProductAttributeSchema } from "@/types";
import { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { initProductAttributeSchema } from "./helper";
import "../style.scss";
import { inputClasses } from "@/components/ui/Input";

export type AttributeRef = {
   submit: () => Promise<ProductAttributeSchema | undefined>;
};

type Props = {
   catAttr: CategoryAttribute;
};

const PRODUCT_ATTRIBUTE_URL = "/product-management/attributes";

const findInitValue = (attributes_data: ProductAttribute[], catAttr: CategoryAttribute) => {
   const target = attributes_data.find((item) => item.category_attr_id === catAttr.id);

   return target;
};

function AttributeGroup({ catAttr }: Props, ref: Ref<AttributeRef>) {
   const { attributes_data, product_ascii, setIsChange } = useProductContext();
   const [value, setValue] = useState("");
   const stock = useRef<ProductAttribute>();

   const privateRequest = usePrivateRequest();

   const submit = async () => {
      if (catAttr.id === undefined || product_ascii === undefined)
         throw new Error("category attribute id is undefined");

      if (stock.current === undefined && !!value) {
         const data = initProductAttributeSchema({
            category_attr_id: catAttr.id,
            product_ascii,
            value,
         });

         return data;
      }

      // update must have value
      if (stock.current && !!value && stock.current.value !== value) {
         const data = initProductAttributeSchema({
            category_attr_id: catAttr.id,
            product_ascii,
            value,
         });

         await privateRequest.put(`${PRODUCT_ATTRIBUTE_URL}/${stock.current.id}`, data);
      } else {
         if (stock.current === null) throw new Error("stock.current id is undefined");
      }
   };

   useImperativeHandle(ref, () => ({ submit }));

   useEffect(() => {
      const target = findInitValue(attributes_data, catAttr);
      if (target) {
         setValue(target.value);
         stock.current = target;
      }
   }, [attributes_data, catAttr]);

   const handleOnChange = (value: string) => {
      setValue(value);
      setIsChange(true);
   };

   return (
      <div className="flex items-center w-2/3 mx-[auto] attr-item">
         <div className="col w-4/12">
            <h5 className={`text-[16px] text-center font-[500]`}>{catAttr.attribute}</h5>
         </div>

         <div className="col w-8/12">
            <textarea
               value={value}
               onChange={(e) => handleOnChange(e.target.value)}
               className={`${inputClasses.input} min-h-[50px] h-[50px] no-scrollbar`}
               id=""
               cols={10}
            />
         </div>
      </div>
   );
}

export default forwardRef(AttributeGroup);
