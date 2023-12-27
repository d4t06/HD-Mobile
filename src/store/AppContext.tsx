import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import { Brand, Category, ImageType } from "@/types";

type StateType = {
   categories: Category[];
   brands: Record<string, Brand[]>;
   banners: Record<string, ImageType[]>;
};

const initialState: StateType = {
   categories: [],
   banners: {},
   brands: {},
};

type ContextType = {
   state: StateType;
   setCategories: Dispatch<SetStateAction<StateType["categories"]>>;
   setBrands: Dispatch<SetStateAction<StateType["brands"]>>;
   setBanners: Dispatch<SetStateAction<StateType["banners"]>>;
};

const initialContext = {
   state: initialState,
   setCategories: () => {},
   setBrands: () => {},
   setBanners: () => {},
};

const AppContext = createContext<ContextType>(initialContext);

const AppProvider = ({ children }: { children: ReactNode }) => {
   const [categories, setCategories] = useState<StateType["categories"]>([]);
   const [brands, setBrands] = useState<StateType["brands"]>({});
   const [banners, setBanners] = useState<StateType["banners"]>({});

   return (
      <AppContext.Provider value={{ state: { banners, brands, categories }, setBanners, setBrands, setCategories }}>
         {children}
      </AppContext.Provider>
   );
};
const useApp = () => {
   const {
      state: { ...rest },
      setBanners,
      setBrands,
      setCategories,
   } = useContext(AppContext);
   return { ...rest, setBanners, setBrands, setCategories };
};

export default AppProvider;
export { useApp };
