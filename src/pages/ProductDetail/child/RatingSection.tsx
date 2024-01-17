import useReview from "@/hooks/useReview";
import { useMemo } from "react";
import rateImage from "@/assets/images/rate.png";
import CommentItem, { CommentSkeleton } from "@/components/CommentItem";
import { Button } from "@/components";
import NoComment from "./NoComment";

export default function RatingSection({
  product_name_ascii,
}: {
  product_name_ascii: string;
}) {
  const {
    state: { count, page, reviews, page_size, status, average },
    addReview,
  } = useReview({ setIsOpenModal: () => {}, product_name_ascii });

  const remaining = useMemo(() => count - page * page_size, [reviews]);

  const renderSkeleton = useMemo(
    () =>
      [...Array(2).keys()].map((item) => (
        <div key={item} className="mb-[30px]">
          {CommentSkeleton}
          <div className="mt-[14px] ml-[64px]">{CommentSkeleton}</div>
        </div>
      )),
    []
  );

  const renderReview = useMemo(
    () =>
      reviews.map((r, index) => {
        console.log("check r", r);

        return (
          <CommentItem key={index} review={true} comment={r}>
            <Button onClick={() => {}} className="px-[5px] !py-[0px]" primary>
              <i className="material-icons text-[15px] mr-[4px]">thumb_up</i>
              {r.total_like}
            </Button>
          </CommentItem>
        );
      }),
    [reviews]
  );

  if (status === "loading") return renderSkeleton;

  console.log("check ", status, reviews);

  if (status === "success" && reviews.length === 0)
    return <NoComment title="Chưa có đánh giá" />;

  return (
    <div className="">
      <div className="text-center mb-[30px]">
        <h2 className="text-[20px] text-[#333] font-[600] ">Đánh giá trung bình</h2>
        {/* <p className="text-[#495057] text-[18px] leading-[20px]">Đánh giá trung bình</p> */}
        <h1 className="text-[70px] font-[600] leading-[80px] text-[#cd1818]">
          {average.toFixed(1)} /5
        </h1>
        <p className="text-[#495057] text-[16px] leading-[20px]">{count} đánh giá</p>
      </div>

      {reviews.length && renderReview}

      <p className="text-center mt-[20px]">
        <Button disable={remaining <= 0} primary>
          Xem thêm ({remaining > 0 ? remaining : 0}) đánh giá
        </Button>
      </p>
    </div>
  );
}
