import { Input } from "@/components";
import { usePrivateRequest } from "@/hooks";
import { useProductContext } from "@/store/ProductDataContext";
import { CategoryAttribute, ProductAttribute, ProductAttributeSchema } from "@/types";
import { Ref, forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { initProductAttributeSchema } from "./helper";

export type AttributeRef = {
   submit: () => Promise<ProductAttributeSchema | undefined>;
};

type Props = {
   catAttr: CategoryAttribute;
};

const PRODUCT_ATTRIBUTE_URL = "/product-attribute-management";

const findInitValue = (attributes_data: ProductAttribute[], catAttr: CategoryAttribute) => {
   const target = attributes_data.find((item) => item.attribute_data.attribute_ascii === catAttr.attribute_ascii);

   return target;
};

function AttributeGroup({ catAttr }: Props, ref: Ref<AttributeRef>) {
   const { attributes_data, product_name_ascii } = useProductContext();
   const [value, setValue] = useState("");
   const stock = useRef<ProductAttribute>();

   const privateRequest = usePrivateRequest();

   const submit = async () => {
      if (catAttr.id === undefined || product_name_ascii === undefined)
         throw new Error("category attribute id is undefined");

      // add new
      console.log('>>> check', catAttr.attribute, stock.current);
      
      if (stock.current === undefined && !!value) {
         const data = initProductAttributeSchema({
            category_attr_id: catAttr.id,
            product_name_ascii,
            value,
         });

         return data;
      }

      // update must have value
      if (stock.current && !!value && stock.current.value !== value) {
         const data = initProductAttributeSchema({
            category_attr_id: catAttr.id,
            product_name_ascii,
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
   }, []);

   return (
      <div className="row items-center w-full +*:mb-[14px]">
         <div className="col w-4/12">
            <h5 className={`text-[16px] text-center font-[500]`}>{catAttr.attribute}</h5>
         </div>

         <div className="col w-8/12">
            <Input value={value} className="w-full" cb={(value) => setValue(value)} />
         </div>
      </div>
   );
}

export default forwardRef(AttributeGroup);
