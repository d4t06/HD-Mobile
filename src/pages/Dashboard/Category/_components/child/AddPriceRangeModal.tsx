import AddItemMulti, { FieldType } from "@/components/Modal/AddItemMulti";

type DataType = { label: string; from: number; to: number };

type Props = {
   close: () => void;
   cb: (data: DataType) => void;
   title: string;
   initData?: Record<string, string>;
   loading: boolean;
};

type FIELD_KEYS = "Label" | "From" | "To";

const PRICE_FIELDS: FieldType = [
   "Label",
   { label: "From", placeholder: "1 = 1.000.000đ" },
   { label: "To", placeholder: "1 = 1.000.000đ" },
];

export default function AddPriceRangeModal({
   cb,
   close,
   loading,
   title,
   initData,
}: Props) {
   return (
      <AddItemMulti
         loading={loading}
         title={title}
         fields={PRICE_FIELDS}
         close={close}
         intiFieldData={initData}
         cb={(data: DataType) => cb(data)}
      />
   );
}
