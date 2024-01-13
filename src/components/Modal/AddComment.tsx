import { Input } from "@/components";
import { Comment, Product } from "@/types";
import { useState } from "react";

type Props = {
  product: Product;
};

const initComment: Comment = {
  content: "",
  cus_name: "",
  product_name_ascii: "",
  phone_number: "",
  total_like: 0,
};

export default function AddCommentModal({}: Props) {
  const [commentData, setCommetData] = useState<Comment>(initComment);

  const handleCommentData = (field: keyof typeof commentData, value: string) => {};

  return (
    <div className="">
      <div className="row">
        <Input
          placeholder="Họ và tên *"
          cb={(val) => handleCommentData("cus_name", val)}
        />
        <Input
          placeholder="Điện thoại"
          cb={(val) => handleCommentData("phone_number", val)}
        />
      </div>
      <Input placeholder="Nội dung" cb={(val) => handleCommentData("content", val)} />
    </div>
  );
}
