import { useToast } from "@/store/ToastContext";
import { ProductComment, Reply } from "@/types";
import { publicRequest } from "@/utils/request";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { useLocalStorage, usePrivateRequest } from ".";
import { initLocalStorage } from "@/utils/appHelper";

type Props = {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
   product_ascii?: string;
   admin?: boolean;
};

export type CommentStateType = {
   page: number;
   product_ascii: string;
   comments: ProductComment[];
   status: "loading" | "error" | "success";
   count: number;
   page_size: number;
};

const initialState: CommentStateType = {
   status: "loading",
   comments: [],
   page: 1,
   product_ascii: "",
   count: 0,
   page_size: 0,
};

const COMMENT_URL = "/product-comment-management";
const COMMENT_URL_CLIENT = "/product-comments";

export default function useComment({ setIsOpenModal, product_ascii, admin }: Props) {
   const [state, setState] = useState<CommentStateType>(initialState);
   const [apiLoading, setApiLoading] = useState(false);
   const { setSuccessToast, setErrorToast } = useToast();

   const ranEffect = useRef(false);

   const privateRequest = usePrivateRequest();
   const [localValue, setLocalValue] = useLocalStorage("HD-Mobile", initLocalStorage);

   const updateComments = (comment: ProductComment, index?: number) => {
      const newComments = [...state.comments];

      let myIndex = index;
      if (myIndex === undefined) myIndex = newComments.findIndex((c) => c.id === comment.id);

      if (myIndex === -1 || myIndex === undefined) throw new Error("update comment index is undefined");

      newComments[myIndex] = comment;
      setState((prev) => ({ ...prev, comments: newComments } as typeof state));
   };

   const addComment = async (commentData: ProductComment, setShowConfirm: Dispatch<SetStateAction<boolean>>) => {
      try {
         setApiLoading(true);

         await publicRequest.post(`${COMMENT_URL_CLIENT}`, commentData);

         setSuccessToast("Add comment successful");
      } catch (error) {
         setErrorToast("Add comment fail");
      } finally {
         setApiLoading(false);
         setShowConfirm(true);
      }
   };

   const getComments = async (_page: number = 1) => {
      console.log("run get comments");

      try {
         setState((prev) => ({ ...prev, status: "loading" }));
         let res;

         if (admin) {
            res = await privateRequest.get(`${COMMENT_URL}/comments`, {
               params: { page: _page },
            });
         } else {
            res = await publicRequest.get(`${COMMENT_URL_CLIENT}/${product_ascii}`, {
               params: { page: _page },
            });
         }

         const { comments, ...rest } = res.data as CommentStateType;
         setState((prev) => ({
            ...rest,
            status: "success",
            comments: [...prev.comments, ...comments],
         }));
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
         newReply.date_convert = "Recent";

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

   const like = async (c: ProductComment) => {
      try {
         let type: "like" | "unlike";
         if (c.id === undefined) throw new Error("review id is undefined");

         setApiLoading(true);
         const newLikeCommentIds = [...localValue.like_comment_ids];

         const indexInLocal = newLikeCommentIds.findIndex((id) => id === c.id);
         const isExist = indexInLocal !== -1;
         if (!isExist) {
            console.log(">>> api like");

            type = "like";
            newLikeCommentIds.push(c.id);

            await publicRequest.post(`${COMMENT_URL_CLIENT}/like`, { id: c.id });
         } else {
            console.log(">>> api unlike");

            type = "unlike";
            newLikeCommentIds.splice(indexInLocal, 1);

            await publicRequest.post(`${COMMENT_URL_CLIENT}/unlike`, { id: c.id });
         }

         const newComment = {
            ...c,
            total_like: type === "like" ? c.total_like + 1 : c.total_like - 1,
         } as ProductComment;

         setLocalValue((prev) => ({ ...prev, like_comment_ids: newLikeCommentIds }));
         updateComments(newComment);
      } catch (error) {
         console.log(error);
      } finally {
         setApiLoading(false);
      }
   };

   //  run initial
   useEffect(() => {
      if (!ranEffect.current) {
         if (product_ascii || admin) {
            ranEffect.current = true;
            getComments(1);
         }
      }
   }, [product_ascii]);

   return {
      apiLoading,
      getComments,
      addComment,
      replyComment,
      deleteComment,
      editReply,
      like,
      state,
      setState,
   };
}
