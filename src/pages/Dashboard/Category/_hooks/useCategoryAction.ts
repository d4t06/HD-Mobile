import { useState } from "react";
import { useToast } from "@/store/ToastContext";
import { usePrivateRequest } from "@/hooks";
import { useDispatch, useSelector } from "react-redux";
import { selectCategory, setCategory } from "@/store/categorySlice";

const CATEGORY_URL = "/categories";

export default function useCategoryAction() {
   const dispatch = useDispatch();
   const { categories } = useSelector(selectCategory);
   const [isFetching, setIsFetching] = useState(false);

   //    hooks
   const { setSuccessToast, setErrorToast } = useToast();
   const privateRequest = usePrivateRequest();

   type Add = {
      type: "Add";
      category: CategorySchema;
   };

   type Edit = {
      type: "Edit";
      category: CategorySchema;
      curIndex: number;
      category_id: number;
   };

   type Delete = {
      type: "Delete";
      category: Category;
   };

   type Props = Add | Edit | Delete;

   const actions = async ({ ...props }: Props) => {
      try {
         switch (props.type) {
            case "Add":
               const { category } = props;
               // add category
               const res = await privateRequest.post(`${CATEGORY_URL}`, category);

               // add attributes prop to category to fix error not found when add attribute
               //  const newCategoryData = {
               //     ...catRes.data,
               //  } as Category;

               //  // add slider
               //  const sliderData: SliderSchema = {
               //     slider_name: `Slider for category ${newCategoryData.category_name}`,
               //  };
               //  const sliderRes = await privateRequest.post(
               //     MANAGE_SLIDER_URL,
               //     sliderData,
               //     {
               //        headers: { "Content-Type": "application/json" },
               //     }
               //  );
               //  const newSliderData = sliderRes.data as SliderSchema & { id: number };

               // add category slider
               //  const categorySliderData: CategorySliderSchema = {
               //     category_id: newCategoryData.id,
               //     slider_id: newSliderData.id,
               //  };
               //  await privateRequest.post(
               //     `${CATEGORY_URL}/category-sliders`,
               //     categorySliderData,
               //     {
               //        headers: { "Content-Type": "application/json" },
               //     }
               //  );

               dispatch(setCategory({ type: "add", category: res.data.data }));
               break;
            case "Edit": {
               const { category, curIndex } = props;

               await privateRequest.put(`${CATEGORY_URL}/${props.category_id}`, category);
               dispatch(
                  setCategory({ type: "update", category: category, index: curIndex })
               );

               break;
            }

            case "Delete": {
               await privateRequest.delete(`${CATEGORY_URL}/${props.category.id}`);

               const newCategories = categories.filter((c) => c.id !== props.category.id);
               dispatch(setCategory({ type: "replace", categories: newCategories }));
            }
         }
         setSuccessToast(`${props.type} category successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${props.type} category fail`);
      } finally {
         setIsFetching(false);
         close();
      }
   };

   return { isFetching, actions };
}
