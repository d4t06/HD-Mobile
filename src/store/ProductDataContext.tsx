import { ReactNode, createContext, useContext, useState } from "react";
import { Product, ProductSchema } from "@/types";
import { initProductObject } from "@/utils/appHelper";

type StateType = {
   productData: ProductSchema;
};

const initialState: StateType = {
   productData: initProductObject({}),
};

type ContextType = {
   state: StateType;
};

const initialContext = {
   state: initialState,
};

const ProductDataContext = createContext<ContextType>(initialContext);

const ProductDataProvider = ({ children, initialState }: { children: ReactNode; initialState: Product }) => {
   const [productData, _setProductData] = useState(initialState);

   return <ProductDataContext.Provider value={{ state: { productData } }}>{children}</ProductDataContext.Provider>;
};
const useProductContext = () => {
   const {
      state: { productData },
   } = useContext(ProductDataContext);
   return { ...productData };
};

export default ProductDataProvider;
export { useProductContext };
