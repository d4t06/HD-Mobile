import { Button, Modal } from "@/components";
import AddItemMulti, { FieldType } from "@/components/Modal/AddItemMulti";
import { selectProduct } from "@/store/productSlice";
import { generateId, moneyFormat } from "@/utils/appHelper";
import { PencilSquareIcon } from "@heroicons/react/16/solid";
import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import useCombineAction from "../../_hooks/useCombineAction";

type FIELD_KEYS = "Quantity" | "Price";

const PRICE_FIELDS: FieldType = [
   "Quantity",
   { label: "Price", placeholder: "Price", type: "price" },
];

const getFieldValue = (value: Record<string, string>, name: FIELD_KEYS) => {
   return value[generateId(name)];
};

type Props = {
   color: ProductColor;
   variant: ProductVariant;
   variantIndex: number;
};

export default function CombineItem({ color, variant, variantIndex }: Props) {
   const { product } = useSelector(selectProduct);

   const [openModal, setOpenModal] = useState(false);

   // hooks
   const { isFetching, updateCombine } = useCombineAction();

   const foundedCombineIndex = useMemo(
      () =>
         product
            ? product.combines.findIndex(
                 (c) => c.color_id === color.id && c.variant_id === variant.id
              )
            : -1,
      [product?.combines, variant, color]
   );
   const foundedCombine = useMemo(() => {
      if (!product) return null;

      return foundedCombineIndex === -1 ? null : product.combines[foundedCombineIndex];
   }, [product?.combines]);

   const isDefaultCombineOfProduct = useMemo(() => {
      if (!product || !foundedCombine) return false;

      const isDefaultStorage = product.default_variant.variant_id === variant.id;
      const isDefaultCombineOfStorage =
         variant.default_combine.combine_id === foundedCombine.id;

      return isDefaultStorage && isDefaultCombineOfStorage;
   }, [product?.default_variant, product?.combines, product?.default_variant, variant]);

   const closeModal = () => setOpenModal(false);

   const handleUpdateCombine = async (value: Record<string, string>) => {
      if (!foundedCombine) return;

      const newCombine = { ...foundedCombine };
      newCombine.price = +getFieldValue(value, "Price");
      newCombine.quantity = +getFieldValue(value, "Quantity");

      await updateCombine({
         newCombine,
         variant,
         variantIndex,
         combineIndex: foundedCombineIndex,
      });
      closeModal();
   };

   if (!foundedCombine || foundedCombineIndex === null || foundedCombineIndex === -1)
      return <p>Some things went wrong</p>;

   return (
      <>
         <tr>
            <td>
               <span className="font-[500] text-[#cd1818]"> {variant.name}</span>
               {` / ${color.name} ${isDefaultCombineOfProduct ? "(default)" : ""}`}
            </td>
            <td>{foundedCombine.quantity}</td>
            <td>{moneyFormat(foundedCombine.price)}</td>
            <td className="!text-right">
               <Button
                  onClick={() => setOpenModal(true)}
                  className="p-[4px] sm:px-[14px]"
                  colors={"second"}
                  size={'clear'}
               >
                  <PencilSquareIcon className="w-[20px]" />
                  <span className="ml-[6px] hidden sm:block">Change</span>
               </Button>
            </td>
         </tr>

         {openModal && foundedCombine && (
            <Modal closeModal={closeModal}>
               <AddItemMulti
                  loading={isFetching}
                  title={`Edit '${variant.name}/${color.name}'`}
                  cb={(value) => handleUpdateCombine(value)}
                  closeModal={closeModal}
                  intiFieldData={{
                     quantity: foundedCombine.quantity
                        ? foundedCombine.quantity + ""
                        : "",
                     price: foundedCombine.price ? foundedCombine.price + "" : "",
                  }}
                  fields={PRICE_FIELDS}
               />
            </Modal>
         )}
      </>
   );
}
