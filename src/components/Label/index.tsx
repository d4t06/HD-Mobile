import { useApp } from "@/store/AppContext";

export default function Label({ category, count, loading }: { count: number; category: string; loading: boolean }) {
   const { categories } = useApp();

   const getCatName = (category_id: string) => {
      const curCatData = categories.find((item) => item.category_name_ascii === category_id);
      return curCatData?.category_name;
   };

   return (
      <h1 className="mb-15">
         {getCatName(category)} {`( `}
         <span style={{ color: "#cd1818" }}>{!loading ? count : "- -"}</span>
         {` )`} sản phẩm
      </h1>
   );
}
