import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { Product } from "@/types";

type StateType = {
  productData: Product;
  setIsChange: Dispatch<SetStateAction<boolean>>;
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

type Props = {
  children: ReactNode;
  initialState: Product;
  setIsChange: Dispatch<SetStateAction<boolean>>;
};

const ProductDataProvider = ({ children, initialState, setIsChange }: Props) => {
  const [productData, _setProductData] = useState(initialState);

  return (
    <ProductDataContext.Provider value={{ state: { productData, setIsChange } }}>
      {children}
    </ProductDataContext.Provider>
  );
};
const useProductContext = () => {
  const context = useContext(ProductDataContext);

  if (!context) throw new Error("Context not found");
  const {
    state: { productData, setIsChange },
  } = context;
  return { ...productData, setIsChange };
};

export default ProductDataProvider;
export { useProductContext };
