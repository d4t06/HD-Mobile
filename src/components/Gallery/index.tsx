import { useEffect, useState, useRef, ChangeEvent, Dispatch, SetStateAction } from "react";
import classNames from "classnames/bind";

import { Button } from "../";

import styles from "./Gallery.module.scss";
import usePrivateRequest from "@/hooks/usePrivateRequest";
import { ImageType } from "@/types";

const cx = classNames.bind(styles);

type Props = {
   setImageUrl: (image_url: string) => void;
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
};

function Gallery({ setImageUrl, setIsOpenModal }: Props) {
   const [images, setImages] = useState<ImageType[]>([]);
   const [active, setActive] = useState<ImageType>();

   const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
   const [apiLoading, setApiLoading] = useState(false);

   const ranUseEffect = useRef(false);

   const privateRequest = usePrivateRequest();

   const formatSize = (size: number) => {
      const units = ["Kb", "Mb"];
      let mb = 0;

      if (size < 1024) return size + units[mb];
      while (size > 1024) {
         size -= 1024;
         mb++;
      }

      return mb + "," + size + units[1];
   };

   const handleChoose = () => {
      if (!active) return;

      setImageUrl(active.image_url);
      // console.log(setIsOpenModal);
      setIsOpenModal(false);
   };

   const handleUploadImages = async (e: ChangeEvent<HTMLInputElement>) => {
      try {
         setApiLoading(true);
         const inputEle = e.target as HTMLInputElement & { files: FileList };
         const fileLists = inputEle.files;

         const formData = new FormData();
         formData.append("image", fileLists[0]);

         const controller = new AbortController();

         const res = await privateRequest.post("/images", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            signal: controller.signal,
         });

         const newImage = res.data.image as ImageType;
         if (newImage) {
            setImages((prev) => [newImage, ...prev]);
         }
      } catch (error) {
         console.log({ message: error });
      } finally {
         setApiLoading(false);
      }
   };

   const handleDeleteImage = async () => {
      try {
         if (!active || !active.image_file_path) return;

         setApiLoading(true);
         const controller = new AbortController();

         await privateRequest.post(`/images/delete`, active, {
            signal: controller.signal,
         });

         const newImages = images.filter((image) => image.image_file_path !== active.image_file_path);
         setImages(newImages);

         return () => {
            controller.abort();
         };
      } catch (error) {
         console.log({ message: error });
      } finally {
         setApiLoading(false);
      }
   };

   const getImages = async () => {
      try {
         const res = await privateRequest.get("/images"); //res.data
         setImages(res.data);
         setStatus("success");
      } catch (error) {
         console.log({ message: error });
         setStatus("error");
      }
   };

   useEffect(() => {
      if (!ranUseEffect.current) {
         ranUseEffect.current = true;
         getImages();
      }
   }, []);

   return (
      <div className={cx("gallery")}>
         <div className={cx("gallery__top")}>
            <div className={cx("left")}>
               <h1>Images</h1>
               <div>
                  <label className={cx("input-label")} htmlFor="input-file">
                     <i className="material-icons">add</i>
                     Upload
                  </label>
                  <input
                     className={cx("input-file")}
                     id="input-file"
                     name="input-file"
                     type="file"
                     onChange={handleUploadImages}
                  />
               </div>
            </div>

            <Button className={cx("choose-image-btn")} disable={!active} rounded fill onClick={handleChoose}>
               Chọn
            </Button>
         </div>
         <div className={cx("gallery__body")}>
            <div className={cx("row", "container")}>
               <div className={cx("col col-8", "left")}>
                  {status === "loading" && <h1>Loading...</h1>}

                  {status !== "loading" && (
                     <>
                        {status === "success" ? (
                           <div className="row">
                              {!!images?.length &&
                                 images?.map((item, index) => {
                                    return (
                                       <div key={index} className={cx("col col-3", "gallery-item")}>
                                          <div
                                             onClick={() => setActive(item)}
                                             className={cx("image-frame", {
                                                active: active ? active.image_url === item.image_url : false,
                                             })}
                                          >
                                             <img src={item.image_url} alt="img" />
                                          </div>
                                       </div>
                                    );
                                 })}
                           </div>
                        ) : (
                           <h1>Some thing went wrong</h1>
                        )}
                     </>
                  )}
               </div>
               <div className={cx("col col-4", "image-info-container")}>
                  {active && (
                     <div className={cx("image-info")}>
                        <h2>{active.name}</h2>
                        <ul>
                           <li>
                              <h4>Image path:</h4>{" "}
                              <a target="blank" href={active.image_url}>
                                 {active.image_url}
                              </a>
                           </li>
                           <li>
                              <h4>Size:</h4> {formatSize(active.size)}
                           </li>
                        </ul>
                        <Button fill rounded onClick={handleDeleteImage}>
                           Xóa
                        </Button>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}

export default Gallery;
