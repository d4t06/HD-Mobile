import { ReactNode, createContext, useContext, useRef, useState } from "react";

const useDrag = () => {
   const [isDrag, setIsDrag] = useState(false);
   const endIndexRef = useRef<number>(0);
   const startIndexRef = useRef<number>(0);

   return { isDrag, setIsDrag, endIndexRef, startIndexRef };
};

type ContextType = ReturnType<typeof useDrag>;

const Context = createContext<ContextType | null>(null);

export default function DragProvider({ children }: { children: ReactNode }) {
   return <Context.Provider value={useDrag()}>{children}</Context.Provider>;
}

export const useDragContext = () => {
   const context = useContext(Context);

   return context || {} as ContextType;
};
