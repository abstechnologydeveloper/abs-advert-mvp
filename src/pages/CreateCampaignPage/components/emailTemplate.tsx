export const wrapEmailTemplate = (content: string, subject: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${subject}</title>
    <!--[if mso]>
    <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
    <style>
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-content { background-color: #1f2937 !important; }
            .email-header { background-color: #111827 !important; border-bottom-color: #374151 !important; }
            .email-footer { background-color: #111827 !important; border-top-color: #374151 !important; }
            .header-tagline { color: #9ca3af !important; }
            .content-text { color: #d1d5db !important; }
            .content-heading { color: #f9fafb !important; }
            .footer-text { color: #9ca3af !important; }
            .footer-link { color: #9ca3af !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6;">
        <tr>
            <td align="center" style="padding: 20px 10px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" class="email-content" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Compact Professional Header -->
                    <tr>
                        <td class="email-header" style="background-color: #ffffff; padding: 16px 24px; border-bottom: 1px solid #e5e7eb;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="vertical-align: middle; width: 70%;">
                                        <img src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg" 
                                             alt="AbS" 
                                             height="36"
                                             style="height: 36px; width: auto; display: block;">
                                    </td>
                                    <td align="right" style="vertical-align: middle; width: 30%;">
                                        <p class="header-tagline" style="color: #6b7280; font-size: 12px; margin: 0; font-weight: 500; white-space: nowrap;">Education & Technology</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 32px 24px;">
                            <div class="content-text" style="font-size: 16px; line-height: 1.7; color: #374151; overflow-wrap: break-word; word-wrap: break-word;">
                                ${content}
                            </div>
                            
                            <!-- Enhanced CTA Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 32px 0 16px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.abstechconnect.com/" 
                                           style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                                            Visit AbS Platform →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Compact Footer -->
                    <tr>
                        <td class="email-footer" style="background-color: #f9fafb; padding: 24px; border-top: 1px solid #e5e7eb;">
                            <!-- Social Links -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 16px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.abstechconnect.com/" class="footer-link" style="color: #6b7280; text-decoration: none; font-size: 12px; font-weight: 500; margin: 0 8px;">Website</a>
                                        <span style="color: #d1d5db; margin: 0 4px;">•</span>
                                        <a href="https://x.com/ABSTEAM01" class="footer-link" style="color: #6b7280; text-decoration: none; font-size: 12px; font-weight: 500; margin: 0 8px;">Twitter</a>
                                        <span style="color: #d1d5db; margin: 0 4px;">•</span>
                                        <a href="https://www.linkedin.com/company/abstechconnect1/" class="footer-link" style="color: #6b7280; text-decoration: none; font-size: 12px; font-weight: 500; margin: 0 8px;">LinkedIn</a>
                                        <span style="color: #d1d5db; margin: 0 4px;">•</span>
                                        <a href="https://web.facebook.com/people/ABS-Solution/61564113997916/" class="footer-link" style="color: #6b7280; text-decoration: none; font-size: 12px; font-weight: 500; margin: 0 8px;">Facebook</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Company Info -->
                            <p class="footer-text" style="font-size: 11px; color: #9ca3af; text-align: center; line-height: 1.5; margin: 0 0 12px;">
                                AbS - Empowering education through innovation and technology<br>
                                © 2025 AbS. All rights reserved.
                            </p>

                            <!-- Unsubscribe -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top: 1px solid #e5e7eb; padding-top: 12px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://admin.abstechconnect.com/unsubscribe" class="footer-link" style="color: #9ca3af; text-decoration: underline; font-size: 11px;">
                                            Unsubscribe from these emails
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
<style>
    /* Content Styles - Compact spacing with proper link handling */
    p { margin: 0 0 16px; font-size: 16px; color: #374151; line-height: 1.7; }
    h1 { font-size: 28px; font-weight: 700; margin: 24px 0 12px; color: #111827; line-height: 1.3; }
    h2 { font-size: 24px; font-weight: 600; margin: 20px 0 10px; color: #111827; line-height: 1.4; }
    h3 { font-size: 20px; font-weight: 600; margin: 16px 0 8px; color: #374151; line-height: 1.5; }
    strong, b { font-weight: 600; color: #111827; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    s { text-decoration: line-through; }
    ul, ol { margin: 12px 0; padding-left: 24px; }
    li { margin-bottom: 8px; color: #374151; font-size: 16px; line-height: 1.7; }
    a { color: #667eea; text-decoration: underline; word-wrap: break-word; overflow-wrap: anywhere; }
    img { max-width: 100%; height: auto; display: block; margin: 20px auto; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    table td, table th { border: 1px solid #e5e7eb; padding: 12px; text-align: left; font-size: 15px; }
    table th { background-color: #f9fafb; font-weight: 600; color: #374151; }
    blockquote { border-left: 3px solid #667eea; padding: 12px 16px; margin: 16px 0; background-color: #f9fafb; font-style: italic; color: #6b7280; }
    pre { background-color: #1f2937; color: #f3f4f6; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 16px 0; }
    code { background-color: #f3f4f6; color: #dc2626; padding: 2px 6px; border-radius: 3px; font-size: 14px; font-family: 'Courier New', monospace; }
    pre code { background: none; color: #f3f4f6; padding: 0; }
    hr { border: none; border-top: 2px solid #e5e7eb; margin: 24px 0; }
    mark { background-color: #fef08a; padding: 2px 4px; border-radius: 2px; }

    /* Dark mode styles */
    @media (prefers-color-scheme: dark) {
        p, li { color: #d1d5db !important; }
        h1, h2, strong, b { color: #f9fafb !important; }
        h3 { color: #e5e7eb !important; }
        a { color: #818cf8 !important; }
        blockquote { background-color: #1f2937 !important; color: #d1d5db !important; border-left-color: #818cf8 !important; }
        code { background-color: #374151 !important; color: #fca5a5 !important; }
        table th { background-color: #374151 !important; color: #f9fafb !important; }
        table td, table th { border-color: #4b5563 !important; }
    }
</style>
    `;
};
