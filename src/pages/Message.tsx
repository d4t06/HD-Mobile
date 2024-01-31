import { Button, Modal } from "@/components";
import useComment from "@/hooks/useComment";
import { useMemo, useRef, useState } from "react";
import CommentItem, { AdminReply } from "@/components/CommentItem";
import AddCommentModal from "@/components/Modal/AddComment";
import ConfirmModal from "@/components/Modal/Confirm";
import Skeleton from "@/components/Skeleton";

type ModalTarget = "Add-Comment" | "Add-Reply" | "Edit-Reply" | "Delete-Comment";

export default function Message() {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const { deleteComment, apiLoading, state, setState } = useComment({
    admin: true,
    setIsOpenModal,
  });

  const openModalTarget = useRef<ModalTarget | "">("");
  const curCommentIndex = useRef<number>();

  const { comments, status, count, page, page_size } = state;
  const remaining = useMemo(() => count - page * page_size, [comments]);

  const handleOpenModal = (type: ModalTarget, index: number) => {
    curCommentIndex.current = index;
    openModalTarget.current = type;
    setIsOpenModal(true);
  };

  const classes = {
    button: "px-[5px] !py-[1px]",
  };

  const renderModal = useMemo(() => {
    if (!isOpenModal) return;
    if (curCommentIndex.current === undefined) return <h1>Index not found</h1>;

    const curComment = comments[curCommentIndex.current];

    switch (openModalTarget.current) {
      case "Add-Reply":
        return (
          <AddCommentModal
            state={state}
            setState={setState}
            target="Add-Reply"
            setIsOpenModal={setIsOpenModal}
            comment={curComment}
            index={curCommentIndex.current}
          />
        );
      case "Edit-Reply":
        return (
          <AddCommentModal
            state={state}
            setState={setState}
            index={curCommentIndex.current}
            target="Edit-Reply"
            setIsOpenModal={setIsOpenModal}
            comment={curComment}
          />
        );
      case "Delete-Comment":
        return (
          <ConfirmModal
            label={`Delete comment '${curComment.cus_name}'`}
            callback={() =>
              deleteComment(
                curComment,
                curCommentIndex.current as number,
                state,
                setState
              )
            }
            loading={apiLoading}
            setOpenModal={setIsOpenModal}
          />
        );
    }
  }, [isOpenModal]);

  const renderSkeleton = useMemo(
    () =>
      [...Array(3).keys()].map((index) => (
        <Skeleton key={index} className="h-[130px] mb-[20px] w-full rounded-[12px]" />
      )),
    []
  );

  const commentCta = (index: number) => (
    <>
      <Button
        onClick={() => handleOpenModal("Add-Reply", index)}
        primary
        className={classes.button}
      >
        <span className="ml-[4px]">Reply</span>
      </Button>

      <Button
        onClick={() => handleOpenModal("Delete-Comment", index)}
        primary
        className={classes.button}
      >
        <span className="ml-[4px]">Delete</span>
      </Button>
    </>
  );

  if (status === "error") return <h1 className="text-[22px]">Some thing went wrong</h1>;

  return (
    <div className="">
      <div className="text-[22px] font-[600] mb-[20px]">Message</div>
      {status === "loading" && renderSkeleton}

      {status === "success" &&
        !!comments.length &&
        comments.map((comment, index) => {
          return (
            <div key={index} className="bg-[#e1e1e1] rounded-[12px]">
              <div className="mb-[20px] bg-white rounded-[12px] p-[10px] translate-y-[-6px]">
                <CommentItem admin comment={comment}>
                  {!comment.reply_data && commentCta(index)}
                </CommentItem>
                {comment.reply_data && (
                  <div className="ml-[74px] mt-[14px]">
                    <AdminReply
                      cta={
                        <Button
                          onClick={() => handleOpenModal("Edit-Reply", index)}
                          primary
                          className={classes.button}
                        >
                          <span className="ml-[4px]">Edit</span>
                        </Button>
                      }
                      reply={comment.reply_data}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}

      {status === "success" && !comments.length && (
        <p className="text-[16px] text-[#333]">Nothing to show</p>
      )}

      {!!comments.length && (
        <p className="mt-[30px] text-center">
          <Button disable={remaining <= 0} primary>
            Xem thêm ({remaining > 0 ? remaining : 0}) câu hỏi
          </Button>
        </p>
      )}

      <>{isOpenModal && <Modal setShowModal={setIsOpenModal}>{renderModal}</Modal>}</>
    </div>
  );
}
