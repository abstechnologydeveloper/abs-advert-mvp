import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import logo from "../assets/logo.svg";

interface SidebarProps {
  onNavigate: (path: string) => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, isMobileOpen, onCloseMobile }) => {
  const [expandedSection, setExpandedSection] = useState<string | null>("email");

  const location = useLocation();
  const currentPage = location.pathname.split("/").pop();

  const isActive = (path: string) => currentPage === path;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const menuItems = [
    {
      path: "overview",
      label: "Overview",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10h3a1 1 0 001-1v-4h4v4a1 1 0 001 1h3V10l-2-2-7-7-7 7z"
          />
        </svg>
      ),
    },
  ];

  const emailItems = [
    { path: "create-campaign", label: "Create New" },
    { path: "drafts", label: "Drafts" },
    { path: "history", label: "History" },
  ];

  const quillsItems = [
    { path: "app-quills-ads", label: "Create New" },
    { path: "quills-ads-drafts", label: "Drafts" },
    { path: "quills-ads-history", label: "History" },
  ];

  const blogItems = [
    { path: "web-blog-ads", label: "Create New" },
    { path: "blog-ads-drafts", label: "Drafts" },
    { path: "blog-ads-history", label: "History" },
  ];

  const scholarshipItems = [
    { path: "web-scholarship-ads", label: "Create New (Web)" },
    { path: "mobile-scholarship-ads", label: "Create New (Mobile)" },
    { path: "scholarship-ads-drafts", label: "Drafts" },
    { path: "scholarship-ads-history", label: "History" },
  ];

  const libraryItems = [
    { path: "web-library-ads", label: "Create New (Web)" },
    { path: "mobile-library-ads", label: "Create New (Mobile)" },
    { path: "library-ads-drafts", label: "Drafts" },
    { path: "library-ads-history", label: "History" },
  ];

  const settingsItems = [
    {
      path: "settings",
      label: "Settings",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      ),
    },
    {
      path: "privacy-policy",
      label: "Privacy Policy",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
    },
    {
      path: "contact-us",
      label: "Contact Us",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ];

  const ChevronIcon = (expanded: boolean) => (
    <svg
      className={`w-4 h-4 transition-transform ${expanded ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const MailIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );

  const QuillsIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
      />
    </svg>
  );

  const BlogIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
      />
    </svg>
  );

  const ScholarshipIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l9-5-9-5-9 5 9 5z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
      />
    </svg>
  );

  const LibraryIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
      />
    </svg>
  );

  const CloseIcon = (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gray-900 text-white flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header with Logo */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img src={logo} alt="logo" className="w-18 h-14" />
          </div>
          <button onClick={onCloseMobile} className="lg:hidden text-gray-400 hover:text-white">
            {CloseIcon}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-2">
            <div className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2 font-semibold">
              Dashboard
            </div>

            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  onNavigate(item.path);
                  onCloseMobile();
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition
                  ${
                    isActive(item.path)
                      ? "bg-blue-600 text-white"
                      : "text-gray-300 hover:bg-gray-800"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Email Campaign Section */}
            <div className="pt-4">
              <button
                onClick={() => toggleSection("email")}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                <div className="flex items-center space-x-3">
                  {MailIcon}
                  <span>Email Campaigns</span>
                </div>
                {ChevronIcon(expandedSection === "email")}
              </button>

              {expandedSection === "email" && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-800 pl-4">
                  {emailItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        onCloseMobile();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition text-sm
                        ${
                          isActive(item.path)
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }
                      `}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quills Ads Section */}
            <div>
              <button
                onClick={() => toggleSection("quills")}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                <div className="flex items-center space-x-3">
                  {QuillsIcon}
                  <span>Quills Advertising</span>
                </div>
                {ChevronIcon(expandedSection === "quills")}
              </button>

              {expandedSection === "quills" && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-800 pl-4">
                  {quillsItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        onCloseMobile();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm
                        ${
                          isActive(item.path)
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Blog Ads Section */}
            <div>
              <button
                onClick={() => toggleSection("blog")}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                <div className="flex items-center space-x-3">
                  {BlogIcon}
                  <span>Blog Advertising</span>
                </div>
                {ChevronIcon(expandedSection === "blog")}
              </button>

              {expandedSection === "blog" && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-800 pl-4">
                  {blogItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        onCloseMobile();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm
                        ${
                          isActive(item.path)
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Scholarship Ads Section */}
            <div>
              <button
                onClick={() => toggleSection("scholarship")}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                <div className="flex items-center space-x-3">
                  {ScholarshipIcon}
                  <span>Scholarships</span>
                </div>
                {ChevronIcon(expandedSection === "scholarship")}
              </button>

              {expandedSection === "scholarship" && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-800 pl-4">
                  {scholarshipItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        onCloseMobile();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm
                        ${
                          isActive(item.path)
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Library Ads Section */}
            <div>
              <button
                onClick={() => toggleSection("library")}
                className="w-full flex items-center justify-between px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg transition"
              >
                <div className="flex items-center space-x-3">
                  {LibraryIcon}
                  <span>Library Advertising</span>
                </div>
                {ChevronIcon(expandedSection === "library")}
              </button>

              {expandedSection === "library" && (
                <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-800 pl-4">
                  {libraryItems.map((item) => (
                    <button
                      key={item.path}
                      onClick={() => {
                        onNavigate(item.path);
                        onCloseMobile();
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm
                        ${
                          isActive(item.path)
                            ? "bg-blue-600 text-white"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Settings Section */}
            <div className="pt-4">
              <div className="text-gray-400 text-xs uppercase tracking-wider px-3 py-2 font-semibold">
                Other
              </div>
              {settingsItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    onNavigate(item.path);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition
                    ${
                      isActive(item.path)
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
