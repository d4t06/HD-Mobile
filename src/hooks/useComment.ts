import { useToast } from "@/store/ToastContext";
import { ProductComment, Reply } from "@/types";
import { publicRequest } from "@/utils/request";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { usePrivateRequest } from ".";

type Props = {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
   product_name_ascii?: string;
   admin?: boolean;
};

export type CommentStateType = {
   page: number;
   product_name_ascii: string;
   comments: ProductComment[];
   status: "loading" | "error" | "success";
   count: number;
   page_size: number;
};

const initialState: CommentStateType = {
   status: "loading",
   comments: [],
   page: 1,
   product_name_ascii: "",
   count: 0,
   page_size: 0,
};

const COMMENT_URL = "/product-comment-management";
const COMMENT_URL_CLIENT = "/product-comments";

export default function useComment({ setIsOpenModal, product_name_ascii, admin }: Props) {
   const [state, setState] = useState<CommentStateType>(initialState);
   const [apiLoading, setApiLoading] = useState(false);
   const { setSuccessToast, setErrorToast } = useToast();

   const ranEffect = useRef(false);

   const privateRequest = usePrivateRequest();

   const addComment = async (commentData: ProductComment) => {
      try {
         setApiLoading(true);

         await publicRequest.post(`${COMMENT_URL_CLIENT}`, commentData);

         setSuccessToast("Add comment successful");
      } catch (error) {
         setErrorToast("Add comment fail");
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const getComments = async (_page: number = 1) => {
      try {
         setState((prev) => ({ ...prev, status: "loading" }));
         let res;

         if (admin) {
            res = await privateRequest.get(`${COMMENT_URL}/comments`, {
               params: { page: _page },
            });
         } else {
            res = await publicRequest.get(`${COMMENT_URL_CLIENT}/${product_name_ascii}`, {
               params: { page: _page },
            });
         }

         const { comments, ...rest } = res.data as CommentStateType;
         setState((prev) => ({ ...rest, status: "success", comments: [...prev.comments, ...comments] }));
      } catch (error) {
         console.log(error);
         setState((prev) => ({ ...prev, status: "error" }));
      }
   };

   const replyComment = async (
      replyData: Reply,
      index: number,
      state: CommentStateType,
      setState: Dispatch<SetStateAction<CommentStateType>>
   ) => {
      try {
         setApiLoading(true);
         if (replyData.q_id === undefined) throw new Error("q_id is undefined");

         const res = await privateRequest.post(`${COMMENT_URL}/replies`, replyData);
         const newReply = res.data.data as Reply;

         const newComments = [...state.comments];
         newComments[index] = { ...newComments[index], reply_data: newReply };

         setState((prev) => ({ ...prev, comments: newComments }));
         setSuccessToast("Reply successful");
      } catch (error) {
         console.log(error);
         setErrorToast("Reply comment fail");
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const deleteComment = async (
      comment: ProductComment,
      index: number,
      state: CommentStateType,
      setState: Dispatch<SetStateAction<CommentStateType>>
   ) => {
      try {
         setApiLoading(true);
         if (comment.id === undefined) throw new Error("id is undefined");

         await privateRequest.delete(`${COMMENT_URL}/comments/${comment.id}`);

         const newComments = [...state.comments];
         newComments.splice(index, 1);

         setState((prev) => ({ ...prev, comments: newComments }));

         setSuccessToast("Delete comment successful");
      } catch (error) {
         console.log(error);
         setErrorToast("Reply comment fail");
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const editReply = async (
      id: number,
      content: string,
      index: number,
      state: CommentStateType,
      setState: Dispatch<SetStateAction<CommentStateType>>
   ) => {
      try {
         const newComments = [...state.comments];
         const target = { ...newComments[index] };

         if (index === undefined || id === undefined || !target.reply_data) throw new Error("index is undefined");
         setApiLoading(true);

         // await privateRequest.put(`${COMMENT_URL}/replies/${id}`, { content });

         target.reply_data.content = content;
         newComments[index] = target;

         console.log("check new newComments", state.comments);

         setState((prev) => ({ ...prev, comments: newComments }));

         setSuccessToast("Edit reply successful");
      } catch (error) {
         console.log(error);
         setErrorToast("Edit reply comment fail");
      } finally {
         setApiLoading(false);
         setIsOpenModal(false);
      }
   };

   const like = async (id: number, type: "QUESTION" | "ANSWER") => {
      try {
         setApiLoading(true);

         await publicRequest.post(`${COMMENT_URL_CLIENT}/like`, { id, type });
         // setSuccessToast("Comment liked");
      } catch (error) {
         console.log(error);
         // setErrorToast("Edit reply comment fail");
      } finally {
         setApiLoading(false);
         // setIsOpenModal(false);
      }
   };

   //  run initial
   useEffect(() => {
      if (!ranEffect.current) {
         ranEffect.current = true;
         if (product_name_ascii || admin) getComments(1);
      }
   }, []);

   return { apiLoading, getComments, addComment, replyComment, deleteComment, editReply, like, state, setState };
}
