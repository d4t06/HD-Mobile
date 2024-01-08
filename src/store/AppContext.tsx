import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { Brand, Category, SliderImage } from "@/types";

type StateType = {
   categories: Category[];
   brands: Record<string, Brand[]>;
   sliders: Record<string, SliderImage[]>;
   initLoading: boolean;
};

const initialState: StateType = {
   categories: [],
   sliders: {},
   brands: {},
   initLoading: true,
};

type ContextType = {
   state: StateType;
   setCategories: Dispatch<SetStateAction<StateType["categories"]>>;
   setBrands: Dispatch<SetStateAction<StateType["brands"]>>;
   setSliders: Dispatch<SetStateAction<StateType["sliders"]>>;
   setInitLoading: Dispatch<SetStateAction<StateType["initLoading"]>>;
};

const AppContext = createContext<ContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
   const [categories, setCategories] = useState<StateType["categories"]>([]);
   const [brands, setBrands] = useState<StateType["brands"]>({});
   const [sliders, setSliders] = useState<StateType["sliders"]>({});

   const [initLoading, setInitLoading] = useState(initialState["initLoading"]);

   return (
      <AppContext.Provider
         value={{
            state: { sliders, brands, categories, initLoading },
            setInitLoading,
            setSliders,
            setBrands,
            setCategories,
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
