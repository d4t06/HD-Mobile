import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";

// 1 state
export type RatingStateType = {
   page: number;
   ratings: Rating[];
   status: "loading" | "error" | "success" | "more-loading";
   count: number;
   size: number;
   average: number;
};

const initialState: RatingStateType = {
   status: "loading",
   ratings: [],
   page: 1,
   count: 0,
   size: 0,
   average: 0,
};

// 2 reducer

const enum REDUCER_ACTION_TYPE {
   APPROVE,
   DELETE,
   STORING,
   ERROR,
   RESET,
}
type Storing = {
   type: REDUCER_ACTION_TYPE.STORING;
   payload: Partial<RatingStateType> & { replace?: boolean };
};

type Delete = {
   type: REDUCER_ACTION_TYPE.DELETE;
   payload: {
      index: number;
   };
};

type Error = {
   type: REDUCER_ACTION_TYPE.ERROR;
};
type Reset = {
   type: REDUCER_ACTION_TYPE.RESET;
};

type Approve = {
   type: REDUCER_ACTION_TYPE.APPROVE;
   payload: {
      index: number;
   };
};

const reducer = (
   state: RatingStateType,
   action: Storing | Delete | Approve | Error | Reset
): RatingStateType => {
   switch (action.type) {
      case REDUCER_ACTION_TYPE.APPROVE: {
         const payload = structuredClone(action.payload);

         const newRatings = [...state.ratings];

         const newRating = { ...newRatings[payload.index] };
         newRating.approve = 1;

         newRatings[payload.index] = newRating;

         return { ...state, ratings: newRatings };
      }
      case REDUCER_ACTION_TYPE.DELETE: {
         const payload = structuredClone(action.payload);

         const newRatings = [...state.ratings];

         newRatings.splice(payload.index, 1);

         return { ...state, ratings: newRatings };
      }
      case REDUCER_ACTION_TYPE.STORING: {
         const payload = action.payload;

         if (payload.replace) {
            return { ...state, ...payload };
         } else {
            const { ratings, ...rest } = payload;
            return { ...state, ...rest, ratings: [...state.ratings, ...(ratings || [])] };
         }
      }
      case REDUCER_ACTION_TYPE.ERROR:
         return {
            ...state,
            ...initialState,
            status: "error",
         };

      case REDUCER_ACTION_TYPE.RESET:
         return {
            ...state,
            ...initialState,
         };

      default:
         return state;
   }
};

// 3 hook
const useRatingContext = () => {
   const [state, dispatch] = useReducer(reducer, initialState);

   const storingRatings = useCallback((payload: Storing["payload"]) => {
      return dispatch({
         type: REDUCER_ACTION_TYPE.STORING,
         payload,
      });
   }, []);

   const approveRating = useCallback((index: number) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.APPROVE,
         payload: { index },
      });
   }, []);

   const deleteRating = useCallback((index: number) => {
      dispatch({
         type: REDUCER_ACTION_TYPE.DELETE,
         payload: { index },
      });
   }, []);

   const catchError = useCallback(() => {
      dispatch({
         type: REDUCER_ACTION_TYPE.ERROR,
      });
   }, []);

   const resetRating = useCallback(() => {
      dispatch({
         type: REDUCER_ACTION_TYPE.RESET,
      });
   }, []);

   return { state, storingRatings, approveRating, deleteRating, catchError, resetRating };
};

// 5 context state
type ContextType = ReturnType<typeof useRatingContext>;

const initialContextState: ContextType = {
   state: initialState,
   approveRating: () => {},
   deleteRating: () => {},
   storingRatings: () => {},
   resetRating: () => {},
   catchError: () => {},
};

const RatingContext = createContext<ContextType>(initialContextState);

export default function RatingContextProvider({ children }: { children: ReactNode }) {
   // const props = useRatingContext();

   return (
      <RatingContext.Provider value={useRatingContext()}>
         {children}
      </RatingContext.Provider>
   );
}

export const useRating = () => {
   const context = useContext(RatingContext);

   const {
      state: { ...restState },
      ...restSetState
   } = context;
   return {
      ...restSetState,
      ...restState,
   };
};
