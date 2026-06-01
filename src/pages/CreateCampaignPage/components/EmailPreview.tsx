import React, { useMemo } from "react";
import { Editor } from "@tiptap/react";
import { X } from "lucide-react";
import { wrapEmailTemplate } from "./emailTemplate";

interface EmailPreviewProps {
  editor: Editor;
  onClose: () => void;
  subject?: string;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ editor, onClose, subject }) => {
  const previewHtml = useMemo(
    () => wrapEmailTemplate(editor.getHTML(), subject || "Campaign preview"),
    [editor, subject]
  );

  return (
    <div className="min-h-screen bg-slate-950 px-3 py-4 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-900 px-4 py-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Email Preview
            </p>
            <h2 className="truncate text-base font-bold text-white">
              {subject || "Campaign preview"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-900 transition hover:bg-slate-200"
            title="Close preview"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-white shadow-2xl">
          <iframe
            title="Email campaign preview"
            srcDoc={previewHtml}
            className="h-[calc(100vh-8rem)] min-h-[680px] w-full bg-white"
            sandbox="allow-popups allow-popups-to-escape-sandbox"
          />
        </div>
      </div>
    </div>
  );
};
