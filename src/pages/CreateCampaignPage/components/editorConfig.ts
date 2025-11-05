import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import Placeholder from "@tiptap/extension-placeholder";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TextAlign from "@tiptap/extension-text-align";

export const editorExtensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
    },
  }),
  Underline,
  TextAlign.configure({
    types: ["heading", "paragraph"],
  }),
  Highlight.configure({
    multicolor: true,
  }),
  Image.configure({
    inline: true,
    allowBase64: true,
    HTMLAttributes: {
      class: "editor-image",
    },
  }).extend({
    addAttributes() {
      return {
        ...this.parent?.(),
        uploading: {
          default: null,
          parseHTML: (element) => element.getAttribute("data-uploading"),
          renderHTML: (attributes) => {
            if (!attributes.uploading) {
              return {};
            }
            return {
              "data-uploading": attributes.uploading,
              class: "uploading-image",
            };
          },
        },
      };
    },
  }),
  Link.configure({
    openOnClick: false,
    autolink: true,
    HTMLAttributes: {
      class: "email-link",
      target: "_blank",
      rel: "noopener noreferrer",
    },
  }),
  TextStyle,
  Color,
  FontFamily.configure({
    types: ["textStyle"],
  }),
  Placeholder.configure({
    placeholder: 'Type "/" for commands or start writing...',
  }),
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "email-table",
    },
  }),
  TableRow,
  TableHeader,
  TableCell,
];
