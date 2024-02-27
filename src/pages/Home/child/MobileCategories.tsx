import { Category } from "@/types";
import { Link } from "react-router-dom";

type Props = {
   categories: Category[];
};

export default function MobileCategories({ categories }: Props) {
   return (
      <div className="hidden max-[768px]:block mt-[16px]">
         <h5 className="text-[18px] mb-[6px] font-[500]">Danh mục sản phẩm</h5>
         <div className="row overflow-auto !flex-nowrap">
            {categories.map((c, index) => (
               <div key={index} className="col flex-shrink-0 w-[120px]">
                  <div className="bg-[#8f1313] rounded-[8px] overflow-hidden relative pt-[100%] ">
                     <Link
                        className="bg-[#cd1818] mt-[6px] absolute inset-0 flex flex-col items-center justify-center text-white translate-y-[-6px] rounded-[8px]"
                        to={`/${c.category_name_ascii}`}
                     >
                        <span className="text-[14px] mt-[4px]">{c.category_name}</span>
                     </Link>
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
}
