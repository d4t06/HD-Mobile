import { Dispatch, FormEvent, SetStateAction, useEffect, useState, useRef, useMemo, ReactNode } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import ModalHeader from "./ModalHeader";
import { generateId } from "@/utils/appHelper";

export type FieldType = (string | { label: string; placeholder: string })[];

type Props = {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  cb: ({}: Record<string, string>) => void;
  title: string;
  fields: FieldType;
  intiFieldData?: Record<string, string>;
  children?: ReactNode;
  loading: boolean;
};

const initState = (
  fields: Props["fields"]
): {
  name: string;
  name_ascii: string;
  placeholder: string;
}[] => {
  return fields.map((f) => {
    if (typeof f === "object") return { name: f.label, name_ascii: generateId(f.label), placeholder: f.placeholder };

    return { name: f, name_ascii: generateId(f), placeholder: f };
  });
};

const intiFieldDataState = (inputFields: ReturnType<typeof initState>) => {
  let data: Record<string, string> = {};
  inputFields.forEach((item) => {
    data[item.name_ascii] = "";
  });

  return data;
};

export default function AddItemMulti({ setIsOpenModal, cb, title, fields, loading, intiFieldData, children }: Props) {
  const inputFields = useMemo(() => {
    return initState(fields);
  }, [fields]);

  const [fieldData, setFieldData] = useState(intiFieldData || intiFieldDataState(inputFields));

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInput = (value: string, name: string) => {
    setFieldData({ ...fieldData, [name]: value });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    cb(fieldData);
  };

  return (
    <div className="w-[300px] bg-[#fff]">
      <ModalHeader setIsOpenModal={setIsOpenModal} title={title} />
      <form action="" onSubmit={handleSubmit}>
        {inputFields.map((item, index) => (
          <div key={index} className=" mb-[15px]">
            <label className="font-semibold text-[16px] h-[30px] mb-[4px] flex items-end" htmlFor={item.name_ascii}>
              {item.name}
            </label>
            <Input
              key={index}
              className="w-full"
              ref={index === 0 ? inputRef : undefined}
              id={item.name_ascii}
              placeholder={item.placeholder}
              value={fieldData[item.name_ascii]}
              cb={(value) => handleInput(value, item.name_ascii)}
            />
          </div>
        ))}

        {children}

        <p className="text-right mt-[20px]">
          <Button isLoading={loading} type="submit" primary>
            Save
          </Button>
        </p>
      </form>
    </div>
  );
}
