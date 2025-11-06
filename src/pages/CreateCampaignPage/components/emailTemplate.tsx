export const wrapEmailTemplate = (content: string, subject: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <!--[if mso]>
    <style type="text/css">
    body, table, td {font-family: Arial, Helvetica, sans-serif !important;}
    </style>
    <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f3f4f6;">
        <tr>
            <td align="center" style="padding: 20px 10px;">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    
                    <!-- Header -->
                    <tr>
                        <td style="background-color: #667eea; padding: 30px 20px; text-align: center;">
                            <img src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg" 
                                 alt="AbS" 
                                 width="150" 
                                 style="max-width: 150px; height: auto; display: block; margin: 0 auto 15px; background: white; padding: 8px; border-radius: 8px;">
                            <p style="color: #e0e7ff; font-size: 14px; margin: 0; line-height: 1.4;">Empowering Students Through Technology & Education</p>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 30px 25px;">
                            <div style="font-size: 16px; line-height: 1.6; color: #374151;">
                                ${content}
                            </div>
                            
                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.abstechconnect.com/" 
                                           style="display: inline-block; padding: 14px 32px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                            Visit AbS →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a202c; padding: 30px 25px; text-align: center; color: #ffffff;">
                            <h3 style="color: #ffffff; font-size: 18px; margin: 0 0 12px; font-weight: 600;">About AbS</h3>
                            <p style="color: #cbd5e0; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
                                Your comprehensive educational platform providing access to academic materials, 
                                scholarships, AI-powered learning tools, and career opportunities.
                            </p>
                            
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.abstechconnect.com/" style="color: #60a5fa; text-decoration: none; font-size: 13px; margin: 0 8px;">Website</a>
                                        <span style="color: #4b5563; margin: 0 4px;">•</span>
                                        <a href="https://x.com/ABSTEAM01" style="color: #60a5fa; text-decoration: none; font-size: 13px; margin: 0 8px;">Twitter</a>
                                        <span style="color: #4b5563; margin: 0 4px;">•</span>
                                        <a href="https://www.linkedin.com/company/abstechconnect1/" style="color: #60a5fa; text-decoration: none; font-size: 13px; margin: 0 8px;">LinkedIn</a>
                                        <span style="color: #4b5563; margin: 0 4px;">•</span>
                                        <a href="https://web.facebook.com/people/ABS-Solution/61564113997916/" style="color: #60a5fa; text-decoration: none; font-size: 13px; margin: 0 8px;">Facebook</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 12px; color: #9ca3af; margin: 20px 0 0; line-height: 1.5; border-top: 1px solid #374151; padding-top: 20px;">
                                © 2025 AbS. All rights reserved.<br>
                                Empowering education through innovation and technology.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
<style>
    /* Content Styles - Minimal spacing for email clients */
    p { margin: 0 0 12px; font-size: 16px; color: #374151; line-height: 1.6; }
    h1 { font-size: 28px; font-weight: 700; margin: 20px 0 12px; color: #111827; line-height: 1.2; }
    h2 { font-size: 24px; font-weight: 600; margin: 18px 0 10px; color: #111827; line-height: 1.3; }
    h3 { font-size: 20px; font-weight: 600; margin: 16px 0 8px; color: #374151; line-height: 1.4; }
    strong, b { font-weight: 600; color: #111827; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    s { text-decoration: line-through; }
    ul, ol { margin: 12px 0; padding-left: 25px; }
    li { margin-bottom: 6px; color: #374151; font-size: 16px; line-height: 1.6; }
    a { color: #667eea; text-decoration: underline; }
    img { max-width: 100%; height: auto; display: block; margin: 16px auto; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 16px 0; }
    table td, table th { border: 1px solid #e5e7eb; padding: 10px; text-align: left; font-size: 15px; }
    table th { background-color: #f9fafb; font-weight: 600; color: #374151; }
    blockquote { border-left: 3px solid #667eea; padding: 10px 15px; margin: 16px 0; background-color: #f9fafb; font-style: italic; color: #6b7280; }
    pre { background-color: #1f2937; color: #f3f4f6; padding: 15px; border-radius: 6px; overflow-x: auto; margin: 16px 0; }
    code { background-color: #f3f4f6; color: #dc2626; padding: 2px 6px; border-radius: 3px; font-size: 14px; font-family: 'Courier New', monospace; }
    pre code { background: none; color: #f3f4f6; padding: 0; }
    hr { border: none; border-top: 2px solid #e5e7eb; margin: 20px 0; }
    mark { background-color: #fef08a; padding: 2px 4px; border-radius: 2px; }
</style>
    `;
};
