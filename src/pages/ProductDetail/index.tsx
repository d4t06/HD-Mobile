import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, ImageSlider, Modal } from "@/components";
import * as productServices from "@/services/productServices";
import { Product, SliderImage } from "@/types";
import Skeleton from "@/components/Skeleton";
import ProductVariantList from "@/components/ProductVariantList";
import { initProductDetailObject } from "@/utils/appHelper";
import AddCommentModal from "@/components/Modal/AddComment";
import CommentSection from "./child/CommentSection";
import RatingSection from "./child/RatingSection";
import AddReviewModal from "@/components/Modal/AddReview";
import Policy from "./child/Policy";

import "./styles.scss";
import { CommentStateType } from "@/hooks/useComment";
import SpecSection from "./child/SpecSection";
import ContentSection from "./child/ContentSection";
import ModalHeader from "@/components/Modal/ModalHeader";
import { BoltIcon, ChatBubbleBottomCenterTextIcon, Cog6ToothIcon, DocumentTextIcon, PaperClipIcon, PlusIcon, StarIcon, TagIcon } from "@heroicons/react/16/solid";

type ModalTarget = "add-comment" | "add-review" | "confirm-login";

const classes = {
   proName: "leading-[1] text-[22px] font-bold text-[#333]",
   label: "text-[20px] font-semibold text-[#333]",
};

export const PrimaryLabel = (icon: ReactNode, title: string) => (
   <div className="flex items-center text-[#cd1818]">
      {icon}
      <h1 className={`${classes.label} text-[#cd1818]`}>{title}</h1>
   </div>
);

