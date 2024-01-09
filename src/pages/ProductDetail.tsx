import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, ImageSlider } from "@/components";
import * as productServices from "../services/productServices";
import { Product, SliderImage } from "@/types";
import Skeleton from "@/components/Skeleton";
import ProductVariantList from "@/components/ProductVariantList";
import { initProductDetailObject } from "@/utils/appHelper";

function DetailPage() {
   const [product, setProduct] = useState<Product>(initProductDetailObject({}));
   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
   const [sliderImages, setSliderImages] = useState<SliderImage[]>([]);

   const useEffectRan = useRef(false);

   const { category, key } = useParams();

   const SliderSkeleton = useMemo(() => <Skeleton className="w-full pt-[75%] rounded-[16px]" />, []);
   const ProductInfoSkeleton = useMemo(
      () => (
         <>
            <Skeleton className="w-[300px] h-[26px] rounded-[6px] mb-[14px]" />
            <Skeleton className="w-[50px] h-[20px] rounded-[6px] mb-[4px]" />
            <div className="row">
               {[...Array(2).keys()].map((item) => (
                  <div key={item} className="col col-4">
                     <Skeleton className="h-[6rem] rounded-[6px]" />
                  </div>
               ))}
            </div>

            <Skeleton className="w-[50px] h-[20px] rounded-[6px] mt-[14px] mb-[4px]" />
            <div className="row">
               {[...Array(2).keys()].map((item) => (
                  <div key={item} className="col col-4">
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
   const isHaveProduct = useMemo(() => status === "success" && !!product, [status, product]);

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

   if (status === "error" || (status === "success" && !product)) return <h1>Some thing went wrong</h1>;

   return (
      <>
         <div className="row pt-[30px]">
            <div className="col w-full md:w-1/2">
               {status === "loading" && SliderSkeleton}
               {status === "success" && <ImageSlider className="pt-[100%]" data={sliderImages} />}
            </div>
            <div className={"col  w-full md:w-1/2"}>
               {status === "loading" && ProductInfoSkeleton}

               {isHaveProduct && (
                  <>
                     <h1 className={"leading-[1] text-[26px] font-bold mb-[14px]"}>{product.product_name}</h1>
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
                  <Button  disable={status === "loading"} primary className="w-[100%] mt-[14px] text-[18px]" onClick={() => {}}>
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

         <div className="row mt-[30px]">
            <div className="col w-full md:w-2/3">
               <div className="h-[500px] border">Review</div>
            </div>
            <div className="col  w-full md:w-1/3">
               <div className="h-[500px] border">Spec</div>
            </div>
         </div>

         <div className="mt-[30px] h-[500px] border">review</div>
      </>
   );
}
export default DetailPage;
