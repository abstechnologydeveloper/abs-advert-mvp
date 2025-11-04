/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import bgImage from "../assets/login-bg.svg";
import logo from "../assets/logo.svg";
import { useLoginUserMutation } from "../redux/auth/auth-apis";
import { AuthStorage } from "../utils/authStorage";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginUser({ email, password }).unwrap();
      console.log("✅ Login success:", res);
      AuthStorage.setAuthData(res.user_credentials);
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("❌ Login failed:", err);
      setError(err?.data?.message || "Invalid email or password");
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <div
        className="h-[55vh] relative overflow-hidden"
        style={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundBlendMode: "overlay",
        }}
      >
        <div className="relative z-10 flex flex-col justify-center items-center h-full text-white px-8 text-center">
          <h1 className="text-2xl md:text-5xl font-bold mb-4 leading-tight max-w-4xl">
            Reach out to thousands of students through AbS Ads campaign
          </h1>
        </div>
      </div>

      {/* Login form */}
      <div className="h-[45vh] bg-white flex items-start justify-center px-8 relative shrink-0">
        <div className="w-full max-w-2xl absolute top-2 transform -translate-y-1/3 flex justify-center flex-col">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8 flex justify-center flex-col items-center">
              <img src={logo} alt="logo" className="w-14 h-14 " />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Ads Campaign Dashboard</h2>
              <p className="text-gray-600">Access your campaign dashboard</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 md:w-[70%] mx-auto">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900 placeholder-gray-400"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#6E58FF] text-white py-2.5 px-3 rounded-xl hover:bg-[#5843e0] transition font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center group"
              >
                {isLoading ? "Logging in..." : "Login"}
                {!isLoading && (
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                )}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <a href="#" className="font-semibold text-blue-600 hover:text-blue-700">
                  Create an account
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
