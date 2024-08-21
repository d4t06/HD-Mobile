import { publicRequest } from "@/utils/request";
import { useState } from "react";

type StateType = {
   page: number;
   ratings: Rating[];
   status: "loading" | "error" | "success";
   count: number;
   page_size: number;
   average: number;
};
const RATING_URL = "/product-ratings";

export default function useReview() {
   const [state, setState] = useState<StateType>({
      status: "loading",
      ratings: [],
      page: 1,
      count: 0,
      page_size: 0,
      average: 0,
   });

   // const [status, setStatus] = useState<"loading" | "successful" | "error">("loading");
   // const [apiLoading, setApiLoading] = useState(false);
   // const { setSuccessToast, setErrorToast } = useToast();

   // const ranEffect = useRef(false);

   // const privateRequest = usePrivateRequest();
   // const [localValue, setLocalValue] = useLocalStorage("HD-Mobile", initLocalStorage);

   // const updateReviews = (review: ProductReview, index?: number) => {
   //    const newReviews = [...state.reviews];

   //    let myIndex = index;
   //    if (myIndex === undefined)
   //       myIndex = newReviews.findIndex((r) => review.id === r.id);

   //    if (myIndex === -1 || myIndex === undefined)
   //       throw new Error("update review index is undefined");

   //    newReviews[myIndex] = review;
   //    setState((prev) => ({ ...prev, reviews: newReviews }));
   // };

   // const addReview = async (
   //    reviewData: ProductReview,
   //    setShowConfirm: Dispatch<SetStateAction<boolean>>
   // ) => {
   //    try {
   //       setApiLoading(true);

   //       await publicRequest.post(`${REVIEW_URL_CLIENT}`, reviewData);

   //       setSuccessToast("Add review successful");
   //    } catch (error) {
   //       setErrorToast("Add review fail");
   //    } finally {
   //       setApiLoading(false);
   //       setShowConfirm(true);
   //    }
   // };

   type Storing = {
      variant: "storing";
      payload: Partial<StateType> & {
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

   const setRating = (props: Storing | Delete | Approve) => {
      setState((prev) => {
         const newPrev = { ...prev };

         switch (props.variant) {
            case "delete": {
               const newRatings = [...newPrev.ratings];

               newRatings.splice(props.index, 1);
               newPrev.ratings = newRatings;

               return newPrev;
            }

            case "approve": {
               const newRatings = [...newPrev.ratings];

               const newRating = { ...newRatings[props.index] };
               newRating.approve = 1;

               newRatings[props.index] = newRating;
               newPrev.ratings = newRatings;

               return newPrev;
            }

            case "storing": {
               const payload = props.payload;

               if (payload.replace) Object.assign(newPrev, payload);
               else {
                  payload.ratings = [...state.ratings, ...(payload.ratings || [])];
                  Object.assign(newPrev, payload);
               }

               return newPrev;
            }
            default:
               return prev;
         }
      });
   };

   const getReviews = async ({
      page,
      productId,
      replace,
   }: {
      page?: number;
      productId: number;
      replace?: boolean;
   }) => {
      try {
         setState((prev) => ({ ...prev, status: "loading" }));

         const res = await publicRequest.get(RATING_URL, {
            params: { page, product_id: productId },
         });

         const payload = res.data.data as StateType;

         // let ratingAvg = 0;

         // if (replace) {
         //    const averageRes = await publicRequest.get(`${RATING_URL}/avg/${productId}`);
         //    ratingAvg = +averageRes.data;
         // }

         // if (replace) {
         //    payload["average"] = ratingAvg;
         // }

         setRating({
            variant: "storing",
            payload: {
               ...payload,
               status: "success",
               replace,
            },
         });
      } catch (error) {
         console.log(error);
         setState((prev) => ({ ...prev, status: "error" }));
      }
   };

   // const replyReview = async (replyData: Reply) => {
   //    try {
   //       setApiLoading(true);
   //       if (replyData.q_id === undefined) throw new Error("q_id is undefined");

   //       await privateRequest.post(`${REVIEW_URL}/replies`, replyData);
   //    } catch (error) {
   //       console.log(error);
   //       setErrorToast("Reply comment fail");
   //    } finally {
   //       setApiLoading(false);
   //       closeModal();
   //    }
   // };

   // const deleteReview = async (comment: ProductComment) => {
   //    try {
   //       setApiLoading(true);
   //       if (comment.id === undefined) throw new Error("id is undefined");

   //       await privateRequest.delete(`${REVIEW_URL}/${comment.id}`);
   //       setSuccessToast("Delete comment successful");
   //    } catch (error) {
   //       console.log(error);
   //       setErrorToast("Reply comment fail");
   //    } finally {
   //       setApiLoading(false);
   //       closeModal();
   //    }
   // };

   // const editReply = async (id: number, content: string) => {
   //    try {
   //       setApiLoading(true);

   //       await privateRequest.put(`${REVIEW_URL}/replies/${id}`, { content });
   //       setSuccessToast("Edit reply successful");
   //    } catch (error) {
   //       console.log(error);
   //       setErrorToast("Edit reply comment fail");
   //    } finally {
   //       setApiLoading(false);
   //       closeModal();
   //    }
   // };

   // const likeReview = async (r: ProductReview) => {
   //    try {
   //       let type: "like" | "unlike";
   //       if (r.id === undefined) throw new Error("review id is undefined");

   //       setApiLoading(true);
   //       const newLocalLikeReviewIds = [...localValue.like_review_ids];

   //       const indexInLocal = newLocalLikeReviewIds.findIndex((id) => id === r.id);
   //       const isExist = indexInLocal !== -1;
   //       if (!isExist) {
   //          console.log(">>> api like");

   //          type = "like";
   //          newLocalLikeReviewIds.push(r.id);

   //          await publicRequest.post(`${REVIEW_URL_CLIENT}/like`, { id: r.id });
   //       } else {
   //          console.log(">>> api unlike");

   //          type = "unlike";
   //          newLocalLikeReviewIds.splice(indexInLocal, 1);

   //          await publicRequest.post(`${REVIEW_URL_CLIENT}/unlike`, { id: r.id });
   //       }

   //       const newReview = {
   //          ...r,
   //          total_like: type === "like" ? r.total_like + 1 : r.total_like - 1,
   //       } as ProductReview;

   //       setLocalValue((prev) => ({ ...prev, like_review_ids: newLocalLikeReviewIds }));
   //          (newReview);
   //    } catch (error) {
   //       console.log(error);
   //    } finally {
   //       setApiLoading(false);
   //    }
   // };

   // const approveReview = async (
   //    index: number,
   //    state: StateType,
   //    setState: Dispatch<SetStateAction<StateType>>
   // ) => {
   //    try {
   //       setApiLoading(true);
   //       const newReviews = [...state.reviews];
   //       const target = newReviews[index];

   //       await privateRequest.post(`${REVIEW_URL}/approve`, { id: target.id });

   //       target.approve = 1;
   //       newReviews[index] = target;
   //       setState((prev) => ({ ...prev, reviews: newReviews }));

   //       setSuccessToast("Review approved");
   //    } catch (error) {
   //       console.log(error);
   //       setErrorToast("Approve fail");
   //    } finally {
   //       setApiLoading(false);
   //       // closeModal(false);
   //    }
   // };

   //  run initial
   // useEffect(() => {
   //    if (!ranEffect.current) {
   //       ranEffect.current = true;
   //       if (product_ascii || admin) {
   //          getReviews(1);
   //       } else {
   //          setState((prev) => ({ ...prev, status: "success" }));
   //       }
   //    }
   // }, [product_ascii]);

   // return {
   //    getReviews,

   //    state,
   // };
}
