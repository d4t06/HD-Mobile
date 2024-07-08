import { Editor } from "@tiptap/react";
import { Button, Gallery, Modal } from "..";
import { useState } from "react";
import { LockClosedIcon, LockOpenIcon } from "@heroicons/react/16/solid";

type Props = {
   editor: Editor | null;
   isChange: boolean;
   isLock: boolean;
   toggleIsLock: () => void;
   cb: (value: string) => Promise<void>;
};

export default function Toolbar({ editor, cb, isChange, isLock, toggleIsLock }: Props) {
   if (!editor) return <></>;

   const [isOpenModal, setIsOpenModal] = useState(false);
   const closeModal = () => setIsOpenModal(false);

   const handleAddImage = (imageList: ImageType[]) => {
      imageList.forEach((image) =>
         editor.chain().focus().setImage({ src: image.image_url }).run()
      );
   };

   const handleSubmit = async () => {
      if (!editor) return;
      const content = editor.getHTML();

      await cb(content);
   };

   const classes = {
      left: "flex mt-[-8px] ml-[-8px] flex-wrap [&_button]:px-[6px] [&_button]:mt-[8px] [&_button]:ml-[8px] [&_button]:font-[500] [&_button]:py-[3px] [&_button.active]:bg-white [&_button.active]:text-[#cd1818] [&_button.active]:rounded-[6px] ",
      right: "right flex flex-col space-y-[8px] sm:space-x-[8px] sm:space-y-0 sm:flex-row items-center",
   };

   return (
      <>
         <div
            className={`bg-[#cd1818] text-white flex  justify-between items-center p-[10px] `}
         >
            <div className={`${classes.left} ${isLock ? "disable" : ""}`}>
               <button
                  onClick={() => editor.chain().focus().setParagraph().run()}
                  className={editor.isActive("paragraph") ? "active" : ""}
               >
                  paragraph
               </button>
               <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
                  className={editor.isActive("heading", { level: 5 }) ? "active" : ""}
               >
                  h5
               </button>
               <button onClick={() => setIsOpenModal(true)}>image</button>
               <button
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().chain().focus().undo().run()}
               >
                  undo
               </button>
               <button
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().chain().focus().redo().run()}
               >
                  redo
               </button>
            </div>
            <div className={classes.right}>
               <Button colors={"second"} onClick={handleSubmit} disabled={!isChange}>
                  save
               </Button>

               <button onClick={toggleIsLock}>
                  {isLock ? (
                     <LockClosedIcon className="w-[20px]" />
                  ) : (
                     <LockOpenIcon className="w-[20px]" />
                  )}
               </button>
            </div>
         </div>

         {isOpenModal && (
            <Modal closeModal={closeModal}>
               <Gallery
                  closeModal={closeModal}
                  setImageUrl={(images) => handleAddImage(images)}
               />
            </Modal>
         )}
      </>
   );
}
