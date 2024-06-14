import { ArrowPathIcon } from "@heroicons/react/24/outline";
import CategoryList from "./_components/CategoryList";
import BrandList from "./_components/BrandList";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import PriceRangeList from "./_components/PriceRangeList";
import AttributeList from "./_components/AttributeList";

const classes: LayoutClasses = {
   flexContainer: "flex gap-y-[8px] mx-[-4px] flex-wrap",
   flexCol: "px-[4px]",
   group: "p-[20px] rounded-[12px] bg-[#fff]",
   label: "text-[24px]",
};


export default function Category() {
   const { status } = useSelector(selectCategory);

   return (
      <div className="pb-[30px] space-y-[30px]">
         {status === "loading" && <ArrowPathIcon className="w-[24px] animate-spin" />}
         {status === "error" && <p>Some thing went wrong</p>}
         {status === "success" && (
            <>
               <CategoryList mainClasses={classes} />
               <BrandList mainClasses={classes} />
               <PriceRangeList mainClasses={classes} />
               <AttributeList mainClasses={classes} />
            </>
         )}
      </div>
   );
}
