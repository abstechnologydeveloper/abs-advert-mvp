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
                    
                    <!-- Compact Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 16px 25px;">
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="vertical-align: middle;">
                                        <img src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg" 
                                             alt="AbS" 
                                             width="50" 
                                             height="50"
                                             style="width: 50px; height: 50px; display: block; background: white; padding: 6px; border-radius: 8px;">
                                    </td>
                                    <td style="vertical-align: middle; padding-left: 15px;">
                                        <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.2;">AbS</h2>
                                        <p style="margin: 2px 0 0; font-size: 13px; color: #e0e7ff; line-height: 1.3;">Empowering Students Through Tech & Education</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 30px 25px;">
                            <div style="font-size: 17px; line-height: 1.7; color: #374151;">
                                ${content}
                            </div>
                            
                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.abstechconnect.com/" 
                                           style="display: inline-block; padding: 16px 36px; background-color: #667eea; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 17px;">
                                            Visit AbS →
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- What Makes AbS Special Section -->
                    <tr>
                        <td style="background-color: #f0f9ff; padding: 25px 25px; border-top: 3px solid #667eea;">
                            <h3 style="color: #1e40af; font-size: 22px; font-weight: 700; margin: 0 0 16px; text-align: center; line-height: 1.3;">
                                🌟 What Makes AbS Special?
                            </h3>
                            
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
                                <tr>
                                    <td style="padding: 12px; background-color: #ffffff; border-radius: 8px; margin-bottom: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td width="40" style="vertical-align: top; padding-right: 12px;">
                                                    <div style="font-size: 28px; line-height: 1;">📚</div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b; line-height: 1.4;">
                                                        Free Study Materials
                                                    </p>
                                                    <p style="margin: 4px 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                                                        Access comprehensive resources across all subjects
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
                                <tr>
                                    <td style="padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td width="40" style="vertical-align: top; padding-right: 12px;">
                                                    <div style="font-size: 28px; line-height: 1;">🎓</div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b; line-height: 1.4;">
                                                        Scholarship Opportunities
                                                    </p>
                                                    <p style="margin: 4px 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                                                        Discover funding options for your education journey
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 8px;">
                                <tr>
                                    <td style="padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td width="40" style="vertical-align: top; padding-right: 12px;">
                                                    <div style="font-size: 28px; line-height: 1;">🤖</div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b; line-height: 1.4;">
                                                        AI-Powered Learning Tools
                                                    </p>
                                                    <p style="margin: 4px 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                                                        Smart study assistance and personalized learning
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding: 12px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
                                        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td width="40" style="vertical-align: top; padding-right: 12px;">
                                                    <div style="font-size: 28px; line-height: 1;">💼</div>
                                                </td>
                                                <td style="vertical-align: top;">
                                                    <p style="margin: 0; font-size: 16px; font-weight: 600; color: #1e293b; line-height: 1.4;">
                                                        Career Guidance & Tech Resources
                                                    </p>
                                                    <p style="margin: 4px 0 0; font-size: 14px; color: #64748b; line-height: 1.5;">
                                                        Navigate your career path with expert support
                                                    </p>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #1a202c; padding: 30px 25px; text-align: center; color: #ffffff;">
                            <h3 style="color: #ffffff; font-size: 20px; margin: 0 0 12px; font-weight: 600;">About AbS</h3>
                            <p style="color: #cbd5e0; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
                               Your comprehensive educational platform providing access to academic materials, scholarships, AI-powered learning tools, career opportunities, and student communities.
                            </p>
                            
                            <!-- Social Links -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 20px;">
                                <tr>
                                    <td align="center">
                                        <a href="https://www.abstechconnect.com/" style="color: #60a5fa; text-decoration: none; font-size: 14px; margin: 0 8px; display: inline-block;">🌐 Website</a>
                                        <span style="color: #4b5563; margin: 0 4px;">•</span>
                                        <a href="https://x.com/ABSTEAM01" style="color: #60a5fa; text-decoration: none; font-size: 14px; margin: 0 8px; display: inline-block;">🐦 Twitter</a>
                                        <span style="color: #4b5563; margin: 0 4px;">•</span>
                                        <a href="https://www.linkedin.com/company/abstechconnect1/" style="color: #60a5fa; text-decoration: none; font-size: 14px; margin: 0 8px; display: inline-block;">💼 LinkedIn</a>
                                    </td>
                                </tr>
                                <tr>
                                    <td align="center" style="padding-top: 8px;">
                                        <a href="https://web.facebook.com/people/ABS-Solution/61564113997916/" style="color: #60a5fa; text-decoration: none; font-size: 14px; margin: 0 8px; display: inline-block;">📘 Facebook</a>
                                        <span style="color: #4b5563; margin: 0 4px;">•</span>
                                        <a href="https://www.instagram.com/abstech_001" style="color: #60a5fa; text-decoration: none; font-size: 14px; margin: 0 8px; display: inline-block;">📷 Instagram</a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="font-size: 13px; color: #9ca3af; margin: 20px 0 0; line-height: 1.6; border-top: 1px solid #374151; padding-top: 20px;">
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
    /* Content Styles - Enhanced for mobile readability */
    p { margin: 0 0 14px; font-size: 17px; color: #374151; line-height: 1.7; }
    h1 { font-size: 30px; font-weight: 700; margin: 20px 0 14px; color: #111827; line-height: 1.2; }
    h2 { font-size: 26px; font-weight: 600; margin: 18px 0 12px; color: #111827; line-height: 1.3; }
    h3 { font-size: 22px; font-weight: 600; margin: 16px 0 10px; color: #374151; line-height: 1.4; }
    strong, b { font-weight: 600; color: #111827; }
    em, i { font-style: italic; }
    u { text-decoration: underline; }
    s { text-decoration: line-through; }
    ul, ol { margin: 14px 0; padding-left: 28px; }
    li { margin-bottom: 8px; color: #374151; font-size: 17px; line-height: 1.7; }
    a { color: #667eea; text-decoration: underline; }
    img { max-width: 100%; height: auto; display: block; margin: 18px auto; border-radius: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 18px 0; }
    table td, table th { border: 1px solid #e5e7eb; padding: 12px; text-align: left; font-size: 16px; }
    table th { background-color: #f9fafb; font-weight: 600; color: #374151; }
    blockquote { border-left: 3px solid #667eea; padding: 12px 16px; margin: 18px 0; background-color: #f9fafb; font-style: italic; color: #6b7280; }
    pre { background-color: #1f2937; color: #f3f4f6; padding: 16px; border-radius: 6px; overflow-x: auto; margin: 18px 0; }
    code { background-color: #f3f4f6; color: #dc2626; padding: 3px 7px; border-radius: 3px; font-size: 15px; font-family: 'Courier New', monospace; }
    pre code { background: none; color: #f3f4f6; padding: 0; }
    hr { border: none; border-top: 2px solid #e5e7eb; margin: 24px 0; }
    mark { background-color: #fef08a; padding: 2px 5px; border-radius: 2px; }
    
    /* Mobile Optimization */
    @media only screen and (max-width: 600px) {
        p { font-size: 16px !important; line-height: 1.6 !important; }
        h1 { font-size: 26px !important; }
        h2 { font-size: 22px !important; }
        h3 { font-size: 20px !important; }
        li { font-size: 16px !important; }
        table td, table th { font-size: 15px !important; padding: 10px !important; }
        code { font-size: 14px !important; }
        .special-features h3 { font-size: 20px !important; }
        .special-features p { font-size: 15px !important; }
    }
</style>
    `;
};
