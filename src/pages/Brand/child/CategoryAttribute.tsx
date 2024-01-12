import { inputClasses } from "@/components/ui/Input";
import { Category } from "@/types";
import { useMemo, useRef, useState } from "react";

import styles from "../Brand.module.scss";
import classNames from "classnames/bind";
import { Button, Modal } from "@/components";
import AddItem from "@/components/Modal/AddItem";
import ConfirmModal from "@/components/Modal/Confirm";
const cx = classNames.bind(styles);

type Props = {
  categories: Category[];
};

type ModalTarget = "add-attr" | "edit-attr" | "delete-attr";

function CategoryAttribute({ categories }: Props) {
  const [apiLoading, setApiLoading] = useState(false);
  const [curCategory, setCurCategory] = useState<Category | undefined>();
  const [isOpenModal, setIsOpenModal] = useState(false);

  const openModalTarget = useRef<ModalTarget | "">("");
  const curAttrIndex = useRef<number>();

  const handleAddAttr = (value: string, type: "ADD" | "EDIT") => {};

  const handleDeleteAttr = () => {};

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
        return (
          <AddItem
            loading={apiLoading}
            title="Add attribute"
            cbWhenSubmit={(value) => handleAddAttr(value, "ADD")}
            setIsOpenModal={setIsOpenModal}
          />
        );
      case "edit-attr":
        if (curAttrIndex.current === undefined || curCategory?.attributes == undefined)
          return <h1>Index not found</h1>;

        const initValue = curCategory?.attributes[curAttrIndex.current].attribute;
        return (
          <AddItem
            loading={apiLoading}
            title="Add category"
            cbWhenSubmit={(value) => handleAddAttr(value, "ADD")}
            setIsOpenModal={setIsOpenModal}
            initValue={initValue}
          />
        );

      case "delete-attr":
        if (curAttrIndex.current === undefined || curCategory?.attributes == undefined)
          return <h1>Index not found</h1>;

        return (
          <ConfirmModal
            callback={handleDeleteAttr}
            loading={apiLoading}
            setOpenModal={setIsOpenModal}
          />
        );

      default:
        return <h1 className="text-3xl">Not thing to show</h1>;
    }
  }, [isOpenModal, apiLoading]);

  return (
    <>
      <div className="bg-[#fff]  rounded-[8px] p-[20px] mb-[30px]">
        <div className="flex items-center justify-between">
          <div className="mb-[15px] flex items-center">
            <p className={cx("input-label", "mr-[10px]")}>Category: </p>
            <select
              disabled={!categories.length}
              className={`${inputClasses.input} min-w-[100px]`}
              name="category"
              onChange={(e) => setCurCategory(categories[+e.target.value as number])}
            >
              <option value={undefined}>---</option>
              {!!categories.length &&
                categories.map((category, index) => (
                  <option key={index} value={index}>
                    {category.category_name}
                  </option>
                ))}
            </select>
          </div>

          <Button onClick={() => handleOpenModal("add-attr")} primary>
            <i className="material-icons mr-[8px]">add</i> Add attribute
          </Button>
        </div>

        <div className={`row ${apiLoading ? "disable" : ""}`}>
          {curCategory?.attributes &&
            curCategory.attributes.map((attr, index) => (
              <div key={index} className={cx("attr-item")}>
                {attr.attribute}
              </div>
            ))}
        </div>
      </div>

      {isOpenModal && <Modal setShowModal={setIsOpenModal}>{renderModal}</Modal>}
    </>
  );
}

export default CategoryAttribute;
