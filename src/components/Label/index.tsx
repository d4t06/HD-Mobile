import { useMemo } from "react";
import Skeleton from "../Skeleton";

export default function Label({
   categoryName,
   count,
   loading,
}: {
   count: number;
   categoryName: string | undefined;
   loading: boolean;
}) {
   const labelSkeleton = useMemo(() => {
      return <Skeleton className="w-[180px] h-[27px] rounded-[4px] mb-[6px]" />;
   }, []);

   if (loading) return labelSkeleton;

   return (
      <h1 className="text-xl font-[500]">
         {categoryName} {`( `}
         <span style={{ color: "#cd1818" }}>{!loading ? count : "- -"}</span>
         {` )`} products
      </h1>
   );
}
