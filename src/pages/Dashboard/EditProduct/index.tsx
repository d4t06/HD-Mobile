import useGetProductDetail from "@/hooks/useGetProductDetail";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import Variant from "./_components/Variant";
import Color from "./_components/Color";

import Slider from "./_components/Slider";
import Combine from "./_components/Combine";
import Specification from "./_components/Secification";
import Description from "./_components/Description";
import ProductImage from "./_components/ProductImage";
import DangerZone from "./_components/DangerZone";

function EditProductMain() {
   const { status, productDetail } = useGetProductDetail();

   const classes = {
      proName: "text-[26px] font-[500]",
   };

   const mainClasses: LayoutClasses = {
      flexContainer: "flex mt-[-8px] mx-[-4px] flex-wrap",
      flexCol: "px-[4px] mt-[8px]",
      group: "p-[20px] rounded-[12px] bg-[#fff]",
      label: "text-[24px]",
   };

   if (status === "loading") return <ArrowPathIcon className="w-[24px] animate-spin" />;
   if (status === "error" || !productDetail)
      return <p className="text-[16px] text-[#333}">Some thing went wrong...</p>;

   return (
      <div className="space-y-[30px]">
         <h1 className={`${classes.proName}`}>{productDetail.product}</h1>

         <ProductImage />
         <Variant mainClasses={mainClasses} />
         <Color mainClasses={mainClasses} />
         <Slider mainClasses={mainClasses} />
         <Combine mainClasses={mainClasses} />
         <Specification mainClasses={mainClasses} />
         <Description mainClasses={mainClasses} />
         <DangerZone productAscii={productDetail.product_ascii} />
      </div>
   );
}

export default EditProductMain;
