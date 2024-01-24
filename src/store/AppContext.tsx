import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { Brand, Category, PriceRange, SliderImage } from "@/types";

type StateType = {
   categories: Category[];
   brands: Record<string, Brand[]>;
   sliders: Record<string, SliderImage[]>;
   priceRanges: Record<string,PriceRange[]>;
   initLoading: boolean;
};

const initialState: StateType = {
   categories: [],
   priceRanges: {},
   sliders: {},
   brands: {},
   initLoading: true,
};

type ContextType = {
   state: StateType;
   setCategories: Dispatch<SetStateAction<StateType["categories"]>>;
   setBrands: Dispatch<SetStateAction<StateType["brands"]>>;
   setPriceRanges: Dispatch<SetStateAction<StateType["priceRanges"]>>;
   setSliders: Dispatch<SetStateAction<StateType["sliders"]>>;
   setInitLoading: Dispatch<SetStateAction<StateType["initLoading"]>>;
};

const AppContext = createContext<ContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
   const [categories, setCategories] = useState<StateType["categories"]>([]);
   const [brands, setBrands] = useState<StateType["brands"]>({});
   const [sliders, setSliders] = useState<StateType["sliders"]>({});
   const [priceRanges, setPriceRanges] = useState<StateType["priceRanges"]>({});

   const [initLoading, setInitLoading] = useState(initialState["initLoading"]);

   return (
      <AppContext.Provider
         value={{
            state: { sliders, priceRanges, brands, categories, initLoading },
            setInitLoading,
            setSliders,
            setBrands,
            setCategories,
            setPriceRanges,
         }}
      >
         {children}
      </AppContext.Provider>
   );
};
const useApp = () => {
   const context = useContext(AppContext);

   if (context == undefined) throw new Error("Context not found");

   const {
      state: { ...restState },
      ...restSetState
   } = context;
   return { ...restState, ...restSetState };
};

export default AppProvider;
export { useApp };
