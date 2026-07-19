import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { WebsiteSettings } from "../types";
import { Tv, Radio, MessageSquare, Send, Sparkles, User, ShieldCheck, Crown, Lock, Server, ChevronRight } from "lucide-react";

export default function Live() {
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [activeServerIndex, setActiveServerIndex] = useState(0);
  
  // Live Chat simulation
  const [chatMessages, setChatMessages] = useState<Array<{ id: string; user: string; text: string; time: string; isMod?: boolean }>>([
    { id: "1", user: "সাকিব হাসান", text: "লাইভ স্ট্রিমিং চমৎকার ক্লিয়ার দেখাচ্ছে! 🔥", time: "10:15 PM" },
    { id: "2", user: "ফারহানা আক্তার", text: "আজকের লাইভ ম্যাচটা দারুণ হচ্ছে। ধন্যবাদ স্ট্রীমপ্লেক্সকে।", time: "10:16 PM" },
    { id: "3", user: "আরিফ রহমান", text: "বাফারিং ছাড়াই ফুল এইচডি তে দেখতে পাচ্ছি।", time: "10:17 PM" },
    { id: "4", user: "এডমিন মডারেটর", text: "সকল দর্শকদের স্বাগতম! কোনো সমস্যা হলে কমেন্ট করুন।", time: "10:18 PM", isMod: true },
  ]);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    // 1. Fetch Settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        const urlParams = new URLSearchParams(window.location.search);
        const serverId = urlParams.get("server");
        if (serverId && data.liveStreamServers) {
          const srvIdx = data.liveStreamServers.findIndex((s: any) => s.id === serverId);
          if (srvIdx !== -1) {
            setActiveServerIndex(srvIdx + 1);
          }
        }
      })
      .catch((err) => {
        console.error("Error fetching settings for live page:", err);
      });

    // 2. Fetch User & Premium Status
    const saved = localStorage.getItem("streamplex_logged_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        
        fetch(`/api/users/premium-status?email=${encodeURIComponent(parsed.email)}`)
          .then((res) => res.json())
          .then((data) => {
            setIsPremium(!!data.isPremium);
            setLoading(false);
          })
          .catch((err) => {
            console.error("Error checking premium status:", err);
            setLoading(false);
          });
      } catch (e) {
        console.error("Error parsing logged user info:", e);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const msg = {
      id: Date.now().toString(),
      user: "ভিজিটর দর্শক",
      text: newMsg.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages((prev) => [...prev, msg]);
    setNewMsg("");

    // Simulate auto response in 2 seconds
    setTimeout(() => {
      const responses = [
        "ধন্যবাদ আমাদের সাথে লাইভে যুক্ত থাকার জন্য! ❤️",
        "লাইভটি শেয়ার করে বন্ধুদের দেখার সুযোগ করে দিন।",
        "ভিডিও কোয়ালিটি ঠিক করতে সেটিংসে যান।"
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "_reply",
          user: "সাপোর্ট বট",
          text: randomReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isMod: true
        }
      ]);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">লাইভ ভিডিও প্রস্তুত হচ্ছে...</p>
      </div>
    );
  }

  const liveEnabled = settings?.liveStreamEnabled !== false;
  const embedCode = settings?.liveStreamIframe || "";

  // Helper to ensure any input (raw URL or embed HTML) is converted to robust responsive player code
  const getEmbedHtml = (code: string, thumbnail?: string) => {
    const trimmed = code.trim();
    if (!trimmed) return "";

    // If it's a full HTML block
    if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
      return trimmed;
    }

    // If it's a raw link
    if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
      if (trimmed.includes("youtube.com/watch?v=")) {
        const videoId = trimmed.split("v=")[1]?.split("&")[0];
        if (videoId) {
          return `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen class="w-full h-full"></iframe>`;
        }
      } else if (trimmed.includes("youtu.be/")) {
        const videoId = trimmed.split("youtu.be/")[1]?.split("?")[0];
        if (videoId) {
          return `<iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen class="w-full h-full"></iframe>`;
        }
      } else if (trimmed.includes("youtube.com/embed/")) {
        return `<iframe src="${trimmed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen class="w-full h-full"></iframe>`;
      }
      
      const isDirectVideo = trimmed.match(/\.(mp4|m3u8|webm|ogg|mkv)(\?.*)?$/i) || trimmed.includes("m3u8");
      if (isDirectVideo) {
        return `<video src="${trimmed}" ${thumbnail ? `poster="${thumbnail}"` : ""} controls autoplay muted playsinline class="w-full h-full object-fill"></video>`;
      }

      return `<iframe src="${trimmed}" frameborder="0" allowfullscreen class="w-full h-full"></iframe>`;
    }

    return trimmed;
  };

  // Resolve active embed code based on selection
  let selectedCode = settings?.liveStreamIframe || "";
  let activeThumbnail = settings?.liveStreamThumbnail || "";
  const additionalServers = settings?.liveStreamServers || [];
  
  if (activeServerIndex > 0 && additionalServers[activeServerIndex - 1]) {
    selectedCode = additionalServers[activeServerIndex - 1].embedCode;
    activeThumbnail = additionalServers[activeServerIndex - 1].thumbnail || "";
  }
  
  const processedEmbedCode = getEmbedHtml(selectedCode, activeThumbnail);
  const isPremiumOnly = settings?.liveStreamPremiumOnly === true;
  const showPaywall = isPremiumOnly && !isPremium;

  return (
    <div className="py-6 space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-5 rounded-3xl shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border border-rose-500/20">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping mr-0.5" />
              লাইভ সম্প্রচার
            </span>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">🔴 ২,৪৮০ জন দেখছেন</span>
          </div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-1.5 mt-1">
            <Radio size={20} className="text-rose-500 animate-pulse" />
            চলমান লাইভ সম্প্রচার দেখুন 📺
          </h1>
        </div>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 max-w-sm font-medium">
          বাফারিং ছাড়াই এইচডি কোয়ালিটিতে সরাসরি উপভোগ করুন টিভি চ্যানেল, স্পোর্টস বা বিশেষ অনুষ্ঠানসমূহ।
        </p>
      </div>

      {/* Main Streaming & Chat Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 cols: Video Player */}
        <div className="lg:col-span-2 space-y-4">
          {showPaywall ? (
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-gradient-to-br from-slate-900 via-gray-950 to-indigo-950 flex flex-col items-center justify-center text-center p-8 border border-gray-800 shadow-2xl">
              <div className="absolute top-4 right-4 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-amber-500/20 flex items-center gap-1">
                <Crown size={11} className="text-amber-400 animate-pulse" /> Premium Only
              </div>
              
              <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center animate-bounce mb-4 border border-amber-500/20">
                <Lock size={30} />
              </div>

              <h3 className="text-base md:text-lg font-extrabold text-white flex items-center gap-2">
                লাইভ সম্প্রচারটি লক করা আছে 🔐
              </h3>
              
              <p className="text-xs text-gray-300 max-w-md mt-2 leading-relaxed font-semibold">
                এই লাইভ ভিডিওটি দেখতে একটি প্রিমিয়াম সাবস্ক্রিপশন প্রয়োজন। আমাদের অফারগুলো দেখতে নিচের বাটনে ক্লিক করুন।
              </p>

              <div className="flex flex-wrap gap-3 items-center justify-center mt-6">
                <Link
                  to="/offers"
                  className="bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-slate-950 font-black text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2"
                >
                  <Sparkles size={14} /> অফারগুলো দেখুন
                </Link>
                {!currentUser ? (
                  <Link
                    to="/login"
                    className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all border border-white/10 flex items-center gap-1"
                  >
                    লগইন করুন <ChevronRight size={14} />
                  </Link>
                ) : (
                  <span className="text-[10px] text-gray-400 font-bold">
                    লগইন আছেন: <span className="text-indigo-400 font-black">{currentUser.email}</span> (সাধারণ মেম্বার)
                  </span>
                )}
              </div>
            </div>
          ) : liveEnabled && processedEmbedCode ? (
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-black shadow-xl border border-gray-100 dark:border-gray-800/80">
              <div 
                className="w-full h-full absolute inset-0 [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:w-full [&_iframe]:h-full [&_iframe]:border-0 [&_video]:absolute [&_video]:inset-0 [&_video]:w-full [&_video]:h-full [&_video]:object-fill [&_embed]:absolute [&_embed]:inset-0 [&_embed]:w-full [&_embed]:h-full [&_object]:absolute [&_object]:inset-0 [&_object]:w-full [&_object]:h-full [&_div]:w-full [&_div]:h-full"
                dangerouslySetInnerHTML={{ __html: processedEmbedCode }}
              />
            </div>
          ) : (
            <div className="relative aspect-video rounded-3xl overflow-hidden bg-slate-950 flex flex-col items-center justify-center text-center p-8 border border-gray-800">
              <div className="w-16 h-16 rounded-full bg-rose-600/10 text-rose-500 flex items-center justify-center animate-bounce mb-4">
                <Tv size={32} />
              </div>
              <h3 className="text-base font-extrabold text-white">
                কোনো লাইভ সম্প্রচার চালু নেই
              </h3>
              <p className="text-xs text-gray-400 max-w-md mt-1">
                দুঃখিত, এই মুহূর্তে আমাদের কোনো লাইভ প্রচার চালু নেই। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন অথবা আমাদের পূর্ববর্তী ভিডিওগুলো উপভোগ করুন।
              </p>
            </div>
          )}

          {/* Multi-Server Selector bar shown only if there are extra servers */}
          {liveEnabled && !showPaywall && additionalServers.length > 0 && (
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-5 rounded-3xl space-y-4">
              <span className="text-xs font-black text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                <Server size={14} className="text-indigo-500" />
                অন্যান্য সার্ভার ও স্ট্রিম অপশনসমূহ চয়ন করুন (Multi-Server Streaming Options):
              </span>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {/* Default Server */}
                <button
                  onClick={() => setActiveServerIndex(0)}
                  className={`relative aspect-video rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 group ${
                    activeServerIndex === 0
                      ? "border-indigo-600 ring-2 ring-indigo-500/20"
                      : "border-gray-100 dark:border-gray-800/50 hover:border-indigo-400"
                  }`}
                >
                  {settings?.liveStreamThumbnail ? (
                    <img
                      src={settings.liveStreamThumbnail}
                      alt="Server 1"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center">
                      <Tv size={20} className="text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-2.5">
                    <span className="text-[10px] font-black text-white block truncate">ডিফল্ট সার্ভার (Server 1)</span>
                    <span className="text-[8px] text-rose-400 font-bold">🔴 লাইভ স্ট্রিম</span>
                  </div>
                </button>

                {/* Additional Servers */}
                {additionalServers.map((srv: any, idx: number) => (
                  <button
                    key={srv.id || idx}
                    onClick={() => setActiveServerIndex(idx + 1)}
                    className={`relative aspect-video rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 group ${
                      activeServerIndex === idx + 1
                        ? "border-indigo-600 ring-2 ring-indigo-500/20"
                        : "border-gray-100 dark:border-gray-800/50 hover:border-indigo-400"
                    }`}
                  >
                    {srv.thumbnail ? (
                      <img
                        src={srv.thumbnail}
                        alt={srv.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-950 to-slate-900 flex items-center justify-center">
                        <Tv size={20} className="text-white/40" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 flex flex-col justify-end p-2.5">
                      <span className="text-[10px] font-black text-white block truncate">{srv.name || `Server ${idx + 2}`}</span>
                      <span className="text-[8px] text-rose-400 font-bold">🔴 অল্টারনেটিভ স্ট্রিম</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Details below video */}
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 p-5 rounded-3xl space-y-2">
            <h2 className="text-sm font-black text-gray-900 dark:text-white">
              {settings?.websiteName || "StreamPlex"} লাইভ স্ট্রিমিং ও সম্প্রচার নেটওয়ার্ক
            </h2>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
              লাইভ সম্প্রচারের সকল স্বত্ব সংরক্ষিত। অননুমোদিত পুনঃপ্রচার দণ্ডনীয় অপরাধ। সেরা স্ট্রিমিং অভিজ্ঞতার জন্য আপনার ইন্টারনেট কানেকশন ৫ এমবিপিএস বা তার বেশি হওয়া বাঞ্ছনীয়।
            </p>
          </div>
        </div>

        {/* Right 1 col: Live Chat Box */}
        <div className="flex flex-col h-[400px] lg:h-auto lg:aspect-[4/5] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl overflow-hidden shadow-sm">
          {/* Chat Header */}
          <div className="px-5 py-3.5 bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} className="text-indigo-600 dark:text-indigo-400" />
              <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">লাইভ চ্যাট বক্স</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 font-medium">
            {chatMessages.map((msg) => (
              <div key={msg.id} className="text-xs space-y-1 bg-gray-50 dark:bg-gray-950/40 p-2.5 rounded-xl border border-gray-100/50 dark:border-gray-850">
                <div className="flex items-center justify-between">
                  <span className={`font-black flex items-center gap-1 ${msg.isMod ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
                    <User size={10} />
                    {msg.user}
                    {msg.isMod && (
                      <span className="inline-flex items-center bg-indigo-100 dark:bg-indigo-900/30 text-[8px] px-1 rounded text-indigo-700 dark:text-indigo-400">
                        মডারেটর
                      </span>
                    )}
                  </span>
                  <span className="text-[8px] text-gray-400 font-mono font-bold">{msg.time}</span>
                </div>
                <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  {msg.text}
                </p>
              </div>
            ))}
          </div>

          {/* Chat Input Field */}
          <form onSubmit={handleSendChat} className="p-3 bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="চ্যাটে আপনার বার্তা লিখুন..."
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                className="flex-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
              />
              <button
                type="submit"
                className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-colors cursor-pointer"
                title="বার্তা পাঠান"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}
