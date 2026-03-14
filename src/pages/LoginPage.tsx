/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from "react";
import { Mail, Lock, ArrowRight, X, Building, Phone, User, Loader2 } from "lucide-react";
import bgImage from "../assets/login-bg.svg";
import logo from "../assets/logo.svg";
import { useLoginUserMutation, useLoginWithGoogleMutation } from "../redux/auth/auth-apis";
import { AuthStorage } from "../utils/authStorage";
import toast from "react-hot-toast";

const GOOGLE_GSI_SCRIPT = "https://accounts.google.com/gsi/client";
const GOOGLE_CLIENT_ID =
  (import.meta as any).env?.VITE_GOOGLE_CLIENT_ID ||
  "981395678880-f421mdek9rrtqoc4ok5telvjn1quatt8.apps.googleusercontent.com";

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (googleScriptPromise) return googleScriptPromise;
  googleScriptPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GOOGLE_GSI_SCRIPT}"]`);
    if (existing) {
      if ((window as any).google?.accounts?.oauth2) { resolve(); return; }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Sign-In")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = GOOGLE_GSI_SCRIPT;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Sign-In"));
    document.body.appendChild(script);
  });
  return googleScriptPromise;
}

// Types
interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  position: string;
  reason: string;
}

// Success Message Component
const SuccessMessage: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="text-center py-8">
    <div className="bg-green-50 border border-green-200 rounded-lg p-6">
      <div className="text-green-600 mb-4">
        <svg
          className="w-16 h-16 mx-auto"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-semibold text-green-900 mb-2">
        Application Submitted!
      </h3>
      <p className="text-green-700 mb-6">
        Thank you for applying. The AbS team will review your application and
        get back to you within 48 hours.
      </p>
      <button
        onClick={onClose}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Close
      </button>
    </div>
  </div>
);

// Input Field Component
const InputField: React.FC<{
  label: string;
  name: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  disabled?: boolean;
}> = ({ label, name, type, value, onChange, placeholder, icon, disabled }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">
      {label} *
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required
        disabled={disabled}
        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
        placeholder={placeholder}
      />
    </div>
  </div>
);

