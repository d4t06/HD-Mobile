import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Image from "@tiptap/extension-image";
import { useEffect, useState } from "react";

interface Props extends Partial<EditorOptions> {
   cb: (value: string, resetChange: () => void) => Promise<void>;
   className: string;
}

export default function MyEditor({ extensions, className, cb, ...props }: Props) {
   const [isChange, setIsChange] = useState(false);
   const [isLock, setIsLock] = useState(true);

   const editor = useEditor({
      extensions: [StarterKit, Image],
      onUpdate: () => setIsChange(true),
      ...props,
   });

   const toggleIsLock = () => {
      const newLock = !isLock;

      const container = document.querySelector<HTMLDivElement>(".dashboard-content");

      if (container) {
         if (newLock) container.style.overflow = "auto";
         else container.style.overflow = "hidden";
      }

      setIsLock(newLock);
   };

   const restChangeState = () => setIsChange(false);

   const handleSubmit = async (value: string) => {
      await cb(value, restChangeState);
   };

   const classes = {
      wrapper: "my-editor border border-black/10 bg-white rounded-[12px] overflow-hidden",
      editContainer: "max-h-[70vh] overflow-auto editor-container",
   };

   useEffect(() => {
      return () => {
         const container = document.querySelector<HTMLDivElement>(".dashboard-content");
         if (container) {
            container.style.overflow = "auto";
         }
      };
   }, []);

   return (
      <div className={`${classes.wrapper} ${className || ""}`}>
         <Toolbar
            isLock={isLock}
            toggleIsLock={toggleIsLock}
            isChange={isChange}
            cb={handleSubmit}
            editor={editor}
         />
         <div
            className={`${classes.editContainer} ${isLock ? "pointer-events-none" : ""}`}
         >
            <EditorContent
               className="pt-[30px] px-[20px] sm:px-[50px] pb-[50vh] [&_div]:space-y-[14px] [&_p]:text-[#495057] [&_h5]:font-[500] [&_h5]:text-xl [&_img]:rounded-[6px] [&_img]:mx-auto [&_img]:max-h-[300px] [&_img]:border-[2px] [&_img]:border-transparent [&_.ProseMirror-selectednode]:border-red-500"
               editor={editor}
            />
         </div>
      </div>
   );
}
