import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import { Video, Category, Ad, WebsiteSettings, User } from "./types";
import {
  Menu,
  X,
  Search,
  Tv,
  Settings,
  Sun,
  Moon,
  Shield,
  Film,
  Trophy,
  Facebook,
  Youtube,
  Twitter,
  Mail,
  Flame,
  Clapperboard,
  Heart,
  Gift,
  Radio
} from "lucide-react";
import Home from "./pages/Home";
import CategoryPage from "./pages/Category";
import SearchPage from "./pages/Search";
import VideoDetails from "./pages/VideoDetails";
import Admin from "./pages/Admin";
import Offers from "./pages/Offers";
import Live from "./pages/Live";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Breadcrumb from "./components/Breadcrumb";
import AdSpace from "./components/AdSpace";
import LucideIcon from "./components/LucideIcon";

export default function App() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ads, setAds] = useState<Ad[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  // Dark/Light Mode state
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("streamplex_dark_mode");
    return saved === "true";
  });

  // Fetch core application state on start
  const refreshVideos = () => {
    fetch("/api/videos")
      .then((res) => res.json())
      .then((data) => setVideos(data))
      .catch((err) => console.error("Error loading videos:", err));
  };

  const refreshCategories = () => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error loading categories:", err));
  };

  const refreshAds = () => {
    fetch("/api/ads")
      .then((res) => res.json())
      .then((data) => setAds(data))
      .catch((err) => console.error("Error loading ads:", err));
  };

  const refreshSettings = () => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setSettings(data))
      .catch((err) => console.error("Error loading settings:", err));
  };

  const refreshUsers = () => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error loading users:", err));
  };

  useEffect(() => {
    refreshVideos();
    refreshCategories();
    refreshAds();
    refreshSettings();
    refreshUsers();
  }, []);

  // Sync dark mode HTML classes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("streamplex_dark_mode", String(isDarkMode));
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Safe fallback configurations
  const siteName = settings?.websiteName || "স্ট্রীমপ্লেক্স (StreamPlex)";
  const logoText = settings?.logo || "StreamPlex";
  const contactEmail = settings?.contactEmail || "support@streamplex.com";

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 text-gray-950 dark:bg-gray-950 dark:text-gray-50 transition-colors duration-200">
        
        {/* Core Header Navigation Bar */}
        <Header
          siteName={siteName}
          logoText={logoText}
          categories={categories}
          isDarkMode={isDarkMode}
          onToggleTheme={toggleTheme}
        />

        {/* Global Page Content Layout */}
        <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          
          {/* SEO and Navigation Breadcrumbs */}
          <Breadcrumb />

          {/* Page Routing Mapping */}
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  videos={videos}
                  categories={categories}
                  ads={ads}
                  settings={settings}
                />
              }
            />
            <Route
              path="/category/:slug"
              element={
                <CategoryPage
                  videos={videos}
                  categories={categories}
                  ads={ads}
                />
              }
            />
            <Route
              path="/search"
              element={
                <SearchPage
                  videos={videos}
                  categories={categories}
                  ads={ads}
                />
              }
            />
            <Route
              path="/video/:id"
              element={
                <VideoDetails
                  videos={videos}
                  ads={ads}
                  onRefreshVideos={refreshVideos}
                />
              }
            />
            <Route
              path="/admin"
              element={
                <Admin
                  videos={videos}
                  categories={categories}
                  ads={ads}
                  settings={settings || { websiteName: siteName, logo: logoText, themeColor: "indigo", favicon: "🎥" }}
                  users={users}
                  onRefreshVideos={refreshVideos}
                  onRefreshCategories={refreshCategories}
                  onRefreshAds={refreshAds}
                  onRefreshSettings={refreshSettings}
                  onRefreshUsers={refreshUsers}
                />
              }
            />
            <Route path="/offers" element={<Offers />} />
            <Route path="/live" element={<Live />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile videos={videos} />} />
          </Routes>
        </main>

        {/* Dynamic Sticky bottom overlay ad campaign banner */}
        <AdSpace placement="sticky" adsList={ads} settings={settings || undefined} />
        <AdSpace placement="social_bar" adsList={ads} settings={settings || undefined} />
        <AdSpace placement="popunder" adsList={ads} settings={settings || undefined} />

        {/* Core Footer Block */}
        <Footer
          siteName={siteName}
          logoText={logoText}
          contactEmail={contactEmail}
          socialLinks={settings?.socialLinks}
        />
      </div>
    </BrowserRouter>
  );
}

