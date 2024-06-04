import {
   Dispatch,
   ReactNode,
   SetStateAction,
   createContext,
   useContext,
   useState,
} from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type StateType = {
   auth: {
      token: string;
      username: string;
      role: string;
   } | null;
   loading: boolean;
   persist: boolean;
};

// const initialState: StateType = {
//    auth: { token: "" },
//    persist: false,
//    loading: false,
// };

type ContextType = {
   state: StateType;
   setAuth: Dispatch<SetStateAction<StateType["auth"]>>;
   setPersist: Dispatch<SetStateAction<boolean>>;
   setLoading: Dispatch<SetStateAction<boolean>>;
};

const AuthContext = createContext<ContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [auth, setAuth] = useState<StateType["auth"] | null>(null);
   const [loading, setLoading] = useState(true);
   const [persist, setPersist] = useLocalStorage("persist", false);

   return (
      <AuthContext.Provider
         value={{ state: { auth, persist, loading }, setAuth, setLoading, setPersist }}
      >
         {children}
      </AuthContext.Provider>
   );
};
const useAuth = () => {
   const context = useContext(AuthContext);
   if (!context) throw new Error("Auth Context not found");

   const {
      state: { ...restState },
      ...restSetState
   } = context;
   return { ...restState, ...restSetState };
};

export default AuthProvider;
export { useAuth };
