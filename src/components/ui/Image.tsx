import { useRef, useState } from "react";
import Skeleton from "../Skeleton";

type Props = {
   src?: string;
   classNames?: string;
   onError?: () => void;
};

export default function Image({ src, classNames, onError }: Props) {
   const [imageLoaded, setImageLoaded] = useState(false);
   const imageRef = useRef<HTMLImageElement>(null);

   const handleLoadImage = () => {
      setImageLoaded(true);

      if (!src) return;
      if (src?.includes("blob")) {
         URL.revokeObjectURL(src);
      }
   };

   const defaultHandleError = () => {
      const imageEle = imageRef.current as HTMLImageElement;
      imageEle.src = "https://placehold.co/100";
      setImageLoaded(true);
   };

   const handleError = () => {
      !!onError ? [onError(), defaultHandleError()] : defaultHandleError();
   };

   return (
      <>
         {!imageLoaded && (
            <>
               <Skeleton className="w-full h-0" />
            </>
         )}
         <img
            onLoad={handleLoadImage}
            onError={handleError}
            className={`${classNames ? classNames : ""} w-full ${!imageLoaded ? "hidden" : ""}`}
            src={src}
            ref={imageRef}
         />
      </>
   );
}
