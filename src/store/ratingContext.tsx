import { ReactNode, createContext, useCallback, useContext, useReducer } from "react";

// 1 state
export type RatingStateType = {
   page: number;
   ratings: Rating[];
   status: "loading" | "error" | "success";
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

type Approve = {
   type: REDUCER_ACTION_TYPE.APPROVE;
   payload: {
      index: number;
   };
};

const reducer = (
   state: RatingStateType,
   action: Storing | Delete | Approve
): RatingStateType => {
   const newState = { ...state };

   switch (action.type) {
      case REDUCER_ACTION_TYPE.APPROVE: {
         const payload = action.payload;

         const newRatings = [...newState.ratings];

         const newRating = { ...newRatings[payload.index] };
         newRating.approve = 1;

         newRatings[payload.index] = newRating;
         newState.ratings = newRatings;

         return newState;
      }
      case REDUCER_ACTION_TYPE.DELETE: {
         const payload = action.payload;

         const newRatings = [...newState.ratings];

         newRatings.splice(payload.index, 1);
         newState.ratings = newRatings;

         return newState;
      }
      case REDUCER_ACTION_TYPE.STORING: {
         console.log("storing ");

         const payload = action.payload;

         if (payload.replace) Object.assign(newState, payload);
         else {
            payload.ratings = [...state.ratings, ...(payload.ratings || [])];
            Object.assign(newState, payload);
         }

         return newState;
      }

      default:
         return state;
   }
};

// 3 hook
const useRatingContext = () => {
   const [state, dispatch] = useReducer(reducer, initialState);

   const storingRatings = useCallback((payload: Storing["payload"]) => {
      dispatch({
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

   return { state, storingRatings, approveRating, deleteRating };
};

// 5 context state
type ContextType = ReturnType<typeof useRatingContext>;

const initialContextState: ContextType = {
   state: initialState,
   approveRating: () => {},
   deleteRating: () => {},
   storingRatings: () => {},
};

const RatingContext = createContext<ContextType>(initialContextState);

export default function RatingContextProvider({ children }: { children: ReactNode }) {
   return (
      <RatingContext.Provider value={useRatingContext()}>
         {children}
      </RatingContext.Provider>
   );
}

export const useRating = () => {
   const context = useContext(RatingContext);
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
