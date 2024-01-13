import { useToast } from "@/store/ToastContext";
import { ProductComment, Reply } from "@/types";
import { publicRequest } from "@/utils/request";
import { Dispatch, SetStateAction, useState } from "react";
import { usePrivateRequest } from ".";

type Props = {
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
};

const COMMENT_URL = "/product-comment-management";

export default function useComment({ setIsOpenModal }: Props) {
  const [apiLoading, setApiLoading] = useState(false);
  const { setSuccessToast, setErrorToast } = useToast();

  const privateRequest = usePrivateRequest();

  const addComment = async (commentData: ProductComment) => {
    try {
      setApiLoading(true);

      await publicRequest.post(`${COMMENT_URL}/comments`, commentData);

      setSuccessToast("Add comment successful");
    } catch (error) {
      setErrorToast("Add comment fail");
    } finally {
      setApiLoading(false);
      setIsOpenModal(false);
    }
  };

  const replyComment = async (replyData: Reply) => {
    try {
      setApiLoading(true);
      if (replyData.id === undefined) throw new Error("id is undefined");

      await privateRequest.post(`${COMMENT_URL}/replies`, replyData);
    } catch (error) {
      console.log(error);
      setErrorToast("Reply comment failt");
    } finally {
      setApiLoading(false);
      setIsOpenModal(false);
    }
  };

  return { apiLoading, addComment, replyComment };
}
