import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Image from "@tiptap/extension-image";
import "./style.scss";
import { Ref, forwardRef, useImperativeHandle } from "react";

export type EditorRef = {
  getContent: () => string | undefined;
};

interface Props extends Partial<EditorOptions> {}

function MyEditor({ extensions, ...props }: Props, ref: Ref<EditorRef>) {
  const editor = useEditor({
    extensions: [StarterKit, Image],
    ...props,
  });

  const getContent = () => {
    if (editor === null) throw new Error("edit is undefined");
    return editor.getHTML();
  };

  useImperativeHandle(ref, () => ({ getContent }));

  const classes = {
    wrapper: "my-editor border border-black/10 bg-white rounded-[12px] overflow-hidden",
    controlContainer:
      "bg-[#cd1818] text-white flex gap-[12px] items-center h-[50px] px-[10px]",
    editContainer: "max-h-[70vh] overflow-auto editor-container",
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

export default forwardRef(MyEditor);
