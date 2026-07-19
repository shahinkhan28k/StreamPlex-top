import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Video, Category, Ad } from "../types";
import {
  Eye,
  Calendar,
  Heart,
  Share2,
  Tv,
  MessageSquare,
  ChevronRight,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  Lock,
  Clock,
  ShieldAlert,
  Bookmark,
  Crown
} from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";
import AdSpace from "../components/AdSpace";

interface VideoDetailsProps {
  videos: Video[];
  ads: Ad[];
  onRefreshVideos: () => void;
}

export default function VideoDetails({ videos, ads, onRefreshVideos }: VideoDetailsProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);

  // Comment Form State
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [likesCount, setLikesCount] = useState(128);
  const [liked, setLiked] = useState(false);
  const [inWatchlist, setInWatchlist] = useState(false);

  useEffect(() => {
    if (!id) return;
    const watchlist = JSON.parse(localStorage.getItem("streamplex_watchlist") || "[]");
    setInWatchlist(watchlist.includes(id));
  }, [id]);

  const handleWatchlistToggle = () => {
    if (!id) return;
    let watchlist = JSON.parse(localStorage.getItem("streamplex_watchlist") || "[]");
    if (watchlist.includes(id)) {
      watchlist = watchlist.filter((vId: string) => vId !== id);
      setInWatchlist(false);
    } else {
      watchlist.push(id);
      setInWatchlist(true);
    }
    localStorage.setItem("streamplex_watchlist", JSON.stringify(watchlist));
  };

  // Ad-Overlay for Locked Videos State
  const [isAdRunning, setIsAdRunning] = useState(false);
  const [adCountdown, setAdCountdown] = useState(15);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isTimerStarted, setIsTimerStarted] = useState(false);

  // Premium User Verification State
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isPremiumUser, setIsPremiumUser] = useState(false);
  const [premiumLoading, setPremiumLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("streamplex_logged_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        fetch(`/api/users/premium-status?email=${encodeURIComponent(parsed.email)}`)
          .then((res) => res.json())
          .then((data) => {
            setIsPremiumUser(!!data.isPremium);
            setPremiumLoading(false);
          })
          .catch((err) => {
            console.error("Error checking premium status in video details:", err);
            setPremiumLoading(false);
          });
      } catch (e) {
        setPremiumLoading(false);
      }
    } else {
      setPremiumLoading(false);
    }
  }, []);

  // Increment views and fetch detailed video state
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setCommentSuccess(false);

    // Hit server increment endpoint
    fetch(`/api/videos/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Video not found");
        return res.json();
      })
      .then((data: Video) => {
        setVideo(data);
        setLoading(false);
        setIsUnlocked(false); // Reset unlocked state for the new video
        setIsTimerStarted(false); // Reset direct link click state
        // Refresh core videos database to keep view counts in sync on parent elements
        onRefreshVideos();
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });

    // Randomize initial likes count for realistic display
    setLikesCount(Math.floor(Math.random() * 200) + 50);
    setLiked(false);
  }, [id]);

  // Trigger countdown when video loaded, isLocked is active, and direct link has been clicked
  useEffect(() => {
    if (video && video.isLocked && !isUnlocked && isTimerStarted) {
      setIsAdRunning(true);
    } else {
      setIsAdRunning(false);
    }
  }, [video, isUnlocked, isTimerStarted]);

  useEffect(() => {
    if (!isAdRunning) return;
    if (adCountdown <= 0) {
      setIsAdRunning(false);
      setIsUnlocked(true);
      return;
    }
    const timer = setTimeout(() => {
      setAdCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [isAdRunning, adCountdown]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">ভিডিও লোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...</p>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="text-rose-500 mx-auto" size={48} />
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mt-4">
          ভিডিও পাওয়া যায়নি!
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

  // Related Videos (same category, excluding the current playing video)
  const relatedVideos = videos.filter(
    (v) => v.category === video.category && v.id !== video.id && v.status === "publish"
  );

  // Auto-next fallback if related list has entries
  const handlePlayNext = () => {
    if (relatedVideos.length > 0) {
      navigate(`/video/${relatedVideos[0].id}`);
    }
  };

  // Submit public user comment to moderation endpoint
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentName.trim() || !commentText.trim()) return;

    fetch(`/api/comments/${video.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userName: commentName, text: commentText })
    })
      .then((res) => res.json())
      .then(() => {
        setCommentText("");
        setCommentSuccess(true);
        // Refresh the video state from the server to pick up the pending comment
        fetch(`/api/videos/${video.id}`)
          .then((res) => res.json())
          .then((data) => setVideo(data));
      });
  };

  const handleLike = () => {
    if (liked) {
      setLikesCount((p) => p - 1);
      setLiked(false);
    } else {
      setLikesCount((p) => p + 1);
      setLiked(true);
    }
  };

  // Share Simulation
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: video.title,
          text: video.description,
          url: window.location.href
        })
        .catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("ভিডিও লিঙ্কটি ক্লিপবোর্ডে কপি করা হয়েছে! 🔗");
    }
  };

  // Filter approved comments to show publicly
  const approvedComments = video.comments ? video.comments.filter((c) => c.approved) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
      {/* Left 2 Columns: Video Player, Title, Meta Details, Comments */}
      <div className="lg:col-span-2 space-y-6">
        {/* Ad top */}
        <AdSpace placement="header" adsList={ads} />

        {/* Video Player or Premium Gate or Locked Ad Overlay */}
        {video.isPremium && !isPremiumUser ? (
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-slate-950 via-indigo-950/80 to-slate-950 flex flex-col items-center justify-center p-8 text-center border border-indigo-900/40">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 shadow-lg shadow-amber-500/10 animate-pulse">
              <Crown size={32} />
            </div>
            <h2 className="text-lg md:text-xl font-black text-amber-400">প্রিমিয়াম কন্টেন্ট! ⭐</h2>
            <p className="text-xs text-gray-300 max-w-md mt-2 leading-relaxed">
              এই ভিডিওটি শুধুমাত্র আমাদের সম্মানিত প্রিমিয়াম মেম্বারদের জন্য সংরক্ষিত। অনুগ্রহ করে প্রিমিয়াম সাবস্ক্রিপশন প্যাকেজ অ্যাক্টিভেট করে আজই দেখা শুরু করুন।
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <Link
                to="/offers"
                className="bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-xs py-2.5 px-6 rounded-xl shadow-lg shadow-amber-500/20 hover:scale-105 transition-all flex items-center gap-1.5"
              >
                <Sparkles size={14} /> প্রিমিয়াম প্যাকেজ কিনুন ⚡
              </Link>
              {!currentUser && (
                <Link
                  to="/login"
                  className="bg-white/10 text-white hover:bg-white/15 border border-white/10 font-bold text-xs py-2.5 px-6 rounded-xl transition-all"
                >
                  লগইন করুন
                </Link>
              )}
            </div>
          </div>
        ) : video.isLocked && !isUnlocked ? (
          <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-slate-950 flex flex-col justify-between border border-gray-800">
            {/* Blurred background image */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-30 scale-105"
              style={{ backgroundImage: `url(${video.thumbnailUrl})` }}
            />

            {/* Header Lock Alert */}
            <div className="relative z-10 bg-black/60 backdrop-blur-md px-5 py-3 border-b border-white/5 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                <span className="text-[10px] uppercase font-black tracking-widest text-rose-400">Locked Video Access</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] font-bold text-gray-300 font-mono">
                <Clock size={12} className="text-indigo-400" />
                <span>{!isTimerStarted ? "ক্লিক করুন" : adCountdown > 0 ? `${adCountdown}s` : "সম্পন্ন"}</span>
              </div>
            </div>

            {/* Middle: Custom Ads Frame */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
              {!isTimerStarted ? (
                <div className="space-y-3 max-w-md">
                  <div className="w-12 h-12 rounded-full bg-rose-500/10 border-2 border-rose-500 text-rose-400 flex items-center justify-center mx-auto text-lg font-black animate-pulse">
                    <Lock size={18} />
                  </div>
                  <h3 className="text-sm font-extrabold text-white">
                    ভিডিওটি বর্তমানে লক করা আছে
                  </h3>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-medium">
                    ভিডিওটি আনলক করতে প্রথমে নিচের <b>বিজ্ঞাপন বা ডাইরেক্ট লিঙ্কে</b> ক্লিক করুন। ক্লিক করার সাথে সাথে টাইমিং শুরু হবে এবং টাইমিং শেষে ভিডিওটি দেখতে পারবেন।
                  </p>
                  
                  {/* Direct Link Trigger Button */}
                  <button
                    type="button"
                    onClick={() => {
                      const smartlinkAds = ads.filter(a => a.enabled && a.placement === "smartlink");
                      let targetUrl = "https://www.highrevenuegate.com/direct-link-placeholder";
                      if (smartlinkAds.length > 0) {
                        const matches = smartlinkAds[0].code.match(/href="([^"]+)"/);
                        if (matches && matches[1]) {
                          targetUrl = matches[1];
                        } else {
                          targetUrl = smartlinkAds[0].code.replace(/<[^>]*>/g, '').trim();
                        }
                      }
                      window.open(targetUrl, '_blank');
                      setIsTimerStarted(true);
                      setAdCountdown(15);
                    }}
                    className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-xs px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all cursor-pointer"
                  >
                    <Sparkles size={14} /> ডাইরেক্ট লিংক (বিজ্ঞাপন) ক্লিক করুন
                  </button>
                </div>
              ) : adCountdown > 0 ? (
                <div className="space-y-3 max-w-md">
                  <div className="w-12 h-12 rounded-full bg-indigo-600/10 border-2 border-indigo-500 text-indigo-400 flex items-center justify-center mx-auto text-sm font-black animate-pulse">
                    {adCountdown}
                  </div>
                  <h3 className="text-sm font-extrabold text-white">
                    ভিডিওটি আনলক হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...
                  </h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-medium">
                    এই ভিডিওটি দেখতে অনুগ্রহ করে {adCountdown} সেকেন্ড অপেক্ষা করুন। নিচে আপনার জন্য একটি বিজ্ঞাপন লোড হয়েছে।
                  </p>
                </div>
              ) : (
                <div className="space-y-4 animate-bounce">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                    <Play size={24} className="ml-1" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-emerald-400">
                      ভিডিওটি আনলক করা হয়েছে! 🎉
                    </h3>
                    <p className="text-[11px] text-gray-300 font-medium">
                      নিচের বাটনে ক্লিক করে এখনই সম্পূর্ণ ভিডিওটি উপভোগ করুন।
                    </p>
                  </div>
                </div>
              )}

              {/* Advertisement Display Area */}
              <div className="w-full max-w-lg bg-black/40 border border-white/5 p-3 rounded-2xl">
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-wider text-left mb-1">PROMOTED ADVERTISEMENT</div>
                {ads.filter(a => a.enabled && a.placement === "banner").length > 0 ? (
                  <div 
                    className="text-xs text-white"
                    dangerouslySetInnerHTML={{ __html: ads.filter(a => a.enabled && a.placement === "banner")[0].code }}
                  />
                ) : (
                  <div className="py-2.5 px-4 text-left space-y-1 bg-gradient-to-r from-indigo-950/40 to-slate-900/40 rounded-xl">
                    <div className="font-extrabold text-xs text-indigo-400">StreamPlex Premium 📺</div>
                    <p className="text-[10px] text-gray-400 leading-normal text-left">
                      মাত্র ৯৯ টাকায় পান প্রিমিয়াম একাউন্ট! বিজ্ঞাপনহীন স্ট্রিমিং, আনলিমিটেড লাইভ স্পোর্টস, নাটক ও মুভি উপভোগ করুন আজই।
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Play Actions */}
            <div className="relative z-10 bg-black/40 px-5 py-3 border-t border-white/5 flex justify-end">
              <button
                type="button"
                disabled={!isTimerStarted || adCountdown > 0}
                onClick={() => setIsUnlocked(true)}
                className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-gray-500 text-white font-extrabold text-xs py-2 px-6 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-600/15 cursor-pointer disabled:cursor-not-allowed"
              >
                <Play size={13} />
                {!isTimerStarted ? "প্রথমে বিজ্ঞাপনে ক্লিক করুন" : adCountdown > 0 ? `ভিডিও প্লে করতে ${adCountdown} সেকেন্ড বাকি...` : "ভিডিও প্লে করুন"}
              </button>
            </div>
          </div>
        ) : (
          <VideoPlayer
            src={video.videoUrl}
            poster={video.thumbnailUrl}
            title={video.title}
            onNext={handlePlayNext}
          />
        )}

        {/* Title and stats bar */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                {video.category}
              </span>
              <span className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-mono text-[10px] uppercase px-2 py-1 rounded-md">
                {video.resolution}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-900 dark:text-white leading-tight">
              {video.title}
            </h1>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800/60 text-xs">
            {/* View Stats */}
            <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Eye size={15} className="text-indigo-500" />
                {video.views.toLocaleString()} বার দেখা হয়েছে
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar size={15} />
                {new Date(video.createdAt).toLocaleDateString("bn-BD", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </span>
            </div>

            {/* Social / React Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 font-bold py-2 px-3.5 rounded-xl transition-all border ${
                  liked
                    ? "bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900"
                    : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Heart size={15} fill={liked ? "currentColor" : "none"} />
                {likesCount} লাইক
              </button>

              <button
                onClick={handleWatchlistToggle}
                className={`flex items-center gap-1.5 font-bold py-2 px-3.5 rounded-xl transition-all border ${
                  inWatchlist
                    ? "bg-indigo-50 border-indigo-200 text-indigo-600 dark:bg-indigo-950/20 dark:border-indigo-900"
                    : "bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Bookmark size={15} fill={inWatchlist ? "currentColor" : "none"} />
                {inWatchlist ? "সেভ করা আছে" : "ওয়াচলিস্ট"}
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 font-bold bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 py-2 px-3.5 rounded-xl transition-all"
              >
                <Share2 size={15} />
                শেয়ার
              </button>
            </div>
          </div>
        </div>

        {/* Video Description Card */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl shadow-sm space-y-3">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white">ভিডিও বিবরণী</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
            {video.description || "এই ভিডিওটির জন্য কোনো বিশেষ বিবরণ যোগ করা হয়নি।"}
          </p>

          {/* Tags Mapping */}
          {video.tags && video.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-50 dark:border-gray-800/40">
              {video.tags.map((tag) => (
                <Link
                  key={tag}
                  to={`/search?q=${tag}`}
                  className="bg-gray-50 hover:bg-indigo-50 dark:bg-gray-950 dark:hover:bg-indigo-950/40 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 text-[10px] font-bold px-2 py-1 rounded transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Video Page Ads (Smartlink, Banner 320x50 & Native Banner) */}
        <div className="space-y-4">
          <AdSpace placement="smartlink" adsList={ads} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AdSpace placement="banner_320_50" adsList={ads} />
            <AdSpace placement="native_banner" adsList={ads} />
          </div>
        </div>

        {/* Public comments discussion board */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-50 dark:border-gray-800/60 pb-3">
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-500" />
              মন্তব্যসমূহ ({approvedComments.length})
            </h3>
          </div>

          {/* New Comment Submission Form */}
          <form onSubmit={handleCommentSubmit} className="space-y-3">
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">একটি নতুন মন্তব্য লিখুন</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="আপনার নাম..."
                value={commentName}
                onChange={(e) => setCommentName(e.target.value)}
                required
                className="md:col-span-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50 font-semibold"
              />
              <div className="md:col-span-3 flex gap-2">
                <input
                  type="text"
                  placeholder="আপনার মন্তব্যটি এখানে লিখুন..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  required
                  className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50 font-medium"
                />
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-xl transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center shrink-0 cursor-pointer"
                  title="মন্তব্য পাঠান"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>

            {commentSuccess && (
              <div className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-800 dark:text-emerald-300 p-3 rounded-xl border border-emerald-200 dark:border-emerald-900/50 text-[11px] font-semibold flex items-center gap-2 animate-fade-in">
                <CheckCircle2 size={14} className="text-emerald-500" />
                ধন্যবাদ! আপনার মন্তব্যটি অ্যাডমিন অনুমোদনের জন্য অপেক্ষমান রয়েছে।
              </div>
            )}
          </form>

          {/* List of Approved comments */}
          <div className="space-y-4 pt-2">
            {approvedComments.length > 0 ? (
              approvedComments.map((comm) => (
                <div
                  key={comm.id}
                  className="p-3.5 rounded-xl bg-gray-50/50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-800/40 flex items-start gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold font-mono">
                    {comm.userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-gray-800 dark:text-gray-200">
                        {comm.userName}
                      </span>
                      <span className="text-[10px] font-mono text-gray-400">
                        {new Date(comm.createdAt).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      {comm.text}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-6 text-xs text-gray-400 dark:text-gray-500 font-medium">
                এখনো কোনো মন্তব্য করা হয়নি। প্রথম মন্তব্যটি আপনার করুন!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Advertisement sidebar & Related Videos stack */}
      <div className="space-y-6">
        {/* Sidebar Banner Ad */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-1.5 rounded-2xl shadow-sm">
          <AdSpace placement="sidebar" adsList={ads} />
        </div>

        {/* Related Videos List */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-5 rounded-2xl shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-gray-900 dark:text-white flex items-center gap-2">
            <Tv size={16} className="text-indigo-500 animate-pulse" />
            সম্পর্কিত ভিডিও (Related)
          </h3>

          <div className="space-y-4">
            {relatedVideos.length > 0 ? (
              relatedVideos.map((relVid) => (
                <div key={relVid.id} className="flex gap-3 group">
                  <Link
                    to={`/video/${relVid.id}`}
                    className="relative w-28 aspect-video shrink-0 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 dark:border-gray-800"
                  >
                    <img
                      src={relVid.thumbnailUrl || undefined}
                      alt={relVid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1 py-0.2 rounded">
                      {relVid.duration}
                    </span>
                  </Link>

                  <div className="space-y-1.5 min-w-0 flex flex-col justify-center">
                    <h4 className="font-bold text-xs text-gray-900 dark:text-white line-clamp-2 leading-snug hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      <Link to={`/video/${relVid.id}`}>{relVid.title}</Link>
                    </h4>
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 block truncate">
                      {relVid.views.toLocaleString()} বার দেখা হয়েছে
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-xs text-gray-400 dark:text-gray-500 font-medium">
                এই ক্যাটাগরিতে অন্য কোনো ভিডিও নেই।
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
