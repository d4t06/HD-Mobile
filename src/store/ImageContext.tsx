"use client";

import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";

type StateType = {
   tempImages: ImageTypeSchema[];
   page: number;
   count: number;
   page_size: number;
   currentImages: ImageType[];
};

const initialState: StateType = {
   count: 0,
   currentImages: [],
   tempImages: [],
   page: 0,
   page_size: 0,
};

// 2 reducer
const enum REDUCER_ACTION_TYPE {
   STORE_IMAGES,
   SET_STATUS,
   ADD_IMAGE,
}

type ReducerAction = {
   type: REDUCER_ACTION_TYPE;
   payload: Partial<StateType>;
};

const reducer = (state: StateType, action: ReducerAction): StateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.STORE_IMAGES:
         return {
            ...state,
            ...action.payload,
         };
      case REDUCER_ACTION_TYPE.ADD_IMAGE:
         if (!action.payload.currentImages) return state;

         return {
            ...state,
            currentImages: [...action.payload.currentImages, ...state.currentImages],
            count: state.count + 1,
         };

      default:
         return state;
   }
};

//  4 hook
const useImageContext = () => {
   const [state, dispatch] = useReducer(reducer, initialState);

   const storeImages = useCallback((payload: Partial<StateType>) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.STORE_IMAGES,
         payload,
      });
   }, []);

   const setTempImages = useCallback((tempImages: StateType["tempImages"]) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.STORE_IMAGES,
         payload: { tempImages },
      });
   }, []);

   const addImage = useCallback((image: ImageType) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.ADD_IMAGE,
         payload: { currentImages: [image] },
      });
   }, []);

   return { state, storeImages, setTempImages, addImage };
};

// 3 create context

type UseImageContextTye = ReturnType<typeof useImageContext>;

const initialContextState: UseImageContextTye = {
   state: initialState,

   setTempImages: () => {},
   storeImages: () => {},
   addImage: () => {},
};

const ImageContext = createContext<UseImageContextTye>(initialContextState);

export default function ImageProvider({ children }: { children: ReactNode }) {
   return (
      <ImageContext.Provider value={useImageContext()}>{children}</ImageContext.Provider>
   );
}

export const useImage = () => {
   const context = useContext(ImageContext);
   if (!context) throw new Error("context is required");

   const {
      state: { ...restState },
      ...restSetState
   } = context;
   return {
      ...restSetState,
      ...restState,
   };
};
