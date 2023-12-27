import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

type StateType = {
   auth: {
      token: string;
   } | null;
   persist: boolean;
};

const initialState: StateType = {
   auth: null,
   persist: false,
};

type ContextType = {
   state: StateType;
   setAuth: Dispatch<SetStateAction<StateType["auth"]>>;
   setPersist: Dispatch<SetStateAction<boolean>>;
};

const initialContext = {
   state: initialState,
   setAuth: () => {},
   setPersist: () => {},
};

const AuthContext = createContext<ContextType>(initialContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
   const [auth, setAuth] = useState<StateType["auth"] | null>(null);
   const [persist, setPersist] = useLocalStorage("persist", false);

   return (
      <AuthContext.Provider value={{ state: { auth, persist }, setAuth, setPersist }}>{children}</AuthContext.Provider>
   );
};
const useAuth = () => {
   const {
      state: { auth, persist },
      setPersist,
      setAuth,
   } = useContext(AuthContext);
   return { auth, setAuth, persist, setPersist };
};

export default AuthProvider;
export { useAuth };
