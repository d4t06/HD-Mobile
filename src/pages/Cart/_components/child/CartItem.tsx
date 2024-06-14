import useCartAction from "@/hooks/useCartAction";
import { moneyFormat } from "@/utils/appHelper";
import VariantList from "./VariantList";
import ConfirmModal from "@/components/Modal/Confirm";
import { useState } from "react";
import { Button, Modal } from "@/components";
import { TrashIcon } from "@heroicons/react/24/outline";
import { CheckIcon } from "@heroicons/react/16/solid";
import { useDispatch } from "react-redux";
import { selectCartItem } from "@/store/cartSlice";

type Props = {
   cartItem: cartItemDetail;
   index: number;
   isChecked: boolean;
};

export default function CartItem({ cartItem, isChecked, index }: Props) {
   const dispatch = useDispatch();

   const [openModal, setOpenModal] = useState(false);

   // hooks
   const { actions, isFetching } = useCartAction();

   const closeModal = () => setOpenModal(false);

   const handleSelectCart = (id: number) => dispatch(selectCartItem([id]));

   const handleDeleteCartItem = async () => {
      await actions({ variant: "delete", id: cartItem.item.id, index });
   };

   const classes = {
      imageFrame: "relative w-[70px] h-[70px] md:w-[90px] md:h-[90px] flex-shrink-0",
      variant:
         "flex flex-grow flex-col items-start md:items-center ml-[10px] space-y-[14px] md:flex-row md:space-y-0",
      checkBtn:
         "h-[24px] w-[24px] inline-flex item-center justify-center absolute rounded-[6px] left-[6px] bottom-[6px]",
   };

   return (
      <>
         <div key={index} className="flex items-center">
            <div className="flex flex-grow">
               <div className={classes.imageFrame}>
                  <img
                     src={cartItem.item.product.image_url}
                     className="w-full h-auto"
                     alt=""
                  />

                  <button
                     onClick={() => handleSelectCart(cartItem.item.id)}
                     className={`${classes.checkBtn} ${
                        isChecked
                           ? "bg-[#cd1818] text-white"
                           : "bg-[#fff] border-[2px] border-black/15"
                     }`}
                  >
                     {isChecked && <CheckIcon className="w-[20px]" />}
                  </button>
               </div>

               <div className={classes.variant}>
                  <div className="h-full">
                     <h5 className="text-[18px] font-[500] mb-[14px] md:mb-[4px]">
                        {cartItem.item.product.product}
                     </h5>
                     <VariantList
                        index={index}
                        isFetching={isFetching}
                        actions={actions}
                        cartItem={cartItem}
                     />
                  </div>

                  <h4 className="text-[18px] text-[#3f3f3f] font-[500]  ml-auto md:mr-[50px]">
                     Giá:{" "}
                     <span className="text-[#cd1818] font-[600]">
                        {moneyFormat(cartItem.price)}đ
                     </span>
                  </h4>
               </div>
            </div>

            <Button
               colors={"second"}
               disabled={false}
               onClick={() => setOpenModal(true)}
               className="px-[9px] py-[3px]"
               size={"clear"}
            >
               <TrashIcon className="w-[22px]" />
            </Button>
         </div>

         {openModal && (
            <Modal closeModal={closeModal} z="z-[200]">
               <ConfirmModal
                  callback={handleDeleteCartItem}
                  loading={isFetching}
                  desc={'Định xóa hả gì ?'}
                  label={`Xóa '${cartItem.item.product.product}'`}
                  closeModal={closeModal}
               >
                  <img src="https://zalo-api.zadn.vn/api/emoticon/sticker/webpc?eid=46991&size=130" className="w-auto h-auto mx-auto"  />
                  </ConfirmModal>
            </Modal>
         )}
      </>
   );
}
