import { useRef, useState } from "react";
import Skeleton from "../Skeleton";
import simonCat from "@/assets/images/not-found.png";

type Props = {
   src?: string;
   className?: string;
   onError?: () => void;
};

export default function Image({ src, className = "", onError }: Props) {
   const [imageLoaded, setImageLoaded] = useState(false);
   const imageRef = useRef<HTMLImageElement>(null);

   const handleLoadImage = () => {
      setImageLoaded(true);
   };

   const defaultHandleError = () => {
      const imageEle = imageRef.current as HTMLImageElement;
      imageEle.src = simonCat;

      Object.assign(imageEle.style, {height: 'auto', width: 'auto' ,margin: 'auto'})
      
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
            className={`${className} ${!imageLoaded ? "hidden" : ""}`}
            src={src}
            ref={imageRef}
         />
      </>
   );
}
