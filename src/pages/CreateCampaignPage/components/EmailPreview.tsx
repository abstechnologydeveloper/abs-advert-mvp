import React from "react";
import { Editor } from "@tiptap/react";

interface EmailPreviewProps {
  editor: Editor;
  onClose: () => void;
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ editor, onClose }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111827",
        padding: "40px 20px",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .preview-content * { margin: 0; padding: 0; box-sizing: border-box; }
          .preview-content { 
            overflow-wrap: break-word; 
            word-wrap: break-word;
            max-width: 100%;
          }
          .preview-content p { 
            margin: 0 0 16px; 
            font-size: 16px;
            color: #1f2937;
            line-height: 1.8;
          }
          .preview-content h1 { 
            color: #111827;
            font-size: 28px;
            font-weight: 700;
            margin: 24px 0 12px;
            line-height: 1.3;
          }
          .preview-content h2 { 
            color: #111827;
            font-size: 24px;
            font-weight: 600;
            margin: 20px 0 10px;
            line-height: 1.4;
          }
          .preview-content h3 { 
            color: #374151;
            font-size: 20px;
            font-weight: 600;
            margin: 16px 0 8px;
            line-height: 1.5;
          }
          .preview-content strong,
          .preview-content b { 
            font-weight: 600;
            color: #111827;
          }
          .preview-content em,
          .preview-content i { 
            font-style: italic;
          }
          .preview-content u {
            text-decoration: underline;
          }
          .preview-content s {
            text-decoration: line-through;
          }
          .preview-content ul,
          .preview-content ol { 
            margin: 12px 0; 
            padding-left: 24px;
          }
          .preview-content ul {
            list-style-type: disc;
          }
          .preview-content ol {
            list-style-type: decimal;
          }
          .preview-content li { 
            margin-bottom: 8px;
            color: #1f2937;
            font-size: 16px;
            line-height: 1.7;
          }
          .preview-content li p {
            margin: 4px 0;
          }
          .preview-content a { 
            color: #667eea; 
            text-decoration: underline;
            font-weight: 500;
            word-wrap: break-word;
            overflow-wrap: anywhere;
            display: inline;
            max-width: 100%;
          }
          .preview-content a:hover { 
            color: #5568d3;
          }
          .preview-content img { 
            max-width: 100%; 
            height: auto; 
            display: block; 
            margin: 20px auto;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .preview-content table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 20px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          .preview-content table td,
          .preview-content table th { 
            border: 1px solid #e5e7eb; 
            padding: 12px;
            text-align: left;
            font-size: 15px;
          }
          .preview-content table th { 
            background: #f9fafb; 
            font-weight: 600;
            color: #374151;
          }
          .preview-content blockquote { 
            border-left: 3px solid #667eea; 
            padding: 12px 16px; 
            margin: 16px 0;
            background: #f9fafb;
            font-style: italic; 
            color: #4b5563;
            border-radius: 0 6px 6px 0;
          }
          .preview-content blockquote p {
            margin: 0;
          }
          .preview-content pre {
            background: #1f2937;
            color: #f3f4f6;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 16px 0;
          }
          .preview-content code {
            background: #f3f4f6;
            color: #dc2626;
            padding: 2px 6px;
            border-radius: 3px;
            font-size: 14px;
            font-family: 'Courier New', monospace;
          }
          .preview-content pre code {
            background: none;
            color: #f3f4f6;
            padding: 0;
          }
          .preview-content hr {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 24px 0;
          }
          .preview-content mark {
            background-color: #fef08a;
            padding: 2px 4px;
            border-radius: 2px;
          }
        `,
        }}
      />

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "12px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          }}
        >
          {/* Compact Professional Header */}
          <div
            style={{
              background: "#ffffff",
              padding: "16px 24px",
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
            }}
          >
            <img
              src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg"
              alt="AbS"
              style={{
                height: "36px",
                width: "auto",
                display: "block",
              }}
            />
            <p
              style={{
                color: "#6b7280",
                fontSize: "12px",
                margin: "0",
                fontWeight: "500",
                whiteSpace: "nowrap",
              }}
            >
              Education & Technology
            </p>
          </div>

          {/* Email Content */}
          <div
            style={{
              padding: "32px 24px",
              lineHeight: "1.7",
              color: "#1f2937",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
              background: "#ffffff",
            }}
          >
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />

            {/* Enhanced CTA Button */}
            <div style={{ textAlign: "center", margin: "32px 0 16px" }}>
              <a
                href="https://www.abstechconnect.com/"
                style={{
                  display: "inline-block",
                  padding: "12px 32px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "8px",
                  fontWeight: "600",
                  fontSize: "15px",
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s ease",
                }}
              >
                Visit AbS Platform →
              </a>
            </div>
          </div>

          {/* Compact Footer */}
          <div
            style={{
              background: "#f9fafb",
              padding: "24px",
              borderTop: "1px solid #e5e7eb",
            }}
          >
            {/* Social Links */}
            <div style={{ textAlign: "center", marginBottom: "16px" }}>
              <a
                href="https://www.abstechconnect.com/"
                style={{
                  display: "inline-block",
                  margin: "0 8px",
                  color: "#6b7280",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Website
              </a>
              <span style={{ color: "#d1d5db" }}>•</span>
              <a
                href="https://x.com/ABSTEAM01"
                style={{
                  display: "inline-block",
                  margin: "0 8px",
                  color: "#6b7280",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Twitter
              </a>
              <span style={{ color: "#d1d5db" }}>•</span>
              <a
                href="https://www.linkedin.com/company/abstechconnect1/"
                style={{
                  display: "inline-block",
                  margin: "0 8px",
                  color: "#6b7280",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                LinkedIn
              </a>
              <span style={{ color: "#d1d5db" }}>•</span>
              <a
                href="https://web.facebook.com/people/ABS-Solution/61564113997916/"
                style={{
                  display: "inline-block",
                  margin: "0 8px",
                  color: "#6b7280",
                  textDecoration: "none",
                  fontSize: "12px",
                  fontWeight: "500",
                }}
              >
                Facebook
              </a>
            </div>

            {/* Company Info */}
            <p
              style={{
                fontSize: "11px",
                color: "#9ca3af",
                textAlign: "center",
                lineHeight: "1.5",
                margin: "0 0 12px",
              }}
            >
              AbS - Empowering education through innovation and technology
              <br />© 2025 AbS. All rights reserved.
            </p>

            {/* Unsubscribe Link */}
            <div
              style={{
                textAlign: "center",
                paddingTop: "12px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <a
                href="{{unsubscribe_url}}"
                style={{
                  color: "#9ca3af",
                  textDecoration: "underline",
                  fontSize: "11px",
                }}
              >
                Unsubscribe from these emails
              </a>
            </div>
          </div>
        </div>

        {/* Back to Edit Button */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "10px 20px",
              background: "white",
              color: "#111827",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "14px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              cursor: "pointer",
            }}
          >
            ← Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
};
