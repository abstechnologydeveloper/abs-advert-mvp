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
        background: "#f3f4f6",
        padding: "40px 20px",
      }}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
          /* Force minimum font sizes for email clients */
          .preview-content * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
          }
          .preview-content { 
            overflow-wrap: break-word; 
            word-wrap: break-word;
            max-width: 100%;
            font-size: 17px !important;
            line-height: 1.6;
          }
          .preview-content p { 
            margin: 0 0 18px; 
            font-size: 17px !important;
            color: #1f2937;
            line-height: 1.7;
            min-height: 1em;
          }
          .preview-content h1 { 
            color: #111827;
            font-size: 32px !important;
            font-weight: 700;
            margin: 28px 0 16px;
            line-height: 1.3;
          }
          .preview-content h2 { 
            color: #111827;
            font-size: 26px !important;
            font-weight: 600;
            margin: 24px 0 14px;
            line-height: 1.4;
          }
          .preview-content h3 { 
            color: #374151;
            font-size: 22px !important;
            font-weight: 600;
            margin: 20px 0 12px;
            line-height: 1.5;
          }
          .preview-content strong,
          .preview-content b { 
            font-weight: 700;
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
            color: #1f2937;
            font-size: 17px !important;
            line-height: 1.7;
          }
          .preview-content li p {
            margin: 6px 0;
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
            margin: 24px auto;
            border-radius: 10px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
          }
          .preview-content table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 24px 0;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
          }
          .preview-content table td,
          .preview-content table th { 
            border: 1px solid #e5e7eb; 
            padding: 14px;
            text-align: left;
            font-size: 16px;
          }
          .preview-content table th { 
            background: #f9fafb; 
            font-weight: 600;
            color: #374151;
          }
          .preview-content blockquote { 
            border-left: 4px solid #667eea; 
            padding: 16px 20px; 
            margin: 20px 0;
            background: #f9fafb;
            font-style: italic; 
            color: #4b5563;
            border-radius: 0 8px 8px 0;
            font-size: 17px;
          }
          .preview-content blockquote p {
            margin: 0;
          }
          .preview-content pre {
            background: #1f2937;
            color: #f3f4f6;
            padding: 18px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
          }
          .preview-content code {
            background: #f3f4f6;
            color: #dc2626;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 15px;
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
            margin: 28px 0;
          }
          .preview-content mark {
            background-color: #fef08a;
            padding: 3px 6px;
            border-radius: 3px;
          }
        `,
        }}
      />

      <div style={{ maxWidth: "650px", margin: "0 auto" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: "16px",
            overflow: "hidden",
            boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
          }}
        >
          {/* Enhanced Header with Nigerian Student Appeal */}
          <div
            style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              padding: "24px 28px",
              borderBottom: "3px solid #5568d3",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <img
                src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg"
                alt="AbS"
                style={{
                  height: "48px",
                  width: "auto",
                  display: "block",
                  filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.2))",
                }}
              />
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    color: "#ffffff",
                    fontSize: "14px",
                    margin: "0",
                    fontWeight: "600",
                    textShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  🎓 Empowering Nigerian Students
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: "12px",
                    margin: "4px 0 0",
                    fontWeight: "500",
                  }}
                >
                  Education • Technology • Innovation
                </p>
              </div>
            </div>
          </div>

          {/* Email Content with Better Typography */}
          <div
            style={{
              padding: "40px 28px",
              lineHeight: "1.7",
              color: "#1f2937",
              fontFamily:
                "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif",
              background: "#ffffff",
              fontSize: "17px",
            }}
          >
            <div
              className="preview-content"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />

            {/* Enhanced CTA Button with More Appeal */}
            <div style={{ textAlign: "center", margin: "40px 0 24px" }}>
              <a
                href="https://www.abstechconnect.com/"
                style={{
                  display: "inline-block",
                  padding: "16px 40px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "#ffffff",
                  textDecoration: "none",
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: "17px",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.4)",
                  transition: "all 0.3s ease",
                  textTransform: "none",
                }}
              >
                🚀 Explore AbS Platform →
              </a>
              <p
                style={{
                  fontSize: "14px",
                  color: "#6b7280",
                  marginTop: "12px",
                  fontStyle: "italic",
                }}
              >
                Join thousands of Nigerian students already succeeding with AbS
              </p>
            </div>
          </div>

          {/* Enhanced Footer with Better Social Links */}
          <div
            style={{
              background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)",
              padding: "32px 28px",
              borderTop: "2px solid #e5e7eb",
            }}
          >
            {/* Value Proposition */}
            <div
              style={{
                textAlign: "center",
                marginBottom: "24px",
                padding: "20px",
                background: "#ffffff",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
              }}
            >
              <h4
                style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#111827",
                  margin: "0 0 12px",
                  lineHeight: "1.3",
                }}
              >
                🌟 What Makes AbS Special?
              </h4>
              <p
                style={{
                  fontSize: "15px",
                  color: "#4b5563",
                  lineHeight: "1.6",
                  margin: "0",
                }}
              >
                Free study materials • Scholarship opportunities • AI-powered tools
                <br />
                Career guidance • Tech resources • Student community
              </p>
            </div>

            {/* Enhanced Social Media Section */}
            <div style={{ marginBottom: "24px" }}>
              <p
                style={{
                  textAlign: "center",
                  fontSize: "15px",
                  fontWeight: "600",
                  color: "#374151",
                  marginBottom: "16px",
                }}
              >
                📱 Connect With Us On Social Media
              </p>
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{ margin: "0 auto" }}
              >
                <tr>
                  <td style={{ padding: "0 8px" }}>
                    <a
                      href="https://www.abstechconnect.com/"
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        background: "#667eea",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      🌐 Website
                    </a>
                  </td>
                  <td style={{ padding: "0 8px" }}>
                    <a
                      href="https://x.com/ABSTEAM01"
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        background: "#1DA1F2",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      🐦 Twitter
                    </a>
                  </td>
                  <td style={{ padding: "0 8px" }}>
                    <a
                      href="https://www.instagram.com/abstech_001?utm_source=qr&igsh=MTdneGc1bzY5OXBmeg=="
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        background:
                          "linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      📸 Instagram
                    </a>
                  </td>
                </tr>
              </table>
              <table
                role="presentation"
                cellPadding="0"
                cellSpacing="0"
                border={0}
                style={{ margin: "12px auto 0" }}
              >
                <tr>
                  <td style={{ padding: "0 8px" }}>
                    <a
                      href="https://www.linkedin.com/company/abstechconnect1/"
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        background: "#0077b5",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      💼 LinkedIn
                    </a>
                  </td>
                  <td style={{ padding: "0 8px" }}>
                    <a
                      href="https://web.facebook.com/people/ABS-Solution/61564113997916/"
                      style={{
                        display: "inline-block",
                        padding: "10px 18px",
                        background: "#1877f2",
                        color: "#ffffff",
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: "600",
                        borderRadius: "8px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    >
                      👥 Facebook
                    </a>
                  </td>
                </tr>
              </table>
            </div>

            {/* Company Info */}
            <p
              style={{
                fontSize: "13px",
                color: "#6b7280",
                textAlign: "center",
                lineHeight: "1.6",
                margin: "0 0 16px",
                padding: "16px 0",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <strong style={{ color: "#374151" }}>AbS</strong> - Your trusted partner for academic
              excellence
              <br />
              Empowering Nigerian students with quality education and technology
              <br />© 2025 AbS. All rights reserved.
            </p>

            {/* Unsubscribe Link */}
            <div
              style={{
                textAlign: "center",
                paddingTop: "16px",
                borderTop: "1px solid #e5e7eb",
              }}
            >
              <a
                href="{{unsubscribe_url}}"
                style={{
                  color: "#9ca3af",
                  textDecoration: "underline",
                  fontSize: "12px",
                }}
              >
                Unsubscribe from these emails
              </a>
            </div>
          </div>
        </div>

        {/* Back to Edit Button */}
        <div style={{ textAlign: "center", marginTop: "24px" }}>
          <button
            onClick={onClose}
            style={{
              padding: "12px 28px",
              background: "#ffffff",
              color: "#111827",
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              fontWeight: "700",
              fontSize: "15px",
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
