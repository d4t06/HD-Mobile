import { Button, Modal } from "@/components";
import { selectProduct } from "@/store/productSlice";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useAttributeAction from "../../_hooks/useAttributeAction";
import AddItem from "@/components/Modal/AddItem";

type Props = {
   categoryAttributeId: number;
};

export default function SpecificationItem({ categoryAttributeId }: Props) {
   const { product } = useSelector(selectProduct);

   const [openModal, setOpenModal] = useState(false);

   // hooks
   const { isFetching, actions } = useAttributeAction();

   const foundedCatAttribute = useMemo(
      () => product?.category.attributes.find((attr) => attr.id === categoryAttributeId),
      []
   );

   const foundedAttribute = useMemo(() => {
      if (!product || !foundedCatAttribute)
         return { actuallyIndex: undefined, attribute: undefined };

      const index = product.attributes.findIndex(
         (attr) => attr.category_attribute_id === categoryAttributeId
      );

      if (index === -1)
         return {
            actuallyIndex: undefined,
            attribute: undefined,
         };

      return {
         actuallyIndex: index,
         attribute: product.attributes[index],
      };
   }, [product?.attributes]);

   const closeModal = () => setOpenModal(false);

   const handleUpdateAttribute = async (value: string) => {
      if (foundedAttribute.attribute) {
         const schema: ProductAttributeSchema = {
            ...foundedAttribute.attribute,
            value,
         };

         await actions({
            type: "Edit",
            attribute: schema,
            index: foundedAttribute.actuallyIndex,
            id: foundedAttribute.attribute.id,
         });
      } else if (foundedCatAttribute) {
         if (!product) return;
         const schema: ProductAttributeSchema = {
            value,
            category_attribute_id: foundedCatAttribute.id,
            product_ascii: product.product_ascii,
         };

         await actions({
            type: "Add",
            attribute: schema,
         });
      }

      closeModal();
   };

   if (!foundedCatAttribute) return <p>Some things went wrong</p>;

   return (
      <>
         <tr>
            <td className="w-[30%]">
               <span className="font-[500] text-[#cd1818]">
                  {foundedCatAttribute.attribute}
               </span>
            </td>
            <td>
               <p className="whitespace-break-spaces">
                  {foundedAttribute.attribute?.value || ""}
               </p>
            </td>
            <td className="!text-right">
               <Button
                  onClick={() => setOpenModal(true)}
                  className="p-[4px] sm:px-[14px]"
                  colors={"second"}
                  size={'clear'}
               >
                  <PencilSquareIcon className="w-[20px]" />
                  <span className="ml-[6px] hidden sm:inline-block">Change</span>
               </Button>
            </td>
         </tr>

         {openModal && foundedAttribute && (
            <Modal closeModal={closeModal}>
               <AddItem
                  variant="text-area"
                  loading={isFetching}
                  cbWhenSubmit={(value) => handleUpdateAttribute(value)}
                  closeModal={closeModal}
                  title={`Edit '${foundedCatAttribute.attribute}'`}
                  initValue={foundedAttribute.attribute?.value || ""}
               />
            </Modal>
         )}
      </>
   );
}
