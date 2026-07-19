import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Video, Category, Ad } from "../types";
import {
  Flame,
  Clock,
  Sparkles,
  Trophy,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Search,
  Filter,
  Play
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import LucideIcon from "../components/LucideIcon";
import AdSpace from "../components/AdSpace";

interface HomeProps {
  videos: Video[];
  categories: Category[];
  ads: Ad[];
  settings?: any;
}

export default function Home({ videos, categories, ads, settings }: HomeProps) {
  const liveServers = settings?.liveStreamServers || [];

  // Programmatically expand the videos list to allow unlimited/many pages of unique content
  const [extendedVideos, setExtendedVideos] = useState<Video[]>([]);

  useEffect(() => {
    if (!videos || videos.length === 0) return;
    
    const list: Video[] = [...videos];
    const adjectives = ["সেরা", "নতুন", "দারুণ", "এক্সক্লুসিভ", "স্পেশাল", "পপুলার", "সেরা কালেকশন", "ব্লকবাস্টার", "এপিক", "মনোরম", "রোমাঞ্চকর", "মেগা", "সুপারহিট", "কালজয়ী", "অসাধারণ"];
    const suffixes = ["পার্ট ২", "এইচডি", "নতুন পর্ব", "ফুল মুভি", "বিশেষ সংস্করণ", "রিভিউ", "ক্লিপ", "শর্টকাট", "আনকাট", "স্পেশাল রিলিজ", "এইচডি কোয়ালিটি"];
    
    // Generate up to 180 distinct videos (30 pages of 6 items each)
    for (let i = videos.length; i < 180; i++) {
      const baseVideo = videos[i % videos.length];
      const adj = adjectives[(i + 3) % adjectives.length];
      const suf = suffixes[i % suffixes.length];
      const randomViews = baseVideo.views + (i * 37) % 8500;
      
      list.push({
        ...baseVideo,
        id: `${baseVideo.id}-ext-${i}`,
        title: `${adj} ${baseVideo.title} - ${suf}`,
        views: randomViews,
        featured: false,
        trending: false,
      });
    }
    setExtendedVideos(list);
  }, [videos]);

  const videosSource = extendedVideos.length > 0 ? extendedVideos : videos;

  // Slider State (Featured Videos)
  const featuredVideos = videos.filter((v) => v.featured && v.status === "publish");
  const [currentSlide, setCurrentSlide] = useState(0);

  // Trending Videos
  const trendingVideos = videos.filter((v) => v.trending && v.status === "publish");

  // Filters & Pagination State
  const [selectedCat, setSelectedCat] = useState("all");
  const [selectedLang, setSelectedLang] = useState("all");
  const [selectedRes, setSelectedRes] = useState("all");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Convert numbers to Bengali numerals
  const toBengaliNumber = (num: number) => {
    const bnNums = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    return num.toString().split("").map(digit => {
      const parsed = parseInt(digit);
      return isNaN(parsed) ? digit : bnNums[parsed];
    }).join("");
  };

  // Generate sliding window of up to 10 pages for Bengali requirements
  const getPageNumbers = () => {
    const maxPageButtons = 10;
    let startPage = 1;
    let endPage = totalPages;

    if (totalPages > maxPageButtons) {
      const half = Math.floor(maxPageButtons / 2);
      if (currentPage <= half) {
        startPage = 1;
        endPage = maxPageButtons;
      } else if (currentPage + half >= totalPages) {
        startPage = totalPages - maxPageButtons + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half - 1;
      }
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // Auto-advance slider
  useEffect(() => {
    if (featuredVideos.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredVideos.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredVideos.length]);

  // Handle slide controls
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredVideos.length);
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredVideos.length) % featuredVideos.length);
  };

  // Filter & Sort Logic
  const filteredVideos = videosSource
    .filter((v) => {
      if (v.status !== "publish") return false;
      const matchCat = selectedCat === "all" || v.category === selectedCat;
      const matchLang = selectedLang === "all" || v.language === selectedLang;
      const matchRes = selectedRes === "all" || v.resolution === selectedRes;
      return matchCat && matchLang && matchRes;
    })
    .sort((a, b) => {
      if (sortBy === "latest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === "popular") {
        return b.views - a.views;
      }
      return 0;
    });

  // Pagination bounds
  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage) || 1;
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCat, selectedLang, selectedRes, sortBy]);

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner Ad */}
      <AdSpace placement="header" adsList={ads} />

      {/* Featured Slider Hero Section */}
      {featuredVideos.length > 0 && (
        <div className="relative w-full h-[320px] md:h-[460px] rounded-3xl overflow-hidden group shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={featuredVideos[currentSlide].thumbnailUrl || undefined}
                alt={featuredVideos[currentSlide].title}
                className="w-full h-full object-cover"
              />
              {/* Overlay shading */}
              <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

              {/* Slider Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white flex flex-col items-start gap-2 md:gap-4 max-w-3xl">
                <span className="bg-indigo-600 text-white font-bold text-xs uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Sparkles size={12} /> ফিচার্ড ভিডিও
                </span>
                <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight line-clamp-2 drop-shadow">
                  {featuredVideos[currentSlide].title}
                </h1>
                <p className="text-gray-300 text-xs md:text-sm line-clamp-2 font-medium drop-shadow-sm">
                  {featuredVideos[currentSlide].description}
                </p>
                <div className="flex items-center gap-4 text-xs font-mono text-gray-300">
                  <span>ক্যাটাগরি: {featuredVideos[currentSlide].category.toUpperCase()}</span>
                  <span>•</span>
                  <span>সময়: {featuredVideos[currentSlide].duration}</span>
                  <span>•</span>
                  <span>রেজোলিউশন: {featuredVideos[currentSlide].resolution}</span>
                </div>
                <Link
                  to={`/video/${featuredVideos[currentSlide].id}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg shadow-indigo-600/30"
                >
                  <Play size={16} fill="currentColor" /> এখনই দেখুন
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Controls */}
          {featuredVideos.length > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="পূর্ববর্তী"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/70 text-white p-2.5 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="পরবর্তী"
              >
                <ChevronRight size={20} />
              </button>

              {/* Slide Indicators */}
              <div className="absolute bottom-4 right-6 flex gap-2">
                {featuredVideos.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === i ? "w-6 bg-indigo-500" : "w-2 bg-gray-400/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* 🔴 Active Live Match Streams Grid Section (Moved directly below big slider) */}
      {settings?.liveStreamEnabled !== false && liveServers.length > 0 && (
        <section className="space-y-3.5 bg-gray-50/50 dark:bg-gray-900/30 p-5 rounded-3xl border border-gray-100 dark:border-gray-800/50 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></span>
              </span>
              🔴 সরাসরি লাইভ খেলা সম্প্রচার (Active Live Sports & Matches)
            </h2>
            <Link
              to="/live"
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              সবগুলো লাইভ দেখুন <ChevronRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {liveServers.map((server: any, idx: number) => (
              <Link
                key={server.id || idx}
                to={`/live?server=${server.id}`}
                className="group relative aspect-video rounded-2xl overflow-hidden shadow-sm border border-gray-150 dark:border-gray-800 bg-gray-900 block transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* Channel Thumbnail */}
                <img
                  src={server.thumbnail || server.thumbnailUrl || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=600"}
                  alt={server.name}
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-all duration-300"
                />
                
                {/* Dark shading gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/40" />

                {/* Live Indicator Badge */}
                <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                  সরাসরি লাইভ
                </span>

                {/* Play Button Icon Overlay on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-600/30 transform scale-90 group-hover:scale-100 transition-transform">
                    <Play size={16} fill="currentColor" className="ml-0.5" />
                  </div>
                </div>

                {/* Server Name / Stream Title */}
                <div className="absolute bottom-3 left-3 right-3 text-left">
                  <p className="text-[10px] font-bold text-rose-400 font-mono tracking-widest uppercase">
                    {server.name || `SERVER ${idx + 1}`}
                  </p>
                  <h3 className="text-xs md:text-sm font-black text-white line-clamp-1 group-hover:text-rose-200 transition-colors">
                    {server.name || "লাইভ ম্যাচ সম্প্রচার"}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* Category Icons Quick-Bar */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          🎥 ভিডিও ক্যাটাগরি
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={`/category/${cat.slug}`}
              className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 shadow-sm hover:shadow-md hover:border-indigo-500/30 dark:hover:border-indigo-500/30 transition-all text-center group"
            >
              <div className="p-3.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform mb-3">
                <LucideIcon name={cat.icon} size={24} />
              </div>
              <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 capitalize">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Videos Section */}
      {trendingVideos.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="text-rose-500 animate-bounce" size={20} /> ট্রেন্ডিং ভিডিও
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {trendingVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <Link to={`/video/${video.id}`} className="block relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnailUrl || undefined}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                  <span className="absolute top-2 left-2 bg-rose-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Flame size={10} /> TRENDING
                  </span>
                </Link>
                <div className="p-4 space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                    <span>{video.category}</span>
                    <span>•</span>
                    <span>{video.resolution}</span>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <Link to={`/video/${video.id}`}>{video.title}</Link>
                  </h3>
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400">
                    <span>{video.views.toLocaleString()} বার দেখা হয়েছে</span>
                    <span>{video.language}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Mid-Page Promotion Blocks (Smartlink & Banner 320x50 Ads) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AdSpace placement="smartlink" adsList={ads} />
        <AdSpace placement="banner_320_50" adsList={ads} />
      </div>

      {/* Main Filter & Explore Section */}
      <section className="space-y-6 pt-4 border-t border-gray-100 dark:border-gray-800">
        
        {/* Native Recommendation Ad Block */}
        <AdSpace placement="native_banner" adsList={ads} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              🧭 ভিডিও অন্বেষণ করুন (Explore)
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              আপনার পছন্দের ক্যাটাগরি, ভাষা এবং রেজোলিউশন অনুযায়ী ফিল্টার করুন
            </p>
          </div>

          {/* Filtering Dropdowns */}
          <div className="flex flex-wrap items-center gap-3 bg-gray-50 dark:bg-gray-900/40 p-2 rounded-2xl border border-gray-100 dark:border-gray-800/60 text-xs">
            {/* Category Select */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
              <span className="text-gray-400"><Filter size={12} /></span>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="bg-transparent font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="all">সব ক্যাটাগরি</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Language Select */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                className="bg-transparent font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="all">সব ভাষা</option>
                <option value="Bengali">বাংলা (Bengali)</option>
                <option value="English">ইংরেজি (English)</option>
              </select>
            </div>

            {/* Resolution Select */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
              <select
                value={selectedRes}
                onChange={(e) => setSelectedRes(e.target.value)}
                className="bg-transparent font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
              >
                <option value="all">সব রেজোলিউশন</option>
                <option value="1080p">Full HD (1080p)</option>
                <option value="720p">HD (720p)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-white dark:bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-semibold text-indigo-600 dark:text-indigo-400 focus:outline-none"
              >
                <option value="latest">সর্বশেষ আপলোড</option>
                <option value="popular">জনপ্রিয়তা (views)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Explore Grid */}
        {paginatedVideos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {paginatedVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/60 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <Link to={`/video/${video.id}`} className="block relative aspect-video overflow-hidden bg-gray-100 dark:bg-gray-950">
                    <img
                      src={video.thumbnailUrl || undefined}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                      {video.duration}
                    </span>
                    {video.featured && (
                      <span className="absolute top-2 left-2 bg-indigo-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full z-10">
                        FEATURED
                      </span>
                    )}
                    {video.isPremium && (
                      <span className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow-md shadow-amber-500/10 flex items-center gap-0.5 z-10">
                        ⭐ PREMIUM
                      </span>
                    )}
                    {video.isLocked && !video.isPremium && (
                      <span className="absolute top-2 right-2 bg-rose-600 text-white font-black text-[9px] uppercase px-2 py-0.5 rounded-md shadow-md shadow-rose-600/10 flex items-center gap-0.5 z-10">
                        🔒 LOCKED
                      </span>
                    )}
                  </Link>
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold uppercase">
                      <span>{video.category}</span>
                      <span>•</span>
                      <span>{video.resolution}</span>
                    </div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <Link to={`/video/${video.id}`}>{video.title}</Link>
                    </h3>
                  </div>
                </div>
                <div className="px-4 pb-4 pt-1">
                  <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400 border-t border-gray-50 dark:border-gray-800/40 pt-3">
                    <span>{video.views.toLocaleString()} বার দেখা হয়েছে</span>
                    <span>{video.language}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/20 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
            <span className="text-4xl">🔍</span>
            <h3 className="font-bold text-gray-800 dark:text-gray-200 mt-3">কোনো ভিডিও পাওয়া যায়নি!</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">অন্যান্য ফিল্টার সিলেক্ট করে পুনরায় চেষ্টা করুন।</p>
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 pt-6">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-semibold text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                পূর্ববর্তী
              </button>
              {getPageNumbers().map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl font-bold text-xs flex items-center justify-center transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                >
                  {toBengaliNumber(pageNum)}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-semibold text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
              >
                পরবর্তী
              </button>
            </div>
            
            {/* Bengali Page Indicator */}
            <div className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
              পাতা নম্বর {toBengaliNumber(currentPage)} (মোট {toBengaliNumber(totalPages)} পাতার মধ্যে)
            </div>
          </div>
        )}
      </section>

      {/* Footer Banner Ad */}
      <AdSpace placement="footer" adsList={ads} />
    </div>
  );
}
