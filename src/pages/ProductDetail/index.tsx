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
import SpecTable from "./child/SpecTable";
import AddCommentModal from "@/components/Modal/AddComment";

type ModalTarget = "add-comment" | "";

function DetailPage() {
  const [product, setProduct] = useState<Product>(initProductDetailObject({}));
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);
  const [isOpenModal, setIsOpenModal] = useState(false);

  const useEffectRan = useRef(false);
  const openModalTarget = useRef<ModalTarget>("");

  const { category, key } = useParams();

  const handleOpemModal = (type: ModalTarget) => {
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
        return <AddCommentModal product={product} />;
    }
  }, [isOpenModal]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!category || !key) return;
        const data = await productServices.getProductDetail({ id: key });
        setProduct(data);
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

  console.log("check ", product.detail.content);

  const classes = {
    proName: "leading-[1] text-[22px] font-bold mb-[14px] text-[#333]",
  };

  if (status === "error" || (status === "success" && !product))
    return <h1>Some thing went wrong</h1>;

  return (
    <>
      <div className="row pt-[30px]">
        <div className="col w-full md:w-7/12">
          {status === "loading" && SliderSkeleton}
          {status === "success" && (
            <ImageSlider className="pt-[50%]" data={sliderImages} />
          )}
        </div>
        <div className={"col  w-full md:w-5/12"}>
          {status === "loading" && ProductInfoSkeleton}

          {isHaveProduct && (
            <>
              <h1 className={classes.proName}>{product.product_name}</h1>
              <ProductVariantList
                setSliderImages={setSliderImages}
                colors={product.colors_data}
                combines={product.combines_data}
                storages={product.storages_data}
                sliders={product.sliders_data}
                query={"23434"}
              />
            </>
          )}
          {/* <div className={"product-cta"}> */}
          <Button
            disable={status === "loading"}
            primary
            className="w-[100%] mt-[14px] text-[18px]"
            onClick={() => {}}
          >
            Mua Ngay
          </Button>
          {/* </div> */}
          {/* <div className={("product-policy")}>
                  <h1 className={("policy-title")}>Chính Sách Bảo Hành</h1>
                  <ul>
                     <li>
                        <div className={("icon-frame")}>
                           <div className={("policy-icon", "icon-doimoi")}></div>
                        </div>
                        <span>Hư gì đổi nấy 12 tháng tại 3384 siêu thị toàn quốc</span>
                     </li>
                     <li>
                        <div className={("icon-frame")}>
                           <div className={("policy-icon", "icon-baohanh")}></div>
                        </div>
                        <span>Bảo hành chính hãng điện thoại 12 tháng tại các trung tâm bảo hành hãng</span>
                     </li>
                     <li>
                        <div className={("icon-frame")}>
                           <div className={("policy-icon", "icon-box")}></div>
                        </div>
                        <span>Bộ sản phẩm gồm: Hộp, Sách hướng dẫn, Cây lấy sim, Cáp Type C</span>
                     </li>
                  </ul>
               </div> */}
        </div>
        {/* <ProductDetailItem  data={product} /> */}
      </div>

      <div className="row mt-[60px]">
        <div className={"content-container col w-full md:w-2/3"}>
          {HTMLReactParser(product.detail.content || "")}
        </div>
        <div className="col  w-full md:w-1/3">
          <SpecTable attrs={product.attributes_data} />
        </div>
      </div>

      <div className="mt-[60px]">
        <h1 className={classes.proName}>Đánh giá {product.product_name}</h1>
      </div>

      <div className="mt-[60px]">
        <div className="flex justify-between">
          <h1 className={classes.proName}>Hỏi đáp về {product.product_name}</h1>
          <Button onClick={() => handleOpemModal("add-comment")} primary>
            <i className="material-icons mr-[8px]">add</i>
            Thêm câu hỏi
          </Button>
        </div>
      </div>

      {isOpenModal && <Modal setShowModal={setIsOpenModal}>{renderModal}</Modal>}
    </>
  );
}
export default DetailPage;
