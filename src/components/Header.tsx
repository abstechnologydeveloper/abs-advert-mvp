
import React from "react";
import { mockUser } from "../data/mockData";

const Header: React.FC = () => {
  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center space-x-4">
        <img src={mockUser.avatar} alt={mockUser.name} className="w-16 h-16 rounded-full" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{mockUser.name}</h1>
          <p className="text-gray-600">
            Welcome to AbS Ads, reach out to thousands of students worldwide
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
