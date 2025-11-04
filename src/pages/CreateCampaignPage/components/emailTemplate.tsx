export const wrapEmailTemplate = (content: string, subject: string): string => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${subject}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            margin: 0; 
            padding: 0; 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            
        }
        .email-container { 
            max-width: 700px; 
            margin: 0 auto; 
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }
        .email-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 10px 20px;
            text-align: center;
        }
        .email-logo {
            max-width: 150px;
            height: auto;
            margin: 0 auto 20px;
            display: block;
            background: white;
            padding: 10px;
            border-radius: 12px;
        }
        .email-header h1 {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0 0 8px;
        }
        .email-header p {
            color: #e0e7ff;
            font-size: 14px;
            margin: 0;
        }
        .email-content { 
            padding: 40px 30px;
            line-height: 1.8;
            color: #333;
        }
        
        /* Typography - Direct element styling */
        .email-content p { 
            margin: 0 0 16px; 
            font-size: 16px;
            color: #4a5568;
            line-height: 1.8;
        }
        
        .email-content h1 { 
            color: #1a202c;
            font-size: 32px;
            font-weight: 700;
            margin: 32px 0 16px;
            line-height: 1.2;
        }
        
        .email-content h2 { 
            color: #1a202c;
            font-size: 26px;
            font-weight: 600;
            margin: 28px 0 14px;
            line-height: 1.3;
        }
        
        .email-content h3 { 
            color: #2d3748;
            font-size: 22px;
            font-weight: 600;
            margin: 24px 0 12px;
            line-height: 1.4;
        }
        
        .email-content strong,
        .email-content b { 
            font-weight: 600;
            color: #1a202c;
        }
        
        .email-content em,
        .email-content i { 
            font-style: italic;
        }
        
        .email-content u {
            text-decoration: underline;
        }
        
        .email-content s {
            text-decoration: line-through;
        }
        
        /* Lists */
        .email-content ul,
        .email-content ol { 
            margin: 16px 0 16px 0; 
            padding-left: 28px;
        }
        
        .email-content ul {
            list-style-type: disc;
        }
        
        .email-content ol {
            list-style-type: decimal;
        }
        
        .email-content li { 
            margin-bottom: 10px;
            color: #4a5568;
            font-size: 16px;
            line-height: 1.7;
        }
        
        .email-content li p {
            margin: 4px 0;
        }
        
        /* Links */
        .email-content a { 
            color: #667eea; 
            text-decoration: underline;
            font-weight: 500;
        }
        
        .email-content a:hover { 
            color: #5568d3;
        }
        
        /* Images */
        .email-content img,
        .email-content-image { 
            max-width: 100% !important; 
            height: auto !important; 
            display: block; 
            margin: 24px auto;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        /* Tables */
        .email-content table,
        .email-table { 
            width: 100%; 
            border-collapse: collapse; 
            margin: 24px 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        }
        
        .email-content table td,
        .email-content table th,
        .email-table td,
        .email-table th { 
            border: 1px solid #e2e8f0; 
            padding: 14px;
            text-align: left;
            font-size: 15px;
        }
        
        .email-content table th,
        .email-table th { 
            background: #f7fafc; 
            font-weight: 600;
            color: #2d3748;
        }
        
        .email-content table tbody tr:hover {
            background: #f9fafb;
        }
        
        /* Blockquote */
        .email-content blockquote { 
            border-left: 4px solid #667eea; 
            padding: 16px 20px; 
            margin: 24px 0;
            background: #f7fafc;
            font-style: italic; 
            color: #4a5568;
            border-radius: 0 8px 8px 0;
        }
        
        .email-content blockquote p {
            margin: 0;
        }
        
        /* Code blocks */
        .email-content pre {
            background: #2d3748;
            color: #f7fafc;
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 24px 0;
        }
        
        .email-content code {
            background: #f1f5f9;
            color: #e53e3e;
            padding: 3px 6px;
            border-radius: 4px;
            font-size: 14px;
            font-family: 'Courier New', monospace;
        }
        
        .email-content pre code {
            background: none;
            color: #f7fafc;
            padding: 0;
        }
        
        /* Horizontal Rule */
        .email-content hr {
            border: none;
            border-top: 2px solid #e2e8f0;
            margin: 32px 0;
        }
        
        /* Highlights */
        .email-content mark {
            background-color: #fef08a;
            padding: 2px 4px;
            border-radius: 3px;
        }
        
        /* Text alignment */
        .email-content [style*="text-align: center"] {
            text-align: center;
        }
        
        .email-content [style*="text-align: right"] {
            text-align: right;
        }
        
        .email-content [style*="text-align: left"] {
            text-align: left;
        }
        
        .email-content [style*="text-align: justify"] {
            text-align: justify;
        }
        
        /* CTA Button */
        .cta-button {
            display: inline-block;
            padding: 18px 36px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            text-decoration: none !important;
            border-radius: 10px;
            font-weight: 600;
            font-size: 16px;
            margin: 32px 0;
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
            transition: all 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.5);
        }
        
        /* Footer */
        .email-footer {
            background: #1a202c;
            padding: 40px 30px;
            text-align: center;
            color: #fff;
        }
        
        .email-footer h3 {
            color: #fff;
            font-size: 20px;
            margin: 0 0 16px;
            font-weight: 600;
        }
        
        .email-footer p {
            color: #cbd5e0;
            font-size: 14px;
            line-height: 1.7;
            margin: 0 0 20px;
        }
        
        .social-links {
            margin: 24px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 12px;
            color: #60a5fa;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
            transition: color 0.2s;
        }
        
        .social-links a:hover {
            color: #93c5fd;
        }
        
        .footer-divider {
            border-top: 1px solid #374151;
            margin: 24px 0;
        }
        
        .copyright {
            font-size: 12px;
            color: #9ca3af;
            margin: 0;
            line-height: 1.6;
        }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            body {
                padding: 20px 10px;
            }
            
            .email-container {
                border-radius: 12px;
            }
            
            .email-header,
            .email-content,
            .email-footer {
                padding: 24px 20px;
            }
            
            .email-header h1 {
                font-size: 24px;
            }
            
            .email-content h1 {
                font-size: 26px;
            }
            
            .email-content h2 {
                font-size: 22px;
            }
            
            .email-content h3 {
                font-size: 18px;
            }
            
            .cta-button {
                padding: 14px 28px;
                font-size: 15px;
            }
            
            .social-links a {
                display: block;
                margin: 8px 0;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="email-header">
            <img src="https://aws-s3-aws-bucket.s3.us-east-1.amazonaws.com/uploads/1762192698428-ABS_New_Logo.jpg" 
                 alt="AbS" 
                 class="email-logo">
            <p>Empowering Students Through Technology & Education</p>
        </div>

        <!-- Main Content -->
        <div class="email-content">
            ${content}
            <!-- Call-to-Action -->
            <div style="text-align: center; margin: 40px 0;">
                <a href="https://www.abstechconnect.com/" class="cta-button">
                    Visit AbS →
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div class="email-footer">
            <h3>About AbS</h3>
            <p>
                Your comprehensive educational platform providing access to academic materials, 
                scholarships, AI-powered learning tools, and career opportunities. Join thousands 
                of students advancing their education with ABS.
            </p>
            
            <div class="social-links">
                <a href="https://www.abstechconnect.com/">🌐 Website</a>
                <a href="https://x.com/ABSTEAM01">🐦 Twitter</a>
                <a href="https://www.linkedin.com/company/abstechconnect1/">💼 LinkedIn</a>
                <a href="https://web.facebook.com/people/ABS-Solution/61564113997916/">📘 Facebook</a>
            </div>

            <div class="footer-divider"></div>
            
            <p class="copyright">
                © 2025 AbS. All rights reserved.<br>
                Empowering education through innovation and technology.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};
