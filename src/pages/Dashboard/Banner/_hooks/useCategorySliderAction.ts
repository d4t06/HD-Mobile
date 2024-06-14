import { useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch } from "react-redux";
import { sleep } from "@/utils/appHelper";
import { setCategorySlider } from "@/store/categorySlice";

const URL = "/slider-images";

export default function useCategorySliderAction() {
   const [isFetching, setIsFetching] = useState(false);
   const dispatch = useDispatch();

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   type Add = {
      type: "Add";
      images: ImageType[];
      categoryIndex: number;
      sliderId: number;
   };

   type Edit = {
      type: "Edit";
      image: ImageType;
      index: number;
      sliderImage: SliderImageSchema;
      categoryIndex: number;
      id: number;
   };

   type Delete = {
      type: "Delete";
      id: number;
      index: number;
      categoryIndex: number;
   };

   type Props = Add | Edit | Delete;

   const actions = async ({ ...props }: Props) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         switch (props.type) {
            case "Add":
               const { images, categoryIndex, sliderId } = props;

               const schemas = props.images.map(
                  (image) =>
                     ({
                        image_id: image.id,
                        slider_id: sliderId,
                        link_to: "",
                     } as SliderImageSchema)
               );

               const res = await privateRequest.post(URL, schemas);

               const data = res.data.data as SliderImage[];
               const newSliderImages = data.map(
                  (sI, index) => ({ ...sI, image: images[index] } as SliderImage)
               );

               dispatch(
                  setCategorySlider({
                     type: "add",
                     sliderImages: newSliderImages,
                     categoryIndex,
                  })
               );

               break;
            case "Edit": {
               const { sliderImage, id, index, categoryIndex, image } = props;
               await privateRequest.put(`${URL}/${id}`, sliderImage);

               dispatch(
                  setCategorySlider({
                     type: "update",
                     sliderImage: { image, image_id: image.id },
                     index,
                     categoryIndex,
                  })
               );

               break;
            }

            case "Delete": {
               const { id, index, categoryIndex } = props;
               await privateRequest.delete(`${URL}/${id}`);
               dispatch(setCategorySlider({ type: "delete", index, categoryIndex }));
            }
         }
         setSuccessToast(`${props.type} slider image successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.type} slider image fail`);
      } finally {
         setIsFetching(false);
      }
   };

   return { isFetching, actions };
}
