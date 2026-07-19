import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { WebsiteSettings } from "../types";
import { Mail, Lock, User, UserPlus, AlertCircle, Sparkles, CheckCircle2 } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error loading settings:", err));
  }, []);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !email || !password || !confirmPassword) {
      setError(lang === "en" ? "Please fill in all information." : "অনুগ্রহ করে সকল তথ্য পূরণ করুন।");
      return;
    }

    if (password !== confirmPassword) {
      setError(lang === "en" ? "Passwords do not match!" : "পাসওয়ার্ড দুটি মিলছে না!");
      return;
    }

    setLoading(true);

    // Register user in backend database via POST /api/users
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: username, email: email })
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        setSuccess(lang === "en" ? "Account created successfully! Logging you in..." : "একাউন্ট তৈরি সফল হয়েছে! আমরা আপনাকে লগইন করাচ্ছি...");
        
        // Auto Log in user locally
        localStorage.setItem("streamplex_logged_user", JSON.stringify({ email: data.email, name: data.userName }));
        
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        setError(lang === "en" ? "Something went wrong. Please try again." : "একাউন্ট তৈরি করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।");
        setLoading(false);
      });
  };

  const defaultTitle = lang === "en" ? "Create New Account" : "নতুন একাউন্ট তৈরি করুন";
  const defaultSubtitle = lang === "en" 
    ? "Create an account to unlock thousands of premium video contents."
    : "একাউন্ট তৈরি করে আনলক করুন হাজারো প্রিমিয়াম ভিডিও কনটেন্ট।";

  const pageTitle = settings?.registerPageTitle || defaultTitle;
  const pageSubtitle = settings?.registerPageSubtitle || defaultSubtitle;

  return (
    <div className="py-12 flex items-center justify-center min-h-[calc(100vh-250px)]">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-8 shadow-xl space-y-6">
        
        {/* Header Block */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-indigo-600/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm shadow-indigo-600/10">
            <UserPlus size={24} />
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

        {/* Register Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">
              {lang === "en" ? "Username (Full Name)" : "ইউজারনেম (পূর্ণ নাম)"}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={lang === "en" ? "John Doe" : "সাকিব হাসান"}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl pl-10 pr-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
              />
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>

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

          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">
              {lang === "en" ? "Confirm Password" : "পাসওয়ার্ড নিশ্চিত করুন"}
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                <UserPlus size={14} />
                <span>{lang === "en" ? "Register" : "একাউন্ট তৈরি করুন"}</span>
              </>
            )}
          </button>
        </form>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Footer info link */}
        <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center font-medium">
          {lang === "en" ? "Already have an account? " : "ইতিমধ্যে একাউন্ট আছে? "}
          <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-extrabold hover:underline">
            {t("login")}
          </Link>
        </p>

      </div>
    </div>
  );
}
