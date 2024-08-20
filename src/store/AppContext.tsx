import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useMemo,
   useState,
} from "react";
import { useParams } from "react-router-dom";

type StateType = {
   categories: Category[];
   // brands: Record<string, Brand[]>;
   // sliders: Record<string, SliderImage[]>;
   // priceRanges: Record<string,PriceRange[]>;
   status: "loading" | "success" | "error";
};

const initialState: StateType = {
   categories: [],
   // priceRanges: {},
   // sliders: {},
   // brands: {},
   status: "loading",
};

type ContextType = {
   state: StateType;
   setCategories: Dispatch<SetStateAction<StateType["categories"]>>;
   // setBrands: Dispatch<SetStateAction<StateType["brands"]>>;
   // setPriceRanges: Dispatch<SetStateAction<StateType["priceRanges"]>>;
   // setSliders: Dispatch<SetStateAction<StateType["sliders"]>>;
   setStatus: Dispatch<SetStateAction<StateType["status"]>>;
};

const AppContext = createContext<ContextType | undefined>(undefined);

const AppProvider = ({ children }: { children: ReactNode }) => {
   const [categories, setCategories] = useState<StateType["categories"]>([]);
   // const [brands, setBrands] = useState<StateType["brands"]>({});
   // const [sliders, setSliders] = useState<StateType["sliders"]>({});
   // const [priceRanges, setPriceRanges] = useState<StateType["priceRanges"]>({});

   const [status, setStatus] = useState(initialState["status"]);

   return (
      <AppContext.Provider
         value={{
            state: { categories, status },
            setStatus,
            // setSliders,
            // setBrands,
            setCategories,
            // setPriceRanges,
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
      state: { categories, ...restState },
      ...restSetState
   } = context;

   const { category_ascii } = useParams<{ category_ascii: string }>();

   const currentCategory = useMemo(
      () => categories.find((c) => c.name_ascii === category_ascii),
      [category_ascii, categories]
   );

   return { ...restState, categories, currentCategory, ...restSetState };
};

export default AppProvider;
export { useApp };
