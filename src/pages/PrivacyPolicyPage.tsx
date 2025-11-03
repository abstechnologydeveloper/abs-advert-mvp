// ============================================
// FILE: src/pages/PrivacyPolicyPage.tsx
// ============================================
import React from "react";

const PrivacyPolicyPage: React.FC = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "We collect information you provide directly to us when you create an account, use our services, or communicate with us. This includes:",
        "• Account information (name, email address, password)",
        "• Profile information (company name, phone number, avatar)",
        "• Campaign data (email content, recipients, analytics)",
        "• Usage data (how you interact with our platform)",
        "• Technical data (IP address, browser type, device information)",
      ],
    },
    {
      title: "2. How We Use Your Information",
      content: [
        "We use the information we collect to:",
        "• Provide, maintain, and improve our services",
        "• Process and complete transactions",
        "• Send you technical notices and support messages",
        "• Respond to your comments and questions",
        "• Analyze usage patterns and trends",
        "• Protect against fraudulent or illegal activity",
        "• Comply with legal obligations",
      ],
    },
    {
      title: "3. Information Sharing and Disclosure",
      content: [
        "We do not sell your personal information. We may share your information in the following circumstances:",
        "• With your consent or at your direction",
        "• With service providers who perform services on our behalf",
        "• To comply with legal obligations or protect rights and safety",
        "• In connection with a merger, acquisition, or sale of assets",
        "• With analytics and advertising partners (in aggregated form)",
      ],
    },
    {
      title: "4. Data Security",
      content: [
        "We implement appropriate technical and organizational measures to protect your personal information, including:",
        "• Encryption of data in transit and at rest",
        "• Regular security assessments and audits",
        "• Access controls and authentication mechanisms",
        "• Employee training on data protection",
        "However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
      ],
    },
    {
      title: "5. Data Retention",
      content: [
        "We retain your information for as long as necessary to provide our services and fulfill the purposes outlined in this policy. Specific retention periods include:",
        "• Account information: Until account deletion",
        "• Campaign data: 2 years after campaign completion",
        "• Analytics data: 1 year",
        "• Legal records: As required by law",
        "You can request deletion of your data at any time through your account settings.",
      ],
    },
    {
      title: "6. Your Rights and Choices",
      content: [
        "Depending on your location, you may have certain rights regarding your personal information:",
        "• Access: Request a copy of your data",
        "• Correction: Update inaccurate information",
        "• Deletion: Request deletion of your data",
        "• Portability: Receive your data in a machine-readable format",
        "• Opt-out: Unsubscribe from marketing communications",
        "• Object: Object to certain processing activities",
        "To exercise these rights, contact us at privacy@quills.com",
      ],
    },
    {
      title: "7. Cookies and Tracking Technologies",
      content: [
        "We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings.",
        "Types of cookies we use:",
        "• Essential cookies: Required for the website to function",
        "• Analytics cookies: Help us understand how you use our site",
        "• Advertising cookies: Used to deliver relevant ads",
        "• Preference cookies: Remember your settings and choices",
      ],
    },
    {
      title: "8. Third-Party Services",
      content: [
        "Our platform may contain links to third-party websites and services. We are not responsible for the privacy practices of these third parties. We encourage you to read their privacy policies.",
      ],
    },
    {
      title: "9. Children's Privacy",
      content: [
        "Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.",
      ],
    },
    {
      title: "10. International Data Transfers",
      content: [
        "Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers in compliance with applicable laws.",
      ],
    },
    {
      title: "11. Changes to This Policy",
      content: [
        "We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the 'Last Updated' date. Your continued use of our services after changes constitutes acceptance of the updated policy.",
      ],
    },
    {
      title: "12. Contact Us",
      content: [
        "If you have questions or concerns about this Privacy Policy, please contact us:",
        "• Email: privacy@quills.com",
        "• Address: Quills Inc., 123 Privacy Lane, Tech City, TC 12345",
        "• Phone: +1 (555) 123-4567",
      ],
    },
  ];

  return (
    <div className="md:p-6 px-3 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <span>Last Updated: November 3, 2024</span>
          <span>•</span>
          <span>Effective Date: November 3, 2024</span>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
        <p className="text-gray-800 leading-relaxed">
          At AbS, we are committed to protecting your privacy and ensuring the security of your
          personal information. This Privacy Policy explains how we collect, use, disclose, and
          safeguard your information when you use our advertising platform and services.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 space-y-8">
          {sections.map((section, index) => (
            <div key={index} className="pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>
              <div className="space-y-2">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Questions About Your Privacy?</h3>
        <p className="text-gray-700 mb-4">
          We're here to help. If you have any questions about how we handle your data or want to
          exercise your privacy rights, don't hesitate to reach out to our privacy team.
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
          Contact Privacy Team
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>© 2024 Quills Inc. All rights reserved.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
