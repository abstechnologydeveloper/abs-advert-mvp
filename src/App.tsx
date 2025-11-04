// ============================================
// FILE: src/App.tsx
// ============================================
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import CreateCampaignPage from "./pages/CreateCampaignPage/CreateCampaignPage";
import DraftsPage from "./pages/DraftsPage/DraftsPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import NoPermissionPage from "./components/NoPermissionPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ContactUsPage from "./pages/ContactUsPage/ContactUsPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationPage from "./pages/Notifications/NotificationPage";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("abs_token");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("abs_token");
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard/overview" replace /> : <LoginPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <DashboardLayout onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* Core Pages */}
          <Route path="overview" element={<OverviewPage />} />
          <Route path="create-campaign" element={<CreateCampaignPage />} />
          <Route path="drafts" element={<DraftsPage />} />
          <Route path="history" element={<HistoryPage />} />

          {/* Quills Ads */}
          <Route
            path="app-quills-ads"
            element={<NoPermissionPage feature="Quills Advertising" />}
          />
          <Route
            path="quills-ads-drafts"
            element={<NoPermissionPage feature="Quills Advertising" />}
          />
          <Route
            path="quills-ads-history"
            element={<NoPermissionPage feature="Quills Advertising" />}
          />

          {/* Blog Ads */}
          <Route path="web-blog-ads" element={<NoPermissionPage feature="Blog Advertising" />} />
          <Route path="blog-ads-drafts" element={<NoPermissionPage feature="Blog Advertising" />} />
          <Route
            path="blog-ads-history"
            element={<NoPermissionPage feature="Blog Advertising" />}
          />

          <Route path="notifications" element={<NotificationPage />} />

          {/* Scholarship Ads */}
          <Route
            path="web-scholarship-ads"
            element={<NoPermissionPage feature="Scholarship Advertising" />}
          />
          <Route
            path="mobile-scholarship-ads"
            element={<NoPermissionPage feature="Scholarship Advertising" />}
          />
          <Route
            path="scholarship-ads-drafts"
            element={<NoPermissionPage feature="Scholarship Advertising" />}
          />
          <Route
            path="scholarship-ads-history"
            element={<NoPermissionPage feature="Scholarship Advertising" />}
          />

          {/* Library Ads */}
          <Route
            path="web-library-ads"
            element={<NoPermissionPage feature="Library Advertising" />}
          />
          <Route
            path="mobile-library-ads"
            element={<NoPermissionPage feature="Library Advertising" />}
          />
          <Route
            path="library-ads-drafts"
            element={<NoPermissionPage feature="Library Advertising" />}
          />
          <Route
            path="library-ads-history"
            element={<NoPermissionPage feature="Library Advertising" />}
          />

          {/* Settings & Others */}
          <Route path="settings" element={<SettingsPage onLogout={handleLogout} />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="contact-us" element={<ContactUsPage />} />

          {/* Default Fallback */}
          <Route path="*" element={<OverviewPage />} />
        </Route>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
