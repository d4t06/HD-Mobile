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
      return <Skeleton className="w-[180px] h-[24px] rounded-[4px] mb-[15px]" />;
   }, []);

   if (loading) return labelSkeleton;

   return (
      <h1 className="mb-[15px] text-3xl">
         {categoryName} {`( `}
         <span style={{ color: "#cd1818" }}>{!loading ? count : "- -"}</span>
         {` )`} sản phẩm
      </h1>
   );
}
