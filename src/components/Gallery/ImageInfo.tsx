import { formatSize } from "@/utils/appHelper";
import { Button } from "..";

type Props = {
   image: ImageType | null;
   handleDeleteImage: () => void;
   fetching: boolean;
};

export default function ImageInfo({ image, handleDeleteImage, fetching }: Props) {
   return (
      <div
         className={"col hidden sm:block w-1/3 px-[8px] overflow-hidden border-l-[2px]"}
      >
         {image && (
            <div className="space-y-[20px]">
               <h2 className="break-words">{image.name}</h2>
               <ul className="space-y-[10px]">
                  <li>
                     <h4 className="font-[500] mb-[6px]">Image path:</h4>{" "}
                     <a target="blank" href={image.image_url}>
                        {image.image_url}
                     </a>
                  </li>
                  <li>
                     <h4 className="font-[500] mb-[6px]">Size:</h4>{" "}
                     {formatSize(image.size)}
                  </li>
               </ul>
               <Button
                  colors={"third"}
                  size={"clear"}
                  className="py-[5px] px-[40px]"
                  loading={fetching}
                  onClick={handleDeleteImage}
               >
                  Xóa
               </Button>
            </div>
         )}
      </div>
   );
}
