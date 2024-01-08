import { ReactNode, createContext, useContext, useState } from "react";
import { Product } from "@/types";

type StateType = {
   productData: Product;
};

// const initialState: StateType = {
//    productData: initProductObject({}),
// };

type ContextType = {
   state: StateType;
};

// const initialContext = {
//    state: initialState,
// };

const ProductDataContext = createContext<ContextType | undefined>(undefined);

const ProductDataProvider = ({ children, initialState }: { children: ReactNode; initialState: Product }) => {
   const [productData, _setProductData] = useState(initialState);

   return <ProductDataContext.Provider value={{ state: { productData } }}>{children}</ProductDataContext.Provider>;
};
const useProductContext = () => {
   const context = useContext(ProductDataContext);

   if (!context) throw new Error("Context not found");
   const {
      state: { productData },
   } = context;
   return { ...productData };
};

export default ProductDataProvider;
export { useProductContext };