/* --- Internal Modular Sub-components to keep code clean and readable --- */

interface HeaderProps {
  siteName: string;
  logoText: string;
  categories: Category[];
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

function Header({ siteName, logoText, categories, isDarkMode, onToggleTheme }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("streamplex_logged_user");
    if (saved) {
      try {
        setUser(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("streamplex_logged_user");
    setUser(null);
    window.location.reload();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
  };

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 z-40 transition-colors">
      <div className="w-full max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Clapperboard size={18} />
            </div>
            <span className="font-black text-base md:text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-violet-500 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              {logoText}
            </span>
          </Link>
          {!isOnline && (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-black text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 animate-pulse">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              অফলাইন মোড
            </span>
          )}
        </div>

        {/* Center: Search Field */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative max-w-xs lg:max-w-md w-full">
          <input
            type="text"
            placeholder="আপনার প্রিয় মুভি, নাটক বা কমেডি ভিডিও খুঁজুন..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50 font-medium"
          />
          <Search size={14} className="absolute left-3 text-gray-400" />
        </form>

        {/* Right: Quick Links, Categories, DarkMode Toggle, Admin */}
        <div className="flex items-center gap-3">
          {/* Watch Live Stream button */}
          <Link
            to="/live"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/5 hover:bg-rose-500/20 transition-all border border-rose-500/20"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            লাইভ দেখুন
          </Link>

          {/* Special Offers button */}
          <Link
            to="/offers"
            className="hidden md:flex items-center gap-1.5 border border-gray-200 dark:border-gray-800 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-950 transition-colors"
          >
            <Gift size={12} className="text-indigo-500 animate-bounce" />
            অফার দেখুন
          </Link>

          {/* Categories Dropdown selector */}
          <div className="hidden lg:flex items-center gap-1.5 border border-gray-200 dark:border-gray-800 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-950">
            <Tv size={12} className="text-indigo-500" />
            <select
              onChange={(e) => {
                if (e.target.value !== "none") {
                  navigate(`/category/${e.target.value}`);
                }
              }}
              defaultValue="none"
              className="bg-transparent focus:outline-none cursor-pointer"
            >
              <option value="none">ক্যাটাগরি সমূহ</option>
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>


          {/* Dynamic Login / Profile Section */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/profile"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1.5 rounded-xl border border-indigo-100 dark:border-indigo-900 transition-all flex items-center gap-1 hover:shadow-sm"
              >
                👤 {user.name}
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-extrabold text-rose-600 hover:text-rose-500 transition-colors cursor-pointer px-1 ml-1"
              >
                লগআউট
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-1.5">
              <Link
                to="/login"
                className="text-xs font-extrabold text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-2 py-1.5 transition-colors"
              >
                লগইন
              </Link>
              <Link
                to="/register"
                className="text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl transition-colors shadow-md shadow-indigo-600/10"
              >
                নিবন্ধন
              </Link>
            </div>
          )}

          {/* Theme selector */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800/80 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
            title={isDarkMode ? "লাইট মোড চালু করুন" : "ডার্ক মোড চালু করুন"}
          >
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Mobile Menu Hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-gray-50 hover:bg-gray-100 dark:bg-gray-850 dark:hover:bg-gray-800 border border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 transition-colors cursor-pointer"
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 p-4 shadow-xl flex flex-col gap-4 animate-fade-in text-xs font-bold">
          
          {/* Mobile Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              placeholder="ভিডিও খুঁজুন..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 focus:outline-none"
            />
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          {/* Live stream & Offers button on Mobile */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/live"
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 text-center text-xs font-black"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
              লাইভ দেখুন
            </Link>
            <Link
              to="/offers"
              className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-200 text-center text-xs font-extrabold"
            >
              <Gift size={13} className="text-indigo-500" />
              অফার দেখুন
            </Link>
          </div>

          {/* Mobile Categories Links */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">ভিডিও ক্যাটাগরি</span>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((c) => (
                <Link
                  key={c.slug}
                  to={`/category/${c.slug}`}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-850 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 text-gray-700 dark:text-gray-200"
                >
                  <LucideIcon name={c.icon} size={14} className="text-indigo-500" />
                  <span className="capitalize">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100 dark:bg-gray-850" />

          {/* Mobile Auth Profile block */}
          <div className="p-3 bg-gray-50 dark:bg-gray-950/40 rounded-xl border border-gray-100 dark:border-gray-850 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between text-xs font-bold">
                <Link to="/profile" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                  👤 {user.name} (প্রোফাইল)
                </Link>
                <button onClick={handleLogout} className="text-rose-600 font-extrabold cursor-pointer">লগআউট</button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="w-full text-center bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 py-2 rounded-lg text-xs font-bold"
                >
                  লগইন
                </Link>
                <Link
                  to="/register"
                  className="w-full text-center bg-indigo-600 text-white py-2 rounded-lg text-xs font-bold"
                >
                  নিবন্ধন
                </Link>
              </div>
            )}
          </div>


        </div>
      )}
    </header>
  );
}

interface FooterProps {
  siteName: string;
  logoText: string;
  contactEmail: string;
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
}

function Footer({ siteName, logoText, contactEmail, socialLinks }: FooterProps) {
  return (
    <footer className="bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-900 transition-colors py-12 text-xs">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Col 1: Brand Info */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold">
              <Clapperboard size={15} />
            </div>
            <span className="font-black text-sm tracking-tight text-indigo-600 dark:text-indigo-400">
              {logoText}
            </span>
          </div>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            মুভি, নাটক, কমেডি ও এডুকেশনাল ভিডিওর সেরা সংগ্রহশালা। সম্পূর্ণ ফ্রি ও বাফারিং ছাড়া উন্নত ভিডিও প্লেয়ারে উপভোগ করুন সেরা কন্টেন্ট।
          </p>
        </div>

        {/* Col 2: Policy & Compliance */}
        <div className="space-y-3">
          <h4 className="font-extrabold text-[11px] text-gray-800 dark:text-gray-200 uppercase tracking-widest">কপিরাইট ও পলিসি</h4>
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
            শুধুমাত্র নিজের তৈরি অথবা যথাযথ লাইসেন্সপ্রাপ্ত ভিডিও আপলোড করার সুবিধা থাকবে। কপিরাইটযুক্ত ভিডিও অনুমতি ছাড়া প্রকাশ করার জন্য ওয়েবসাইটটি ব্যবহার করা যাবে না।
          </p>
        </div>

        {/* Col 3: Contact and social connect */}
        <div className="space-y-4">
          <h4 className="font-extrabold text-[11px] text-gray-800 dark:text-gray-200 uppercase tracking-widest">যোগাযোগ করুন</h4>
          <div className="space-y-2 text-gray-500 dark:text-gray-400 font-medium">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-indigo-500" />
              <span>{contactEmail}</span>
            </div>
          </div>

          {/* Social Icons Mapping */}
          <div className="flex items-center gap-3 pt-2">
            <a
              href={socialLinks?.facebook || "#"}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-gray-50 hover:bg-indigo-50 hover:text-indigo-600 dark:bg-gray-900 dark:hover:bg-indigo-950 text-gray-400 transition-colors"
              title="ফেসবুক"
            >
              <Facebook size={16} />
            </a>
            <a
              href={socialLinks?.youtube || "#"}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-gray-50 hover:bg-rose-50 hover:text-rose-600 dark:bg-gray-900 dark:hover:bg-rose-950 text-gray-400 transition-colors"
              title="ইউটিউব"
            >
              <Youtube size={16} />
            </a>
            <a
              href={socialLinks?.twitter || "#"}
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-full bg-gray-50 hover:bg-sky-50 hover:text-sky-600 dark:bg-gray-900 dark:hover:bg-sky-950 text-gray-400 transition-colors"
              title="টুইটার"
            >
              <Twitter size={16} />
            </a>
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 pt-6 border-t border-gray-50 dark:border-gray-900 text-center font-semibold text-gray-400 dark:text-gray-600">
        <p>© {new Date().getFullYear()} {siteName}. সর্বস্বত্ব সংরক্ষিত।</p>
      </div>
    </footer>
  );
}