export default function DetailPage() {
   const [product, setProduct] = useState<Product>(initProductDetailObject({}));
   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
   const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
   const [isOpenModal, setIsOpenModal] = useState(false);

   const openModalTarget = useRef<ModalTarget | "">("");

   const { category, key } = useParams();

   const handleOpenModal = (type: ModalTarget) => {
      openModalTarget.current = type;
      setIsOpenModal(true);
   };

   const SliderSkeleton = useMemo(() => <Skeleton className="w-full pt-[50%] rounded-[16px]" />, []);

   const BoxSkeleton = [...Array(2).keys()].map((item) => (
      <div key={item} className="col w-1/2 sm:w-1/3">
         <Skeleton className="h-[6rem] rounded-[6px]" />
      </div>
   ));

   const ProductInfoSkeleton = useMemo(
      () => (
         <>
            <Skeleton className="w-[300px] h-[26px] rounded-[6px] mb-[14px]" />
            <Skeleton className="w-[70px] h-[20px] rounded-[6px] mb-[6px]" />
            <div className="row">{BoxSkeleton}</div>

            <Skeleton className="w-[70px] h-[20px] rounded-[6px] mt-[14px] mb-[6px]" />
            <div className="row">{BoxSkeleton}</div>

            <Skeleton className="w-[70px] h-[20px] rounded-[6px] mt-[14px] mb-[6px]" />
            <Skeleton className="w-[200px] h-[34px] rounded-[6px] my-[6px]" />
            <Skeleton className="w-[160px] h-[24px] rounded-[6px] my-[6px]" />
         </>
      ),
      []
   );

   const isHaveProduct = useMemo(() => status === "success" && !!product, [status, product]);

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;
      switch (openModalTarget.current) {
         case "add-comment":
            return (
               <AddCommentModal
                  state={{} as CommentStateType}
                  setState={() => {}}
                  target="Add-Comment"
                  setIsOpenModal={setIsOpenModal}
                  product={product}
               />
            );
         case "add-review":
            return <AddReviewModal target="Add-Review" setIsOpenModal={setIsOpenModal} product={product} />;
         case "confirm-login":
            return (
               <>
                  <ModalHeader title={"Đăng nhập dùm cái"} setIsOpenModal={setIsOpenModal} />
                  <p className="text-[16px] text-[#333]">Không đăng nhập mà mua thì tao lấy cái gì lưu ???</p>
                  <div className="text-center mt-[30px]">
                     <Button isLoading={false} onClick={() => setIsOpenModal(false)} primary>
                        Ok
                     </Button>
                  </div>
               </>
            );
      }
   }, [isOpenModal]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            if (!category || !key) return;
            setStatus("loading");
            const data = await productServices.getProductDetail({ id: key });
            setProduct(data);

            console.log("check data", data.comments_data);

            setStatus("success");
         } catch (error) {
            setStatus("error");
         }
      };

      fetchData();
   }, [key]);

   if (status === "error" || (status === "success" && !product)) return <h1>Some thing went wrong</h1>;

   return (
      <>
         <div className="flex flex-wrap mt-[10px] md:mx-[-12px]">
            <div className="w-full mb-[20px] md:mb-0 md:w-7/12 md:px-[12px]">
               {status === "loading" && SliderSkeleton}
               {status === "success" && <ImageSlider className="pt-[50%]" data={sliderImages} />}
            </div>
            <div className={"w-full md:w-5/12 md:px-[12px]"}>
               {status === "loading" && ProductInfoSkeleton}

               {isHaveProduct && (
                  <>
                     <h1 className={classes.proName}>{product.product_name}</h1>
                     <div className="mt-[20px]">
                        <ProductVariantList
                           setSliderImages={setSliderImages}
                           productData={product}
                           // colors={product.colors_data}
                           // combines={product.combines_data}
                           // storages={product.storages_data}
                           // sliders={product.sliders_data}
                           query={"23434"}
                        />
                     </div>
                  </>
               )}

               <div className="mt-[40px]">
                  {PrimaryLabel(<TagIcon className="w-[24px] mr-[8px]" />, "Chính sách bảo hành")}
                  <div className="mt-[10px]">
                     <Policy loading={status === "loading"} />
                  </div>
               </div>
            </div>
         </div>

         <div className=" md:mt-[60px] flex flex-wrap-reverse md:mx-[-12px]">
            <div className={"w-full mt-[40px] md:mt-0 md:w-2/3 flex-shrink-0 md:px-[12px]"}>
               {PrimaryLabel(<DocumentTextIcon className="w-[24px] mr-[8px]" />, `Chi tiết ${product.product_name}`)}
               <div className="mt-[20px]">
                  <ContentSection loading={status === "loading"} detail={product.detail} />
               </div>
            </div>
            <div className="w-full mt-[40px] md:mt-0 md:w-1/3 flex-shrink-0 md:px-[12px]">
               <div className="flex items-center text-[#cd1818]">
                  <Cog6ToothIcon className="w-[24px] mr-[8px]" />
                  <h1 className={`${classes.label} text-[#cd1818]`}>Cấu hình {product.product_name || ""}</h1>
               </div>
               <div className="mt-[20px] spec-table">
                  <SpecSection loading={status === "loading"} product={product} />
               </div>
            </div>
         </div>

         <div className="mt-[40px] md:mt-[60px]">
            <div className="md:flex-row md:gap-0 flex flex-col space-y-[8px] justify-between items-top mb-[30px]">
               {PrimaryLabel(<StarIcon className="w-[24px] mr-[8px]" />, `Đánh giá về ${product.product_name}`)}
               <Button onClick={() => handleOpenModal("add-review")} primary>
                  <PlusIcon className="mr-[8px] w-[24px]" />
                  Viết đánh giá
               </Button>
            </div>
            <RatingSection product_name_ascii={product.product_name_ascii} />
         </div>

         <div className="mt-[40px] md:mt-[60px]">
            <div className="flex flex-col space-y-[8px] justify-between items-top mb-[30px] md:flex-row md:gap-0">
               {PrimaryLabel(<ChatBubbleBottomCenterTextIcon className="w-[24px] mr-[8px]" />, `Hỏi đáp về ${product.product_name}`)}
               <Button onClick={() => handleOpenModal("add-comment")} primary>
                  <PlusIcon className="mr-[8px] w-[24px]" />
                  Thêm câu hỏi
               </Button>
            </div>
            <CommentSection product_name_ascii={product.product_name_ascii} />
         </div>

         <div className="mt-[40px] md:mt-[60px]">{PrimaryLabel(<BoltIcon className="mr-[8px] w-[24px]" />, `Sản phẩm gợi ý`)}</div>

         {isOpenModal && (
            <Modal z="z-[200]" setShowModal={setIsOpenModal}>
               {renderModal}
            </Modal>
         )}
      </>
   );
}
