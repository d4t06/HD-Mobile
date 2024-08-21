import { useEffect, useRef, useState } from "react";
import { usePrivateRequest } from ".";
import { useImage } from "@/store/ImageContext";
import { sleep } from "@/utils/appHelper";

const IMAGE_URL = "/images";

export default function useGalleryAction() {
   const { currentImages, storeImages } = useImage();

   const [imageStatus, setImageStatus] = useState<
      "fetching" | "deleting" | "success" | "error" | ""
   >("");

   const [fetching, setFetching] = useState(false);
   const ranUseEffect = useRef(false);

   //    hooks
   const privateRequest = usePrivateRequest();

   const deleteImage = async (publicId: string) => {
      try {
         setFetching(true);
         const controller = new AbortController();

         await privateRequest.delete(`${IMAGE_URL}/${encodeURIComponent(publicId)}`);

         const newImages = currentImages.filter((image) => image.public_id !== publicId);
         storeImages({ currentImages: newImages });

         return () => {
            controller.abort();
         };
      } catch (error) {
         console.log({ message: error });
      } finally {
         setFetching(false);
      }
   };

   type getImagesRes = {
      page: number;
      images: ImageType[];
      page_size: number;
      count: number;
   };

   const getImages = async (page: number) => {
      try {
         setImageStatus("fetching");
         if (import.meta.env.DEV) await sleep(300);

         const res = await privateRequest.get(`${IMAGE_URL}?page=${page}&size=6`);
         const data = res.data.data as getImagesRes;

         const newImages = [...currentImages, ...data.images];

         storeImages({
            count: data.count,
            page_size: data.page_size,
            page: data.page,
            currentImages: newImages,
         });

         setImageStatus("success");
      } catch (error) {
         console.log({ message: error });
         setImageStatus("error");
      }
   };

   useEffect(() => {
      if (currentImages.length) return;

      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getImages(1);
      }
   }, []);

   return { getImages, deleteImage, imageStatus, fetching };
}
