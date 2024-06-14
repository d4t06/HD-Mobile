import { FilterType } from "@/store/filtersSlice";
import { Button } from "@/components";

type Props = {
   handleFilter: (sort: PriceRange | undefined) => void;
   data: PriceRange[];
   filters: FilterType;
};

export default function Radiobox({ filters, handleFilter, data }: Props) {
   const handleToggle = (item: PriceRange | "clear") => {
      if (item === "clear") {
         handleFilter(undefined);
      } else if (item) {
         handleFilter(item);
      }
   };

   if (!data) return "Data is undefined";

   return (
      <>
         <Button
            active={filters.price === undefined}
            onClick={() => handleToggle("clear")}
            colors={"second"}
            size={"clear"}
            fontWeight={"thin"}
            border={"thin"}
            className="py-[2px] px-[9px]"
         >
            Tất cả
         </Button>

         {data.map((item, index) => {
            const isChecked =
               filters.price === undefined ? false : item.id === filters.price.id;

            return (
               <Button
                  key={index}
                  active={isChecked}
                  onClick={() => handleToggle(item)}
                  colors={"second"}
                  size={"clear"}
                  fontWeight={"thin"}
                  border={"thin"}
                  className="py-[2px] px-[9px]"
               >
                  {item.label}
               </Button>
            );
         })}
      </>
   );
}
