import { Button, Gallery, Modal } from "@/components";
import AddItem from "@/components/Modal/AddItem";

import { generateId, initBrandObject } from "@/utils/appHelper";
import { Dispatch, SetStateAction, useState } from "react";

import styles from "../Brand.module.scss";
import classNames from "classnames/bind";
import { PhoneXMarkIcon } from "@heroicons/react/16/solid";

const cx = classNames.bind(styles);

type OpenType = "Add" | "Edit";

type Props = {
   close: () => void;
   apiLoading: boolean;
   addBrand: (brand: Brand, type: OpenType, curIndex?: number) => Promise<void>;
   type: OpenType;
   curBrand?: Brand & { curIndex: number };
   catId: number | undefined;
};
export default function EditBrand({
   close,
   addBrand,
   apiLoading,
   type,
   curBrand,
   catId,
}: Props) {
   const [brandData, setBrandData] = useState<Brand>(curBrand || initBrandObject({}));
   const [isOpenModal, setIsOpenModal] = useState(false);

   const handleChoseBrandImage = (imageUrls: string[]) => {
      const newBrandData: Brand = { ...brandData, image_url: imageUrls[0] };
      setBrandData(newBrandData);
   };

   const LocalCloseModal = () => setIsOpenModal(false);

   const handleAddBrand = async (
      value: string,
      type: "Add" | "Edit",
      curCategoryId?: number
   ) => {
      if (curCategoryId === undefined) throw new Error("Invalid category id");
      const newBrandData: Brand = {
         ...brandData,
         brand_name: value,
         brand_ascii: generateId(value),
         category_id: curCategoryId,
      };
      await addBrand(newBrandData, type, curBrand?.curIndex);
   };

   const tileMap: Record<OpenType, string> = {
      Add: "Add new brand",
      Edit: `Edit brand ${curBrand?.brand_name}`,
   };

   return (
      <AddItem
         title={tileMap[type]}
         cbWhenSubmit={async (brandName) => await handleAddBrand(brandName, type, catId)}
         close={close}
         initValue={type === "Edit" ? curBrand?.brand_name : ""}
         loading={apiLoading}
      >
         <>
            <div className="mt-[10px] mb-[20px]">
               {brandData.image_url && (
                  <div className={cx("brand-image")}>
                     <img src={brandData.image_url} />
                     <Button
                        onClick={() => handleChoseBrandImage([""])}
                        className="ml-[8px]"
                     >
                        <PhoneXMarkIcon className="w-[24px]" />
                     </Button>
                  </div>
               )}

               {!brandData.image_url && (
                  <Button onClick={() => setIsOpenModal(true)}>Choose image</Button>
               )}
            </div>

            {isOpenModal && (
               <Modal child close={LocalCloseModal}>
                  <Gallery
                     close={LocalCloseModal}
                     setImageUrl={(imageUrls) => handleChoseBrandImage(imageUrls)}
                  />
               </Modal>
            )}
         </>
      </AddItem>
   );
}
