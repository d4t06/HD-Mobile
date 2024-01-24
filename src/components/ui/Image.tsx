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
               <Skeleton className="w-full h-full" />
            </>
         )}
         <img
            onLoad={handleLoadImage}
            onError={handleError}
            className={`${classNames ? classNames : ""} ${!imageLoaded ? "hidden" : ""}`}
            src={src}
            ref={imageRef}
         />
      </>
   );
}
