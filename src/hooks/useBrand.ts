import { Brand, Category, CategorySliderSchema, CategoryAttribute, SliderSchema, PriceRange } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import { usePrivateRequest } from ".";
import { useToast } from "@/store/ToastContext";
import { useApp } from "@/store/AppContext";

type Props = {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
   curCategory: Category | undefined;
   curBrands: Brand[] | undefined;
};

const MANAGE_CAT_URL = "/category-management";
const MANAGE_CAT_ATTR_URL = "/category-attribute-management";
const MANAGE_CAT_PRICE_URL = "/category-price-management/prices";
const MANAGE_CAT_SLIDER_URL = "/slider-management/category_sliders";

const MANAGE_BRAND_URL = "/brand-management";
const MANAGE_SLIDER_URL = "/slider-management/sliders";

export default function useBrandAction({ setIsOpenModal, curCategory, curBrands }: Props) {
   const { categories, setCategories, setBrands } = useApp();
   const [apiLoading, setApiLoading] = useState(false);

   const privateRequest = usePrivateRequest();
   const { setSuccessToast, setErrorToast } = useToast();

   const deleteCategory = async (category?: Category) => {
      try {
         if (category === undefined) throw new Error("no have id");
         setApiLoading(true);

         await privateRequest.delete(`${MANAGE_CAT_URL}/${category.id}`);

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
               const catRes = await privateRequest.post(MANAGE_CAT_URL, category);

               // add attributes prop to category to fix error not found when add attribute
               const newCategoryData = { ...catRes.data, attributes: [] } as Category & { id: number };

               // add slider
               const sliderData: SliderSchema = {
                  slider_name: `Slider for category ${newCategoryData.category_name}`,
               };
               const sliderRes = await privateRequest.post(MANAGE_SLIDER_URL, sliderData, {
                  headers: { "Content-Type": "application/json" },
               });
               const newSliderData = sliderRes.data as SliderSchema & { id: number };

               // add category slider
               const categorySliderData: CategorySliderSchema = {
                  category_id: newCategoryData.id,
                  slider_id: newSliderData.id,
               };
               await privateRequest.post(MANAGE_CAT_SLIDER_URL, categorySliderData, {
                  headers: { "Content-Type": "application/json" },
               });

               setCategories((prev) => [...prev, newCategoryData]);
               break;
            case "Edit":
               if (curIndex === undefined || !!category.id) throw new Error("missing current index");
               setApiLoading(true);

               await privateRequest.put(`${MANAGE_CAT_URL}/${category.id}`, category);

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

               const brandRes = await privateRequest.post(MANAGE_BRAND_URL, brand);

               const newBrandData = brandRes.data.data as Brand;
               const newBrands = [...curBrands, newBrandData];
               setBrands((prev) => ({ ...prev, [curCategory.category_ascii]: newBrands }));
               break;

            case "Edit":
               if (curCategory === undefined || curBrands === undefined) throw new Error("Current not found");
               if (curIndex === undefined || !brand.id) throw new Error("missing current index");
               setApiLoading(true);

               await privateRequest.put(`${MANAGE_BRAND_URL}/${brand.id}`, brand);

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
         await privateRequest.delete(`${MANAGE_BRAND_URL}/${targetBrand.id}`);

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

   const updateCategoryPriceRange = (categories: Category[], priceRanges: PriceRange[], curCategory: Category) => {
      if (curCategory.price_ranges == undefined) throw new Error("Price ranges is undefined");
      const newCategories = [...categories];

      const index = newCategories.findIndex((c) => c.category_ascii === curCategory.category_ascii);

      newCategories[index] = { ...curCategory, price_ranges: priceRanges } as Category;
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

               const res = await privateRequest.post(MANAGE_CAT_ATTR_URL, attribute);
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

               await privateRequest.put(`${MANAGE_CAT_ATTR_URL}/${attribute.id}`, attribute);

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
         await privateRequest.delete(`${MANAGE_BRAND_URL}/${targetAttr.id}`);

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

   const addPriceRange = async (price: PriceRange, type: "Add" | "Edit", curIndex?: number) => {
      try {
         switch (type) {
            case "Add":
               if (curCategory === undefined || curCategory.price_ranges === undefined)
                  throw new Error("Cur category is undefine");

               setApiLoading(true);

               const res = await privateRequest.post(MANAGE_CAT_PRICE_URL, price);
               const newPriceRangeData = res.data.data as PriceRange & { id: number };

               const newPriceRanges = [...curCategory.price_ranges, newPriceRangeData];
               const newCategories = updateCategoryPriceRange(categories, newPriceRanges, curCategory);

               setCategories(newCategories);
               break;
            case "Edit":
               if (
                  curIndex === undefined ||
                  !!price.id ||
                  curCategory == undefined ||
                  curCategory.price_ranges == undefined
               )
                  throw new Error("missing current index");
               setApiLoading(true);

               await privateRequest.put(`${MANAGE_CAT_PRICE_URL}/${price.id}`, price);

               const _newPriceRanges = [...curCategory?.price_ranges];
               _newPriceRanges[curIndex] = price;

               const _newCategories = updateCategoryPriceRange(categories, _newPriceRanges, curCategory);

               setCategories(_newCategories);
         }
         setSuccessToast(`${type} price range successful`);
      } catch (error) {
         console.log({ message: error });
         setErrorToast(`${type} price range fail`);
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const deletePriceRange = async (curIndex?: number) => {
      try {
         if (curIndex === undefined || curCategory === undefined || curCategory.price_ranges === undefined)
            throw new Error("no have id");

         const curPriceRange = [...curCategory.price_ranges];
         const targetPriceRange = curPriceRange[curIndex];

         setApiLoading(true);
         await privateRequest.delete(`${MANAGE_BRAND_URL}/${targetPriceRange.id}`);

         const newPriceRanges = curPriceRange.filter((b) => b.id !== targetPriceRange.id);
         const newCategories = updateCategoryPriceRange(categories, newPriceRanges, curCategory);

         setCategories(newCategories);
         setSuccessToast(`Delete price range '${targetPriceRange.label}' successful`);
      } catch (error) {
         console.log({ message: error });
         setSuccessToast(`Delete price range fail`);
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   return {
      deleteBrand,
      deleteCategory,
      addCategory,
      addBrand,
      deleteAttribute,
      addAttribute,
      addPriceRange,
      deletePriceRange,
      apiLoading,
   };
}
