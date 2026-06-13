const ABS_LOGO_URL =
  "https://www.abstechconnect.com/abs_logo.jpg";
const ABS_WEB_URL = "https://www.abstechconnect.com/";
const ABS_PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.abstech.absmvp.prod";
const ABS_APP_STORE_URL = "https://apps.apple.com/app/abs-tech/id6502200174";

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export const wrapEmailTemplate = (content: string, subject: string): string => {
  const safeSubject = escapeHtml(subject || "AbS Campaign");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>${safeSubject}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td, a, p, h1, h2, h3 { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background:#eef2f7;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;line-height:1px;font-size:1px;">
    ${safeSubject}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;background:#eef2f7;margin:0;padding:0;">
    <tr>
      <td align="center" style="padding:28px 12px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:640px;border-collapse:separate;border-spacing:0;">
          <tr>
            <td style="padding:0 6px 14px 6px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;color:#64748b;font-weight:700;letter-spacing:.08em;text-transform:uppercase;">
                    Absolute Solution
                  </td>
                  <td align="right" style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:18px;">
                    <a href="${ABS_WEB_URL}" style="color:#2563eb;text-decoration:none;font-weight:700;">Open AbS</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background:#ffffff;border:1px solid #d9e2ef;border-radius:20px;overflow:hidden;box-shadow:0 14px 40px rgba(15,23,42,.08);">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="padding:22px 26px;background:#ffffff;border-bottom:1px solid #e5e7eb;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td width="58" valign="middle" style="padding:0;">
                          <img src="${ABS_LOGO_URL}" alt="AbS" width="48" height="48" style="display:block;width:48px;height:48px;border:0;border-radius:12px;background:#ffffff;">
                        </td>
                        <td valign="middle" style="padding:0;font-family:Arial,Helvetica,sans-serif;">
                          <div style="margin:0;color:#0f172a;font-size:19px;line-height:24px;font-weight:800;">AbS</div>
                          <div style="margin:2px 0 0;color:#64748b;font-size:13px;line-height:18px;">Study smarter across web and mobile.</div>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:32px 28px 10px 28px;background:#ffffff;">
                    <!-- ABS_CAMPAIGN_CONTENT_START -->
                    <div class="email-editor-content" style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.68;color:#1f2937;">
                      ${content}
                    </div>
                    <!-- ABS_CAMPAIGN_CONTENT_END -->
                  </td>
                </tr>

                <tr>
                  <td align="center" style="padding:18px 28px 34px 28px;background:#ffffff;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="#2563eb" style="border-radius:999px;">
                          <a href="${ABS_WEB_URL}" style="display:inline-block;padding:14px 24px;border-radius:999px;background:#2563eb;color:#ffffff;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:18px;font-weight:800;text-decoration:none;">
                            Continue on AbS
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:0 28px 30px 28px;background:#ffffff;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #dbeafe;border-radius:16px;background:#eff6ff;">
                      <tr>
                        <td style="padding:18px 18px;font-family:Arial,Helvetica,sans-serif;color:#1e3a8a;font-size:14px;line-height:21px;">
                          <strong style="color:#1d4ed8;">Available everywhere:</strong>
                          open AbS on the web, Google Play, or the App Store whenever you are ready to continue.
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 18px 18px 18px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;">
                          <a href="${ABS_WEB_URL}" style="color:#2563eb;text-decoration:none;font-weight:800;">Web</a>
                          <span style="color:#93a4bd;"> &nbsp;|&nbsp; </span>
                          <a href="${ABS_PLAY_STORE_URL}" style="color:#2563eb;text-decoration:none;font-weight:800;">Google Play</a>
                          <span style="color:#93a4bd;"> &nbsp;|&nbsp; </span>
                          <a href="${ABS_APP_STORE_URL}" style="color:#2563eb;text-decoration:none;font-weight:800;">App Store</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style="padding:22px 28px;background:#0f172a;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" style="font-family:Arial,Helvetica,sans-serif;color:#cbd5e1;font-size:12px;line-height:18px;">
                          You are receiving this email from AbS because you use Absolute Solution services.<br>
                          <a href="${ABS_WEB_URL}" style="color:#93c5fd;text-decoration:none;">abstechconnect.com</a>
                          <span style="color:#475569;"> &nbsp;|&nbsp; </span>
                          <a href="https://www.abstechconnect.com/unsubscribe" style="color:#93c5fd;text-decoration:underline;">Unsubscribe</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td align="center" style="padding:18px 8px 0 8px;font-family:Arial,Helvetica,sans-serif;color:#94a3b8;font-size:12px;line-height:18px;">
              Absolute Solution. Education technology for students.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <style>
    .email-editor-content p { margin:0 0 15px; color:#1f2937; font-size:16px; line-height:1.68; }
    .email-editor-content h1 { margin:0 0 14px; color:#0f172a; font-size:32px; line-height:1.12; font-weight:800; letter-spacing:0; }
    .email-editor-content h2 { margin:24px 0 10px; color:#0f172a; font-size:23px; line-height:1.24; font-weight:800; letter-spacing:0; }
    .email-editor-content h3 { margin:20px 0 8px; color:#111827; font-size:18px; line-height:1.32; font-weight:800; letter-spacing:0; }
    .email-editor-content strong, .email-editor-content b { color:#0f172a; font-weight:800; }
    .email-editor-content a { color:#2563eb; text-decoration:underline; font-weight:800; }
    .email-editor-content img { max-width:100%; height:auto; display:block; margin:18px auto; border:0; border-radius:14px; }
    .email-editor-content ul, .email-editor-content ol { margin:12px 0 18px; padding-left:24px; }
    .email-editor-content li { margin:0 0 8px; color:#1f2937; font-size:16px; line-height:1.62; }
    .email-editor-content blockquote { margin:18px 0; padding:14px 16px; border-left:4px solid #2563eb; background:#eff6ff; color:#1e3a8a; border-radius:0 10px 10px 0; }
    .email-editor-content table { width:100%; border-collapse:collapse; margin:18px 0; }
    .email-editor-content table td, .email-editor-content table th { border:1px solid #e5e7eb; padding:12px; font-size:14px; line-height:20px; color:#1f2937; }
    .email-editor-content table th { background:#f8fafc; color:#0f172a; font-weight:800; }
    .email-editor-content hr { border:0; border-top:1px solid #e5e7eb; margin:24px 0; }
    @media only screen and (max-width:600px) {
      .email-editor-content h1 { font-size:26px !important; }
      .email-editor-content h2 { font-size:20px !important; }
      .email-editor-content h3 { font-size:17px !important; }
      .email-editor-content p, .email-editor-content li { font-size:15px !important; line-height:1.6 !important; }
    }
  </style>
</body>
</html>`;
};
