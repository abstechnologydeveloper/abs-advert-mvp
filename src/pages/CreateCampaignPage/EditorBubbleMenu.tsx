import React from "react";
import { Editor, BubbleMenu } from "@tiptap/react";
import { Bold, Italic, Underline, Palette, Link2, ImagePlus } from "lucide-react";

interface EditorBubbleMenuProps {
  editor: Editor;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
}


export const EditorBubbleMenu: React.FC<EditorBubbleMenuProps> = ({ editor, imageInputRef }) => {
  const setLink = () => {
    const url = prompt("Enter link URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100, placement: "top" }}
      className="bg-gray-900 text-white rounded-xl shadow-2xl p-1.5 flex items-center gap-1"
    >
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-lg transition ${
          editor.isActive("bold") ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-lg transition ${
          editor.isActive("italic") ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-lg transition ${
          editor.isActive("underline") ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        title="Underline"
      >
        <Underline size={16} />
      </button>
      <div className="w-px h-6 bg-gray-600 mx-1" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHighlight({ color: "#fef08a" }).run()}
        className={`p-2 rounded-lg transition ${
          editor.isActive("highlight") ? "bg-yellow-400 text-black" : "hover:bg-gray-700"
        }`}
        title="Highlight"
      >
        <Palette size={16} />
      </button>
      <button
        type="button"
        onClick={setLink}
        className={`p-2 rounded-lg transition ${
          editor.isActive("link") ? "bg-blue-600" : "hover:bg-gray-700"
        }`}
        title="Link"
      >
        <Link2 size={16} />
      </button>
      <button
        type="button"
        onClick={() => imageInputRef.current?.click()}
        className="p-2 rounded-lg hover:bg-gray-700 transition"
        title="Insert Image"
      >
        <ImagePlus size={16} />
      </button>
    </BubbleMenu>
  );
};
