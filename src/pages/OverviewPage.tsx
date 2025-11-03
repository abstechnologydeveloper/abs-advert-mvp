import React from "react";
import { Mail, User, FileText } from "lucide-react";
import { formatNumber } from "../utils/numberFormatter";
import { formatDateTime } from "../utils/dateFormatter";
import { mockUser } from "../data/mockData";

const OverviewPage: React.FC = () => {
  return (
    <div className="md:p-6 p-3">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Campaigns</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{formatNumber(24)}</p>
            </div>
            <Mail className="text-blue-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Students Reached</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{formatNumber(15420)}</p>
            </div>
            <User className="text-green-600" size={40} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Active Drafts</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{formatNumber(7)}</p>
            </div>
            <FileText className="text-orange-600" size={40} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">Spring Semester Promo</p>
              <p className="text-sm text-gray-600">
                {formatDateTime("2024-11-03T12:00:00Z", mockUser.timezone)}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Delivered
            </span>
          </div>
          <div className="flex items-center justify-between py-3 border-b">
            <div>
              <p className="font-medium text-gray-800">New Course Launch</p>
              <p className="text-sm text-gray-600">
                {formatDateTime("2024-11-02T09:00:00Z", mockUser.timezone)}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Delivered
            </span>
          </div>
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium text-gray-800">Campus Event Reminder</p>
              <p className="text-sm text-gray-600">
                {formatDateTime("2024-11-04T14:00:00Z", mockUser.timezone)}
              </p>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Scheduled
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
