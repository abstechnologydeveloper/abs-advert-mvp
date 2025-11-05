
import React from "react";
import { useNavigate } from "react-router-dom";

const PrivacyPolicyPage: React.FC = () => {
    const navigate = useNavigate();
  const sections = [
    {
      title: "1. Information We Collect",
      content: [
        "We collect only the information necessary to deliver advertising and partnership services effectively.",
        "From users (AbS audience):",
        "• Name",
        "• Email address",
        "• Phone number",
        "• Educational level and school",
        "• Interaction data collected through analytics tools (for performance insights only)",
        "From partners:",
        "• Company name and contact details",
        "• Campaign-related uploads or submissions",
        "• Engagement metrics from published campaigns (always anonymized)",
      ],
    },
    {
      title: "2. How We Use This Information",
      content: [
        "We process collected data to:",
        "• Deliver relevant ads and educational opportunities to the right audience segments (e.g., postgraduate or undergraduate categories).",
        "• Allow partners to publish, manage, and monitor campaign performance on the AbS platform.",
        "• Improve ad targeting accuracy and measure engagement using analytics tools.",
        "• Communicate with partners regarding campaign performance, content approval, and technical support.",
        "All user data used for targeting or analytics is anonymized and never shared directly with external partners.",
      ],
    },
    {
      title: "3. Data Sharing and Access",
      content: [
        "AbS does not sell, rent, or disclose personally identifiable user information to any partner or third party.",
        "Partners receive only aggregated and anonymized metrics, such as impressions or engagement rates.",
        "Internal access to user or partner data is strictly limited to authorized AbS personnel for operational purposes.",
      ],
    },
    {
      title: "4. Consent and User Rights",
      content: [
        "All users give consent to data collection and processing when signing up on the AbS platform.",
        "Under NDPR, users have the right to:",
        "• Access a copy of their personal data.",
        "• Correct inaccurate or incomplete data.",
        "• Withdraw consent for promotional or targeted campaigns at any time.",
        "Users may manage these rights through their account settings or by contacting our Data Protection Officer at support@abstechconnect.com or calling 09052728257 / 09025252652.",
        "Every promotional email from AbS includes an “unsubscribe” link to allow easy opt-out.",
      ],
    },
    {
      title: "5. Partner Access and Responsibilities",
      content: [
        "Approved partners (such as I’lltip) receive publishing access through a dedicated dashboard.",
        "All partner submissions pass through AbS’s review and approval before publication.",
        "Partners must ensure that any submitted content complies with AbS’s policies and NDPR standards.",
        "Partner access credentials are unique, monitored, and protected against unauthorized use.",
      ],
    },
    {
      title: "6. Data Retention",
      content: [
        "User data is retained for as long as the user maintains an active AbS account.",
        "Inactive accounts are flagged after 24 months and permanently deleted after 36 months of inactivity.",
        "Analytics logs and campaign data are stored for 12 months for performance evaluation, after which they are anonymized or deleted.",
        "Users and partners may request data deletion at any time by contacting the AbS DPO.",
      ],
    },
    {
      title: "7. Data Security",
      content: [
        "AbS implements multiple security measures to safeguard all data collected or processed:",
        "• Encrypted cloud storage",
        "• Strict access control with user-level permissions",
        "• Regular internal security audits and compliance checks",
        "We continually assess our systems to prevent unauthorized access, data loss, or misuse.",
      ],
    },
    {
      title: "8. Data Breach Protocol",
      content: [
        "In the unlikely event of a data breach affecting personal or partner data, AbS will:",
        "• Notify affected users or partners within 72 hours, and",
        "• Report the incident to the Nigeria Data Protection Commission (NDPC), as required by NDPR.",
      ],
    },
    {
      title: "9. Analytics and Performance Tracking",
      content: [
        "We use internal analytics tools to measure campaign reach, audience engagement, and performance trends.",
        "All analytics data is aggregated and anonymized before analysis. No identifiable user data is tracked for advertising purposes.",
      ],
    },
    {
      title: "10. Contact & Data Protection Officer",
      content: [
        "For questions, data access requests, or complaints about this Privacy Policy, contact our Data Protection Officer (DPO):",
        "• Email: support@abstechconnect.com",
        "• Phone: 09052728257, 09025252652",
        "• Organization: Absolute Solution (AbS)",
      ],
    },
    {
      title: "11. Policy Updates",
      content: [
        "AbS may update this Privacy Policy periodically to reflect changes in regulation, technology, or operations.",
        "Any changes will be communicated through our website and partner dashboards, with the new effective date clearly stated.",
      ],
    },
    {
      title: "12. Acceptance",
      content: [
        "By using the AbS platform or participating in the Ads Campaign and Partner Program, you acknowledge that you have read, understood, and agreed to this Privacy Policy.",
      ],
    },
  ];

  return (
    <div className="md:p-6 px-3 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AbS Ads Campaign & Partner Program Privacy Policy
        </h1>
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <span>Last Updated: 5th Nov., 2025</span>
          <span>•</span>
          <span>Effective Date: 5th Nov., 2025</span>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
        <p className="text-gray-800 leading-relaxed">
          At Absolute Solution (AbS), we value the privacy of our users and partners. This Privacy
          Policy explains how we collect, use, protect, and manage information in connection with
          the AbS Ads Campaign and Partner Program. Our practices follow the Nigeria Data Protection
          Regulation (NDPR) and reflect our commitment to transparency and data security.
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
          exercise your privacy rights, don't hesitate to reach out to our Data Protection Officer.
        </p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          onClick={() => navigate(`/contact-us`)}
        >
          Contact Privacy Team
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>© 2025 Absolute Solution (AbS). All rights reserved.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
