import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Image from "@tiptap/extension-image";
import "./style.scss";

export default function MyEditor() {
   const editor = useEditor({
      extensions: [StarterKit, Image],
      content: "",
      onUpdate: ({editor}) => {
         console.log('check editor content', editor.getHTML());
         
      }
   });

   const classes = {
      wrapper: "border border-black/10 bg-white my-editor",
      controlContainer: "bg-[#cd1818] text-white flex gap-[12px] items-center h-[50px] px-[10px]",
      editContainer: "p-[10px] max-h-[80vh] overflow-auto",
   };

   return (
      <div className={classes.wrapper}>
         <div className={classes.controlContainer}>
            <Toolbar editor={editor} />
         </div>
         <div className={classes.editContainer}>
            <EditorContent editor={editor} />
         </div>
      </div>
   );
}
