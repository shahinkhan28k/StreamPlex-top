import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Video, Category, Ad } from "../types";
import { Filter, Sliders, Play, Search, AlertTriangle } from "lucide-react";
import AdSpace from "../components/AdSpace";

interface SearchPageProps {
  videos: Video[];
  categories: Category[];
  ads: Ad[];
}

export default function SearchPage({ videos, categories, ads }: SearchPageProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  // Search, filter, and page values from address bar (keeps state perfectly on reload!)
  const query = searchParams.get("q") || "";
  const langFilter = searchParams.get("lang") || "all";
  const resFilter = searchParams.get("res") || "all";
  const sortBy = searchParams.get("sort") || "latest";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const itemsPerPage = 6;

  // Helper to update url parameters
  const updateParam = (key: string, value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set(key, value);
    if (key !== "page") {
      nextParams.set("page", "1");
    }
    setSearchParams(nextParams);
  };

  // Perform client-side searching across titles, description and tags
  const matchedVideos = videos.filter((v) => {
    if (v.status !== "publish") return false;
    if (!query) return true;

    const lowerQuery = query.toLowerCase();
    const titleMatch = v.title.toLowerCase().includes(lowerQuery);
    const descMatch = v.description.toLowerCase().includes(lowerQuery);
    const tagMatch = v.tags.some((tag) => tag.toLowerCase().includes(lowerQuery));

    return titleMatch || descMatch || tagMatch;
  });

  // Filter & Sort
  const filteredVideos = matchedVideos
    .filter((v) => {
      const matchLang = langFilter === "all" || v.language === langFilter;
      const matchRes = resFilter === "all" || v.resolution === resFilter;
      return matchLang && matchRes;
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

  // Auto bounds correction
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      updateParam("page", totalPages.toString());
    }
  }, [filteredVideos.length, totalPages, currentPage]);

  return (
    <div className="space-y-8 pb-12">
      {/* Search Result Banner */}
      <div className="p-6 md:p-10 rounded-3xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">অনুসন্ধান ফলাফল</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white mt-1">
            {query ? `"${query}" এর জন্য ফলাফল` : "সব ভিডিও অনুসন্ধান"}
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">
            মোট {filteredVideos.length} টি ভিডিও ম্যাচ করেছে।
          </p>
        </div>

        {/* Input box inside the search page if they want to search again */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const val = (e.currentTarget.elements.namedItem("qInput") as HTMLInputElement).value;
            updateParam("q", val);
          }}
          className="flex items-center gap-2 max-w-sm w-full"
        >
          <div className="relative w-full">
            <input
              type="text"
              name="qInput"
              defaultValue={query}
              placeholder="ভিডিও খুঁজুন..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
          >
            খুঁজুন
          </button>
        </form>
      </div>

      {/* Ads Section */}
      <AdSpace placement="header" adsList={ads} />

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl shadow-sm">
        <div className="flex items-center gap-2">
          <Sliders size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200">
            অনুসন্ধান ফিল্টার ও সর্টিং
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

          {/* Sort filter */}
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

      {/* Grid List */}
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
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/10 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
          <span className="text-4xl">🔍</span>
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mt-4">কোনো ভিডিও ম্যাচ করেনি!</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">দয়া করে কীওয়ার্ড পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
        </div>
      )}

      {/* Pagination */}
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

      {/* Footer Banner Ad */}
      <AdSpace placement="footer" adsList={ads} />
    </div>
  );
}
