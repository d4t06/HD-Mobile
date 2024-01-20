import { Brand, Category, CategorySliderSchema, CategoryAttribute, SliderSchema } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { usePrivateRequest } from ".";
import { useToast } from "@/store/ToastContext";
import { useApp } from "@/store/AppContext";

type Props = {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
   curCategory: Category | undefined;
   curBrands: Brand[] | undefined;
};

const CAT_URL = "/app/categories";
const CAT_ATTR_URL = "/app/category-attributes";
const BRAND_URL = "/app/brands";
const SLIDER_URL = "/slider-management/sliders";
const CAT_SLIDER_URL = "/slider-management/category_sliders";

export default function useBrandAction({ setIsOpenModal, curCategory, curBrands }: Props) {
   const { categories, setCategories, setBrands } = useApp();
   const [apiLoading, setApiLoading] = useState(false);

   const privateRequest = usePrivateRequest();
   const { setSuccessToast, setErrorToast } = useToast();

   const deleteCategory = async (category?: Category) => {
      try {
         if (category === undefined) throw new Error("no have id");
         setApiLoading(true);

         await privateRequest.delete(`${CAT_URL}/${category.id}`);

         const newCategories = categories.filter((c) => c.id !== category.id);
         setCategories(newCategories);

         setSuccessToast(`Delete category '${category.category_name}' successful`);
      } catch (error) {
         console.log({ message: error });
         setSuccessToast(`Delete category fail`);
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const addCategory = async (category: Category, type: "Add" | "Edit", curIndex?: number) => {
      try {
         switch (type) {
            case "Add":
               setApiLoading(true);

               // add category
               const catRes = await privateRequest.post(CAT_URL, category);

               // add attributes prop to category to fix error not found when add attribute
               const newCategoryData = { ...catRes.data, attributes: [] } as Category & { id: number };

               // add slider
               const sliderData: SliderSchema = {
                  slider_name: `Slider for category ${newCategoryData.category_name}`,
               };
               const sliderRes = await privateRequest.post(SLIDER_URL, sliderData, {
                  headers: { "Content-Type": "application/json" },
               });
               const newSliderData = sliderRes.data as SliderSchema & { id: number };

               // add category slider
               const categorySliderData: CategorySliderSchema = {
                  category_id: newCategoryData.id,
                  slider_id: newSliderData.id,
               };
               await privateRequest.post(CAT_SLIDER_URL, categorySliderData, {
                  headers: { "Content-Type": "application/json" },
               });

               setCategories((prev) => [...prev, newCategoryData]);
               break;
            case "Edit":
               if (curIndex === undefined || !!category.id) throw new Error("missing current index");
               setApiLoading(true);

               await privateRequest.put(`${CAT_URL}/${category.id}`, category);

               const newCategories = [...categories];
               newCategories[curIndex] = category;
               setCategories(newCategories);
         }
         setSuccessToast(`${type} category successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${type} category fail`);
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const addBrand = async (brand: Brand, type: "Add" | "Edit", curIndex?: number) => {
      try {
         switch (type) {
            case "Add":
               if (curCategory === undefined || curBrands === undefined) throw new Error("Current not found");
               setApiLoading(true);

               const brandRes = await privateRequest.post(BRAND_URL, brand);

               const newBrandData = brandRes.data.data as Brand;
               const newBrands = [...curBrands, newBrandData];
               setBrands((prev) => ({ ...prev, [curCategory.category_ascii]: newBrands }));
               break;

            case "Edit":
               if (curCategory === undefined || curBrands === undefined) throw new Error("Current not found");
               if (curIndex === undefined || !brand.id) throw new Error("missing current index");
               setApiLoading(true);

               await privateRequest.put(`${BRAND_URL}/${brand.id}`, brand);

               const _newBrands = [...curBrands];
               _newBrands[curIndex] = brand;
               setBrands((prev) => ({ ...prev, [curCategory.category_ascii]: _newBrands }));
         }
         setSuccessToast(`${type} brand successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${type} brand fail`);
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const deleteBrand = async (curIndex?: number) => {
      try {
         if (curIndex === undefined || curBrands === undefined || curCategory === undefined)
            throw new Error("no have id");
         const targetBrand = curBrands[curIndex];

         setApiLoading(true);
         await privateRequest.delete(`${BRAND_URL}/${targetBrand.id}`);

         const newBrands = curBrands.filter((b) => b.id !== targetBrand.id);
         setBrands((prev) => ({ ...prev, [curCategory.category_ascii]: newBrands }));
         setSuccessToast(`Delete brand '${targetBrand.brand_name}' successful`);
      } catch (error) {
         console.log({ message: error });
         setSuccessToast(`Delete brand fail`);
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const updateCategoryAttrs = (categories: Category[], newAttrs: CategoryAttribute[], curCategory: Category) => {
      if (curCategory.attributes == undefined) throw new Error("Attributes is undefined");
      const newCategories = [...categories];

      const index = newCategories.findIndex((c) => c.category_ascii === curCategory.category_ascii);

      newCategories[index] = { ...curCategory, attributes: newAttrs } as Category;
      return newCategories;
   };

   const addAttribute = async (attribute: CategoryAttribute, type: "Add" | "Edit", curIndex?: number) => {
      try {
         switch (type) {
            case "Add":
               console.log("check current category", curCategory);

               if (curCategory === undefined || curCategory.attributes === undefined)
                  throw new Error("Current category is undefined");
               setApiLoading(true);

               const res = await privateRequest.post(CAT_ATTR_URL, attribute);
               const newAttrData = res.data.data as CategoryAttribute;
               const newCategoryAttrs = [...curCategory.attributes, newAttrData];

               const newCategories = updateCategoryAttrs(categories, newCategoryAttrs, curCategory);

               setCategories(newCategories);
               break;

            case "Edit":
               if (curCategory === undefined || curCategory.attributes === undefined)
                  throw new Error("Current category or attr  is undefined");
               if (curIndex === undefined) throw new Error("missing current index");

               setApiLoading(true);

               await privateRequest.put(`${CAT_ATTR_URL}/${attribute.id}`, attribute);

               //  update attribute with index
               const curAttrs = [...curCategory.attributes];
               curAttrs[curIndex] = { ...attribute };

               //  update category list
               const _newCategories = updateCategoryAttrs(categories, curAttrs, curCategory);
               console.log("check new categories", _newCategories);

               setCategories(_newCategories);
         }
         setSuccessToast(`${type} attribute successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${type} attribute fail`);
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const deleteAttribute = async (curIndex?: number) => {
      try {
         if (curIndex === undefined || curCategory === undefined || curCategory.attributes === undefined)
            throw new Error("no have id");

         const curAttrs = [...curCategory.attributes];
         const targetAttr = curAttrs[curIndex];

         setApiLoading(true);
         await privateRequest.delete(`${BRAND_URL}/${targetAttr.id}`);

         const newAttrs = curAttrs.filter((b) => b.id !== targetAttr.id);
         const newCategories = updateCategoryAttrs(categories, newAttrs, curCategory);

         setCategories(newCategories);
         setSuccessToast(`Delete attribute '${targetAttr.attribute}' successful`);
      } catch (error) {
         console.log({ message: error });
         setSuccessToast(`Delete attribute fail`);
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   return { deleteBrand, deleteCategory, addCategory, addBrand, deleteAttribute, addAttribute, apiLoading };
}
