import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, ImageSlider, Modal } from "@/components";
import * as productServices from "@/services/productServices";
import { Product, SliderImage } from "@/types";
import Skeleton from "@/components/Skeleton";
import ProductVariantList from "@/components/ProductVariantList";
import { initProductDetailObject } from "@/utils/appHelper";
import HTMLReactParser from "html-react-parser/lib/index";
import "./styles.scss";
import SpecSection from "./child/SpecSection";
import AddCommentModal from "@/components/Modal/AddComment";
import CommentSection from "./child/CommentSection";
import RatingSection from "./child/RatingSection";
import AddReviewModal from "@/components/Modal/AddReview";
import Image from "@/components/ui/Image";
import Policy from "./child/Policy";

type ModalTarget = "add-comment" | "add-review";

const classes = {
  proName: "leading-[1] text-[22px] font-bold text-[#333]",
  label: "text-[20px] font-semibold text-[#333]",
};

const Label = (icon: string, title: string) => (
  <div className="flex items-center text-[#cd1818]">
    <i className="material-icons mr-[8px]">{icon}</i>
    <h1 className={`${classes.label} text-[#cd1818]`}>{title}</h1>
  </div>
);

function DetailPage() {
  const [product, setProduct] = useState<Product>(initProductDetailObject({}));
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const useEffectRan = useRef(false);
  const openModalTarget = useRef<ModalTarget | "">("");

  const { category, key } = useParams();

  const handleOpenModal = (type: ModalTarget) => {
    openModalTarget.current = type;
    setIsOpenModal(true);
  };

  const SliderSkeleton = useMemo(
    () => <Skeleton className="w-full pt-[75%] rounded-[16px]" />,
    []
  );
  const ProductInfoSkeleton = useMemo(
    () => (
      <>
        <Skeleton className="w-[300px] h-[26px] rounded-[6px] mb-[14px]" />
        <Skeleton className="w-[50px] h-[20px] rounded-[6px] mb-[4px]" />
        <div className="row">
          {[...Array(2).keys()].map((item) => (
            <div key={item} className="col w-1/3">
              <Skeleton className="h-[6rem] rounded-[6px]" />
            </div>
          ))}
        </div>

        <Skeleton className="w-[50px] h-[20px] rounded-[6px] mt-[14px] mb-[4px]" />
        <div className="row">
          {[...Array(2).keys()].map((item) => (
            <div key={item} className="col w-1/3">
              <Skeleton className="h-[6rem] rounded-[6px]" />
            </div>
          ))}
        </div>

        <Skeleton className="w-[50px] h-[20px] rounded-[6px] mt-[14px] mb-[4px]" />
        <Skeleton className="w-[200px] h-[34px] rounded-[6px] my-[6px]" />
        <Skeleton className="w-[160px] h-[24px] rounded-[6px] my-[6px]" />
      </>
    ),
    []
  );
  const isHaveProduct = useMemo(
    () => status === "success" && !!product,
    [status, product]
  );

  const renderModal = useMemo(() => {
    if (!isOpenModal) return;
    switch (openModalTarget.current) {
      case "add-comment":
        return (
          <AddCommentModal
            target="Add-Comment"
            setIsOpenModal={setIsOpenModal}
            product={product}
          />
        );
      case "add-review":
        return (
          <AddReviewModal
            target="Add-Review"
            setIsOpenModal={setIsOpenModal}
            product={product}
          />
        );
    }
  }, [isOpenModal]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!category || !key) return;
        const data = await productServices.getProductDetail({ id: key });
        setProduct(data);

        console.log("check data", data.comments_data);

        setStatus("success");
      } catch (error) {
        setStatus("error");
      }
    };

    if (!useEffectRan.current) {
      fetchData();
      useEffectRan.current = true;
    }
  }, [key]);

  if (status === "error" || (status === "success" && !product))
    return <h1>Some thing went wrong</h1>;

  return (
    <>
      <div className="flex flex-wrap pt-[30px] md:mx-[-12]px">
        <div className="w-full mb-[20px] md:mb-0 md:w-7/12 md:px-[12px]">
          {status === "loading" && SliderSkeleton}
          {status === "success" && (
            <ImageSlider className="pt-[50%]" data={sliderImages} />
          )}
        </div>
        <div className={"w-full md:w-5/12 md:px-[12px]"}>
          {status === "loading" && ProductInfoSkeleton}

          {isHaveProduct && (
            <>
              <h1 className={classes.proName}>{product.product_name}</h1>
              <div className="mt-[20px]">
                <ProductVariantList
                  setSliderImages={setSliderImages}
                  colors={product.colors_data}
                  combines={product.combines_data}
                  storages={product.storages_data}
                  sliders={product.sliders_data}
                  query={"23434"}
                />
              </div>
            </>
          )}
          {/* <div className={"product-cta"}> */}
          <div className="mt-[14px] text-[18px] flex flex-col">
            <Button
              disable={status === "loading"}
              className="leading-[30px]"
              primary
              onClick={() => {}}
            >
              Mua Ngay
            </Button>
          </div>

          <div className="mt-[30px]">
            {Label('loyalty', 'Chính sách bảo hành')}
            <Policy />
          </div>
        </div>
      </div>

      <div className=" md:mt-[60px] flex flex-wrap-reverse md:mx-[-12px]">
        <div className={"w-full mt-[30px] md:mt-0 md:w-2/3 flex-shrink-0 md:px-[12px]"}>
          {Label("mode_edit", `Chi tiết ${product.product_name}`)}
          <div className="content-container mt-[20px]">
            {HTMLReactParser(product.detail.content) || "..."}
          </div>
        </div>
        <div className="w-full mt-[30px] md:mt-0 md:w-1/3 flex-shrink-0 md:px-[12px]">
          <div className="flex items-center text-[#cd1818]">
            <i className="material-icons mr-[8px]">settings</i>
            <h1 className={`${classes.label} text-[#cd1818]`}>
              Cấu hình {product.product_name}
            </h1>
          </div>
          <SpecSection product={product} />
        </div>
      </div>

      <div className="mt-[30px] md:mt-[60px]">
        <div className="md:flex-row md:gap-0 flex flex-col gap-[8px] justify-between items-top mb-[30px]">
          {Label("star", `Đánh giá về ${product.product_name}`)}
          <Button onClick={() => handleOpenModal("add-review")} primary>
            <i className="material-icons mr-[8px]">add</i>
            Viết đánh giá
          </Button>
        </div>
        {isHaveProduct && (
          <RatingSection product_name_ascii={product.product_name_ascii} />
        )}
      </div>

      <div className="mt-[30px] md:mt-[60px]">
        <div className="flex flex-col gap-[8px] justify-between items-top mb-[30px] md:flex-row md:gap-0">
          {Label("message", `Hỏi đáp về ${product.product_name}`)}
          <Button onClick={() => handleOpenModal("add-comment")} primary>
            <i className="material-icons mr-[8px]">add</i>
            Thêm câu hỏi
          </Button>
        </div>

        {isHaveProduct && (
          <CommentSection product_name_ascii={product.product_name_ascii} />
        )}
      </div>

      <div className="mt-[30px] md:mt-[60px]">
          {Label("flash_on", `Sản phẩm gợi ý`)}          

        {/* {isHaveProduct && (
          <CommentSection product_name_ascii={product.product_name_ascii} />
        )} */}
      </div>

      {isOpenModal && <Modal z="z-[200]" setShowModal={setIsOpenModal}>{renderModal}</Modal>}
    </>
  );
}
export default DetailPage;
