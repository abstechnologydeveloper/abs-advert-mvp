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
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "40px 20px",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          .preview-content * { margin: 0; padding: 0; box-sizing: border-box; }
          .preview-content p { 
            margin: 0 0 16px; 
            font-size: 16px;
            color: #4a5568;
            line-height: 1.8;
          }
          .preview-content h1 { 
            color: #1a202c;
            font-size: 32px;
            font-weight: 700;
            margin: 32px 0 16px;
            line-height: 1.2;
          }
          .preview-content h2 { 
            color: #1a202c;
            font-size: 26px;
            font-weight: 600;
            margin: 28px 0 14px;
            line-height: 1.3;
          }
          .preview-content h3 { 
            color: #2d3748;
            font-size: 22px;
            font-weight: 600;
            margin: 24px 0 12px;
            line-height: 1.4;
          }
          .preview-content strong,
          .preview-content b { 
            font-weight: 600;
            color: #1a202c;
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
            margin: 16px 0; 
            padding-left: 28px;
          }
          .preview-content ul {
            list-style-type: disc;
          }
          .preview-content ol {
            list-style-type: decimal;
          }
          .preview-content li { 
            margin-bottom: 10px;
            color: #4a5568;
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
          }
          .preview-content a:hover { 
            color: #5568d3;
          }
          .preview-content img { 
            max-width: 100%; 
            height: auto; 
            display: block; 
            margin: 24px auto;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          }
          .preview-content table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 24px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
          }
          .preview-content table td,
          .preview-content table th { 
            border: 1px solid #e2e8f0; 
            padding: 14px;
            text-align: left;
            font-size: 15px;
          }
          .preview-content table th { 
            background: #f7fafc; 
            font-weight: 600;
            color: #2d3748;
          }
          .preview-content blockquote { 
            border-left: 4px solid #667eea; 
            padding: 16px 20px; 
            margin: 24px 0;
            background: #f7fafc;
            font-style: italic; 
            color: #4a5568;
            border-radius: 0 8px 8px 0;
          }
          .preview-content blockquote p {
            margin: 0;
          }
          .preview-content pre {
            background: #2d3748;
            color: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 24px 0;
          }
          .preview-content code {
            background: #f1f5f9;
            color: #e53e3e;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 14px;
            font-family: 'Courier New', monospace;
          }
          .preview-content pre code {
            background: none;
            color: #f7fafc;
            padding: 0;
          }
          .preview-content hr {
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 32px 0;
          }
          .preview-content mark {
            background-color: #fef08a;
            padding: 2px 4px;
            border-radius: 3px;
          }
        `,
        }}
      />

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)",
          }}
        >
          {/* Email Header */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "10px 20px",
              textAlign: "center",
            }}
          >
            <img
              src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg"
              alt="AbS"
              style={{
                maxWidth: "150px",
                height: "auto",
                margin: "0 auto 20px",
                display: "block",
                background: "white",
                padding: "10px",
                borderRadius: "12px",
              }}
            />
            <p
              style={{
                color: "#e0e7ff",
                fontSize: "14px",
                margin: "0",
              }}
            >
              Empowering Students Through Technology & Education
            </p>
          </div>

          {/* Email Content with Embedded Styles */}
          <div
            style={{
              padding: "40px 30px",
              lineHeight: "1.8",
              color: "#333",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
            }}
          >
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />

            {/* CTA Button */}
          </div>

          {/* Email Footer */}
          <div
            style={{
              background: "#1a202c",
              padding: "40px 30px",
              textAlign: "center",
              color: "#fff",
            }}
          >
            <h3
              style={{
                color: "#fff",
                fontSize: "20px",
                margin: "0 0 16px",
                fontWeight: "600",
              }}
            >
              About AbS
            </h3>
            <p
              style={{
                color: "#cbd5e0",
                fontSize: "14px",
                lineHeight: "1.7",
                margin: "0 0 20px",
              }}
            >
              Your comprehensive educational platform providing access to academic materials,
              scholarships, AI-powered learning tools, and career opportunities. Join thousands of
              students advancing their education with ABS.
            </p>

            <div style={{ margin: "24px 0" }}>
              <a
                href="https://www.abstechconnect.com/"
                style={{
                  display: "inline-block",
                  margin: "0 12px",
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                🌐 Website
              </a>
              <a
                href="https://x.com/ABSTEAM01"
                style={{
                  display: "inline-block",
                  margin: "0 12px",
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                🐦 Twitter
              </a>
              <a
                href="https://www.linkedin.com/company/abstechconnect1/"
                style={{
                  display: "inline-block",
                  margin: "0 12px",
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                💼 LinkedIn
              </a>
              <a
                href="https://web.facebook.com/people/ABS-Solution/61564113997916/"
                style={{
                  display: "inline-block",
                  margin: "0 12px",
                  color: "#60a5fa",
                  textDecoration: "none",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                📘 Facebook
              </a>
            </div>

            <div
              style={{
                borderTop: "1px solid #374151",
                margin: "24px 0",
              }}
            />

            <p
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                margin: "0",
                lineHeight: "1.6",
              }}
            >
              © 2025 AbS. All rights reserved.
              <br />
              Empowering education through innovation and technology.
            </p>
          </div>
        </div>

        {/* Back to Edit Button */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "12px 24px",
              background: "white",
              color: "#111827",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              fontSize: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
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
