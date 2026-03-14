import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Bell, Settings, LogOut } from "lucide-react";
import { useGetStudentDetailsQuery } from "../redux/user/user-apis";

interface SettingsPageProps {
  onLogout: () => void;
}

// ─── Toggle switch ───────────────────────────────────────────────
const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({
  checked,
  onChange,
}) => (
  <button
    type="button"
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? "bg-[#6E58FF]" : "bg-gray-200"
    }`}
  >
    <span
      className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
        checked ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

// ─── Main settings content ───────────────────────────────────────
const SettingsPageContent: React.FC<SettingsPageProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<"notifications" | "account">("notifications");

  const { data } = useGetStudentDetailsQuery();
  const student = data?.data;

  // Notification prefs (local state)
  const [notifs, setNotifs] = useState({
    emailNotifications: true,
    campaignUpdates: true,
    weeklyReports: false,
    marketingEmails: false,
  });

  const toggleNotif = (key: keyof typeof notifs) => {
    setNotifs((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      const labels: Record<keyof typeof notifs, string> = {
        emailNotifications: "Email notifications",
        campaignUpdates: "Campaign updates",
        weeklyReports: "Weekly reports",
        marketingEmails: "Marketing emails",
      };
      toast.success(`${labels[key]} ${next[key] ? "enabled" : "disabled"}`);
      return next;
    });
  };

  const tabs = [
    { id: "notifications" as const, label: "Notifications", Icon: Bell },
    { id: "account" as const, label: "Account", Icon: Settings },
  ];

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account preferences</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Tab nav */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {tabs.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition border-b-2 ${
                activeTab === id
                  ? "border-[#6E58FF] text-[#6E58FF]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
          {/* ── Notifications tab ─────────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="space-y-1">
              <h2 className="text-base font-bold text-gray-900 mb-4">Notification Preferences</h2>
              {[
                { key: "emailNotifications" as const, label: "Email Notifications", desc: "Receive notifications about your campaigns via email" },
                { key: "campaignUpdates" as const, label: "Campaign Updates", desc: "Get notified when a campaign status changes" },
                { key: "weeklyReports" as const, label: "Weekly Reports", desc: "Receive weekly ad performance summaries" },
                { key: "marketingEmails" as const, label: "Marketing Emails", desc: "Promotional updates and platform announcements" },
              ].map(({ key, label, desc }) => (
                <div key={key} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{label}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{desc}</p>
                  </div>
                  <Toggle checked={notifs[key]} onChange={() => toggleNotif(key)} />
                </div>
              ))}
            </div>
          )}

          {/* ── Account tab ─────────────────────────────────────── */}
          {activeTab === "account" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-gray-900">Account Information</h2>

              <div className="bg-gray-50 rounded-xl p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Account ID</span>
                  <span className="font-mono text-xs text-gray-600">{student?.studentId?.slice(0, 12)}…</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium">{student?.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">{student?.firstName} {student?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="text-green-600 font-medium">Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-medium">
                    {student?.createdAt
                      ? new Date(student.createdAt).toLocaleDateString("en-NG", { month: "long", year: "numeric" })
                      : "—"}
                  </span>
                </div>
              </div>

              {/* Profile update note */}
              <div className="bg-violet-50 border border-violet-100 rounded-xl px-4 py-3 text-sm text-violet-700">
                To update your profile details or change your password, please use the{" "}
                <strong>AbS mobile app</strong> or the{" "}
                <strong>AbS web platform</strong>.
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-bold text-gray-900 mb-3">Session</h3>
                <button
                  onClick={onLogout}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>

              <div className="border-t border-gray-100 pt-5">
                <h3 className="text-sm font-bold text-red-800 mb-1">Danger Zone</h3>
                <p className="text-xs text-gray-400 mb-3">
                  To deactivate or delete your account, contact{" "}
                  <a href="mailto:support@abstechng.com" className="text-[#6E58FF] underline">
                    support@abstechng.com
                  </a>
                  . These actions are irreversible.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SettingsPage: React.FC<SettingsPageProps> = ({ onLogout }) => (
  <>
    <Toaster position="top-right" />
    <SettingsPageContent onLogout={onLogout} />
  </>
);

export default SettingsPage;
