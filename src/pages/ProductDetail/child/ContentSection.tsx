import { ProductDetail } from "@/types";
import HTMLReactParser from "html-react-parser/lib/index";
import { useEffect, useRef, useState } from "react";

import "../styles.scss";
import { Button } from "@/components";
import Skeleton from "@/components/Skeleton";

type Props = {
   detail: ProductDetail;
   loading: boolean;
};

export default function ContentSection({ detail, loading }: Props) {
   const containerRef = useRef<HTMLDivElement>(null);
   const [isShowMore, setIsShowMore] = useState(false);
   const [updatedHeight, setUpdatedHeight] = useState(false);

   const handleShowMore = () => {
      if (containerRef.current) {
         containerRef.current.style.maxHeight = "100%";
         setIsShowMore(true);
      }
   };

   useEffect(() => {
      if (loading) return;

      if (!updatedHeight) {
         setTimeout(() => setUpdatedHeight(true), 2000);
         return;
      }

      const specTable = document.querySelector(".spec-table") as HTMLDivElement;
      if (!specTable) return;

      const specTableHeight = specTable.clientHeight;
      if (specTableHeight && containerRef.current) {
         containerRef.current.style.maxHeight = specTableHeight - 32 + "px";
      }
   }, [loading, updatedHeight]);

   if (loading || !updatedHeight) return <Skeleton className="w-full h-[500px] rounded-[12px]" />;
   if (!detail) return <p className="text-[16px] text-[#333]">Detail not found</p>;

   return (
      <>
         <div ref={containerRef} className="content-container relative overflow-hidden">
            {HTMLReactParser(detail.content) || "..."}
            {!isShowMore && <div className="absolute w-full bottom-0 h-[150px] blur-block"></div>}
         </div>
         {!isShowMore && (
            <>
               <p className="text-center">
                  <Button className="leading-[20px]" primary onClick={handleShowMore}>
                     Xêm thêm
                  </Button>
               </p>
            </>
         )}
      </>
   );
}
