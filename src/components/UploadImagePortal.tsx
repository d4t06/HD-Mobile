import { createPortal } from "react-dom";
import { useRef } from "react";
import useUploadImage from "@/hooks/useUploadImage";

function UploadImagePortal() {
   const inputRef = useRef<HTMLInputElement>(null);

   const { handleInputChange } = useUploadImage();

   const classes = {
      container: `upload portal fixed z-[199] bottom-[120px] right-[30px] max-[549px]:bottom-[unset] max-[540px]:top-[10px] max-[540px]:right-[10px]`,
   };

   return (
      <>
         {createPortal(
            <div className={classes.container}>
               <input
                  ref={inputRef}
                  onChange={handleInputChange}
                  type="file"
                  multiple
                  accept="image"
                  id="image_upload"
                  className="hidden"
               />
            </div>,
            document.getElementById("portals")!
         )}
      </>
   );
}

export default UploadImagePortal;
