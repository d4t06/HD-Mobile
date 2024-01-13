import { AvatarPlaceholder } from "@/components/Avatar";
import { Product } from "@/types";

type Props = {
  product: Product;
};

export default function CommentList({ product }: Props) {
  const classes = {
    userName: "text-[18px] font-[500]",
  };

  if (!product.comments_data.length)
    return <h1 className="text-[16px]">Chưa có bình luận</h1>;
  return (
    <>
      {product.comments_data.map((item, index) => {
        const stringList = item.cus_name.split(" ");
        const firstName = stringList[stringList.length - 1];
        return (
          <div key={index} className="flex">
            <AvatarPlaceholder firstChar={firstName.charAt(0)} />
            <div className="ml-[10px]">
              <h5 className={classes.userName}>{item.cus_name}</h5>
              <p className="text-[#495057] text-[16px]">{item.content}</p>
            </div>
          </div>
        );
      })}
    </>
  );
}
