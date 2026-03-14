import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Mail,
  Users,
  BookOpen,
  Settings,
  Shield,
  MessageCircle,
  ChevronDown,
  X,
  AlertTriangle,
  Save,
  Loader2,
  CreditCard,
  Globe,
  Wallet,

} from "lucide-react";

interface SidebarProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  hasUnsavedChanges?: boolean;
  onSaveAndNavigate?: () => Promise<void>;
  isSaving?: boolean;
  hasEmailAccess?: boolean;
}

// Maps route path segments to their sidebar section key (for collapsible sections only)
const ROUTE_SECTION: Record<string, string> = {
  "create-campaign": "email",
  "pending": "email",
  "scheduled": "email",
  "drafts": "email",
  "history": "email",
  "campaign-guidelines": "email",
  "subscription-plans": "email",
  "billing": "email",
};

const getInitialSection = (pathname: string, hasEmail: boolean): string | null => {
  const segment = pathname.split("/").pop() ?? "";
  const section = ROUTE_SECTION[segment];
  if (section) return section;
  return hasEmail ? "email" : "app-web";
};

const Sidebar: React.FC<SidebarProps> = ({
  onNavigate,
  isMobileOpen,
  onCloseMobile,
  hasUnsavedChanges = false,
  onSaveAndNavigate,
  isSaving = false,
  hasEmailAccess = true,
}) => {
  const location = useLocation();
  const currentPage = location.pathname.split("/").pop();

  const [expandedSection, setExpandedSection] = useState<string | null>(
    () => getInitialSection(location.pathname, hasEmailAccess)
  );
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // Auto-expand the correct section when route changes (e.g. navigating via URL)
  useEffect(() => {
    const section = ROUTE_SECTION[currentPage ?? ""];
    if (section) setExpandedSection(section);
  }, [currentPage]);

  const isActive = (path: string) => currentPage === path;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleNavigationAttempt = (path: string) => {
    if (hasUnsavedChanges && currentPage !== path) {
      setPendingPath(path);
      setShowUnsavedModal(true);
    } else {
      onNavigate(path);
      onCloseMobile();
    }
  };

  const handleSaveAndNavigate = async () => {
    if (onSaveAndNavigate && pendingPath) {
      await onSaveAndNavigate();
      setShowUnsavedModal(false);
      onNavigate(pendingPath);
      onCloseMobile();
      setPendingPath(null);
    }
  };

  const handleNavigateWithoutSaving = () => {
    if (pendingPath) {
      setShowUnsavedModal(false);
      onNavigate(pendingPath);
      onCloseMobile();
      setPendingPath(null);
    }
  };

  // Build navigation sections conditionally
  const navigationSections = [
    {
      id: "main",
      title: "",
      items: [
        { path: "overview", label: "Dashboard", icon: LayoutDashboard },
      ],
    },
    // Email Campaigns — only shown if user has ADS_LOGIN
    ...(hasEmailAccess
      ? [
          {
            id: "email-campaigns",
            title: "Email Campaigns",
            collapsible: true,
            sections: [
              {
                key: "email",
                label: "Email Campaigns",
                icon: Mail,
                items: [
                  { path: "create-campaign", label: "Create New" },
                  { path: "pending", label: "In Review" },
                  { path: "scheduled", label: "Scheduled" },
                  { path: "drafts", label: "Drafts" },
                  { path: "history", label: "History" },
                  { path: "campaign-guidelines", label: "Campaign Guidelines", icon: BookOpen },
                  { path: "subscription-plans", label: "Subscription Plans", icon: CreditCard },
                  { path: "billing", label: "Billing & Payments", icon: CreditCard },
                ],
              },
            ],
          },
        ]
      : []),
    {
      id: "ads",
      title: "Advertising",
      items: [
        { path: "in-app-ads", label: "In-App Ads", icon: Users },
        { path: "blog-ads", label: "Blog Ads", icon: Globe },
        { path: "ad-billing", label: "Ad Wallet & Billing", icon: Wallet },
      ],
    },
    {
      id: "account",
      title: "Support",
      items: [
        { path: "settings", label: "Settings", icon: Settings },
        { path: "privacy-policy", label: "Privacy Policy", icon: Shield },
        { path: "contact-us", label: "Contact Us", icon: MessageCircle },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Unsaved Changes Modal */}
      {showUnsavedModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowUnsavedModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-scale-in">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Unsaved Changes</h3>
            </div>
            <p className="text-gray-600 mb-6">
              You have unsaved changes. Would you like to save before leaving?
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSaveAndNavigate}
                disabled={isSaving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save & Leave
              </button>
              <button
                onClick={handleNavigateWithoutSaving}
                className="flex-1 px-4 py-2.5 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition font-medium"
              >
                Leave Without Saving
              </button>
              <button
                onClick={() => setShowUnsavedModal(false)}
                className="sm:w-auto px-4 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800
          text-white flex flex-col
          transform transition-all duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          shadow-2xl
        `}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-800/50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">AbS Ads</h1>
              <p className="text-xs text-gray-400">Marketing Platform</p>
            </div>
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-gray-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-6">
            {navigationSections.map((section) => (
              <div key={section.id}>
                {section.title && (
                  <div className="text-gray-400 text-xs uppercase tracking-wider px-3 mb-2 font-semibold">
                    {section.title}
                  </div>
                )}

                {/* Direct Items */}
                {section.items && (
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigationAttempt(item.path)}
                          className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-all group
                            ${isActive(item.path)
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/50"
                              : "text-gray-300 hover:bg-gray-800 hover:text-white"}
                          `}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Collapsible Sections */}
                {section.sections && (
                  <div className="space-y-1">
                    {section.sections.map((subsection) => {
                      const Icon = subsection.icon;
                      const isExpanded = expandedSection === subsection.key;
                      const hasActiveItem = subsection.items.some((item) => isActive(item.path));

                      return (
                        <div key={subsection.key}>
                          <button
                            onClick={() => toggleSection(subsection.key)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group
                              ${hasActiveItem || isExpanded
                                ? "bg-gray-800 text-white"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"}
                            `}
                          >
                            <div className="flex items-center space-x-3">
                              <Icon className="w-5 h-5" />
                              <span className="font-medium">{subsection.label}</span>
                            </div>
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </button>

                          {isExpanded && (
                            <div className="mt-1 ml-6 space-y-0.5 border-l-2 border-gray-800 pl-4 animate-in slide-in-from-top-2 duration-200">
                              {subsection.items.map((item) => (
                                <button
                                  key={item.path + "-" + subsection.key}
                                  onClick={() => handleNavigationAttempt(item.path)}
                                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm
                                    ${isActive(item.path)
                                      ? "bg-blue-600 text-white font-medium shadow-lg shadow-blue-600/30"
                                      : "text-gray-400 hover:bg-gray-800 hover:text-white"}
                                  `}
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800/50">
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg p-3 border border-blue-500/20">
            <p className="text-xs text-gray-300 mb-1">Need help?</p>
            <button
              onClick={() => handleNavigationAttempt("contact-us")}
              className="text-sm font-medium text-blue-400 hover:text-blue-300 transition"
            >
              Contact Support →
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out; }
      `}</style>
    </>
  );
};

export default Sidebar;
