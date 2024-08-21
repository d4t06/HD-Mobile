import { useState } from "react";

export type RatingState = {
   page: number;
   ratings: Rating[];
   status: "loading" | "error" | "success" | "more-loading";
   count: number;
   size: number;
   average: number;
};

const initialState: RatingState = {
   status: "loading",
   ratings: [],
   page: 1,
   count: 0,
   size: 0,
   average: 0,
};

type SetStatus = {
   variant: "status";
   payload: RatingState["status"];
};

type Storing = {
   variant: "storing";
   payload: Partial<RatingState> & {
      replace?: boolean;
   };
};

type Delete = {
   variant: "delete";
   index: number;
};

type Approve = {
   variant: "approve";
   index: number;
};

export type SetRatingState = Storing | Delete | Approve | SetStatus;

export default function useRating() {
   const [state, setState] = useState<RatingState>(initialState);

   const setRating = (props: SetRatingState) => {
      setState((prev) => {
         switch (props.variant) {
            case "delete": {
               const newRatings = [...prev.ratings];

               newRatings.splice(props.index, 1);

               return { ...prev, ratings: newRatings };
            }

            case "approve": {
               const newRatings = [...prev.ratings];

               const newRating: Rating = { ...newRatings[props.index] };
               newRating.approve = 1;
               newRatings[props.index] = newRating;

               return { ...prev, ratings: newRatings };
            }

            case "storing": {
               const payload = props.payload;

               if (payload.replace) {
                  return { ...prev, ...payload };
               } else {
                  const { ratings, ...rest } = payload;
                  return {
                     ...prev,
                     ...rest,
                     ratings: [...prev.ratings, ...(ratings || [])],
                  };
               }
            }

            case "status": {
               return { ...prev, status: props.payload };
            }

            default:
               return prev;
         }
      });
   };

   return {
      ratingState: state,
      setRating,
   };
}
