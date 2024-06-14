import Skeleton from "@/components/Skeleton";
import { selectCategory } from "@/store/categorySlice";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import CategorySliderItem from "./_components/CategorySliderItem";

export default function Banner() {
   const { categories, status } = useSelector(selectCategory);

   const classes: Partial<LayoutClasses> = {
      group: "p-[20px] rounded-[12px] bg-[#fff]",
      label: "text-[24px] mb-[30px]",
   };

   const Skeletons = [...Array(3).keys()].map((index) => (
      <Skeleton key={index} className="w-full mb-[30px] rounded-[14px] h-[300px]" />
   ));
   const content = useMemo(
      () =>
         !!categories.length &&
         categories.map((item, index) => (
            <div key={index} className={classes.group}>
               <CategorySliderItem category={item} categoryIndex={index} />
            </div>
         )),
      [categories]
   );

   return (
      <>
         <div className={classes.label}>Banner</div>

         {status === "loading" && Skeletons}

         <div className="space-y-[30px]">{status === "success" && content}</div>

         {status === "error" && <p>Some things went wrong ¯\_(ツ)_/¯</p>}
      </>
   );
}