// Application Modal Component
const ApplicationModal: React.FC<{
  showModal: boolean;
  onClose: () => void;
  formData: FormData;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
  submitted: boolean;
}> = ({
  showModal,
  onClose,
  formData,
  onChange,
  onSubmit,
  isSubmitting,
  error,
  submitted,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-8">
          {submitted ? (
            <SuccessMessage onClose={onClose} />
          ) : (
            <>
              <div className="text-center mb-8">
                <img src={logo} alt="logo" className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Apply for an Account
                </h2>
                <p className="text-gray-600">
                  Fill out the form below and our team will review your
                  application
                </p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Full Name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={onChange}
                    placeholder="John Doe"
                    icon={<User className="h-5 w-5 text-gray-400" />}
                    disabled={isSubmitting}
                  />
                  <InputField
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={onChange}
                    placeholder="john@example.com"
                    icon={<Mail className="h-5 w-5 text-gray-400" />}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputField
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={onChange}
                    placeholder="+234 XXX XXX XXXX"
                    icon={<Phone className="h-5 w-5 text-gray-400" />}
                    disabled={isSubmitting}
                  />
                  <InputField
                    label="Organization"
                    name="organization"
                    type="text"
                    value={formData.organization}
                    onChange={onChange}
                    placeholder="Company/Institution"
                    icon={<Building className="h-5 w-5 text-gray-400" />}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Position/Role *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={onChange}
                    required
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    placeholder="Marketing Manager"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Why do you need an account? *
                  </label>
                  <textarea
                    name="reason"
                    value={formData.reason}
                    onChange={onChange}
                    required
                    rows={4}
                    disabled={isSubmitting}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100"
                    placeholder="Please tell us about your advertising goals and how you plan to use the platform..."
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onSubmit}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-[#6E58FF] text-white rounded-lg hover:bg-[#5843e0] transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// Main LoginPage Component
const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    reason: "",
  });

  const [loginUser, { isLoading }] = useLoginUserMutation();
  const [loginWithGoogle] = useLoginWithGoogleMutation();

  useEffect(() => { loadGoogleScript().catch(() => {}); }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await loginUser({ email, password }).unwrap();
      AuthStorage.setAuthData(res.user_credentials);
      window.location.href = "/dashboard";
    } catch (err: any) {
      setError(err?.data?.message || "Invalid email or password");
    }
  };

  const signInWithGoogle = async () => {
    if (googleLoading || isLoading) return;
    try {
      setGoogleLoading(true);
      await loadGoogleScript();
      const google = (window as any).google;
      const accessToken = await new Promise<string>((resolve, reject) => {
        const tokenClient = google?.accounts?.oauth2?.initTokenClient({
          client_id: GOOGLE_CLIENT_ID,
          scope: "openid email profile",
          callback: (response: any) => {
            if (response?.error || !response?.access_token) {
              reject(new Error(response?.error_description || "Google Sign-In failed"));
              return;
            }
            resolve(response.access_token as string);
          },
        });
        if (!tokenClient?.requestAccessToken) {
          reject(new Error("Google Sign-In is unavailable on this browser"));
          return;
        }
        tokenClient.requestAccessToken({ prompt: "select_account" });
      });

      const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!profileRes.ok) throw new Error("Unable to read Google account details");
      const profile = await profileRes.json() as { email?: string };
      const googleEmail = profile.email?.trim().toLowerCase();
      if (!googleEmail) throw new Error("Google account email not found");

      const res = await loginWithGoogle({ email: googleEmail }).unwrap();
      AuthStorage.setAuthData(res.user_credentials);
      window.location.href = "/dashboard";
    } catch (err: any) {
      const msg = err?.data?.message || err?.message || "Unable to sign in with Google";
      toast.error(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplicationSubmit = async () => {
    setIsSubmitting(true);
    setApplicationError(null);

    try {
      const emailBody = `New Account Application Request\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nOrganization: ${formData.organization}\nPosition: ${formData.position}\n\nReason for Account:\n${formData.reason}`;

      window.location.href = `mailto:olatunjiayomiku@gmail.com?subject=Account Application - ${
        formData.name
      }&body=${encodeURIComponent(emailBody)}`;

      setApplicationSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        organization: "",
        position: "",
        reason: "",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setApplicationError("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setApplicationSubmitted(false);
    setApplicationError(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      organization: "",
      position: "",
      reason: "",
    });
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

      <div className="h-[45vh] bg-white flex items-start justify-center px-8 relative shrink-0">
        <div className="w-full max-w-2xl absolute top-2 transform -translate-y-1/3 flex justify-center flex-col">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8 flex justify-center flex-col items-center">
              <img src={logo} alt="logo" className="w-14 h-14" />
              <h2 className="text-2xl font-bold text-gray-700 mb-2">
                Ads Campaign Dashboard
              </h2>
              <p className="text-gray-600">Access your campaign dashboard</p>
            </div>

            <form
              onSubmit={handleLogin}
              className="space-y-6 md:w-[70%] mx-auto"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
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

              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              <button
                type="submit"
                disabled={isLoading || googleLoading}
                className="w-full bg-[#6E58FF] text-white py-2.5 px-3 rounded-xl hover:bg-[#5843e0] transition font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center group disabled:opacity-60"
              >
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Logging in...</> : <>Login<ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></>}
              </button>

              <div className="relative flex items-center gap-3 my-1">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={signInWithGoogle}
                disabled={isLoading || googleLoading}
                className="w-full border border-gray-300 text-gray-700 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {googleLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                )}
                {googleLoading ? "Signing in..." : "Continue with Google"}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setShowModal(true)}
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Apply for an account
                </button>
              </p>
            </form>
          </div>
        </div>
      </div>

      <ApplicationModal
        showModal={showModal}
        onClose={closeModal}
        formData={formData}
        onChange={handleInputChange}
        onSubmit={handleApplicationSubmit}
        isSubmitting={isSubmitting}
        error={applicationError}
        submitted={applicationSubmitted}
      />
    </div>
  );
};

export default LoginPage;
