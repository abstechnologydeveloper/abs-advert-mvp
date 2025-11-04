import React, { useState, useRef, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Table,
  ImagePlus,
  Link2,
  Undo,
  Redo,
  Palette,
  Plus,
  Trash2,
  Highlighter,
  Quote,
  Minus,
  Type,
  ChevronDown,
} from "lucide-react";

interface ToolbarProps {
  editor: Editor;
  imageInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ editor, imageInputRef }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  const [showTypography, setShowTypography] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const highlightPickerRef = useRef<HTMLDivElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (
        highlightPickerRef.current &&
        !highlightPickerRef.current.contains(event.target as Node)
      ) {
        setShowHighlightPicker(false);
      }
      if (typographyRef.current && !typographyRef.current.contains(event.target as Node)) {
        setShowTypography(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const ToolbarButton: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    icon: React.ReactNode;
    title: string;
    disabled?: boolean;
  }> = ({ onClick, isActive, icon, title, disabled }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`p-2 rounded-lg transition-all ${
        isActive ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
      } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
    >
      {icon}
    </button>
  );

  const textColors = [
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#dc2626" },
    { name: "Orange", value: "#ea580c" },
    { name: "Amber", value: "#d97706" },
    { name: "Green", value: "#16a34a" },
    { name: "Blue", value: "#2563eb" },
    { name: "Purple", value: "#7c3aed" },
    { name: "Pink", value: "#db2777" },
    { name: "Gray", value: "#6b7280" },
  ];

  const highlightColors = [
    { name: "None", value: "transparent" },
    { name: "Yellow", value: "#fef08a" },
    { name: "Green", value: "#bbf7d0" },
    { name: "Blue", value: "#bfdbfe" },
    { name: "Purple", value: "#e9d5ff" },
    { name: "Pink", value: "#fbcfe8" },
    { name: "Orange", value: "#fed7aa" },
    { name: "Red", value: "#fecaca" },
  ];

  const typographyOptions = [
    {
      name: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
      style: "text-base",
    },
    {
      name: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
      style: "text-3xl font-bold",
    },
    {
      name: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
      style: "text-2xl font-bold",
    },
    {
      name: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
      style: "text-xl font-bold",
    },
    {
      name: "Heading 4",
      action: () => editor.chain().focus().toggleHeading({ level: 4 }).run(),
      isActive: () => editor.isActive("heading", { level: 4 }),
      style: "text-lg font-bold",
    },
    {
      name: "Heading 5",
      action: () => editor.chain().focus().toggleHeading({ level: 5 }).run(),
      isActive: () => editor.isActive("heading", { level: 5 }),
      style: "text-base font-bold",
    },
    {
      name: "Heading 6",
      action: () => editor.chain().focus().toggleHeading({ level: 6 }).run(),
      isActive: () => editor.isActive("heading", { level: 6 }),
      style: "text-sm font-bold",
    },
  ];

  const getActiveTypography = () => {
    const active = typographyOptions.find((option) => option.isActive());
    return active?.name || "Paragraph";
  };

  const setLink = () => {
    const url = prompt("Enter link URL:");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  return (
    <div className="border-b bg-gray-50 p-2 overflow-x-auto">
      <div className="flex flex-nowrap items-center gap-0.5 min-w-max">
        {/* Text Formatting */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            icon={<Bold size={16} />}
            title="Bold (Ctrl+B)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            icon={<Italic size={16} />}
            title="Italic (Ctrl+I)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            icon={<Underline size={16} />}
            title="Underline (Ctrl+U)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            icon={<Strikethrough size={16} />}
            title="Strikethrough"
          />
        </div>

        {/* Typography Dropdown */}
        <div
          className="flex items-center gap-0.5 pr-2 mr-2 border-r border-gray-300 relative"
          ref={typographyRef}
        >
          <button
            type="button"
            onClick={() => setShowTypography(!showTypography)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium min-w-[120px] justify-between"
            title="Typography"
          >
            <div className="flex items-center gap-1.5">
              <Type size={16} />
              <span className="hidden sm:inline">{getActiveTypography()}</span>
            </div>
            <ChevronDown size={14} />
          </button>
          {showTypography && (
            <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200  py-1 min-w-[200px] z-999">
              {typographyOptions.map((option) => (
                <button
                  key={option.name}
                  type="button"
                  onClick={() => {
                    option.action();
                    setShowTypography(false);
                  }}
                  className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition flex items-center justify-between ${
                    option.isActive() ? "bg-blue-50 text-blue-700" : "text-gray-700"
                  }`}
                >
                  <span className={option.style}>{option.name}</span>
                  {option.isActive() && <span className="text-blue-600 text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Color Pickers */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-gray-300">
          {/* Text Color */}
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowColorPicker(!showColorPicker);
                setShowHighlightPicker(false);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Text Color"
            >
              <Palette size={16} />
            </button>
            {showColorPicker && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[200px]">
                <p className="text-xs font-semibold text-gray-700 mb-2">Text Color</p>
                <div className="grid grid-cols-3 gap-2">
                  {textColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        editor.chain().focus().setColor(color.value).run();
                        setShowColorPicker(false);
                      }}
                      className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-50 transition group"
                      title={color.name}
                    >
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-200 group-hover:border-gray-400 transition"
                        style={{ backgroundColor: color.value }}
                      />
                      <span className="text-xs text-gray-600">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Highlight Color */}
          <div className="relative" ref={highlightPickerRef}>
            <button
              type="button"
              onClick={() => {
                setShowHighlightPicker(!showHighlightPicker);
                setShowColorPicker(false);
              }}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"
              title="Highlight Color"
            >
              <Highlighter size={16} />
            </button>
            {showHighlightPicker && (
              <div className="absolute top-full mt-2 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[200px]">
                <p className="text-xs font-semibold text-gray-700 mb-2">Highlight</p>
                <div className="grid grid-cols-3 gap-2">
                  {highlightColors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => {
                        if (color.value === "transparent") {
                          editor.chain().focus().unsetHighlight().run();
                        } else {
                          editor.chain().focus().setHighlight({ color: color.value }).run();
                        }
                        setShowHighlightPicker(false);
                      }}
                      className="flex flex-col items-center gap-1 p-2 rounded hover:bg-gray-50 transition group"
                      title={color.name}
                    >
                      <div
                        className="w-8 h-8 rounded border-2 border-gray-200 group-hover:border-gray-400 transition"
                        style={{
                          backgroundColor: color.value,
                          backgroundImage:
                            color.value === "transparent"
                              ? "linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc), linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%, #ccc)"
                              : "none",
                          backgroundSize: color.value === "transparent" ? "8px 8px" : "auto",
                          backgroundPosition:
                            color.value === "transparent" ? "0 0, 4px 4px" : "0 0",
                        }}
                      />
                      <span className="text-xs text-gray-600">{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Alignment */}
        <div className="hidden md:flex items-center gap-0.5 pr-2 mr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            icon={<AlignLeft size={16} />}
            title="Align Left"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            icon={<AlignCenter size={16} />}
            title="Align Center"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            icon={<AlignRight size={16} />}
            title="Align Right"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            icon={<AlignJustify size={16} />}
            title="Justify"
          />
        </div>

        {/* Lists */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            icon={<List size={16} />}
            title="Bullet List"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            icon={<ListOrdered size={16} />}
            title="Numbered List"
          />
        </div>

        {/* Special Formatting */}
        <div className="hidden lg:flex items-center gap-0.5 pr-2 mr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            icon={<Quote size={16} />}
            title="Quote"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            icon={<Minus size={16} />}
            title="Horizontal Rule"
          />
        </div>

        {/* Insert */}
        <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-gray-300">
          <ToolbarButton
            onClick={() => imageInputRef?.current?.click()}
            icon={<ImagePlus size={16} />}
            title="Insert Image"
          />
          <ToolbarButton onClick={setLink} icon={<Link2 size={16} />} title="Insert Link" />
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            }
            icon={<Table size={16} />}
            title="Insert Table"
          />
        </div>

        {/* Table Controls */}
        {editor.isActive("table") && (
          <div className="flex items-center gap-0.5 pr-2 mr-2 border-r border-gray-300">
            <ToolbarButton
              onClick={() => editor.chain().focus().addColumnBefore().run()}
              icon={<Plus size={16} />}
              title="Add Column"
            />
            <ToolbarButton
              onClick={() => editor.chain().focus().deleteColumn().run()}
              icon={<Trash2 size={16} />}
              title="Delete Column"
            />
          </div>
        )}


        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 ml-auto">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            icon={<Undo size={16} />}
            title="Undo (Ctrl+Z)"
          />
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            icon={<Redo size={16} />}
            title="Redo (Ctrl+Y)"
          />
        </div>
      </div>
    </div>
  );
};
