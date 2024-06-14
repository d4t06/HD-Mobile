import { Button } from "@/components";

type Props = {
   categories: Category[];
};

export default function MobileCategories({ categories }: Props) {
   return (
      <div className="md:hidden">
         <h5 className="text-[18px] font-[500] mb-[8px]">Danh mục sản phẩm</h5>
         <div className="flex mx-[-4px] mt-[-8px] flex-wrap ">
            {categories.map(
               (c, index) =>
                  !c.hidden && (
                     <div key={index} className="px-[4px] mt-[8px] w-1/2">
                        <Button
                           colors={"third"}
                           className="w-full h-[60px]"
                           to={`/${c.category_ascii}`}
                        >
                           <span className="text-[14px] mt-[4px]">{c.category}</span>
                        </Button>
                     </div>
                  )
            )}
         </div>
      </div>
   );
}
