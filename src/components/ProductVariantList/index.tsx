import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

import styles from "./ProductVariantList.module.scss";
import classNames from "classnames/bind";
import { moneyFormat } from "@/utils/appHelper";
import { CartItemSchema, Product, ProductCombine, SliderImage } from "@/types";
import { Button, Modal } from "..";
import useCart from "@/hooks/useCart";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import ModalHeader from "../Modal/ModalHeader";

const cx = classNames.bind(styles);

type Props = {
   productData: Product;
   setSliderImages: Dispatch<SetStateAction<SliderImage[]>>;
   query: string | undefined;
};

type CurVar = { storage_id: number; color_id: number };

// utils
const findDefaultCombine = (combines: ProductCombine[]): CurVar | undefined => {
   const defaultCombine = combines.find((cb) => cb.default);

   return {
      color_id: defaultCombine?.color_id as number,
      storage_id: defaultCombine?.storage_id as number,
   };
};

const getCurrentCombine = (curVar: CurVar, combines: ProductCombine[]) => {
   return combines.find((combine) => combine.color_id === curVar.color_id && combine.storage_id === curVar.storage_id);
};

export default function ProductVariantList({ productData, setSliderImages }: Props) {
   const { colors_data, storages_data, product_name_ascii, combines_data, sliders_data } = productData;
   const [curVar, setCurVar] = useState<CurVar | undefined>(findDefaultCombine(combines_data));

   const [isOpenModal, setIsOpenModal] = useState(false);

   // hooks
   const { addItemToCart, apiLoading } = useCart({});
   const { auth } = useAuth();
   const navigate = useNavigate();
   const location = useLocation();

   const curCombineData = useMemo(() => (curVar ? getCurrentCombine(curVar, combines_data) : undefined), [curVar]);

   const handleAddProductToCart = async () => {
      if (!auth || !auth?.username) return setIsOpenModal(true);
      if (curCombineData === undefined) throw new Error("cur combine is undefined");

      const cartItem: CartItemSchema = {
         amount: 1,
         username: auth.username,
         color_id: curCombineData?.color_id,
         storage_id: curCombineData?.storage_id,
         product_name_ascii,
      };

      await addItemToCart(cartItem);
   };

   const handleNavigateToLogin = () => {
      setIsOpenModal(false);
      navigate("/login", { state: { from: location.pathname } });
   };

   const handleImDoNotBuy = () => {
      setIsOpenModal(false);
   };

   const handleSetVariant = (type: "color" | "storage", id: number) => {
      if (type === "color") {
         setCurVar((prev) => ({ ...prev!, color_id: id }));
      } else setCurVar((prev) => ({ ...prev!, storage_id: id }));
   };

   // set slider image
   useEffect(() => {
      if (curVar) {
         const slider = sliders_data.find((sd) => sd.color_id === curVar.color_id);
         if (slider && slider.slider_data) {
            setSliderImages(slider.slider_data?.images);
         }
      }
   }, [curVar?.color_id]);

   if (!curVar || !curCombineData) return;

   return (
      <>
         <div className={cx("option")}>
            <h5 className={cx("label")}>Bộ nhớ:</h5>
            <ul className={cx("list")}>
               {storages_data.map((storage, index) => (
                  <li
                     onClick={() => handleSetVariant("storage", storage.id as number)}
                     key={index}
                     className={cx(`item`, "main", {
                        active: storage.id === curVar.storage_id,
                     })}
                  >
                     <div className={cx("wrap")}>
                        <div className={cx("box")}>
                           <span className={cx("label")}>{storage.storage}</span>
                           <span className={cx("min-price")}>{moneyFormat(storage.base_price)}đ</span>
                        </div>
                     </div>
                  </li>
               ))}
            </ul>

            <h5 className={cx("label", "mt-[14px]")}>Màu: </h5>
            <ul className={cx("list")}>
               {colors_data.map((color, index) => (
                  <li
                     onClick={() => handleSetVariant("color", color.id as number)}
                     key={index}
                     className={cx(`item`, "main", {
                        active: color.id === curVar.color_id,
                     })}
                  >
                     <div className={cx("wrap")}>
                        <div className={cx("box")}>
                           <span className={cx("label")}>{color.color}</span>
                        </div>
                     </div>
                  </li>
               ))}
            </ul>
         </div>

         <div className={cx("price")}>
            <p className={cx("label", "mt-[14px]")}>Giá bán</p>
            <p className={cx("cur-price")}>{moneyFormat(curCombineData.price)}₫</p>
            {/* {data.old_price && <span className={cx("old-price")}>{moneyFormat(data?.old_price)}</span>} */}
            <span className={cx("vat-tag")}>Đã bao gồm 10% VAT</span>
         </div>

         <div className="mt-[14px] text-[18px] flex flex-col">
            <Button
               disable={apiLoading}
               className="h-[40px]"
               primary
               isLoading={apiLoading}
               onClick={() => handleAddProductToCart()}
            >
               Mua Ngay
            </Button>
         </div>

         {isOpenModal && (
            <Modal setShowModal={setIsOpenModal}>
               <div className="w-[500px] max-w-[80vw]">
                  <ModalHeader title={"Đăng nhập dùm cái"} setIsOpenModal={setIsOpenModal} />
                  <p className="text-[16px] text-gray-600 font-[500]">
                     Không đăng nhập mà mua thì tao lấy cái gì lưu ???
                  </p>
                  <div className="flex flex-col space-y-[10px] sm:space-y-0 sm:flex-row sm:space-x-[10px] mt-[30px] ">
                     <Button isLoading={false} onClick={() => handleImDoNotBuy()} primary>
                        Cút, tao đéo mua
                     </Button>

                     <Button isLoading={false} onClick={() => handleNavigateToLogin()} primary>
                        Dạ để em đăng nhập
                     </Button>
                  </div>
               </div>
            </Modal>
         )}
      </>
   );
}
