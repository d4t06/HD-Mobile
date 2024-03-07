import { useToast } from "@/store/ToastContext";
import { ProductComment, ProductReview, Reply } from "@/types";
import { publicRequest } from "@/utils/request";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useLocalStorage, usePrivateRequest } from ".";
import { initLocalStorage } from "@/utils/appHelper";

type Props = {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
   product_ascii?: string;
   admin?: boolean;
};

type StateType = {
   page: number;
   product_ascii: string;
   reviews: ProductReview[];
   status: "loading" | "error" | "success";
   count: number;
   page_size: number;
   average: number;
};
const REVIEW_URL = "/product-review-management";
const REVIEW_URL_CLIENT = "/product-reviews";

export default function useReview({ setIsOpenModal, product_ascii, admin }: Props) {
   const [state, setState] = useState<StateType>({
      status: "loading",
      reviews: [],
      page: 1,
      product_ascii: "",
      count: 0,
      page_size: 0,
      average: 0,
   });
   const [apiLoading, setApiLoading] = useState(false);
   const { setSuccessToast, setErrorToast } = useToast();

   const ranEffect = useRef(false);

   const privateRequest = usePrivateRequest();
   const [localValue, setLocalValue] = useLocalStorage("HD-Mobile", initLocalStorage);

   const updateReviews = (review: ProductReview, index?: number) => {
      const newReviews = [...state.reviews];

      let myIndex = index;
      if (myIndex === undefined) myIndex = newReviews.findIndex((r) => review.id === r.id);

      if (myIndex === -1 || myIndex === undefined) throw new Error("update review index is undefined");

      newReviews[myIndex] = review;
      setState((prev) => ({ ...prev, reviews: newReviews }));
   };

   const addReview = async (reviewData: ProductReview, setShowConfirm: Dispatch<SetStateAction<boolean>>) => {
      try {
         setApiLoading(true);

         await publicRequest.post(`${REVIEW_URL_CLIENT}`, reviewData);

         setSuccessToast("Add review successful");
      } catch (error) {
         setErrorToast("Add review fail");
      } finally {
         setApiLoading(false);
         setShowConfirm(true);
      }
   };

   const getReviews = async (_page: number = 1) => {
      console.log("run get review");

      try {
         setState((prev) => ({ ...prev, status: "loading" }));
         let res;

         if (admin) {
            res = await privateRequest.get(`${REVIEW_URL}`, {
               params: { page: _page },
            });
         } else {
            res = await publicRequest.get(`${REVIEW_URL_CLIENT}/${product_ascii}`, {
               params: { page: _page },
            });
         }

         const { reviews, ...restData } = res.data as StateType;

         const averageRes = await publicRequest.get(`${REVIEW_URL_CLIENT}/avg/${product_ascii}`);
         const averageNumber = +averageRes.data.average;

         console.log("check average", averageNumber);

         setState((prev) => ({
            ...restData,
            status: "success",
            average: averageNumber || 0,
            reviews: [...prev.reviews, ...reviews],
         }));
      } catch (error) {
         console.log(error);
         setState((prev) => ({ ...prev, status: "error" }));
      }
   };

   const replyReview = async (replyData: Reply) => {
      try {
         setApiLoading(true);
         if (replyData.q_id === undefined) throw new Error("q_id is undefined");

         await privateRequest.post(`${REVIEW_URL}/replies`, replyData);
      } catch (error) {
         console.log(error);
         setErrorToast("Reply comment fail");
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const deleteReview = async (comment: ProductComment) => {
      try {
         setApiLoading(true);
         if (comment.id === undefined) throw new Error("id is undefined");

         await privateRequest.delete(`${REVIEW_URL}/${comment.id}`);
         setSuccessToast("Delete comment successful");
      } catch (error) {
         console.log(error);
         setErrorToast("Reply comment fail");
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const editReply = async (id: number, content: string) => {
      try {
         setApiLoading(true);

         await privateRequest.put(`${REVIEW_URL}/replies/${id}`, { content });
         setSuccessToast("Edit reply successful");
      } catch (error) {
         console.log(error);
         setErrorToast("Edit reply comment fail");
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const likeReview = async (r: ProductReview) => {
      try {
         let type: "like" | "unlike";
         if (r.id === undefined) throw new Error("review id is undefined");

         setApiLoading(true);
         const newLocalLikeReviewIds = [...localValue.like_review_ids];

         const indexInLocal = newLocalLikeReviewIds.findIndex((id) => id === r.id);
         const isExist = indexInLocal !== -1;
         if (!isExist) {
            console.log(">>> api like");

            type = "like";
            newLocalLikeReviewIds.push(r.id);

            await publicRequest.post(`${REVIEW_URL_CLIENT}/like`, { id: r.id });
         } else {
            console.log(">>> api unlike");

            type = "unlike";
            newLocalLikeReviewIds.splice(indexInLocal, 1);

            await publicRequest.post(`${REVIEW_URL_CLIENT}/unlike`, { id: r.id });
         }

         const newReview = { ...r, total_like: type === "like" ? r.total_like + 1 : r.total_like - 1 } as ProductReview;

         setLocalValue((prev) => ({ ...prev, like_review_ids: newLocalLikeReviewIds }));
         updateReviews(newReview);
      } catch (error) {
         console.log(error);
      } finally {
         setApiLoading(false);
      }
   };

   const approveReview = async (index: number, state: StateType, setState: Dispatch<SetStateAction<StateType>>) => {
      try {
         setApiLoading(true);
         const newReviews = [...state.reviews];
         const target = newReviews[index];

         await privateRequest.post(`${REVIEW_URL}/approve`, { id: target.id });

         target.approve = 1;
         newReviews[index] = target;
         setState((prev) => ({ ...prev, reviews: newReviews }));

         setSuccessToast("Review approved");
      } catch (error) {
         console.log(error);
         setErrorToast("Approve fail");
      } finally {
         setApiLoading(false);
         // setIsOpenModal(false);
      }
   };

   //  run initial
   useEffect(() => {
      if (!ranEffect.current) {
         if (product_ascii || admin) {
            ranEffect.current = true;
            getReviews(1);
         }
      }
   }, [product_ascii]);

   return {
      apiLoading,
      getReviews,
      addReview,
      approveReview,
      replyReview,
      deleteReview,
      editReply,
      likeReview,
      state,
      setState,
   };
}
