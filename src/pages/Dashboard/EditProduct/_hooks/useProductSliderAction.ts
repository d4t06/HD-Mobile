import { useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch } from "react-redux";
import { setSlider } from "@/store/productSlice";
import { sleep } from "@/utils/appHelper";

const URL = "/slider-images";

export default function useProductSliderAction() {
   const [isFetching, setIsFetching] = useState(false);
   const dispatch = useDispatch();

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   type Add = {
      type: "Add";
      images: ImageType[];
      colorIndex: number;
      color: ProductColor;
   };

   type Edit = {
      type: "Edit";
      image: ImageType;
      index: number;
      sliderImage: SliderImageSchema;
      colorIndex: number;
      id: number;
   };

   type Delete = {
      type: "Delete";
      id: number;
      index: number;
      colorIndex: number;
   };

   type Props = Add | Edit | Delete;

   const actions = async ({ ...props }: Props) => {
      try {
         setIsFetching(true);
         if (import.meta.env.DEV) await sleep(500);

         switch (props.type) {
            case "Add":
               const { images, colorIndex, color } = props;

               const schemas = props.images.map(
                  (image) =>
                     ({
                        image_id: image.id,
                        slider_id: color.product_slider.slider_id,
                        link_to: "",
                     } as SliderImageSchema)
               );

               const res = await privateRequest.post(URL, schemas);

               const data = res.data.data as SliderImage[];
               const newSliderImages = data.map(
                  (sI, index) => ({ ...sI, image: images[index] } as SliderImage)
               );

               dispatch(
                  setSlider({ type: "add", sliderImages: newSliderImages, colorIndex })
               );

               break;
            case "Edit": {
               const { sliderImage, id, index, colorIndex, image } = props;
               await privateRequest.put(`${URL}/${id}`, sliderImage);

               dispatch(
                  setSlider({
                     type: "update",
                     sliderImage: { image, image_id: image.id },
                     colorIndex,
                     index,
                  })
               );

               break;
            }

            case "Delete": {
               const { id, index, colorIndex } = props;
               await privateRequest.delete(`${URL}/${id}`);
               dispatch(setSlider({ type: "delete", index, colorIndex }));
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
