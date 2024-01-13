import { Button, Input } from "@/components";
import { ProductComment, Product, Reply } from "@/types";
import { Dispatch, SetStateAction, useState } from "react";
import ModalHeader from "./ModalHeader";
import { inputClasses } from "../ui/Input";
import useComment from "@/hooks/useComment";

type Props = {
  product: Product;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
  target: "Add" | "Reply";
  comment?: ProductComment;
};

const initComment = (product_name_ascii: string) => {
  const data: ProductComment = {
    content: "",
    cus_name: "",
    product_name_ascii,
    phone_number: "",
    total_like: 0,
  };
  return data;
};

export default function AddCommentModal({
  product,
  setIsOpenModal,
  target,
  comment,
}: Props) {
  const [commentData, setCommentData] = useState<ProductComment>(
    initComment(product.product_name_ascii)
  );
  const [replyContent, setReplyContent] = useState("");

  // hooks
  const { addComment, apiLoading, replyComment } = useComment({ setIsOpenModal });

  const handleCommentData = (field: keyof typeof commentData, value: string) => {
    setCommentData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChangeConent = (value: string) => {
    switch (target) {
      case "Add":
        return handleCommentData("content", value);
      case "Reply":
        return setReplyContent(value);
    }
  };

  const handleSubmit = async () => {
    switch (target) {
      case "Add":
        return await addComment(commentData);
      case "Reply":
        if (comment?.id === undefined) return;
        const replyData: Reply = {
          comment_id: comment?.id,
          content: replyContent,
          total_like: 0
        };

        await replyComment(replyData)
    }
  };

  const titleMap: Record<typeof target, string> = {
    Add: "Add new comment",
    Reply: `Reply commit '${comment?.cus_name ?? undefined}'`,
  };

  return (
    <div className="">
      <ModalHeader title={titleMap[target]} setIsOpenModal={setIsOpenModal} />
      {target === "Add" && (
        <div className="flex gap-[20px] mb-[20px]">
          <Input
            placeholder="Họ và tên *"
            value={commentData.cus_name}
            cb={(val) => handleCommentData("cus_name", val)}
          />
          <Input
            value={commentData.phone_number}
            placeholder="Điện thoại"
            cb={(val) => handleCommentData("phone_number", val)}
          />
        </div>
      )}
      <textarea
        placeholder="Nội dung"
        value={commentData.content}
        className={`${inputClasses.input} w-full min-h-[100px]`}
        onChange={(e) => handleChangeConent(e.target.value)}
      ></textarea>
      <div className="text-right mt-[30px]">
        <Button isLoading={apiLoading} onClick={handleSubmit} primary>
          Gửi
        </Button>
      </div>
    </div>
  );
}
