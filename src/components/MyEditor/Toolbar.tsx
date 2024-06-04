import { Editor } from "@tiptap/react";
import { Gallery, Modal } from "..";
import { useState } from "react";

export default function Toolbar({ editor }: { editor: Editor | null }) {
   if (!editor) {
      return null;
   }

   const [isOpenModal, setIsOpenModal] = useState(false);

   const closeModal = () => setIsOpenModal(false);

   const handleAddImage = (imageList: string[]) => {
      if (imageList[0]) {
         editor.chain().focus().setImage({ src: imageList[0] }).run();
      }
   };

   return (
      <>
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
         <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? "active" : ""}
         >
            blockquote
         </button>
         <button
            onClick={() => setIsOpenModal(true)}
            className={editor.isActive("blockquote") ? "active" : ""}
         >
            image
         </button>
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

         {isOpenModal && (
            <Modal close={closeModal}>
               <Gallery
                  close={closeModal}
                  setImageUrl={(images) => handleAddImage(images)}
               />
            </Modal>
         )}
      </>
   );
}
