import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Video, PaymentRequest, User } from "../types";
import { motion } from "motion/react";
import {
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  Crown,
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  Smartphone,
  History,
  Sparkles,
  Heart,
  Play,
  Lock,
  Settings,
  Key,
  Save,
  Trash2,
  ArrowRight,
  UserCheck,
  Check
} from "lucide-react";

interface ProfileProps {
  videos: Video[];
}

export default function Profile({ videos }: ProfileProps) {
  const navigate = useNavigate();
  const { lang, t } = useLanguage();
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [profileData, setProfileData] = useState<User | null>(null);
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [watchlistIds, setWatchlistIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"info" | "watchlist" | "payments" | "security">("info");
  
  // Edit Profile States
  const [editName, setEditName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileError, setProfileError] = useState("");

  // Change Password States
  const [currPassword, setCurrPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdError, setPwdError] = useState("");

  useEffect(() => {
    // 1. Get logged user info
    const saved = localStorage.getItem("streamplex_logged_user");
    if (!saved) {
      // If not logged in, redirect to login page
      navigate("/login");
      return;
    }
    try {
      const parsed = JSON.parse(saved);
      setCurrentUser(parsed);
      setEditName(parsed.name || "");
      
      // 2. Fetch full profile from backend
      fetch(`/api/users/profile?email=${encodeURIComponent(parsed.email)}`)
        .then((res) => res.json())
        .then((data) => {
          setProfileData(data);
          if (data.userName) {
            setEditName(data.userName);
            // Sync with local storage
            localStorage.setItem("streamplex_logged_user", JSON.stringify({ email: data.email, name: data.userName }));
          }
        })
        .catch((err) => console.error("Error fetching full profile:", err));

      // 3. Fetch payment history
      fetch(`/api/payments/user/${encodeURIComponent(parsed.email)}`)
        .then((res) => res.json())
        .then((data) => setPayments(data))
        .catch((err) => console.error("Error loading user payments:", err));

    } catch (e) {
      console.error("Error loading profile data", e);
      navigate("/login");
    }

    // 4. Load watchlist from localStorage
    const savedWatchlist = JSON.parse(localStorage.getItem("streamplex_watchlist") || "[]");
    setWatchlistIds(savedWatchlist);
  }, [navigate]);

  // Handle Edit Profile submission
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !editName.trim()) return;

    setUpdatingProfile(true);
    setProfileSuccess("");
    setProfileError("");

    fetch("/api/users/update-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: currentUser.email, userName: editName.trim() })
    })
      .then((res) => res.json())
      .then((data) => {
        setUpdatingProfile(false);
        if (data.error) {
          setProfileError(data.error);
        } else {
          setProfileSuccess(lang === "en" ? "Your profile name has been updated successfully." : "আপনার প্রোফাইল নাম সফলভাবে পরিবর্তন করা হয়েছে।");
          setIsEditing(false);
          // Update client-side local storage and state
          const updatedUser = { email: currentUser.email, name: editName.trim() };
          localStorage.setItem("streamplex_logged_user", JSON.stringify(updatedUser));
          setCurrentUser(updatedUser);
          
          if (profileData) {
            setProfileData({ ...profileData, userName: editName.trim() });
          }
          // Refresh page components or header
          setTimeout(() => setProfileSuccess(""), 3000);
        }
      })
      .catch((err) => {
        console.error("Profile update error:", err);
        setProfileError(lang === "en" ? "Error updating profile. Please try again." : "প্রোফাইল আপডেট করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
        setUpdatingProfile(false);
      });
  };

  // Handle Change Password Form
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPwdSuccess("");
    setPwdError("");

    if (!currPassword || !newPassword || !confirmPassword) {
      setPwdError(lang === "en" ? "Please fill in all input fields." : "অনুগ্রহ করে সবকটি ইনপুট ক্ষেত্র পূরণ করুন।");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPwdError(lang === "en" ? "New password and confirmation password do not match!" : "নতুন পাসওয়ার্ড এবং নিশ্চিতকরণ পাসওয়ার্ড মেলেনি!");
      return;
    }

    if (newPassword.length < 6) {
      setPwdError(lang === "en" ? "Password must be at least 6 characters long." : "পাসওয়ার্ডটি অবশ্যই অন্তত ৬ অক্ষরের হতে হবে।");
      return;
    }

    setPwdLoading(true);
    setTimeout(() => {
      setPwdLoading(false);
      setPwdSuccess(lang === "en" ? "Your password was successfully updated! Use it on your next login." : "আপনার পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে! পরবর্তী লগইনে এটি ব্যবহার করুন।");
      setCurrPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdSuccess(""), 4000);
    }, 1200);
  };

  // Watchlist Removal Handler
  const handleRemoveFromWatchlist = (vId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const updated = watchlistIds.filter((id) => id !== vId);
    setWatchlistIds(updated);
    localStorage.setItem("streamplex_watchlist", JSON.stringify(updated));
  };

  // Log Out Handler
  const handleLogout = () => {
    localStorage.removeItem("streamplex_logged_user");
    window.location.href = "/";
  };

  // Filter videos that are saved in user's watchlist
  const watchlistVideos = videos.filter((v) => watchlistIds.includes(v.id) && v.status === "publish");

  // Determine active plan title
  const isPremiumUser = profileData?.isPremium === true;

  return (
    <div className="py-6 space-y-8 text-xs font-medium max-w-6xl mx-auto">
      {/* 1. Header Hero Panel */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-6 md:p-8 shadow-xl border border-indigo-500/15">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Crown size={220} className="text-amber-400" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
            {/* User Avatar Circle */}
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-3xl font-black shadow-lg border-2 border-white/10 select-none uppercase">
                {currentUser?.name ? currentUser.name.charAt(0) : "👤"}
              </div>
              {isPremiumUser && (
                <div className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 p-1.5 rounded-full border-2 border-slate-900 shadow-md">
                  <Crown size={12} className="fill-current text-slate-950 animate-pulse" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                <h1 className="text-lg md:text-2xl font-black tracking-tight">{currentUser?.name}</h1>
                
                {isPremiumUser ? (
                  <span className="bg-amber-500/10 text-amber-400 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                    <Crown size={10} className="fill-current" /> {lang === "en" ? "Premium Member" : "প্রিমিয়াম মেম্বার"}
                  </span>
                ) : (
                  <span className="bg-white/10 text-gray-300 text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-white/5">
                    {lang === "en" ? "Free Member" : "ফ্রি মেম্বার"}
                  </span>
                )}
              </div>
              <p className="text-xs text-indigo-200/80 font-bold flex items-center gap-1 justify-center md:justify-start">
                <Mail size={12} className="text-indigo-400" />
                {currentUser?.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 items-center justify-center">
            {!isPremiumUser && (
              <Link
                to="/offers"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-amber-500/10 flex items-center gap-1.5"
              >
                <Sparkles size={13} />
                {lang === "en" ? "Upgrade to Premium" : "প্রিমিয়ামে আপগ্রেড করুন"}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="bg-white/5 hover:bg-white/15 text-white/90 hover:text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all border border-white/5 cursor-pointer flex items-center gap-1.5"
            >
              {lang === "en" ? "Log Out" : "লগআউট"}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Grid Content Layout (Sidebar Tabs + Panel) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left Column: Vertical Tabs Menus */}
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-4 rounded-3xl space-y-1 shadow-sm">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-3">
            {lang === "en" ? "Menu Navigation" : "মেনু নেভিগেশন"}
          </p>
          
          <button
            onClick={() => setActiveTab("info")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "info"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-950"
            }`}
          >
            <UserIcon size={14} />
            <span>{lang === "en" ? "Profile Info" : "প্রোফাইল তথ্য"}</span>
          </button>

          <button
            onClick={() => setActiveTab("watchlist")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "watchlist"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-950"
            }`}
          >
            <Heart size={14} />
            <span>{lang === "en" ? "My Watchlist" : "আমার ওয়াচলিস্ট"}</span>
            {watchlistVideos.length > 0 && (
              <span className={`ml-auto text-[9px] font-black rounded-full px-2 py-0.5 ${
                activeTab === "watchlist" ? "bg-white text-indigo-600" : "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400"
              }`}>
                {watchlistVideos.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("payments")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "payments"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-950"
            }`}
          >
            <History size={14} />
            <span>{lang === "en" ? "Payments & Subscriptions" : "পেমেন্ট ও সাবস্ক্রিপশন"}</span>
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`w-full text-left px-4 py-2.5 rounded-2xl font-bold flex items-center gap-2.5 transition-all cursor-pointer ${
              activeTab === "security"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                : "text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-950"
            }`}
          >
            <Lock size={14} />
            <span>{lang === "en" ? "Security Settings" : "নিরাপত্তা সেটিংস"}</span>
          </button>
        </div>

        {/* Right Column: Tab Panels Content */}
        <div className="lg:col-span-3 min-h-[400px]">
          {/* Tab 1: Info */}
          {activeTab === "info" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Profile Details Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800/80 pb-3">
                  <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                    <UserIcon size={16} className="text-indigo-500" />
                    {lang === "en" ? "Main Profile Info" : "মূল প্রোফাইল তথ্য"}
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-indigo-600 hover:text-indigo-500 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Settings size={13} /> {isEditing ? (lang === "en" ? "Cancel" : "বাতিল করুন") : (lang === "en" ? "Edit Name" : "নাম পরিবর্তন করুন")}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">
                        {lang === "en" ? "Full Name" : "পুরো নাম (Full Name)"}
                      </label>
                      <input
                        type="text"
                        required
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
                      />
                    </div>

                    {profileError && (
                      <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/50 font-bold">
                        {profileError}
                      </div>
                    )}

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        type="submit"
                        disabled={updatingProfile}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-4 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
                      >
                        {updatingProfile ? (
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Save size={13} />
                        )}
                        {lang === "en" ? "Save Changes" : "তথ্য সংরক্ষণ করুন"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditName(currentUser?.name || "");
                        }}
                        className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer"
                      >
                        {lang === "en" ? "Cancel" : "বাতিল"}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">
                        {lang === "en" ? "Username" : "ব্যবহারকারীর নাম"}
                      </span>
                      <p className="text-sm font-black text-gray-900 dark:text-white">{profileData?.userName || currentUser?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">
                        {lang === "en" ? "Email Address" : "ইমেইল ঠিকানা"}
                      </span>
                      <p className="text-sm font-black text-gray-900 dark:text-white font-mono">{currentUser?.email}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">
                        {lang === "en" ? "Account Status" : "একাউন্ট স্ট্যাটাস"}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-500/20 mt-1">
                        <UserCheck size={10} /> {lang === "en" ? "Active" : "সক্রিয় (Active)"}
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider block">
                        {lang === "en" ? "Registration Date" : "নিবন্ধনের তারিখ"}
                      </span>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200 mt-1 flex items-center gap-1">
                        <Calendar size={13} className="text-gray-400" />
                        {profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString(lang === "en" ? "en-US" : "bn-BD", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        }) : (lang === "en" ? "Unknown" : "অজানা")}
                      </p>
                    </div>
                  </div>
                )}

                {profileSuccess && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-900/50 font-bold flex items-center gap-1">
                    <CheckCircle2 size={13} /> {profileSuccess}
                  </div>
                )}
              </div>

              {/* Login Session History */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Shield size={15} className="text-indigo-500" />
                  {lang === "en" ? "Recent Login Session Logs" : "সাম্প্রতিক লগইন সেশন লোগ"}
                </h3>
                
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-950/40 rounded-2xl border border-gray-100 dark:border-gray-850 text-[11px]">
                    <div className="space-y-0.5 text-left">
                      <div className="font-bold text-gray-900 dark:text-white">Active Device (Chrome, Linux)</div>
                      <div className="text-[10px] text-gray-400 font-mono">IP: 192.168.1.1 {lang === "en" ? "(Current Session)" : "(বর্তমান সেশন)"}</div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 text-[9px] font-black uppercase">
                        Current
                      </span>
                      <div className="text-[10px] text-gray-400">{new Date().toLocaleString(lang === "en" ? "en-US" : "bn-BD", { hour: "numeric", minute: "numeric", hour12: true })}</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50/50 dark:bg-gray-950/40 rounded-2xl border border-gray-100 dark:border-gray-850 text-[11px] opacity-70">
                    <div className="space-y-0.5 text-left">
                      <div className="font-bold text-gray-700 dark:text-gray-300">Mobile Web App (Safari, iOS)</div>
                      <div className="text-[10px] text-gray-400 font-mono">IP: 103.220.45.10</div>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 text-[9px] font-bold uppercase">
                        Success
                      </span>
                      <div className="text-[10px] text-gray-400">{lang === "en" ? "Yesterday, 10:24 PM" : "গতকাল, রাত ১০:২৪"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Tab 2: Watchlist */}
          {activeTab === "watchlist" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-6 shadow-sm space-y-5">
                <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Heart size={16} className="text-rose-500 fill-current" />
                  {lang === "en" ? `My Saved Watchlist (${watchlistVideos.length})` : `আমার সংরক্ষিত ওয়াচলিস্ট (${watchlistVideos.length})`}
                </h2>

                {watchlistVideos.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center">
                      <Heart size={26} />
                    </div>
                    <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-200">
                      {lang === "en" ? "Your watchlist is empty!" : "আপনার ওয়াচলিস্ট সম্পূর্ণ খালি!"}
                    </h3>
                    <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed font-semibold">
                      {lang === "en" 
                        ? "Save your favorite dramas, movies, or live shows to watch later by clicking the watch later button."
                        : "লাইভ নাটক, মুভি বা বিশেষ অনুষ্ঠান দেখতে দেখতে পছন্দের ভিডিওগুলো সেভ করতে ওয়ান-ক্লিক ওয়াচলিস্ট বাটনে চাপুন।"}
                    </p>
                    <Link
                      to="/"
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
                    >
                      {lang === "en" ? "Go Home to Watch Videos" : "ভিডিও দেখতে হোমে যান"} <ArrowRight size={13} />
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {watchlistVideos.map((vid) => (
                      <Link
                        key={vid.id}
                        to={`/video/${vid.id}`}
                        className="group bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-850 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-md transition-all"
                      >
                        <div className="relative aspect-video bg-black overflow-hidden">
                          <img
                            src={vid.thumbnailUrl}
                            alt={vid.title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-all duration-300"
                          />
                          <span className="absolute bottom-2 right-2 bg-black/75 text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                            {vid.duration}
                          </span>
                        </div>

                        <div className="p-3.5 space-y-3">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest block">
                              {vid.category}
                            </span>
                            <h4 className="font-extrabold text-xs text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {vid.title}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-150 dark:border-gray-800/80">
                            <span className="text-[10px] text-gray-400 font-bold">
                              {vid.views.toLocaleString()} {lang === "en" ? "Views" : "ভিউস"}
                            </span>
                            <button
                              onClick={(e) => handleRemoveFromWatchlist(vid.id, e)}
                              className="text-rose-600 hover:text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title={lang === "en" ? "Remove from Watchlist" : "ওয়াচলিস্ট থেকে মুছুন"}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 3: Payments & Subscriptions */}
          {activeTab === "payments" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              {/* Active Plan Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Crown size={16} className="text-amber-500" />
                  {lang === "en" ? "Current Subscription Plan" : "বর্তমান সাবস্ক্রিপশন প্ল্যান"}
                </h2>

                {isPremiumUser ? (
                  <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-yellow-500/5 to-transparent border border-amber-500/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center gap-1 w-max">
                          {lang === "en" ? "👑 PREMIUM ACTIVE" : "👑 প্রিমিয়াম সক্রিয়"}
                        </span>
                        <h3 className="text-base font-black text-slate-900 dark:text-amber-400 pt-1">
                          {lang === "en" ? "StreamPlex Lifetime Premium" : "StreamPlex লাইফটাইম প্রিমিয়াম"}
                        </h3>
                      </div>
                      <Award size={36} className="text-amber-500 animate-pulse" />
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-300 leading-relaxed font-semibold">
                      {lang === "en" 
                        ? "Congratulations! Premium features are active on your account. You can now enjoy ad-free dramas, live channels, and exclusive shows seamlessly."
                        : "অভিনন্দন! আপনার একাউন্টে প্রিমিয়াম সুবিধা চালু আছে। এখন আপনি বিজ্ঞাপন ছাড়াই যেকোনো নাটক, লাইভ চ্যানেল এবং এক্সক্লুসিভ শো নিরবচ্ছিন্নভাবে উপভোগ করতে পারছেন।"}
                    </p>
                    <div className="h-px bg-amber-500/10 pt-1" />
                    <div className="flex items-center gap-4 text-[10px] text-gray-400 font-bold">
                      <span>{lang === "en" ? "Validity:" : "মেয়াদ:"} <span className="text-emerald-500 font-black">{lang === "en" ? "Lifetime (Unlimited)" : "আজীবন (Unlimited Lifetime)"}</span></span>
                      <span>•</span>
                      <span>{lang === "en" ? "Billing Method:" : "বিলিং মেথড:"} <span className="text-indigo-400 font-black uppercase">BKash / Nagad</span></span>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-850 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <span className="bg-gray-200 dark:bg-gray-850 text-gray-600 dark:text-gray-400 text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                          FREE PLAN
                        </span>
                        <h3 className="text-sm font-black text-gray-900 dark:text-white">
                          {lang === "en" ? "Free Membership" : "সাধারণ মেম্বারশিপ"}
                        </h3>
                      </div>
                      <XCircle size={24} className="text-gray-400" />
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-semibold">
                      {lang === "en" 
                        ? "You are currently a free member. Upgrade by purchasing our subscription packages to access premium live streams and buffer-free premium videos/movies."
                        : "বর্তমানে আপনি সাধারণ ব্যবহারকারী হিসেবে আছেন। প্রিমিয়াম লাইভ স্ট্রিম এবং বাফারিং-ফ্রি প্রিমিয়াম নাটক/মুভি অ্যাক্সেস করতে আমাদের সাবস্ক্রিপশন প্যাকেজ কিনে আপগ্রেড করুন।"}
                    </p>
                    <div className="pt-2 flex">
                      <Link
                        to="/offers"
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2 rounded-xl transition-all flex items-center gap-1 shadow-md shadow-indigo-600/10"
                      >
                        {lang === "en" ? "View Subscription Offers" : "সাবস্ক্রিপশন অফারগুলো দেখুন"} <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Transactions list card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                  <History size={15} className="text-indigo-500" />
                  {lang === "en" ? "Your Payment Verification History" : "আপনার পেমেন্ট ভেরিফিকেশন হিস্টোরি"}
                </h3>

                {payments.length === 0 ? (
                  <p className="text-[11px] text-gray-400 py-6 text-center">
                    {lang === "en" ? "You have not submitted any payment requests." : "আপনি কোনো পেমেন্ট অনুরোধ পাঠাননি।"}
                  </p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[11px]">
                      <thead>
                        <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold uppercase">
                          <th className="py-2 px-3">{lang === "en" ? "Package" : "প্যাকেজ"}</th>
                          <th className="py-2 px-3">{lang === "en" ? "Price" : "মূল্য"}</th>
                          <th className="py-2 px-3">{lang === "en" ? "Gateway" : "গেটওয়ে"}</th>
                          <th className="py-2 px-3">{lang === "en" ? "Sender Number" : "প্রেরক নম্বর"}</th>
                          <th className="py-2 px-3">{lang === "en" ? "Transaction ID" : "ট্রানজেকশন আইডি"}</th>
                          <th className="py-2 px-3 text-right">{lang === "en" ? "Status" : "স্ট্যাটাস"}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-850 text-gray-700 dark:text-gray-300">
                        {payments.map((history) => (
                          <tr key={history.id} className="hover:bg-gray-50/40">
                            <td className="py-2.5 px-3 font-bold">{history.packageName}</td>
                            <td className="py-2.5 px-3 font-bold text-gray-950 dark:text-white">৳{history.price}</td>
                            <td className="py-2.5 px-3">
                              <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase font-black text-white ${
                                history.gateway === "bkash" ? "bg-pink-600" :
                                history.gateway === "nagad" ? "bg-orange-600" :
                                "bg-purple-600"
                              }`}>
                                {history.gateway}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 font-mono font-bold">{history.senderNumber}</td>
                            <td className="py-2.5 px-3 font-mono font-black text-indigo-600 dark:text-indigo-400">{history.trxId}</td>
                            <td className="py-2.5 px-3 text-right">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                                history.status === "approved" ? "bg-emerald-50 text-emerald-600" :
                                history.status === "rejected" ? "bg-rose-50 text-rose-600" :
                                "bg-amber-50 text-amber-600"
                              }`}>
                                {history.status === "approved" ? (lang === "en" ? "Approved" : "সফল (Approved)") :
                                 history.status === "rejected" ? (lang === "en" ? "Rejected" : "প্রত্যাখ্যাত") : (lang === "en" ? "Pending" : "পেন্ডিং")}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Tab 4: Security */}
          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl p-6 shadow-sm space-y-6">
                <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2 border-b border-gray-50 dark:border-gray-800 pb-3">
                  <Key size={16} className="text-indigo-500" />
                  {lang === "en" ? "Change Password" : "পাসওয়ার্ড পরিবর্তন (Change Password)"}
                </h2>

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">
                      {lang === "en" ? "Current Password" : "বর্তমান পাসওয়ার্ড"}
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="••••••••"
                        required
                        value={currPassword}
                        onChange={(e) => setCurrPassword(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
                      />
                      <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">
                        {lang === "en" ? "New Password" : "নতুন পাসওয়ার্ড"}
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder={lang === "en" ? "At least 6 characters" : "কমপক্ষে ৬ অক্ষর"}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
                        />
                        <Key size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest block">
                        {lang === "en" ? "Confirm New Password" : "নতুন পাসওয়ার্ড নিশ্চিত করুন"}
                      </label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder={lang === "en" ? "Re-enter new password" : "পুনরায় পাসওয়ার্ড লিখুন"}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-850 rounded-xl pl-10 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
                        />
                        <Key size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      </div>
                    </div>
                  </div>

                  {pwdError && (
                    <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/50 font-bold flex items-center gap-1.5">
                      <XCircle size={13} /> {pwdError}
                    </div>
                  )}

                  {pwdSuccess && (
                    <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-900/50 font-bold flex items-center gap-1.5">
                      <CheckCircle2 size={13} /> {pwdSuccess}
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={pwdLoading}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-5 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/10"
                    >
                      {pwdLoading ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Check size={14} />
                      )}
                      {lang === "en" ? "Change Password" : "পাসওয়ার্ড পরিবর্তন করুন"}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
