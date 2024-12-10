import { usePrivateRequest } from "@/hooks";
import { selectedAllFilter, selectedAllProduct } from "@/store";
import { selectCategory } from "@/store/categorySlice";
import { FilterType, SortType } from "@/store/filtersSlice";
import {} from "@/store/productSlice";
import { setProducts, setStatus } from "@/store/productsSlice";
import { AppDispatch } from "@/store/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
   // setCurCategory: Dispatch<SetStateAction<Category | undefined>>;
   tab: string;
};

export default function useDashBoardProduct({ tab }: Props) {
   const dispatch = useDispatch<AppDispatch>();

   const { filters } = useSelector(selectedAllFilter);
   const { categories } = useSelector(selectCategory);

   const { page, count, products, status, category_id } = useSelector(selectedAllProduct);

   // const [isInitCategory, setIsInitCategory] = useState(false);

   const privateRequest = usePrivateRequest();

   type Params = {
      filters?: FilterType;
      category_id: number | undefined;
      page?: number;
      sort?: SortType;
      size?: number;
      variant: "replace" | "storing";
   };

   const getProducts = async (props: Params) => {
      const { variant, filters, sort, page = 1, ...rest } = props;
      const params: Record<string, string | string[] | number[] | number | undefined> = {
         page,
         ...rest,
         ...sort,
      };

      if (filters && filters.brands.length)
         params["brand_id"] = filters.brands.map((b) => b.id) as number[];

      if (props.variant === "replace") {
         dispatch(setStatus("loading"));
      } else dispatch(setStatus("more-loading"));

      const res = await privateRequest.get("/product-management/products", {
         params,
         paramsSerializer: {
            indexes: false,
         },
      });

      const payload = res.data.data as ProductResponse;
      if (products)
         dispatch(
            setProducts({
               variant,
               payload: {
                  category_id: payload.category_id || undefined,
                  count: payload.count,
                  page: payload.page,
                  pageSize: payload.page_size,
                  products: payload.products,
               },
            }),
         );
   };

   const getMore = async () => {
      await getProducts({
         page: page + 1,
         category_id,
         filters,
         variant: "storing",
      });
   };

   useEffect(() => {
      if (!categories.length) return;

      if (tab === "search") return;

      const handleGetProducts = async () => {
         const curCategory = categories.find((c) => c.name_ascii == tab);

         await getProducts({
            category_id: curCategory?.id,
            filters,
            size: 50,
            variant: "replace",
         });
      };

      handleGetProducts();

      // return () => {
      //    dispatch(storingFilters());
      // };
   }, [tab, categories]);

   // useEffect(() => {
   //    if (!categories.length) return;
   //    const localStorage = getLocalStorage();

   //    const categoryId = localStorage.categoryId;
   //    const foundedCategory = categoryId
   //       ? categories.find((c) => c.id === categoryId)
   //       : undefined;

   //    if (!foundedCategory) {
   //       setIsInitCategory(true);
   //       return;
   //    }

   //    setCurCategory(foundedCategory);
   //    setIsInitCategory(true);
   // }, [categories]);

   return { count, products, status, categories, getMore };
}
