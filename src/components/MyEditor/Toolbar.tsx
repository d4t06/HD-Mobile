import { Editor } from "@tiptap/react";
import { Gallery, Modal } from "..";
import { useState } from "react";

type Props = {
   editor: Editor | null;
   isChange: boolean;
   cb: (value: string) => Promise<void>;
};

export default function Toolbar({ editor, cb, isChange }: Props) {
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

   return (
      <>
         <div
            className={`bg-[#cd1818] text-white flex  justify-between items-center h-[50px] px-[10px] `}
         >
            <div className="left flex gap-[8px]">
               <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  disabled={!editor.can().chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "active" : ""}
               >
                  bold
               </button>
               <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  disabled={!editor.can().chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "active" : ""}
               >
                  italic
               </button>
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
            <div className="right flex gap-[8px]">
               <button onClick={handleSubmit} disabled={!isChange}>
                  save
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
