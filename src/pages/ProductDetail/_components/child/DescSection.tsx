import HTMLReactParser from "html-react-parser/lib/index";
import { useEffect, useRef, useState } from "react";

// import "../styles.scss";
import Skeleton from "@/components/Skeleton";
import PushButton from "@/components/ui/PushButton";

import styles from "./DescSection.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(styles);

type Props = {
   product: ProductDetail | null;
   loading: boolean;
};

export default function DescSection({ product, loading }: Props) {
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
         containerRef.current.style.maxHeight = specTableHeight + "px";
      }
   }, [loading, updatedHeight]);

   return (
      <>
         <div
            ref={containerRef}
            className={`${cx("content-container")} relative overflow-hidden`}
         >
            {(loading || !updatedHeight) && (
               <Skeleton className="w-full h-[500px] rounded-[12px]" />
            )}

            {!loading && updatedHeight && (
               <>
                  {HTMLReactParser(product?.description.content || "")}
                  {!isShowMore && (
                     <div
                        className={`absolute w-full bottom-0 h-[150px] ${cx(
                           "blur-block"
                        )}`}
                     ></div>
                  )}
               </>
            )}
         </div>

         {!loading && updatedHeight && !isShowMore && (
            <p className="text-center">
               <PushButton onClick={handleShowMore}>Xêm thêm</PushButton>
            </p>
         )}
      </>
   );
}
