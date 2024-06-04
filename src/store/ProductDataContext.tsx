import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useState,
} from "react";


type StateType = {
   productData: Product;
   isChange: boolean;
};

type ContextType = {
   state: StateType;
   setEditorData: Dispatch<SetStateAction<Product>>;
   setIsChange: Dispatch<SetStateAction<boolean>>;
};

const ProductDataContext = createContext<ContextType | null>(null);

type Props = {
   children: ReactNode;
};

const ProductDataProvider = ({ children }: Props) => {
   const [editorData, setEditorData] = useState<Product>({} as Product);
   const [isChange, setIsChange] = useState(false);

   return (
      <ProductDataContext.Provider
         value={{
            state: { productData: editorData, isChange },
            setEditorData,
            setIsChange,
         }}
      >
         {children}
      </ProductDataContext.Provider>
   );
};
const useProductContext = () => {
   const context = useContext(ProductDataContext);

   if (!context) throw new Error("Context not found");
   const {
      state: { isChange, productData },
      setEditorData,
      setIsChange,
   } = context;

   return { ...productData, isChange, setIsChange, setEditorData };
};

export default ProductDataProvider;
export { useProductContext };
