import { Editor } from "@tiptap/react";
import { Button, Gallery, Modal } from "..";
import { useState } from "react";

export default function Toolbar({ editor }: { editor: Editor | null }) {
   if (!editor) {
      return null;
   }

   const [isOpenModal, setIsOpenModal] = useState(false);

   const handleAddImage = (imageList: string[]) => {
      if (imageList[0]) {
         editor.chain().focus().setImage({ src: imageList[0] }).run();
      }
   };

   // const classes = {
   //    btn: 'px-[6px] py-[3px] rounded-[]'
   //    activeBtn: 'bg-white text-[#cd1818]'
   // }

   return (
      <>
         <Button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disable={!editor.can().chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? 'active' : ""}
         >
            bold
         </Button>
         <Button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disable={!editor.can().chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? 'active' : ""}
         >
            italic
         </Button>

         {/* <Button onClick={() => editor.chain().focus().unsetAllMarks().run()}>clear marks</Button>
         <Button onClick={() => editor.chain().focus().clearNodes().run()}>clear nodes</Button> */}
         <Button
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={editor.isActive("paragraph") ? 'active' : ""}
         >
            paragraph
         </Button>
         <Button
            onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
            className={editor.isActive("heading", { level: 5 }) ? 'active' : ""}
         >
            h5
         </Button>
         <Button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={editor.isActive("blockquote") ? 'active' : ""}
         >
            blockquote
         </Button>
         <Button onClick={() => setIsOpenModal(true)} className={editor.isActive("blockquote") ? 'active' : ""}>
            image
         </Button>
         {/* <Button onClick={() => editor.chain().focus().setHorizontalRule().run()}>horizontal rule</Button>
         <Button onClick={() => editor.chain().focus().setHardBreak().run()}>hard break</Button> */}
         <Button
            onClick={() => editor.chain().focus().undo().run()}
            disable={!editor.can().chain().focus().undo().run()}
         >
            undo
         </Button>
         <Button
            onClick={() => editor.chain().focus().redo().run()}
            disable={!editor.can().chain().focus().redo().run()}
         >
            redo
         </Button>

         {isOpenModal && (
            <Modal setShowModal={setIsOpenModal}>
               <Gallery setIsOpenModal={setIsOpenModal} setImageUrl={(images) => handleAddImage(images)} />
            </Modal>
         )}
      </>
   );
}
