import { ArrowPathIcon } from "@heroicons/react/24/outline";
import CategoryList from "./_components/CategoryList";
import BrandList from "./_components/BrandList";
import { useSelector } from "react-redux";
import { selectCategory } from "@/store/categorySlice";
import PriceRangeList from "./_components/PriceRangeList";
import AttributeList from "./_components/AttributeList";

// import './style.scss'

export default function Category() {
   const { status } = useSelector(selectCategory);

   return (
      <div className="pb-[30px] space-y-[30px]">
         {status === "loading" && <ArrowPathIcon className="w-[24px] animate-spin" />}
         {status === "error" && <p>Some thing went wrong</p>}
         {status === "success" && (
            <>
               <CategoryList />
               <BrandList />
               <PriceRangeList />
               <AttributeList />
            </>
         )}
      </div>
   );
}
