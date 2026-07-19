import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { WebsiteSettings } from "../types";
import { Mail, Lock, LogIn, AlertCircle, ShieldAlert, Sparkles, CheckCircle2 } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email || !password) {
      setError(lang === "en" ? "Please fill in both email and password." : "অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড দুটিই পূরণ করুন।");
      return;
    }

    setLoading(true);

    // Dynamic backend log simulation
    setTimeout(() => {
      setLoading(false);
      // Simulate login
      localStorage.setItem("streamplex_logged_user", JSON.stringify({ email, name: email.split("@")[0] }));
      setSuccess(lang === "en" ? "Login successful! Redirecting..." : "লগইন সফল হয়েছে! ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...");
      setTimeout(() => {
        // Force refresh components in App
        window.location.href = "/";
      }, 1500);
    }, 1000);
  };

  const defaultTitle = lang === "en" ? "StreamPlex Account Login" : "স্ট্রীমপ্লেক্স একাউন্ট লগইন";
  const defaultSubtitle = lang === "en" 
    ? "Login to enjoy your favorite live sports, dramas & entertainment."
    : "আপনার প্রিয় লাইভ স্পোর্টস, নাটক ও বিনোদন উপভোগ করতে লগইন করুন।";

  const pageTitle = settings?.loginPageTitle || defaultTitle;
  const pageSubtitle = settings?.loginPageSubtitle || defaultSubtitle;

  return (
    <div className="py-12 flex items-center justify-center min-h-[calc(100vh-250px)]">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-8 shadow-xl space-y-6">
        
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm shadow-indigo-600/10">
            <LogIn size={24} />
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
            {pageTitle}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto leading-relaxed">
            {pageSubtitle}
          </p>
        </div>

        {/* Error / Success Banners */}
        {error && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs rounded-xl flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span className="font-semibold">{success}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">
              {lang === "en" ? "Email Address" : "ইমেইল অ্যাড্রেস"}
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
              />
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">
              {lang === "en" ? "Password" : "পাসওয়ার্ড"}
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
              />
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-300 dark:disabled:bg-gray-800 disabled:text-gray-500 text-white font-black text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 cursor-pointer"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <LogIn size={14} />
                <span>{lang === "en" ? "Login" : "লগইন করুন"}</span>
              </>
            )}
          </button>
        </form>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Footer info link */}
        <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center font-medium">
          {lang === "en" ? "New to StreamPlex? " : "স্ট্রীমপ্লেক্স-এ নতুন? "}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline">
            {lang === "en" ? "Create New Account" : "নতুন একাউন্ট তৈরি করুন"}
          </Link>
        </p>

      </div>
    </div>
  );
}
