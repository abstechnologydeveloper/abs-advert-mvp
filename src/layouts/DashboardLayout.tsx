/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { AuthStorage } from "../utils/authStorage";
import { Menu, X } from "lucide-react";

interface DashboardLayoutProps {
  onLogout: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ onLogout }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = AuthStorage.getUser();
    if (storedUser) {
      setTimeout(() => setIsLoading(false), 500);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="text-center">
            <p className="text-gray-800 text-base font-semibold">Loading Dashboard</p>
            <p className="text-gray-500 text-sm">Please wait...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        onNavigate={(path) => navigate(`/dashboard/${path}`)}
        onLogout={onLogout}
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Menu Button - Fixed Position */}
        <button
          onClick={() => setIsMobileOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-30 p-2.5 bg-white rounded-lg shadow-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all border border-gray-200"
          aria-label="Open menu"
        >
          {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 lg:p-6 p-4">
          <div className="mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4 hidden lg:block">
          <div className="max-w-[1600px] mx-auto flex items-center justify-between text-sm text-gray-600">
            <p>© 2025 ABS Advertising Platform. All rights reserved.</p>
            <div className="flex items-center space-x-6">
              <a
                href="https://www.abstechconnect.com/about-us"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 transition"
              >
                About
              </a>
              <a href="/dashboard/privacy-policy" className="hover:text-blue-600 transition">
                Privacy
              </a>
              <a href="/dashboard/contact-us" className="hover:text-blue-600 transition">
                Support
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
