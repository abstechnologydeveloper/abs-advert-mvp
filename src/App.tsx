import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout";
import OverviewPage from "./pages/OverviewPage";
import CreateCampaignPage from "./pages/CreateCampaignPage/CreateCampaignPage";
import DraftsPage from "./pages/DraftsPage/DraftsPage";
import PendingCampaignsPage from "./pages/PendingCampaignsPage/PendingCampaignsPage";
import HistoryPage from "./pages/HistoryPage/HistoryPage";
import NoPermissionPage from "./components/NoPermissionPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import ContactUsPage from "./pages/ContactUsPage/ContactUsPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationPage from "./pages/Notifications/NotificationPage";
import CampaignDetailsPage from "./pages/CampaignDetailPage/CampaignDetailPage";
import CampaignGuidelinesPage from "./pages/CampaignGuidelinesPage/CampaignGuidelinesPage";
import ScheduledCampaignsPage from "./pages/ScheduledCampaignsPage/ScheduledCampaignsPage";
import BillingPage from "./pages/BillingPage/BillingPage";
import UnsubscribePage from "./pages/UnsubscribePage/UnsubscribePage";
import SubscriptionPLans from "./pages/SubscriptionPlans/SubscriptionPlans";

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("abs_token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("abs_token");
    setIsAuthenticated(false);
  };

  if (isAuthenticated === null) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="flex flex-col items-center space-y-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
          <p className="text-gray-600 text-sm font-medium">Checking your session...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard/overview" replace />
            ) : (
              <LoginPage />
            )
          }
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
          {/* Default redirect */}
          <Route index element={<Navigate to="overview" replace />} />

          {/* Core Pages */}
          <Route path="overview" element={<OverviewPage />} />
          <Route path="create-campaign" element={<CreateCampaignPage />} />
          <Route path="pending" element={<PendingCampaignsPage />} />
          <Route path="scheduled" element={<ScheduledCampaignsPage />} />
          <Route path="drafts" element={<DraftsPage />} />
          <Route path="history" element={<HistoryPage />} />

          {/* Campaign Details */}
          <Route path="campaign/:id" element={<CampaignDetailsPage />} />
          <Route path="edit-draft/:id" element={<CreateCampaignPage />} />
          <Route path="edit-failed/:id" element={<CreateCampaignPage />} />
          <Route
            path="campaign-guidelines"
            element={<CampaignGuidelinesPage />}
          />
          {/* Quills Ads */}
          <Route path="billing" element={<BillingPage />} />
          {/* Notifications */}
          <Route path="notifications" element={<NotificationPage />} />

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
          <Route
            path="web-blog-ads"
            element={<NoPermissionPage feature="Blog Advertising" />}
          />
          <Route
            path="blog-ads-drafts"
            element={<NoPermissionPage feature="Blog Advertising" />}
          />
          <Route
            path="blog-ads-history"
            element={<NoPermissionPage feature="Blog Advertising" />}
          />

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
          <Route
            path="settings"
            element={<SettingsPage onLogout={handleLogout} />}
          />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="contact-us" element={<ContactUsPage />} />
          <Route path="subscription-plans" element={<SubscriptionPLans />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="overview" replace />} />
        </Route>
        <Route path="/unsubscribe" element={<UnsubscribePage />} />
        {/* Redirect root */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard/overview" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
