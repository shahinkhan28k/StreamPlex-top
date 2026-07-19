import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Ad, WebsiteSettings } from "../types";
import { X } from "lucide-react";

interface AdSpaceProps {
  placement: "header" | "sidebar" | "sticky" | "footer" | "banner" | "banner_320_50" | "native_banner" | "smartlink" | "social_bar" | "popunder";
  adsList: Ad[];
  settings?: WebsiteSettings;
}

export default function AdSpace({ placement, adsList, settings }: AdSpaceProps) {
  const [activeAd, setActiveAd] = useState<Ad | null>(null);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Filter ads by placement, enabled status, and validity dates
    const matched = adsList.find((ad) => {
      if (!ad.enabled || ad.placement !== placement) return false;

      // Check date range
      const today = new Date().toISOString().split("T")[0];
      if (ad.startDate && today < ad.startDate) return false;
      if (ad.endDate && today > ad.endDate) return false;

      // Device detection (simplified client-side matching)
      const isMobile = window.innerWidth < 768;
      if (ad.devices === "mobile" && !isMobile) return false;
      if (ad.devices === "desktop" && isMobile) return false;

      return true;
    });

    setActiveAd(matched || null);
  }, [adsList, placement]);

  // Handle Popunder behavior
  useEffect(() => {
    if (placement === "popunder" && activeAd && visible) {
      const popped = sessionStorage.getItem(`popunder_${activeAd.id}`);
      if (!popped) {
        const handleFirstInteraction = () => {
          const isHtml = activeAd.code.trim().startsWith("<");
          const destination = isHtml
            ? activeAd.code.match(/href="([^"]+)"/)?.[1] || "/"
            : activeAd.code.trim();

          try {
            window.open(destination, "_blank");
            sessionStorage.setItem(`popunder_${activeAd.id}`, "true");
          } catch (e) {
            console.error("Popunder blocked", e);
          }
          document.removeEventListener("click", handleFirstInteraction);
        };
        document.addEventListener("click", handleFirstInteraction);
        return () => document.removeEventListener("click", handleFirstInteraction);
      }
    }
  }, [activeAd, placement, visible]);

  const handleAdClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const anchor = target.closest("a");
    if (anchor) {
      const href = anchor.getAttribute("href");
      if (href && href.startsWith("/")) {
        e.preventDefault();
        navigate(href);
      }
    }
  };

  // Render for Sticky Footer Ad / Bottom Notice Banner
  if (placement === "sticky") {
    // Check settings first
    const isBannerEnabled = settings?.bottomBannerEnabled !== false;
    if (!isBannerEnabled || !visible) return null;

    const bannerText = settings?.bottomBannerText || "লাইভ আইপিএল ২০২৬ ম্যাচ আজ সন্ধ্যা ৭টায়! সম্পূর্ণ ফ্রিতে উপভোগ করুন।";
    const btnText = settings?.bottomBannerBtnText || "লাইভ দেখুন";
    const btnLink = settings?.bottomBannerLink || "/live";

    return (
      <div id="sticky-notice-banner" className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl p-3 z-50 transition-all flex items-center justify-center animate-slide-up">
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between gap-4 px-4 relative">
          <div className="flex-grow flex items-center justify-between gap-4 w-full">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
              <span className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                {bannerText}
              </span>
            </div>
            <Link
              to={btnLink}
              id="sticky-live-button"
              className="bg-rose-600 hover:bg-rose-700 text-white text-xs px-4 py-2 rounded-lg font-bold transition-all shadow-sm shrink-0"
            >
              {btnText}
            </Link>
          </div>
          <button
            onClick={() => setVisible(false)}
            id="close-sticky-banner-btn"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer shrink-0"
            title="বিজ্ঞাপন বন্ধ করুন"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (!activeAd || !visible) return null;

  // Render for Popunder (hidden trigger)
  if (placement === "popunder") {
    return null;
  }

  // Render for Social Bar (dynamic notification popup)
  if (placement === "social_bar") {
    return (
      <div id="ad-placement-social-bar" className="fixed bottom-24 right-4 z-40 bg-white dark:bg-gray-950 border border-gray-100 dark:border-gray-800 shadow-2xl rounded-2xl p-4 max-w-xs transition-all animate-bounce-short">
        <div className="flex gap-3 relative">
          <div className="w-9 h-9 rounded-full bg-rose-500 text-white flex items-center justify-center font-black text-xs shrink-0">
            🔥
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-extrabold text-[11px] text-gray-900 dark:text-white truncate">{activeAd.name}</h4>
            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 leading-normal" onClick={handleAdClick} dangerouslySetInnerHTML={{ __html: activeAd.code }} />
          </div>
          <button
            onClick={() => setVisible(false)}
            id="close-social-bar-btn"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer self-start -mt-1 -mr-1"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    );
  }

  // Render for Smartlink (promotional button / direct redirect wrapper)
  if (placement === "smartlink") {
    const isUrl = !activeAd.code.trim().startsWith("<");
    if (isUrl) {
      return (
        <div id="ad-placement-smartlink" className="w-full my-4">
          <a
            href={activeAd.code.trim()}
            target="_blank"
            rel="noreferrer"
            className="block p-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-extrabold text-center rounded-2xl text-xs transition-all shadow-md shadow-orange-500/10 cursor-pointer"
          >
            🚀 আজকের বিশেষ অফার: {activeAd.name} (সম্পূর্ণ ফ্রি)
          </a>
        </div>
      );
    }
  }

  // Render for Banner 320x50
  if (placement === "banner_320_50") {
    return (
      <div id="ad-placement-320-50" className="flex justify-center w-full my-4">
        <div className="w-[320px] h-[50px] overflow-hidden rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center relative shadow-sm">
          <div className="text-[8px] absolute top-0.5 right-1 text-gray-300 pointer-events-none uppercase tracking-widest">AD</div>
          <div
            className="w-full h-full flex items-center justify-center"
            onClick={handleAdClick}
            dangerouslySetInnerHTML={{ __html: activeAd.code }}
          />
        </div>
      </div>
    );
  }

  // Render for Native Banner Block
  if (placement === "native_banner") {
    return (
      <div id="ad-placement-native-banner" className="w-full my-4 p-4 rounded-2xl bg-gradient-to-b from-gray-50/80 to-gray-50/30 dark:from-gray-900/40 dark:to-gray-900/10 border border-gray-100 dark:border-gray-800/80 space-y-2 relative">
        <span className="text-[8px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest absolute top-2 right-3">Sponsored</span>
        <div
          className="text-xs text-gray-700 dark:text-gray-300 font-medium"
          onClick={handleAdClick}
          dangerouslySetInnerHTML={{ __html: activeAd.code }}
        />
      </div>
    );
  }

  return (
    <div id={`ad-placement-${placement}`} className="w-full my-4 relative" onClick={handleAdClick}>
      <div className="w-full overflow-hidden rounded-xl" dangerouslySetInnerHTML={{ __html: activeAd.code }} />
    </div>
  );
}
