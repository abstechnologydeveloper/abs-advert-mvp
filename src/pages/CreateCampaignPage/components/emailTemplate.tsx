export const wrapEmailTemplate = (content: string, subject: string): string => {
  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="format-detection" content="telephone=no,address=no,email=no,date=no,url=no">
    <meta name="color-scheme" content="light dark">
    <meta name="supported-color-schemes" content="light dark">
    <title>${subject}</title>
    <!--[if mso]>
    <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    table {border-collapse: collapse;}
    </style>
    <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <style>
        /* Reset and Base Styles */
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            margin: 0 !important; 
            padding: 0 !important; 
            background-color: #f3f4f6 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; }
        
        /* Force Minimum Font Sizes */
        p, li, td, span, div { 
            font-size: 17px !important; 
            line-height: 1.7 !important;
            -webkit-text-size-adjust: 100%;
            -ms-text-size-adjust: 100%;
        }
        h1 { font-size: 32px !important; line-height: 1.3 !important; }
        h2 { font-size: 26px !important; line-height: 1.4 !important; }
        h3 { font-size: 22px !important; line-height: 1.5 !important; }
        
        /* Mobile Responsive */
        @media only screen and (max-width: 600px) {
            .email-content { width: 100% !important; min-width: 100% !important; }
            .social-button { 
                display: block !important; 
                width: 100% !important; 
                margin: 8px 0 !important;
                text-align: center !important;
            }
            .header-flex { flex-direction: column !important; text-align: center !important; }
            p, li { font-size: 16px !important; }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-content { background-color: #1f2937 !important; }
            .email-header { background-color: #111827 !important; }
            .email-footer { background-color: #111827 !important; }
            .content-text { color: #d1d5db !important; }
            .content-heading { color: #f9fafb !important; }
        }
        
        /* Prevent Gmail blue links */
        a[x-apple-data-detectors] {
            color: inherit !important;
            text-decoration: none !important;
            font-size: inherit !important;
            font-family: inherit !important;
            font-weight: inherit !important;
            line-height: inherit !important;
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6; min-width: 100%;">
        <tr>
            <td align="center" style="padding: 20px 10px;">
                <table role="presentation" width="650" cellpadding="0" cellspacing="0" border="0" class="email-content" style="max-width: 650px; width: 100%; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.15);">
                    
                    <!-- Enhanced Header -->
                    <tr>
                        <td class="email-header" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 24px 28px; border-bottom: 3px solid #5568d3;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="header-flex">
                                <tr>
                                    <td style="vertical-align: middle; width: 50%;">
                                        <img src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg" 
                                             alt="AbS" 
                                             height="48"
                                             style="height: 48px; width: auto; display: block; filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));">
                                    </td>
                                    <td align="right" style="vertical-align: middle; width: 50%;">
                                        <p style="color: #ffffff; font-size: 14px; margin: 0; font-weight: 600; text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
                                            🎓 Empowering Nigerian Students
                                        </p>
                                        <p style="color: rgba(255,255,255,0.9); font-size: 12px; margin: 4px 0 0; font-weight: 500;">
                                            Education • Technology • Innovation
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 40px 28px;">
                            <div class="content-text" style="font-size: 17px; line-height: 1.7; color: #1f2937; overflow-wrap: break-word; word-wrap: break-word;">
                                ${content}
                            </div>
                            
                            <!-- Enhanced CTA Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 40px 0 24px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.abstechconnect.com/" 
                                           style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff !important; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 17px; box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);">
                                            🚀 Explore AbS Platform →
                                        </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 12px;">
                                        <p style="font-size: 14px; color: #6b7280; margin: 0; font-style: italic;">
                                            Join thousands of Nigerian students already succeeding with AbS
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Enhanced Footer -->
                    <tr>
                        <td class="email-footer" style="background: linear-gradient(to bottom, #f9fafb, #f3f4f6); padding: 32px 28px; border-top: 2px solid #e5e7eb;">
                            
                            <!-- Value Proposition Box -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px; background: #ffffff; border-radius: 10px; border: 1px solid #e5e7eb;">
                                <tr>
                                    <td style="padding: 20px; text-align: center;">
                                        <h4 style="font-size: 18px; font-weight: 700; color: #111827; margin: 0 0 12px; line-height: 1.3;">
                                            🌟 What Makes AbS Special?
                                        </h4>
                                        <p style="font-size: 15px; color: #4b5563; line-height: 1.6; margin: 0;">
                                            Free study materials • Scholarship opportunities • AI-powered tools<br/>
                                            Career guidance • Tech resources • Student community
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <!-- Enhanced Social Media Section -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 24px;">
                                <tr>
                                    <td align="center">
                                        <p style="font-size: 15px; font-weight: 600; color: #374151; margin: 0 0 16px;">
                                            📱 Connect With Us On Social Media
                                        </p>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center">
                                        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto;">
                                            <tr>
                                                <td style="padding: 4px;">
                                                    <a href="https://www.abstechconnect.com/" class="social-button"
                                                       style="display: inline-block; padding: 10px 18px; background: #667eea; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                                        🌐 Website
                                                    </a>
                                                </td>
                                                <td style="padding: 4px;">
                                                    <a href="https://x.com/ABSTEAM01" class="social-button"
                                                       style="display: inline-block; padding: 10px 18px; background: #1DA1F2; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                                        🐦 Twitter
                                                    </a>
                                                </td>
                                                <td style="padding: 4px;">
                                                    <a href="https://www.instagram.com/abstech_001?utm_source=qr&igsh=MTdneGc1bzY5OXBmeg==" class="social-button"
                                                       style="display: inline-block; padding: 10px 18px; background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                                        📸 Instagram
                                                    </a>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" style="height: 8px;"></td>
                                            </tr>
                                            <tr>
                                                <td colspan="3" align="center">
                                                    <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                                        <tr>
                                                            <td style="padding: 4px;">
                                                                <a href="https://www.linkedin.com/company/abstechconnect1/" class="social-button"
                                                                   style="display: inline-block; padding: 10px 18px; background: #0077b5; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                                                    💼 LinkedIn
                                                                </a>
                                                            </td>
                                                            <td style="padding: 4px;">
                                                                <a href="https://web.facebook.com/people/ABS-Solution/61564113997916/" class="social-button"
                                                                   style="display: inline-block; padding: 10px 18px; background: #1877f2; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 600; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                                                                    👥 Facebook
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
                            
                            <!-- Company Info -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 16px 0; border-top: 1px solid #e5e7eb;">
                                        <p style="font-size: 13px; color: #6b7280; line-height: 1.6; margin: 0;">
                                            <strong style="color: #374151;">AbS</strong> - Your trusted partner for academic excellence<br/>
                                            Empowering Nigerian students with quality education and technology<br/>
                                            © 2025 AbS. All rights reserved.
                                        </p>
                                    </td>
                                </tr>
                            </table>

                            <!-- Unsubscribe -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding-top: 16px; border-top: 1px solid #e5e7eb;">
                                        <a href="https://ads.abstechconnect.com/unsubscribe"
                                           style="color: #9ca3af; text-decoration: underline; font-size: 12px;">
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
    /* Content Styles - Enhanced for email clients */
    p { margin: 0 0 18px; font-size: 17px !important; color: #1f2937; line-height: 1.7; }
    h1 { font-size: 32px !important; font-weight: 700; margin: 28px 0 16px; color: #111827; line-height: 1.3; }
    h2 { font-size: 26px !important; font-weight: 600; margin: 24px 0 14px; color: #111827; line-height: 1.4; }
    h3 { font-size: 22px !important; font-weight: 600; margin: 20px 0 12px; color: #374151; line-height: 1.5; }
    strong, b { font-weight: 700; color: #111827; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    s { text-decoration: line-through; }
    ul, ol { margin: 16px 0; padding-left: 28px; }
    li { margin-bottom: 10px; color: #1f2937; font-size: 17px !important; line-height: 1.7; }
    a { color: #667eea !important; text-decoration: underline; word-wrap: break-word; overflow-wrap: anywhere; }
    img { max-width: 100%; height: auto; display: block; margin: 24px auto; border-radius: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    table td, table th { border: 1px solid #e5e7eb; padding: 14px; text-align: left; font-size: 16px; }
    table th { background-color: #f9fafb; font-weight: 600; color: #374151; }
    blockquote { border-left: 4px solid #667eea; padding: 16px 20px; margin: 20px 0; background-color: #f9fafb; font-style: italic; color: #4b5563; font-size: 17px; }
    pre { background-color: #1f2937; color: #f3f4f6; padding: 18px; border-radius: 8px; overflow-x: auto; margin: 20px 0; }
    code { background-color: #f3f4f6; color: #dc2626; padding: 3px 8px; border-radius: 4px; font-size: 15px; font-family: 'Courier New', monospace; }
    pre code { background: none; color: #f3f4f6; padding: 0; }
    hr { border: none; border-top: 2px solid #e5e7eb; margin: 28px 0; }
    mark { background-color: #fef08a; padding: 3px 6px; border-radius: 3px; }
</style>
    `;
};
