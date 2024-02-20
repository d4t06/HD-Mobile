import { inputClasses } from "@/components/ui/Input";
import { Category, CategoryAttribute } from "@/types";
import { useEffect, useMemo, useRef, useState } from "react";

import styles from "../Brand.module.scss";
import classNames from "classnames/bind";
import { Button, Modal } from "@/components";
import AddItem from "@/components/Modal/AddItem";
import ConfirmModal from "@/components/Modal/Confirm";
import useBrandAction from "@/hooks/useBrand";
import { generateId } from "@/utils/appHelper";
import PushFrame from "@/components/ui/PushFrame";
import { PlusIcon } from "@heroicons/react/16/solid";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
const cx = classNames.bind(styles);

type Props = {
  categories: Category[];
  //  addAttribute: (attribute: Category_Attribute, type: "Add" | "Edit", curIndex?: number | undefined) => Promise<void>;
  //  deleteAttribute: (curIndex?: number | undefined) => Promise<void>;
};

type ModalTarget = "add-attr" | "edit-attr" | "delete-attr";

function AttributeGroup({ categories }: Props) {
  const [curCategory, setCurCategory] = useState<Category | undefined>();
  const [curCategoryIndex, setCurCategoryIndex] = useState<number>();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const openModalTarget = useRef<ModalTarget | "">("");
  const curAttrIndex = useRef<number>();

  //  hooks
  const { addAttribute, deleteAttribute, apiLoading } = useBrandAction({
    curCategory,
    setIsOpenModal,
    curBrands: undefined,
  });

  const handleAddAttr = async (value: string, type: "Add" | "Edit") => {
    if (curCategory?.id === undefined) throw new Error("curCategory.id is undefined");

    const newCatAttr: CategoryAttribute = {
      id: undefined,
      attribute: value,
      attribute_ascii: generateId(value),
      category_id: curCategory?.id,
    };

    if (type === "Edit") {
      if (curAttrIndex.current === undefined || curCategory.attributes === undefined) {
        throw new Error("Current index not found");
      }

      newCatAttr.id = curCategory.attributes[curAttrIndex.current].id;
    }

    await addAttribute(newCatAttr, type, curAttrIndex.current);
  };

  const handleDeleteAttr = async () => {
    await deleteAttribute(curAttrIndex.current);
  };

  const handleOpenModal = (target: typeof openModalTarget.current, index?: number) => {
    openModalTarget.current = target;
    switch (target) {
      case "edit-attr":
      case "delete-attr":
        curAttrIndex.current = index ?? undefined;
        break;
    }
    setIsOpenModal(true);
  };

  const renderModal = useMemo(() => {
    if (!isOpenModal) return;
    switch (openModalTarget.current) {
      case "add-attr":
        if (!curCategory) return <p className="text-[16px]">Current category not found</p>;
        return <AddItem loading={apiLoading} title="Add attribute" cbWhenSubmit={(value) => handleAddAttr(value, "Add")} setIsOpenModal={setIsOpenModal} />;
      case "edit-attr":
        if (curAttrIndex.current === undefined || curCategory?.attributes == undefined) return <h1>Index not found</h1>;

        const initValue = curCategory?.attributes[curAttrIndex.current].attribute;
        return <AddItem loading={apiLoading} title="Add category" cbWhenSubmit={(value) => handleAddAttr(value, "Edit")} setIsOpenModal={setIsOpenModal} initValue={initValue} />;

      case "delete-attr":
        if (curAttrIndex.current === undefined || curCategory?.attributes == undefined) return <h1>Index not found</h1>;

        return <ConfirmModal callback={handleDeleteAttr} loading={apiLoading} setOpenModal={setIsOpenModal} />;

      default:
        return <h1 className="text-3xl">Not thing to show</h1>;
    }
  }, [isOpenModal, apiLoading]);

  useEffect(() => {
    if (curCategoryIndex === undefined) return;
    setCurCategory(categories[curCategoryIndex]);
  }, [categories, curCategoryIndex]);

  return (
    <>
      <div className="bg-[#fff]  rounded-[8px] p-[20px] mb-[30px]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <p className={cx("input-label", "mr-[10px]")}>Category: </p>
            <div className="bg-[#ccc] rounded-[12px]">
              <select disabled={!categories.length} className={`${inputClasses.input} min-w-[100px]`} name="category" onChange={(e) => setCurCategoryIndex(+e.target.value)}>
                <option value={undefined}>---</option>
                {!!categories.length &&
                  categories.map((category, index) => (
                    <option key={index} value={index}>
                      {category.category_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <Button disable={!curCategory} onClick={() => handleOpenModal("add-attr")} primary>
            Add attribute
          </Button>
        </div>

        {curCategory?.attributes && (
          <div className={`mt-[14px] row gap-[10px] ${apiLoading ? "disable" : ""}`}>
            {curCategory.attributes.map((attr, index) => (
              <PushFrame type="translate" key={index}>
                <div className={cx("attr-item")}>
                  <span>{attr.attribute}</span>

                  <div className={cx("cta")}>
                    <Button onClick={() => handleOpenModal("delete-attr", index)}>
                      <TrashIcon className="w-[24px]" />
                    </Button>
                    <Button onClick={() => handleOpenModal("edit-attr", index)}>
                      <PencilSquareIcon className="w-[24px]" />
                    </Button>
                  </div>
                </div>
              </PushFrame>
            ))}
          </div>
        )}
      </div>

      {isOpenModal && <Modal setShowModal={setIsOpenModal}>{renderModal}</Modal>}
    </>
  );
}

export default AttributeGroup;
