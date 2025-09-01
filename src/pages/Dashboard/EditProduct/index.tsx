import useGetProductDetail from "@/hooks/useGetProductDetail";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

import Variant from "./_components/Variant";
import Color from "./_components/Color";

import Slider from "./_components/Slider";
import Combine from "./_components/Combine";
import Specification from "./_components/Secification";
import Description from "./_components/Description";
import ProductInfo from "./_components/ProductInfo";
import DangerZone from "./_components/DangerZone";

function EditProductMain() {
   const { status, productDetail } = useGetProductDetail();


   const mainClasses: LayoutClasses = {
      flexContainer: "flex -mt-2 -ml-2 flex-wrap",
      flexCol: "px-[4px] mt-[8px]",
      group: "p-[20px] rounded-[12px] bg-[#fff]",
      label: "text-lg sm:text-xl font-[500]",
   };

   if (status === "loading") return <ArrowPathIcon className="w-[24px] animate-spin" />;
   if (status === "error" || !productDetail)
      return <p className="text-[16px] text-[#333}">Some thing went wrong...</p>;

   return (
      <div className="space-y-[30px]">

         <ProductInfo />
         <Variant mainClasses={mainClasses} />
         <Color mainClasses={mainClasses} />
         <Slider mainClasses={mainClasses} />
         <Combine mainClasses={mainClasses} />
         <Specification mainClasses={mainClasses} />
         <Description mainClasses={mainClasses} />
         <DangerZone productId={productDetail.id} />
      </div>
   );
}

export default EditProductMain;
