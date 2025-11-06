import  { useState } from "react";
import {
  BookOpen,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Mail,
  Users,
  Shield,
  Lightbulb,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CampaignGuidelinesPage = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>("voice-tone");
  const navigate = useNavigate();
  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const guidelines = [
    {
      id: "voice-tone",
      title: "Voice & Tone Guidelines",
      icon: Users,
      color: "blue",
      content: {
        description:
          "Write as if AbS is personally recommending your opportunity to students. Your message should feel like a helpful friend sharing valuable information.",
        dos: [
          'Use "we" or "AbS team" when introducing opportunities',
          "Frame your content as a curated recommendation from AbS",
          "Maintain a friendly, supportive, and educational tone",
          'Address students directly with inclusive language (e.g., "fellow students", "our community")',
          'Start messages with contextual introductions like "We found an opportunity..." or "The AbS team has partnered with..."',
        ],
        donts: [
          "Use corporate or overly formal language",
          "Write in third person about your company without context",
          "Send plain promotional messages without AbS framing",
          "Use aggressive sales tactics or urgency manipulation",
          "Ignore the student-first perspective",
        ],
        examples: [
          {
            wrong:
              "XYZ Company is hiring! Apply now for our internship program. Visit our website.",
            right:
              "Hey there! The AbS team has partnered with XYZ Company to bring you an exciting internship opportunity. We've reviewed their program and believe it's a great fit for students looking to gain real-world experience in [field]. Here's what caught our attention...",
          },
          {
            wrong: "Get 50% off our online courses. Limited time offer!",
            right:
              "Good news, AbS family! We've secured an exclusive discount for our students with [Company]. If you've been looking to upskill in [subject], this might be perfect timing. Here's what you need to know...",
          },
        ],
      },
    },
    {
      id: "content-structure",
      title: "Message Structure",
      icon: Mail,
      color: "green",
      content: {
        description:
          "Every email should follow a consistent structure that students recognize and trust from AbS communications.",
        structure: [
          {
            element: "Opening",
            details:
              'Start with a warm greeting and AbS context. Example: "Hello from the AbS team!" or "Hey [Student Name], we have something special for you!"',
          },
          {
            element: "Introduction",
            details:
              "Explain why AbS is sharing this opportunity and how it benefits students. Build the bridge between AbS and your brand.",
          },
          {
            element: "Value Proposition",
            details:
              "Clearly explain what students will gain. Focus on benefits, not features. Use bullet points for clarity.",
          },
          {
            element: "Call-to-Action",
            details:
              'Provide clear next steps. Make it easy and non-intimidating. Example: "Interested? Here\'s how to get started..."',
          },
          {
            element: "Closing",
            details:
              'End with encouragement and support. Sign off as "The AbS Team" or "Your friends at AbS"',
          },
        ],
        template: `Subject: [Benefit-focused headline] - From Your AbS Team

Hi [Student Name],

We hope your studies are going well! The AbS team has some exciting news to share.

[Introduction explaining the partnership/opportunity and why AbS selected it]

Here's what makes this special for our student community:
• [Key benefit 1]
• [Key benefit 2]
• [Key benefit 3]

[Details about the opportunity]

Interested? [Clear call-to-action with simple steps]

We're here if you have questions. Simply reply to this email or reach out through the AbS app.

Keep pushing forward!
The AbS Team

---
This opportunity is brought to you by [Partner Company] in collaboration with AbS.`,
      },
    },
    {
      id: "trust-authenticity",
      title: "Trust & Authenticity",
      icon: Shield,
      color: "purple",
      content: {
        description:
          "Students trust AbS. Maintain that trust by being transparent and authentic in every communication.",
        principles: [
          {
            title: "Always Disclose Partnerships",
            description:
              "Clearly state that this is a sponsored opportunity or partnership. Transparency builds trust.",
            example:
              '"This opportunity is brought to you through AbS\'s partnership with [Company]"',
          },
          {
            title: "Be Honest About Requirements",
            description:
              "Don't hide eligibility criteria, costs, or commitments. Students appreciate honesty upfront.",
            example:
              "If there are fees, prerequisites, or limitations, state them clearly in the email.",
          },
          {
            title: "Respect Student Context",
            description:
              "Remember that students are busy, often financially constrained, and cautious about scams.",
            example:
              'Avoid language like "limited slots" or "act now" that might feel manipulative.',
          },
          {
            title: "Provide Support",
            description:
              "Always include how students can get help or ask questions through AbS channels.",
            example: '"Questions? Message us in the app or reply to this email."',
          },
        ],
      },
    },
    {
      id: "forbidden-practices",
      title: "What NOT to Do",
      icon: XCircle,
      color: "red",
      content: {
        description:
          "These practices will result in campaign rejection and may lead to partnership termination.",
        violations: [
          {
            title: "Misleading Information",
            items: [
              "False promises about guaranteed jobs or income",
              "Exaggerated success rates or testimonials",
              "Hidden costs or surprise requirements",
              "Fake urgency or artificial scarcity",
            ],
          },
          {
            title: "Inappropriate Content",
            items: [
              "Get-rich-quick schemes or pyramid structures",
              "Gambling, betting, or high-risk investments",
              "Adult content or age-inappropriate material",
              "Anything that violates Nigerian laws or educational ethics",
            ],
          },
          {
            title: "Poor Practices",
            items: [
              "Sending without AbS branding or context",
              "Using student data inappropriately",
              "Spamming or excessive follow-ups",
              "Bypassing AbS review processes",
            ],
          },
          {
            title: "Brand Misrepresentation",
            items: [
              "Claiming to BE AbS rather than partnering with AbS",
              "Using AbS logo without approval",
              "Implying official endorsement beyond partnership",
              "Misusing AbS brand guidelines",
            ],
          },
        ],
      },
    },
    {
      id: "best-practices",
      title: "Best Practices & Tips",
      icon: Lightbulb,
      color: "yellow",
      content: {
        description:
          "Follow these tips to create campaigns that resonate with students and achieve better results.",
        tips: [
          {
            category: "Timing",
            items: [
              "Avoid exam periods (check academic calendar)",
              "Send during weekday mornings or early afternoons",
              "Give students adequate time to respond (avoid last-minute deadlines)",
              "Consider semester schedules when planning campaigns",
            ],
          },
          {
            category: "Content",
            items: [
              "Use relatable language and student-friendly terms",
              "Include visuals that reflect Nigerian student life",
              "Share success stories from real students (with permission)",
              "Keep emails mobile-friendly (most students use phones)",
              "Use clear formatting with headers and bullet points",
            ],
          },
          {
            category: "Engagement",
            items: [
              "Personalize when possible (use first names)",
              "Segment by relevant criteria (year of study, field, etc.)",
              "Provide clear value in the subject line",
              "Include multiple contact options",
              "Follow up thoughtfully, not aggressively",
            ],
          },
          {
            category: "Conversion",
            items: [
              "Make next steps crystal clear",
              "Reduce friction in application/signup process",
              "Offer AbS-exclusive benefits when possible",
              "Provide support throughout the journey",
              "Share deadlines prominently but without pressure",
            ],
          },
        ],
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Email Campaign Guidelines</h1>
              <p className="text-gray-600 mt-1">
                Creating authentic, student-centered messages on AbS
              </p>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Important:</strong> All messages must be written as if AbS is introducing
                  your opportunity to students. Students trust AbS, and we're extending that trust
                  to you. Please honor it by following these guidelines carefully.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Guidelines Sections */}
        <div className="space-y-4">
          {guidelines.map((guideline) => {
            const Icon = guideline.icon;
            const isExpanded = expandedSection === guideline.id;
            const colorClasses = {
              blue: "bg-blue-50 border-blue-200 text-blue-700",
              green: "bg-green-50 border-green-200 text-green-700",
              purple: "bg-purple-50 border-purple-200 text-purple-700",
              red: "bg-red-50 border-red-200 text-red-700",
              yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
            };

            return (
              <div key={guideline.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                <button
                  onClick={() => toggleSection(guideline.id)}
                  className={`w-full flex items-center justify-between p-6 hover:bg-gray-50 transition ${
                    isExpanded ? "border-b border-gray-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${
                        colorClasses[guideline.color as keyof typeof colorClasses]
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{guideline.title}</h2>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  )}
                </button>

                {isExpanded && (
                  <div className="p-6 space-y-6">
                    {/* Description */}
                    <p className="text-gray-700 leading-relaxed">{guideline.content.description}</p>

                    {/* Voice & Tone Content */}
                    {guideline.id === "voice-tone" && (
                      <>
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                            <div className="flex items-center gap-2 mb-3">
                              <CheckCircle className="w-5 h-5 text-green-600" />
                              <h3 className="font-bold text-green-900">Do This ✓</h3>
                            </div>
                            <ul className="space-y-2">
                              {guideline.content.dos?.map((item, idx) => (
                                <li key={idx} className="text-sm text-green-800 flex gap-2">
                                  <span className="text-green-600 font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-red-50 rounded-xl p-5 border border-red-200">
                            <div className="flex items-center gap-2 mb-3">
                              <XCircle className="w-5 h-5 text-red-600" />
                              <h3 className="font-bold text-red-900">Don't Do This ✗</h3>
                            </div>
                            <ul className="space-y-2">
                              {guideline.content.donts?.map((item, idx) => (
                                <li key={idx} className="text-sm text-red-800 flex gap-2">
                                  <span className="text-red-600 font-bold">•</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h3 className="font-bold text-gray-900 text-lg">Examples</h3>
                          {guideline.content.examples?.map((example, idx) => (
                            <div
                              key={idx}
                              className="border border-gray-200 rounded-lg overflow-hidden"
                            >
                              <div className="bg-red-50 p-4 border-b border-red-200">
                                <div className="flex items-start gap-2">
                                  <XCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-bold text-red-900 mb-1">❌ WRONG</p>
                                    <p className="text-sm text-gray-700 italic">
                                      "{example.wrong}"
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-green-50 p-4">
                                <div className="flex items-start gap-2">
                                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs font-bold text-green-900 mb-1">✓ RIGHT</p>
                                    <p className="text-sm text-gray-700 italic">
                                      "{example.right}"
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {/* Content Structure */}
                    {guideline.id === "content-structure" && (
                      <>
                        <div className="space-y-4">
                          <h3 className="font-bold text-gray-900 text-lg">Required Structure</h3>
                          {guideline.content.structure?.map((item, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 mb-1">{item.element}</h4>
                                <p className="text-sm text-gray-600">{item.details}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="bg-gray-900 text-gray-100 rounded-xl p-6 overflow-x-auto">
                          <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            Email Template
                          </h3>
                          <pre className="text-xs leading-relaxed whitespace-pre-wrap font-mono">
                            {guideline.content.template}
                          </pre>
                        </div>
                      </>
                    )}

                    {/* Trust & Authenticity */}
                    {guideline.id === "trust-authenticity" && (
                      <div className="space-y-4">
                        {guideline.content.principles?.map((principle, idx) => (
                          <div
                            key={idx}
                            className="bg-purple-50 rounded-lg p-5 border border-purple-200"
                          >
                            <h3 className="font-bold text-purple-900 mb-2">{principle.title}</h3>
                            <p className="text-sm text-purple-800 mb-3">{principle.description}</p>
                            <div className="bg-white rounded-lg p-3 border border-purple-200">
                              <p className="text-xs text-gray-600 mb-1 font-semibold">Example:</p>
                              <p className="text-sm text-gray-700 italic">{principle.example}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Forbidden Practices */}
                    {guideline.id === "forbidden-practices" && (
                      <div className="space-y-4">
                        {guideline.content.violations?.map((violation, idx) => (
                          <div
                            key={idx}
                            className="bg-red-50 rounded-lg p-5 border-2 border-red-300"
                          >
                            <h3 className="font-bold text-red-900 mb-3 flex items-center gap-2">
                              <XCircle className="w-5 h-5" />
                              {violation.title}
                            </h3>
                            <ul className="space-y-2">
                              {violation.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="text-sm text-red-800 flex gap-2">
                                  <span className="text-red-600 font-bold">✗</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Best Practices */}
                    {guideline.id === "best-practices" && (
                      <div className="grid md:grid-cols-2 gap-4">
                        {guideline.content.tips?.map((tip, idx) => (
                          <div
                            key={idx}
                            className="bg-yellow-50 rounded-lg p-5 border border-yellow-200"
                          >
                            <h3 className="font-bold text-yellow-900 mb-3">{tip.category}</h3>
                            <ul className="space-y-2">
                              {tip.items.map((item, itemIdx) => (
                                <li key={itemIdx} className="text-sm text-yellow-800 flex gap-2">
                                  <span className="text-yellow-600 font-bold">→</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-8 mt-8 text-white">
          <h2 className="text-2xl font-bold mb-3">Questions About These Guidelines?</h2>
          <p className="text-blue-100 mb-6">
            Our team is here to help you create campaigns that resonate with students while
            maintaining the trust they have in AbS.
          </p>
          <button
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            onClick={() => navigate(`/contact-us`)}
          >
            Contact AbS Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default CampaignGuidelinesPage;
