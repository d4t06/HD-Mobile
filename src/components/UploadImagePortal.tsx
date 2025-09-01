import useUploadImage from "@/hooks/useUploadImage";
import { useImageContext } from "@/store/ImageContext";
import { useImperativeHandle } from "react";

function UploadImagePortal() {
   const { uploaderRef } = useImageContext();

   const { uploadImage } = useUploadImage();

   useImperativeHandle(uploaderRef, () => ({ upload: uploadImage }));

   return <></>;
}

export default UploadImagePortal;
