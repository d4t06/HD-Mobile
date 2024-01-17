import { useToast } from "@/store/ToastContext";
import { ProductComment, ProductReview, Reply } from "@/types";
import { publicRequest } from "@/utils/request";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { usePrivateRequest } from ".";

type Props = {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  product_name_ascii?: string;
  admin?: boolean;
};

type StateType = {
  page: number;
  product_name_ascii: string;
  reviews: ProductReview[];
  status: "loading" | "error" | "success";
  count: number;
  page_size: number;
  average: number;
};
const REVIEW_URL = "/product-review-management";
const REVIEW_URL_CLIENT = "/product-reviews";

export default function useReview({ setIsOpenModal, product_name_ascii, admin }: Props) {
  const [state, setState] = useState<StateType>({
    status: "loading",
    reviews: [],
    page: 1,
    product_name_ascii: "",
    count: 0,
    page_size: 0,
    average: 0,
  });
  const [apiLoading, setApiLoading] = useState(false);
  const { setSuccessToast, setErrorToast } = useToast();

  const ranEffect = useRef(false);

  const privateRequest = usePrivateRequest();

  const addReview = async (
    reviewData: ProductReview,
    setShowConfirm: Dispatch<SetStateAction<boolean>>
  ) => {
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
        res = await publicRequest.get(`${REVIEW_URL_CLIENT}/${product_name_ascii}`, {
          params: { page: _page },
        });
      }

      const { reviews, ...restData } = res.data as StateType;

      const averageRes = await publicRequest.get(
        `${REVIEW_URL_CLIENT}/avg/${product_name_ascii}`
      );
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

  const likeReview = async (id: number, type: "REVIEW" | "REPLY") => {
    try {
      setApiLoading(true);

      await publicRequest.post(`${REVIEW_URL_CLIENT}/like`, { id, type });
      // setSuccessToast("Comment liked");
    } catch (error) {
      console.log(error);
      // setErrorToast("Edit reply comment fail");
    } finally {
      setApiLoading(false);
      // setIsOpenModal(false);
    }
  };

  const approveReview = async (
    index: number,
    state: StateType,
    setState: Dispatch<SetStateAction<StateType>>
  ) => {
    try {
      setApiLoading(true);
      const newReviews = [...state.reviews];
      const target = newReviews[index];

      await privateRequest.post(`${REVIEW_URL}/approve`, { id: target.id });

      target.approve = "1";
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
      ranEffect.current = true;

      if (product_name_ascii || admin) getReviews(1);
    }
  }, []);

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
