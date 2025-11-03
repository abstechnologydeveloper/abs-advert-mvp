import React, { useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Table,
  Quote,
  Code,
  Minus,
  Image,
} from "lucide-react";

interface SlashMenuProps {
  editor: Editor;
  position: { top: number; left: number };
  onClose: () => void;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
}

export const SlashMenu: React.FC<SlashMenuProps> = ({
  editor,
  position,
  onClose,
  imageInputRef,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Extract search query from text after slash
  useEffect(() => {
    const { state } = editor;
    const { from } = state.selection;
    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, "\n");
    const slashIndex = textBefore.lastIndexOf("/");

    if (slashIndex !== -1) {
      const query = textBefore.substring(slashIndex + 1).toLowerCase();
      setSearchQuery(query);
    }
  }, [editor.state.selection]);

  const insertBlock = (action: string) => {
    const { state } = editor;
    const { from } = state.selection;
    const textBefore = state.doc.textBetween(Math.max(0, from - 50), from, "\n");
    const slashIndex = textBefore.lastIndexOf("/");

    if (slashIndex !== -1) {
      const deleteFrom = from - (textBefore.length - slashIndex);
      editor.chain().deleteRange({ from: deleteFrom, to: from }).run();
    }

    setTimeout(() => {
      switch (action) {
        case "h1":
          editor.chain().focus().toggleHeading({ level: 1 }).run();
          break;
        case "h2":
          editor.chain().focus().toggleHeading({ level: 2 }).run();
          break;
        case "h3":
          editor.chain().focus().toggleHeading({ level: 3 }).run();
          break;
        case "paragraph":
          editor.chain().focus().setParagraph().run();
          break;
        case "bulletList":
          editor.chain().focus().toggleBulletList().run();
          break;
        case "orderedList":
          editor.chain().focus().toggleOrderedList().run();
          break;
        case "quote":
          editor.chain().focus().toggleBlockquote().run();
          break;
        case "divider":
          editor.chain().focus().setHorizontalRule().run();
          break;
        case "code":
          editor.chain().focus().toggleCodeBlock().run();
          break;
        case "table":
          editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
          break;
        case "image":
          imageInputRef.current?.click();
          break;
      }
    }, 10);

    onClose();
  };

  const menuItems = [
    {
      icon: <Type size={18} />,
      label: "Paragraph",
      desc: "Normal text",
      action: "paragraph",
      keywords: ["text", "paragraph", "p"],
    },
    {
      icon: <Heading1 size={18} />,
      label: "Heading 1",
      desc: "Large heading",
      action: "h1",
      keywords: ["heading", "h1", "title", "large"],
    },
    {
      icon: <Heading2 size={18} />,
      label: "Heading 2",
      desc: "Medium heading",
      action: "h2",
      keywords: ["heading", "h2", "subtitle", "medium"],
    },
    {
      icon: <Heading3 size={18} />,
      label: "Heading 3",
      desc: "Small heading",
      action: "h3",
      keywords: ["heading", "h3", "small"],
    },
    {
      icon: <List size={18} />,
      label: "Bullet List",
      desc: "Unordered list",
      action: "bulletList",
      keywords: ["bullet", "list", "unordered", "ul"],
    },
    {
      icon: <ListOrdered size={18} />,
      label: "Numbered List",
      desc: "Ordered list",
      action: "orderedList",
      keywords: ["numbered", "ordered", "list", "ol"],
    },
    {
      icon: <Table size={18} />,
      label: "Table",
      desc: "Insert table",
      action: "table",
      keywords: ["table", "grid"],
    },
    {
      icon: <Quote size={18} />,
      label: "Quote",
      desc: "Block quote",
      action: "quote",
      keywords: ["quote", "blockquote", "citation"],
    },
    {
      icon: <Code size={18} />,
      label: "Code",
      desc: "Code block",
      action: "code",
      keywords: ["code", "snippet", "pre"],
    },
    {
      icon: <Minus size={18} />,
      label: "Divider",
      desc: "Horizontal line",
      action: "divider",
      keywords: ["divider", "line", "separator", "hr"],
    },
    {
      icon: <Image size={18} />,
      label: "Image",
      desc: "Upload image",
      action: "image",
      keywords: ["image", "picture", "photo", "img"],
    },
  ];

  // Filter menu items based on search query
  const filteredItems = menuItems.filter((item) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchLower) ||
      item.desc.toLowerCase().includes(searchLower) ||
      item.keywords.some((keyword) => keyword.includes(searchLower))
    );
  });

  return (
    <div
      className="absolute z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-64 sm:w-72 overflow-hidden"
      style={{ top: position.top, left: position.left }}
    >
      <div className="p-2 bg-gradient-to-r from-blue-50 to-purple-50 border-b">
        <p className="text-xs font-semibold text-gray-700 uppercase truncate">
          {searchQuery ? `Searching: "${searchQuery}"` : "Insert Block"}
        </p>
      </div>
      <div className="max-h-64 sm:max-h-80 overflow-y-auto overscroll-contain">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => insertBlock(item.action)}
              className="w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition text-left"
            >
              <div className="text-gray-500 flex-shrink-0">{item.icon}</div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-900 text-sm truncate">{item.label}</p>
                <p className="text-xs text-gray-500 truncate">{item.desc}</p>
              </div>
            </button>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            No blocks found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};
