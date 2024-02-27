import emptyCart from "@/assets/images/empty-cart.png";
import { ShoppingBagIcon, TrashIcon, CreditCardIcon, MapPinIcon, TruckIcon, BanknotesIcon } from "@heroicons/react/24/outline";
import PushFrame from "@/components/ui/PushFrame";
import useCart from "@/hooks/useCart";
import { moneyFormat } from "@/utils/appHelper";
import PrimaryLabel from "@/components/ui/PrimaryLabel";
import { Button } from "@/components";
import { useRef, useState } from "react";
import AddressGroup, { AddressGroupRef } from "./child/AdressGroup";
import Skeleton from "@/components/Skeleton";
import VariantList from "./child/VariantList";
import { CartItem, OrderItem, OrderSchema } from "@/types";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useNavigate } from "react-router-dom";

const USER_ORDER_URL = "/orders";

export default function Checkout() {
  const [submitLoading, setSubmitLoading] = useState(false);

  const AddressGroupRef = useRef<AddressGroupRef>(null);

  const discount = 0;
  const navigate = useNavigate();

  const { setErrorToast } = useToast();
  const privateRequest = usePrivateRequest();
  const { cart, apiLoading, initStatus, handleCartData, deleteCartItem } = useCart({
    autoRun: true,
  });

  const handleDeleteItem = async (cartItem: CartItem) => {
    await deleteCartItem(handleCartData, cartItem.id);
  };

  const handleSubmit = async () => {
    try {
      const isValidAddress = AddressGroupRef.current?.validate();

      if (!isValidAddress || !cart) throw new Error("invalid address");

      const address = AddressGroupRef.current?.getAddress();
      if (!address) throw new Error("invalid address");

      setSubmitLoading(true);

      const orderDataForInsert: OrderSchema = {
        username: cart.username,
        discount,
        purchase_price: cart.total_price,
        purchase_type: "Thanh toán khi nhận hàng",
        recipient_address: address.address,
        recipient_name: address.name,
        recipient_phone_number: address.phoneNumber,
        status: "processing",
        total_price: cart.total_price - discount,
      };

      const res = await privateRequest.post(USER_ORDER_URL, orderDataForInsert);
      const newOrderData = res.data as OrderSchema & { id: number };

      const orderItems = cart.items.map((item) => {
        const color = item.product_data.colors_data.find((cl) => cl.id === item.color_id);
        const storage = item.product_data.storages_data.find((s) => s.id === item.storage_id);

        if (!color || !storage) throw new Error("invalid variant value");

            return {
               amount: item.amount,
               color: color.color,
               image_url: item.product_data.image_url,
               order_id: newOrderData.id,
               product_name: item.product_data.product_name,
               slug: item.product_data.category_data.category_name_ascii + "/" + item.product_name_ascii,
               storage: storage.storage,
               price: item.product_data.combines_data[0].price,
            } as OrderItem;
         });

      await privateRequest.post(`${USER_ORDER_URL}/order-items`, orderItems);

      for await (const item of cart.items) {
        await deleteCartItem(undefined, item.id);
      }

      navigate("/order", { replace: true });
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setSubmitLoading(false);
    }
  };

  const classes = {
    emptyImage: "w-[160px] md:w-[200px] mx-auto h-auto",
    p: "text-[14px] sm:text-[16px] text-[#333] text-center",
    variantLabel: "text-[13px] md:text-[14px] text-gray-600 font-[500]",
    pushBtn: "leading-[26px] text-[14px] px-[6px]",
    container: "mb-[20px] sm:mb-[30px]",
    formLabel: "text-[16px] text-[#333]",
    h5: "text-[14px] md:text-[16px] text-[#808080] font-[500]",
    select: "px-[10px] border border-[#e1e1e1] bg-[#fff] hover:bg-[#f1f1f1] cursor-pointer py-[6px] rounded-[6px] font-[500] text-[13px] md:text-[14px] text-[#333] text-[500]",
    quantityBox: "inline-flex  border-[#e1e1e1] border  justify-between  overflow-hidden items-center text-[#333] rounded-[99px] bg-[#fff]",
  };

  const Empty = (
    <div className="">
      <img src={emptyCart} className={classes.emptyImage} alt="" />
      <p className={`${classes.h5} text-center`}>Chưa có sản phẩm</p>
    </div>
  );

  const groupSkeleton = [...Array(3).keys()].map((index) => (
    <div key={index} className="mb-[30px] space-y-[16px]">
      <Skeleton className="w-[200px] rounded-[6px] h-[24px] max-w-[30%]" />
      <Skeleton className="w-full rounded-[6px] h-[200px]" />
    </div>
  ));

  if (initStatus === "loading") return groupSkeleton;

  if (initStatus === "error") return <p className={classes.p}>Some thing went wrong</p>;

  if (!cart || !cart.items.length) {
    return Empty;
  }

  return (
    <>
      <div className={`${submitLoading ? "opacity-60 pointer-events-none" : ""} `}>
        <div className={classes.container}>
          <PrimaryLabel className="mb-[12px]" title={`Tất cả sản phẩm (${cart.items.length})`}>
            <ShoppingBagIcon className="w-[22px] md:w-[24px]" />
          </PrimaryLabel>
          <PushFrame>
            <div className={`space-y-[20px] ${apiLoading ? "opacity-60 pointer-events-none" : ""}`}>
              {cart.items.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex flex-grow">
                    <div className="w-[70px] h-[70px] md:w-[90px] md:h-[90px] flex-shrink-0 flex items-center">
                      <img src={item.product_data.image_url} className="w-full h-auto" alt="" />
                    </div>
                    <div className="flex flex-grow flex-col items-start md:items-center ml-[10px] space-y-[10px] md:flex-row md:space-y-0">
                      <div className="h-full">
                        <h5 className="text-[16px] font-[600] mb-[10px] md:mb-0">{item.product_data.product_name}</h5>
                        <VariantList handleCartData={handleCartData} cartItem={item} />
                      </div>

                      <h4 className="text-[18px] font-[600] text-gray-600  ml-auto md:mr-[50px]">
                        Giá: <span className="text-[#cd1818]">{moneyFormat(item.product_data.combines_data[0].price)}đ</span>
                      </h4>
                    </div>
                  </div>

                  <Button onClick={() => handleDeleteItem(item)} className="px-[8px] py-[3px]" primary>
                    <TrashIcon className="w-[18px] sm:w-[22px]" />
                  </Button>
                </div>
              ))}
            </div>
          </PushFrame>
        </div>

        <div className={classes.container}>
          <PrimaryLabel className="mb-[12px]" title="Hình thức nhận hàng">
            <TruckIcon className="w-[22px] md:w-[24px]" />
          </PrimaryLabel>

          <div className="flex space-x-[10px]">
            <PushFrame active={false} type="translate">
              <button className={classes.pushBtn} onClick={() => {}}>
                Giao hàng tận nơi
              </button>
            </PushFrame>
            <PushFrame active={false} type="translate">
              <button className={classes.pushBtn} onClick={() => {}}>
                Nhận tại của hàng
              </button>
            </PushFrame>
          </div>
        </div>

        <div className={classes.container}>
          <PrimaryLabel className="mb-[12px]" title="Địa chỉ">
            <MapPinIcon className="w-[22px] md:w-[24px]" />
          </PrimaryLabel>
          <PushFrame>
            <AddressGroup ref={AddressGroupRef} />
          </PushFrame>
        </div>

        <div className={classes.container}>
          <PrimaryLabel className="mb-[12px]" title="Hình thức thanh toán">
            <CreditCardIcon className="w-[22px] md:w-[24px]" />
          </PrimaryLabel>
          <div className="flex flex-col items-start md:flex-row space-y-[10px] md:space-y-0 md:items-center md:space-x-[10px]">
            <PushFrame active={false} type="translate">
              <button className={`${classes.pushBtn} inline-flex items-center`} onClick={() => {}}>
                <BanknotesIcon className="w-[22px] md:w-[24px] mr-[6px]" />
                Thanh toán khi nhận hàng
              </button>
            </PushFrame>
            <PushFrame active={false} type="translate">
              <button className={`${classes.pushBtn} inline-flex items-center`} onClick={() => {}}>
                <CreditCardIcon className="w-[22px] md:w-[24px] mr-[6px]" />
                Chuyển khoản ngân hàng
              </button>
            </PushFrame>
          </div>
        </div>

        <div className="fixed bg-white bottom-0 left-0 right-0 border-t-[1px] py-[10px] md:p-[16px]">
          <div className="max-w-[800px] px-[10px] mx-auto">
            <div className="flex flex-col md:flex-row items-start mx-[-8px]">
              <div className="w-full md:w-1/2 px-[8px]">
                <div className="flex items-center leading-[30px]">
                  <p className={classes.h5}>Tổng tiền:</p>
                  <p className={`${classes.h5} ml-auto text-black`}>{moneyFormat(cart.total_price)}đ</p>
                </div>

                <div className="flex items-center leading-[30px]">
                  <p className={classes.h5}>Giảm giá voucher:</p>
                  <p className={`${classes.h5} ml-auto`}>- 0đ</p>
                </div>
              </div>
              <div className="w-full md:w-1/2 px-[8px]">
                <div className="flex items-center leading-[30px]">
                  <p className={classes.h5}>Cần thanh toán:</p>
                  <p className="text-[20px] text-[#cd1818] font-[600] ml-auto">{moneyFormat(cart.total_price)}đ</p>
                </div>
                <Button isLoading={submitLoading} onClick={handleSubmit} backClass="w-full mt-[10px]" primary>
                  Thanh toán
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
