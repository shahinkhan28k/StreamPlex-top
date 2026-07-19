import { useEffect } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import { Video, Category, Ad } from "../types";
import { Filter, Sliders, Play, AlertTriangle, Sparkles } from "lucide-react";
import LucideIcon from "../components/LucideIcon";
import AdSpace from "../components/AdSpace";

interface CategoryPageProps {
  videos: Video[];
  categories: Category[];
  ads: Ad[];
}

export default function CategoryPage({ videos, categories, ads }: CategoryPageProps) {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  // Find active category
  const activeCategory = categories.find((c) => c.slug === slug);

  // Read state from URL search params (F5 / back-forward persistent!)
  const subFilter = searchParams.get("sub") || "all";
  const langFilter = searchParams.get("lang") || "all";
  const resFilter = searchParams.get("res") || "all";
  const sortBy = searchParams.get("sort") || "latest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 6;

  // Helper to update search params
  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set(key, value);
    // Reset page to 1 if filter changes, unless page itself is changing
    if (key !== "page") {
      nextParams.set("page", "1");
    }
    setSearchParams(nextParams);
  };

  // Filter & Sort
  const categoryVideos = videos.filter(
    (v) => v.category === slug && v.status === "publish"
  );

  const filteredVideos = categoryVideos
    .filter((v) => {
      const matchSub = subFilter === "all" || v.subCategory === subFilter;
      const matchLang = langFilter === "all" || v.language === langFilter;
      const matchRes = resFilter === "all" || v.resolution === resFilter;
      return matchSub && matchLang && matchRes;
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

  const totalPages = Math.ceil(filteredVideos.length / itemsPerPage) || 1;
  const paginatedVideos = filteredVideos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  // Validate current page bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateParam("page", totalPages.toString());
    }
  }, [filteredVideos.length, totalPages, currentPage]);

  if (!activeCategory) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="text-amber-500 mx-auto" size={48} />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-4">
          ক্যাটাগরি খুঁজে পাওয়া যায়নি!
        </h2>
        <Link
          to="/"
          className="mt-4 inline-block bg-indigo-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors"
        >
          হোমে ফিরে যান
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Category Header Banner with Overlay */}
      <div className="relative w-full h-[180px] md:h-[240px] rounded-3xl overflow-hidden shadow-md">
        <img
          src={activeCategory.image || undefined}
          alt={activeCategory.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/90 to-gray-950/60 flex items-center p-6 md:p-12 text-white" />
        <div className="absolute inset-0 flex flex-col justify-center p-6 md:p-12 text-white">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <LucideIcon name={activeCategory.icon} className="text-white" size={28} />
            </div>
            <div>
              <span className="text-[10px] font-bold tracking-widest uppercase opacity-85">ক্যাটাগরি</span>
              <h1 className="text-2xl md:text-4xl font-extrabold capitalize leading-tight">
                {activeCategory.name}
              </h1>
            </div>
          </div>
          <p className="text-gray-300 text-xs md:text-sm mt-3 max-w-xl font-medium">
            {activeCategory.name} ক্যাটাগরির সমস্ত লেটেস্ট, জনপ্রিয় এবং ফিচার্ড ভিডিওগুলো নিচে উপভোগ করুন।
          </p>
        </div>
      </div>

      {/* Ads Integration */}
      <AdSpace placement="header" adsList={ads} />

      {/* Sub Category Tabs Selector */}
      {activeCategory.subCategories && activeCategory.subCategories.length > 0 && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-3 rounded-2xl flex flex-wrap gap-2 items-center">
          <span className="text-xs font-black text-gray-500 dark:text-gray-400 mr-2 flex items-center gap-1">
            <Sparkles size={13} className="text-indigo-500 animate-pulse" />
            সাব-ক্যাটাগরি:
          </span>
          <button
            onClick={() => updateParam("sub", "all")}
            className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
              subFilter === "all"
                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-150 dark:border-gray-800"
            }`}
          >
            সব ভিডিও ({categoryVideos.length})
          </button>
          {activeCategory.subCategories.map((sub: any, idx: number) => {
            const count = categoryVideos.filter(v => v.subCategory === sub.slug).length;
            return (
              <button
                key={sub.slug || idx}
                onClick={() => updateParam("sub", sub.slug)}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                  subFilter === sub.slug
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/10"
                    : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-950 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-150 dark:border-gray-800"
                }`}
              >
                {sub.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Filter and sorting system */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">
            ভিডিও ফিল্টার ও শর্টিং করুন
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          {/* Language filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800/60">
            <span className="text-gray-400">ভাষা:</span>
            <select
              value={langFilter}
              onChange={(e) => updateParam("lang", e.target.value)}
              className="bg-transparent font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="all">সব ভাষা</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="English">ইংরেজি (English)</option>
            </select>
          </div>

          {/* Resolution filter */}
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800/60">
            <span className="text-gray-400">রেজোলিউশন:</span>
            <select
              value={resFilter}
              onChange={(e) => updateParam("res", e.target.value)}
              className="bg-transparent font-semibold text-gray-700 dark:text-gray-300 focus:outline-none"
            >
              <option value="all">সব রেজোলিউশন</option>
              <option value="1080p">Full HD (1080p)</option>
              <option value="720p">HD (720p)</option>
            </select>
          </div>

          {/* Sort selection */}
          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-gray-800/60">
            <span className="text-gray-400">সাজানো:</span>
            <select
              value={sortBy}
              onChange={(e) => updateParam("sort", e.target.value)}
              className="bg-transparent font-semibold text-indigo-600 dark:text-indigo-400 focus:outline-none"
            >
              <option value="latest">সর্বশেষ আপলোড</option>
              <option value="popular">জনপ্রিয়তা (views)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Videos List Grid */}
      {paginatedVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {paginatedVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800/80 overflow-hidden shadow-sm hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              <div>
                <Link to={`/video/${video.id}`} className="block relative aspect-video overflow-hidden">
                  <img
                    src={video.thumbnailUrl || undefined}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white font-mono text-[10px] px-1.5 py-0.5 rounded">
                    {video.duration}
                  </span>
                  {video.trending && (
                    <span className="absolute top-2 left-2 bg-rose-600 text-white font-bold text-[9px] uppercase px-2 py-0.5 rounded-full z-10">
                      TRENDING
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
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/10 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <span className="text-4xl">🎬</span>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mt-4">এই ফিল্টারে কোনো ভিডিও পাওয়া যায়নি!</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">দয়া করে অন্যান্য ফিল্টারিং অপশন সিলেক্ট করুন।</p>
        </div>
      )}

      {/* Pagination component */}
      {totalPages > 1 && (
        <div className="flex flex-col items-center gap-3 pt-6">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => updateParam("page", Math.max(1, currentPage - 1).toString())}
              disabled={currentPage === 1}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 font-semibold text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              পূর্ববর্তী
            </button>
            {getPageNumbers().map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => updateParam("page", pageNum.toString())}
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
              onClick={() => updateParam("page", Math.min(totalPages, currentPage + 1).toString())}
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

      {/* Footer Ad Placement */}
      <AdSpace placement="footer" adsList={ads} />
    </div>
  );
}
