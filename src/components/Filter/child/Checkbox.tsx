import { FilterType } from "@/store/filtersSlice";
import { Button } from "@/components";

type Props = {
   handleFilter: (brand: FilterType["brands"]) => void;
   filters: FilterType;
   data: Brand[];
};

export default function Checkbox({ handleFilter, filters, data }: Props) {
   const handleToggle = (value: Brand | "clear") => {
      let newBrands = [...filters.brands];

      if (value === "clear") newBrands = [];
      else {
         const index = newBrands.indexOf(value);

         if (index === -1) newBrands.push(value);
         else newBrands.splice(index, 1);
      }

      handleFilter(newBrands);
   };

   return (
      <>
         <Button
            active={!filters.brands.length}
            onClick={() => handleToggle("clear")}
            colors={"second"}
            size={"clear"}
            fontWeight={"thin"}
            border={"thin"}
            className="py-[2px] px-[9px]"
         >
            All
         </Button>
         {/* </div> */}
         {data.map((item, index) => {
            const i = filters.brands.findIndex((b) => b.id === item.id);
            const isChecked = i !== -1;
            return (
               <Button
                  colors={"second"}
                  border={"thin"}
                  size={"clear"}
                  fontWeight={"thin"}
                  className="py-[2px] px-[9px]"
                  key={index}
                  onClick={() => handleToggle(item)}
                  active={isChecked}
               >
                  {item.name}
               </Button>
            );
         })}
      </>
   );
}
