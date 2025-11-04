import React, { useState } from "react";
import { useGetStudentDetailsQuery } from "../redux/user/user-apis";

interface SettingsPageProps {
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState("profile");

  // ✅ Fetch real student data
  const { data, isLoading, error } = useGetStudentDetailsQuery();
  const student = data?.data;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    campaignUpdates: true,
    weeklyReports: false,
    marketingEmails: false,
  });

  // ✅ Prefill form when student data loads
  React.useEffect(() => {
    if (student) {
      setFormData({
        name: `${student.firstName || ""} ${student.lastName || ""}`,
        email: student.email || "",
        phone: student.phone || "",
        company: student.school || "ABS Tech",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  }, [student]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleNotificationChange = (key: string) => {
    setNotifications({
      ...notifications,
      [key]: !notifications[key as keyof typeof notifications],
    });
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Profile updated successfully!");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: "👤" },
    { id: "security", label: "Security", icon: "🔒" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "account", label: "Account", icon: "⚙️" },
  ];

  if (isLoading) return <div className="p-6 text-gray-600">Loading settings...</div>;
  if (error) return <div className="p-6 text-red-500">Failed to load user profile</div>;

  return (
    <div className="md:p-4 p-3 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm sm:text-base text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-4 sm:space-x-8 px-4 sm:px-6 min-w-max sm:min-w-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 sm:p-6">
          {activeTab === "profile" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Profile Information</h2>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center sm:space-x-6 mb-6 sm:mb-8">
                  <img
                    src={
                      student?.profilePicture?.profilePicture ||
                      student?.avatar ||
                      "/default-avatar.png"
                    }
                    alt={student?.firstName || "Profile"}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-200 mb-4 sm:mb-0 object-cover"
                  />
                  <div className="text-center sm:text-left">
                    <button
                      type="button"
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition"
                    >
                      Change Avatar
                    </button>
                    <p className="text-xs sm:text-sm text-gray-500 mt-2">
                      JPG, GIF or PNG. Max size of 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      disabled
                      onChange={handleInputChange}
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+234 000 000 0000"
                      className="w-full px-3 sm:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
          {/* Security Tab */}
          {activeTab === "security" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Security Settings</h2>
              <form onSubmit={handleChangePassword} className="space-y-4 sm:space-y-6 max-w-md">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <p className="text-xs sm:text-sm text-blue-800">
                    <strong>Password requirements:</strong> At least 8 characters, including
                    uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Change Password
                </button>
              </form>
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                  Two-Factor Authentication
                </h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">
                  Add an extra layer of security to your account by enabling two-factor
                  authentication.
                </p>
                <button className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
                  Enable 2FA
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">
                Notification Preferences
              </h2>
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-start sm:items-center justify-between py-3 sm:py-4 border-b border-gray-200 gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                      Email Notifications
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Receive notifications via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={() => handleNotificationChange("emailNotifications")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-start sm:items-center justify-between py-3 sm:py-4 border-b border-gray-200 gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                      Campaign Updates
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Get notified about campaign status changes
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.campaignUpdates}
                      onChange={() => handleNotificationChange("campaignUpdates")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-start sm:items-center justify-between py-3 sm:py-4 border-b border-gray-200 gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                      Weekly Reports
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Receive weekly performance reports
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReports}
                      onChange={() => handleNotificationChange("weeklyReports")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-start sm:items-center justify-between py-3 sm:py-4 gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                      Marketing Emails
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                      Receive promotional emails and updates
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={notifications.marketingEmails}
                      onChange={() => handleNotificationChange("marketingEmails")}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === "account" && (
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">Account Management</h2>

              <div className="space-y-4 sm:space-y-6">
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                    Account Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-sm sm:text-base text-gray-600">Account Type:</span>
                      <span className="text-sm sm:text-base font-medium">Premium</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-sm sm:text-base text-gray-600">Member Since:</span>
                      <span className="text-sm sm:text-base font-medium">January 2024</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                      <span className="text-sm sm:text-base text-gray-600">Account Status:</span>
                      <span className="text-sm sm:text-base font-medium text-green-600">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
                    Data & Privacy
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <button className="w-full text-left px-3 sm:px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-medium">Download Your Data</span>
                        <svg
                          className="w-5 h-5 text-gray-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                          />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Request a copy of all your data
                      </p>
                    </button>

                    <button className="w-full text-left px-3 sm:px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-base font-medium">Clear Cache</span>
                        <svg
                          className="w-5 h-5 text-gray-400 flex-shrink-0"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">Clear all cached data</p>
                    </button>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-red-900 mb-3 sm:mb-4">
                    Danger Zone
                  </h3>
                  <div className="space-y-3 sm:space-y-4">
                    <button
                      onClick={onLogout}
                      className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                    >
                      Logout
                    </button>
                    <button className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition font-medium">
                      Deactivate Account
                    </button>
                    <button className="w-full px-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border-2 border-red-800 text-red-800 rounded-lg hover:bg-red-50 transition font-medium">
                      Delete Account Permanently
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm text-red-700 mt-3 sm:mt-4">
                    ⚠️ These actions are irreversible. Please be certain before proceeding.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
