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
        "  - Name",
        "  - Email address",
        "  - Phone number",
        "  - Educational level and school",
        "  - Interaction data collected through analytics tools (for performance insights only)",
        "From advertisers and partners:",
        "  - Company or individual name and contact details",
        "  - Campaign-related uploads, creatives, or submissions",
        "  - Engagement metrics from published campaigns (always anonymized)",
      ],
    },
    {
      title: "2. How We Use This Information",
      content: [
        "We process collected data to:",
        "  - Deliver relevant ads and educational opportunities to the right audience segments (e.g., postgraduate or undergraduate categories).",
        "  - Allow advertisers and partners to publish, manage, and monitor campaign performance on the AbS Ads platform.",
        "  - Improve ad targeting accuracy and measure engagement using analytics tools.",
        "  - Communicate with advertisers regarding campaign performance, content approval, billing, and technical support.",
        "All user data used for targeting or analytics is anonymized and never shared directly with external advertisers or partners.",
      ],
    },
    {
      title: "3. Data Sharing and Access",
      content: [
        "AbS does not sell, rent, or disclose personally identifiable user information to any advertiser or third party.",
        "Advertisers receive only aggregated and anonymized metrics, such as impressions, clicks, or engagement rates.",
        "Internal access to user or advertiser data is strictly limited to authorized AbS personnel for operational purposes.",
      ],
    },
    {
      title: "4. Consent and User Rights",
      content: [
        "All users give consent to data collection and processing when signing up on the AbS platform.",
        "Under NDPR, users have the right to:",
        "  - Access a copy of their personal data.",
        "  - Correct inaccurate or incomplete data.",
        "  - Withdraw consent for promotional or targeted campaigns at any time.",
        "Users may manage these rights through their account settings or by contacting our Data Protection Officer at support@abstechconnect.com or calling 09052728257 / 09025252652.",
        "Every promotional email from AbS includes an unsubscribe link to allow easy opt-out.",
      ],
    },
    {
      title: "5. Advertiser Access and Responsibilities",
      content: [
        "Approved advertisers receive publishing access through the dedicated AbS Ads dashboard.",
        "The platform supports Email Campaigns (for approved partners), App & Web Ads, and Blog Space Ads - all subject to review and approval by the AbS team before going live.",
        "All submissions must comply with AbS campaign guidelines, content policies, and NDPR standards.",
        "Advertiser access credentials are unique, monitored, and protected against unauthorized use.",
        "Budget deductions are handled through the AbS Ads Wallet, which is funded via Paystack. Advertisers are responsible for maintaining sufficient wallet balance for active campaigns.",
      ],
    },
    {
      title: "6. Ad Wallet and Payments",
      content: [
        "The AbS Ads platform uses a prepaid wallet system for App & Web Ads and Blog Space Ads. Advertisers fund their wallet via Paystack before launching campaigns.",
        "Email Campaign billing is managed separately via the Email Campaign subscription system.",
        "All payment processing is handled securely by Paystack in accordance with their terms of service and PCI-DSS standards.",
        "AbS does not store any credit card or bank account details on its servers.",
        "Wallet top-ups are non-refundable once credited, except in cases of verified technical error. Contact support@abstechconnect.com for refund inquiries.",
      ],
    },
    {
      title: "7. Data Retention",
      content: [
        "User data is retained for as long as the user maintains an active AbS account.",
        "Inactive accounts are flagged after 24 months and permanently deleted after 36 months of inactivity.",
        "Analytics logs and campaign data are stored for 12 months for performance evaluation, after which they are anonymized or deleted.",
        "Users and advertisers may request data deletion at any time by contacting the AbS DPO.",
      ],
    },
    {
      title: "8. Data Security",
      content: [
        "AbS implements multiple security measures to safeguard all data collected or processed:",
        "  - Encrypted cloud storage",
        "  - Strict access control with user-level permissions",
        "  - Regular internal security audits and compliance checks",
        "We continually assess our systems to prevent unauthorized access, data loss, or misuse.",
      ],
    },
    {
      title: "9. Data Breach Protocol",
      content: [
        "In the unlikely event of a data breach affecting personal or advertiser data, AbS will:",
        "  - Notify affected users or advertisers within 72 hours, and",
        "  - Report the incident to the Nigeria Data Protection Commission (NDPC), as required by NDPR.",
      ],
    },
    {
      title: "10. Analytics and Performance Tracking",
      content: [
        "We use internal analytics tools to measure campaign reach, audience engagement, and performance trends.",
        "All analytics data is aggregated and anonymized before analysis. No identifiable user data is tracked for advertising purposes.",
        "Advertiser-facing metrics (impressions, clicks, CTR, budget spent) are computed from anonymized interaction events.",
      ],
    },
    {
      title: "11. Contact & Data Protection Officer",
      content: [
        "For questions, data access requests, or complaints about this Privacy Policy, contact our Data Protection Officer (DPO):",
        "  - Email: support@abstechconnect.com",
        "  - Phone: 09052728257, 09025252652",
        "  - Organization: Absolute Solution (AbS)",
      ],
    },
    {
      title: "12. Policy Updates",
      content: [
        "AbS may update this Privacy Policy periodically to reflect changes in regulation, technology, or operations.",
        "Any changes will be communicated through our website and advertiser dashboards, with the new effective date clearly stated.",
      ],
    },
    {
      title: "13. Acceptance",
      content: [
        "By using the AbS Ads platform or participating in the Ads Campaign and Partner Program, you acknowledge that you have read, understood, and agreed to this Privacy Policy.",
      ],
    },
  ];

  return (
    <div className="md:p-6 px-3 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AbS Ads Campaign &amp; Partner Program Privacy Policy
        </h1>
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          <span>Last Updated: 6th March, 2026</span>
          <span>&middot;</span>
          <span>Effective Date: 6th March, 2026</span>
        </div>
      </div>

      <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg mb-8">
        <p className="text-gray-800 leading-relaxed">
          At Absolute Solution (AbS), we value the privacy of our users and partners. This Privacy
          Policy explains how we collect, use, protect, and manage information in connection with
          the AbS Ads Campaign and Partner Program &mdash; including Email Campaigns, App &amp; Web Ads, and
          Blog Space Ads. Our practices follow the Nigeria Data Protection Regulation (NDPR) and
          reflect our commitment to transparency and data security.
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
          We are here to help. If you have any questions about how we handle your data or want to
          exercise your privacy rights, do not hesitate to reach out to our Data Protection Officer.
        </p>
        <button
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          onClick={() => navigate("/dashboard/contact-us")}
        >
          Contact Privacy Team
        </button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>&copy; 2026 Absolute Solution (AbS). All rights reserved.</p>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
