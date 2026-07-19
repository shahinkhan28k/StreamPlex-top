import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { Video, Category, Ad, WebsiteSettings, LoginHistory, User, VideoComment, Offer, PaymentRequest } from "../types";
import {
  LayoutDashboard,
  Film,
  Tv,
  MessageSquare,
  Sliders,
  Settings,
  Lock,
  LogOut,
  Users,
  CheckCircle,
  XCircle,
  Trash2,
  PlusCircle,
  Edit2,
  FileText,
  AlertTriangle,
  Flame,
  Star,
  Check,
  Ban,
  Upload,
  Globe,
  Database,
  Image as ImageIcon,
  Video as VideoIcon,
  Gift,
  CreditCard,
  Sparkles,
  Shield,
  Crown
} from "lucide-react";
import LucideIcon from "../components/LucideIcon";

interface AdminProps {
  videos: Video[];
  categories: Category[];
  ads: Ad[];
  settings: WebsiteSettings;
  users: User[];
  onRefreshVideos: () => void;
  onRefreshCategories: () => void;
  onRefreshAds: () => void;
  onRefreshSettings: () => void;
  onRefreshUsers: () => void;
}

export default function Admin({
  videos,
  categories,
  ads,
  settings,
  users,
  onRefreshVideos,
  onRefreshCategories,
  onRefreshAds,
  onRefreshSettings,
  onRefreshUsers
}: AdminProps) {
  const { lang, t } = useLanguage();
  // Authorization State
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginHistory, setLoginHistory] = useState<LoginHistory[]>([]);
  const [adminRole, setAdminRole] = useState<string>("admin");
  const [adminPermissions, setAdminPermissions] = useState<string[]>([
    "dashboard", "videos", "categories", "comments", "payments", "ads", "users", "offers", "settings"
  ]);

  // User Role Management State
  const [selectedRoleUser, setSelectedRoleUser] = useState<any>(null);
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | "moderator">("user");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Current Admin Tab
  const [activeTab, setActiveTab] = useState("dashboard");

  // Video Management State
  const [videoSearch, setVideoSearch] = useState("");
  const [bulkSelected, setBulkSelected] = useState<string[]>([]);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // Video Form Fields
  const [vTitle, setVTitle] = useState("");
  const [vDesc, setVDesc] = useState("");
  const [vUrl, setVUrl] = useState("");
  const [vThumbnail, setVThumbnail] = useState("");
  const [vCategory, setVCategory] = useState("");
  const [vSubCategory, setVSubCategory] = useState("");
  const [vTags, setVTags] = useState("");
  const [vLanguage, setVLanguage] = useState("Bengali");
  const [vDuration, setVDuration] = useState("10:00");
  const [vResolution, setVResolution] = useState("1080p");
  const [vFeatured, setVFeatured] = useState(false);
  const [vTrending, setVTrending] = useState(false);
  const [vPremium, setVPremium] = useState(false);
  const [vLocked, setVLocked] = useState(false);
  const [vStatus, setVStatus] = useState<"publish" | "draft" | "scheduled">("publish");

  // Category Management State
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [cName, setCName] = useState("");
  const [cSlug, setCSlug] = useState("");
  const [cIcon, setCIcon] = useState("Tv");
  const [cImage, setCImage] = useState("");
  const [subCategoriesInput, setSubCategoriesInput] = useState("");

  // Comment Moderation State
  const [allComments, setAllComments] = useState<VideoComment[]>([]);

  // Ad Manager State
  const [showAdModal, setShowAdModal] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [aName, setAName] = useState("");
  const [aType, setAType] = useState("Banner Ads");
  const [aPlacement, setAPlacement] = useState<"header" | "sidebar" | "sticky" | "footer" | "banner">("header");
  const [aCode, setACode] = useState("");
  const [aEnabled, setAEnabled] = useState(true);
  const [aDevices, setADevices] = useState<"mobile" | "desktop" | "both">("both");
  const [aStartDate, setAStartDate] = useState("");
  const [aEndDate, setAEndDate] = useState("");

  // Settings Fields State
  const [sName, setSName] = useState("");
  const [sLogo, setSLogo] = useState("");
  const [sFavicon, setSFavicon] = useState("");
  const [sTheme, setSTheme] = useState("indigo");
  const [sEmail, setSEmail] = useState("");
  const [sFb, setSFb] = useState("");
  const [sYt, setSYt] = useState("");
  const [sTw, setSTw] = useState("");
  const [sMetaTitle, setSMetaTitle] = useState("");
  const [sMetaDesc, setSMetaDesc] = useState("");
  const [sMetaKeys, setSMetaKeys] = useState("");
  const [sSmtpHost, setSSmtpHost] = useState("");
  const [sSmtpPort, setSSmtpPort] = useState("");
  const [sSmtpUser, setSSmtpUser] = useState("");
  const [sSmtpPass, setSSmtpPass] = useState("");
  const [sGa, setSGa] = useState("");
  const [sGsc, setSGsc] = useState("");

  // Live Stream & Authentication Branding States
  const [sLiveStreamIframe, setSLiveStreamIframe] = useState("");
  const [sLiveStreamThumbnail, setSLiveStreamThumbnail] = useState("");
  const [sLiveStreamEnabled, setSLiveStreamEnabled] = useState(true);
  const [sLiveStreamPremiumOnly, setSLiveStreamPremiumOnly] = useState(false);
  const [sLiveStreamServers, setSLiveStreamServers] = useState<{ id: string; name: string; embedCode: string; thumbnail?: string }[]>([]);
  const [sBottomBannerEnabled, setSBottomBannerEnabled] = useState(true);
  const [sBottomBannerText, setSBottomBannerText] = useState("");
  const [sBottomBannerBtnText, setSBottomBannerBtnText] = useState("");
  const [sBottomBannerLink, setSBottomBannerLink] = useState("");
  
  // Payment Gateway Config States
  const [sPaymentBkashNumber, setSPaymentBkashNumber] = useState("");
  const [sPaymentBkashType, setSPaymentBkashType] = useState("Personal");
  const [sPaymentBkashLogo, setSPaymentBkashLogo] = useState("");
  const [sPaymentNagadNumber, setSPaymentNagadNumber] = useState("");
  const [sPaymentNagadType, setSPaymentNagadType] = useState("Personal");
  const [sPaymentNagadLogo, setSPaymentNagadLogo] = useState("");
  const [sPaymentRocketNumber, setSPaymentRocketNumber] = useState("");
  const [sPaymentRocketType, setSPaymentRocketType] = useState("Personal");
  const [sPaymentRocketLogo, setSPaymentRocketLogo] = useState("");
  const [newServerName, setNewServerName] = useState("");
  const [newServerEmbed, setNewServerEmbed] = useState("");
  const [newServerThumbnail, setNewServerThumbnail] = useState("");
  const [galleryTarget, setGalleryTarget] = useState<string>("");

  const [sLoginPageTitle, setSLoginPageTitle] = useState("");
  const [sLoginPageSubtitle, setSLoginPageSubtitle] = useState("");
  const [sRegisterPageTitle, setSRegisterPageTitle] = useState("");
  const [sRegisterPageSubtitle, setSRegisterPageSubtitle] = useState("");
  const [sLanguages, setSLanguages] = useState("Bengali, English");
  const [sAdminUsername, setSAdminUsername] = useState("admin");
  const [sAdminPassword, setSAdminPassword] = useState("adminpassword");

  // Offers Management States
  const [adminOffers, setAdminOffers] = useState<Offer[]>([]);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [oTitle, setOTitle] = useState("");
  const [oDesc, setODesc] = useState("");
  const [oLink, setOLink] = useState("");
  const [oImage, setOImage] = useState("");
  const [oBtnText, setOBtnText] = useState("অফার নিন");
  const [oPoints, setOPoints] = useState("");
  const [oPrice, setOPrice] = useState("");
  const [oStatus, setOStatus] = useState<"active" | "draft">("active");
  const [oDurationCount, setODurationCount] = useState<number>(1);
  const [oDurationUnit, setODurationUnit] = useState<"days" | "months">("months");

  // Premium Activation Payments
  const [payments, setPayments] = useState<PaymentRequest[]>([]);
  const [selectedProfileUser, setSelectedProfileUser] = useState<any>(null);

  // Video Duration Auto-detection state
  const [isDetectingDuration, setIsDetectingDuration] = useState(false);

  // Media Gallery & Auto Thumbnail States
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryType, setGalleryType] = useState<"image" | "video" | "all">("all");
  const [galleryFiles, setGalleryFiles] = useState<{ name: string; url: string; type: "image" | "video" }[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingThumbnail, setIsGeneratingThumbnail] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);

  const fetchGalleryFiles = () => {
    fetch("/api/uploads")
      .then((res) => res.json())
      .then((data) => setGalleryFiles(data))
      .catch((err) => console.error("Error loading gallery files:", err));
  };

  const handleOpenGallery = (type: "image" | "video" | "all", target: string = "") => {
    setGalleryType(type);
    setGalleryTarget(target);
    fetchGalleryFiles();
    setShowGalleryModal(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64 = reader.result as string;
      fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: file.name, base64 })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            fetchGalleryFiles();
            if (galleryType === "video") {
              if (galleryTarget === "video_url") {
                setVUrl(data.url);
              } else {
                setVUrl(data.url);
              }
            } else if (galleryType === "image") {
              if (galleryTarget === "video_thumbnail") {
                setVThumbnail(data.url);
              } else if (galleryTarget === "live_stream_default_thumbnail") {
                setSLiveStreamThumbnail(data.url);
              } else if (galleryTarget === "live_stream_server_new_thumbnail") {
                setNewServerThumbnail(data.url);
              } else {
                setVThumbnail(data.url);
              }
            }
          } else {
            alert("ফাইল আপলোড করতে সমস্যা হয়েছে: " + data.error);
          }
        })
        .catch((err) => alert("আপলোড ব্যর্থ হয়েছে: " + err.message))
        .finally(() => setIsUploading(false));
    };
  };

  const handleGenerateThumbnail = () => {
    if (!vUrl) {
      alert("দয়া করে প্রথমে ভিডিও সোর্স URL প্রদান করুন।");
      return;
    }
    setIsGeneratingThumbnail(true);
    
    // Create hidden video element
    const video = document.createElement("video");
    video.src = vUrl;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    
    video.onloadedmetadata = () => {
      video.currentTime = Math.min(1.5, video.duration / 2 || 1);
    };

    video.onseeked = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 640;
        canvas.height = 360;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
          
          fetch("/api/upload", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: `thumb_${Date.now()}.jpg`,
              base64: dataUrl
            })
          })
            .then(res => res.json())
            .then(data => {
              if (data.url) {
                setVThumbnail(data.url);
                alert("ভিডিও থেকে থাম্বনেইল সফলভাবে জেনারেট ও আপলোড করা হয়েছে! 📸");
              } else {
                setVThumbnail(dataUrl);
              }
            })
            .catch(() => {
              setVThumbnail(dataUrl);
            });
        }
      } catch (err) {
        console.error("Error generating thumbnail: ", err);
        alert("ভিডিও থেকে থাম্বনেইল জেনারেট করা যায়নি। সিওআরএস (CORS) সীমাবদ্ধতার কারণে হতে পারে। তবে আপনি যেকোনো সাধারণ ইমেজ URL থাম্বনেইল হিসেবে ব্যবহার করতে পারেন।");
      } finally {
        setIsGeneratingThumbnail(false);
      }
    };

    video.onerror = () => {
      setIsGeneratingThumbnail(false);
      alert("ভিডিও সোর্স URL-টি লোড করা যাচ্ছে না। দয়া করে সঠিক ও সক্রিয় ভিডিও URL প্রদান করুন।");
    };

    video.load();
  };

  const fetchPayments = () => {
    fetch("/api/payments")
      .then((res) => res.json())
      .then((data: any[]) => {
        const sorted = [...data].sort((a, b) => {
          if (a.status === "pending" && b.status !== "pending") return -1;
          if (a.status !== "pending" && b.status === "pending") return 1;
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        });
        setPayments(sorted);
      })
      .catch((err) => console.error("Error fetching payments in admin:", err));
  };

  // Check login token on mount
  useEffect(() => {
    const token = localStorage.getItem("streamplex_admin_token");
    const loggedUserStr = localStorage.getItem("streamplex_logged_user");
    let isLoggedAdmin = false;
    if (loggedUserStr) {
      try {
        const loggedUser = JSON.parse(loggedUserStr);
        if (loggedUser && (
          loggedUser.email?.toLowerCase() === "shahinkhan28r@gmail.com" || 
          loggedUser.email?.toLowerCase() === "shahinkhan28uu@gmail.com" || 
          loggedUser.email?.toLowerCase() === "shahinkhan28ddd@gmail.com"
        )) {
          isLoggedAdmin = true;
        }
      } catch (e) {
        // ignore
      }
    }

    if (token || isLoggedAdmin) {
      setIsAuthorized(true);
      fetchLoginHistory();
      fetchComments();
      fetchOffers();
      fetchPayments();

      const role = isLoggedAdmin ? "admin" : (localStorage.getItem("streamplex_admin_role") || "admin");
      const savedPerms = localStorage.getItem("streamplex_admin_permissions");
      setAdminRole(role);
      
      if (isLoggedAdmin) {
        setAdminPermissions(["dashboard", "videos", "categories", "comments", "payments", "ads", "users", "offers", "settings"]);
      } else if (savedPerms) {
        try {
          const parsedPerms = JSON.parse(savedPerms);
          setAdminPermissions(parsedPerms);
          // Set first allowed tab
          if (parsedPerms.length > 0) {
            setActiveTab(parsedPerms[0]);
          }
        } catch (e) {
          // fallback
        }
      }
    }
  }, []);

  // Initialize Website Settings form on data load
  useEffect(() => {
    if (settings) {
      setSName(settings.websiteName || "");
      setSLogo(settings.logo || "");
      setSFavicon(settings.favicon || "");
      setSTheme(settings.themeColor || "indigo");
      setSEmail(settings.contactEmail || "");
      setSFb(settings.socialLinks?.facebook || "");
      setSYt(settings.socialLinks?.youtube || "");
      setSTw(settings.socialLinks?.twitter || "");
      setSMetaTitle(settings.seoSettings?.metaTitle || "");
      setSMetaDesc(settings.seoSettings?.metaDescription || "");
      setSMetaKeys(settings.seoSettings?.metaKeywords || "");
      setSSmtpHost(settings.smtpConfig?.host || "");
      setSSmtpPort(settings.smtpConfig?.port || "");
      setSSmtpUser(settings.smtpConfig?.user || "");
      setSSmtpPass(settings.smtpConfig?.pass || "");
      setSGa(settings.analyticsConfig?.googleAnalytics || "");
      setSGsc(settings.analyticsConfig?.googleSearchConsole || "");
      
      // Load live stream and auth page branding settings
      setSLiveStreamIframe(settings.liveStreamIframe || "");
      setSLiveStreamThumbnail(settings.liveStreamThumbnail || "");
      setSLiveStreamEnabled(settings.liveStreamEnabled !== false);
      setSLiveStreamPremiumOnly(!!settings.liveStreamPremiumOnly);
      setSLiveStreamServers(settings.liveStreamServers || []);
      setSBottomBannerEnabled(settings.bottomBannerEnabled !== false);
      setSBottomBannerText(settings.bottomBannerText || "");
      setSBottomBannerBtnText(settings.bottomBannerBtnText || "");
      setSBottomBannerLink(settings.bottomBannerLink || "");
      
      setSPaymentBkashNumber(settings.paymentBkashNumber || "01777-112233");
      setSPaymentBkashType(settings.paymentBkashType || "Personal");
      setSPaymentBkashLogo(settings.paymentBkashLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bkash_logo_without_text.svg/512px-Bkash_logo_without_text.svg.png");
      setSPaymentNagadNumber(settings.paymentNagadNumber || "01999-445566");
      setSPaymentNagadType(settings.paymentNagadType || "Personal");
      setSPaymentNagadLogo(settings.paymentNagadLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nagad_logo.svg/512px-Nagad_logo.svg.png");
      setSPaymentRocketNumber(settings.paymentRocketNumber || "01888-778899");
      setSPaymentRocketType(settings.paymentRocketType || "Personal");
      setSPaymentRocketLogo(settings.paymentRocketLogo || "https://upload.wikimedia.org/wikipedia/commons/e/ea/DBBL_Rocket_Logo.svg");

      setSLoginPageTitle(settings.loginPageTitle || "");
      setSLoginPageSubtitle(settings.loginPageSubtitle || "");
      setSRegisterPageTitle(settings.registerPageTitle || "");
      setSRegisterPageSubtitle(settings.registerPageSubtitle || "");
      setSLanguages(settings.languages ? settings.languages.join(", ") : "Bengali, English");
      setSAdminUsername(settings.adminUsername || "admin");
      setSAdminPassword(settings.adminPassword || "adminpassword");
    }
  }, [settings]);

  const fetchLoginHistory = () => {
    fetch("/api/admin/history")
      .then((res) => res.json())
      .then(setLoginHistory);
  };

  const fetchComments = () => {
    fetch("/api/comments")
      .then((res) => res.json())
      .then(setAllComments);
  };

  const fetchOffers = () => {
    fetch("/api/offers")
      .then((res) => res.json())
      .then(setAdminOffers)
      .catch((err) => console.error("Error loading offers in admin:", err));
  };

  // Video Duration Auto-detection action helper
  const handleDetectDuration = () => {
    if (!vUrl) {
      alert("দয়া করে প্রথমে ভিডিও সোর্স URL প্রদান করুন।");
      return;
    }
    setIsDetectingDuration(true);
    const video = document.createElement("video");
    video.src = vUrl;
    video.crossOrigin = "anonymous";
    video.muted = true;
    video.playsInline = true;
    
    video.onloadedmetadata = () => {
      try {
        const minutes = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        const formattedDuration = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
        setVDuration(formattedDuration);
        alert(`সফলভাবে ভিডিওর দৈর্ঘ্য সনাক্ত করা হয়েছে: ${formattedDuration} ⏱️`);
      } catch (err) {
        console.error("Error formatting duration: ", err);
      } finally {
        setIsDetectingDuration(false);
      }
    };
    
    video.onerror = () => {
      setIsDetectingDuration(false);
      alert("ভিডিওর দৈর্ঘ্য সনাক্ত করা যায়নি। অনুগ্রহ করে সঠিক URL নিশ্চিত করুন।");
    };
    video.load();
  };

  // Offers Actions
  const handleOpenAddOffer = () => {
    setEditingOffer(null);
    setOTitle("");
    setODesc("");
    setOLink("");
    setOImage("");
    setOBtnText("অফার নিন");
    setOPoints("");
    setOPrice("");
    setOStatus("active");
    setODurationCount(1);
    setODurationUnit("months");
    setShowOfferModal(true);
  };

  const handleOpenEditOffer = (offer: Offer) => {
    setEditingOffer(offer);
    setOTitle(offer.title);
    setODesc(offer.description);
    setOLink(offer.link);
    setOImage(offer.image);
    setOBtnText(offer.btnText || "অফার নিন");
    setOPoints(offer.points || "");
    setOPrice(offer.price || "");
    setOStatus(offer.status);

    let count = 30;
    let unit: "days" | "months" = "days";
    if (offer.durationDays) {
      if (offer.durationDays % 30 === 0) {
        count = offer.durationDays / 30;
        unit = "months";
      } else {
        count = offer.durationDays;
        unit = "days";
      }
    } else if (offer.points) {
      const num = parseInt(offer.points);
      if (!isNaN(num)) {
        count = num;
        if (offer.points.includes("মাস") || offer.points.toLowerCase().includes("month")) {
          unit = "months";
        } else {
          unit = "days";
        }
      }
    }
    setODurationCount(count);
    setODurationUnit(unit);
    setShowOfferModal(true);
  };

  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const days = oDurationUnit === "months" ? oDurationCount * 30 : oDurationCount;
    const pointsStr = oDurationUnit === "months" ? `${oDurationCount} মাস মেয়াদ` : `${oDurationCount} দিন মেয়াদ`;

    const payload = {
      title: oTitle,
      description: oDesc,
      link: oLink,
      image: oImage,
      btnText: oBtnText,
      points: pointsStr,
      durationDays: days,
      price: oPrice,
      status: oStatus
    };

    const url = editingOffer ? `/api/offers/${editingOffer.id}` : "/api/offers";
    const method = editingOffer ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        setShowOfferModal(false);
        fetchOffers();
      })
      .catch((err) => console.error("Error saving offer:", err));
  };

  const handleDeleteOffer = (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই অফারটি ডিলিট করতে চান?")) return;
    fetch(`/api/offers/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchOffers());
  };

  // Admin Log-In Action
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Invalid credentials");
        }
        return data;
      })
      .then((data) => {
        localStorage.setItem("streamplex_admin_token", data.token);
        localStorage.setItem("streamplex_admin_role", data.role || "admin");
        localStorage.setItem("streamplex_admin_permissions", JSON.stringify(data.permissions || []));
        setAdminRole(data.role || "admin");
        setAdminPermissions(data.permissions || []);
        setIsAuthorized(true);
        fetchLoginHistory();
        fetchComments();
        fetchOffers();
        fetchPayments();
        
        // Pick first permitted tab
        const firstTab = data.permissions && data.permissions.length > 0 ? data.permissions[0] : "dashboard";
        setActiveTab(firstTab);
      })
      .catch((err) => {
        setLoginError(err.message);
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("streamplex_admin_token");
    localStorage.removeItem("streamplex_admin_role");
    localStorage.removeItem("streamplex_admin_permissions");
    setIsAuthorized(false);
  };

  // Video Actions
  const handleOpenAddVideo = () => {
    setEditingVideo(null);
    setVTitle("");
    setVDesc("");
    setVUrl("");
    setVThumbnail("");
    setVCategory(categories[0]?.slug || "movies");
    setVSubCategory("");
    setVTags("");
    setVLanguage("Bengali");
    setVDuration("15:00");
    setVResolution("1080p");
    setVFeatured(false);
    setVTrending(false);
    setVPremium(false);
    setVLocked(false);
    setVStatus("publish");
    setShowVideoModal(true);
  };

  const handleOpenEditVideo = (video: Video) => {
    setEditingVideo(video);
    setVTitle(video.title);
    setVDesc(video.description);
    setVUrl(video.videoUrl);
    setVThumbnail(video.thumbnailUrl);
    setVCategory(video.category);
    setVSubCategory(video.subCategory || "");
    setVTags(video.tags.join(", "));
    setVLanguage(video.language);
    setVDuration(video.duration);
    setVResolution(video.resolution);
    setVFeatured(video.featured);
    setVTrending(video.trending);
    setVPremium(!!video.isPremium);
    setVLocked(!!video.isLocked);
    setVStatus(video.status);
    setShowVideoModal(true);
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: vTitle,
      description: vDesc,
      videoUrl: vUrl,
      thumbnailUrl: vThumbnail,
      category: vCategory,
      subCategory: vSubCategory,
      tags: vTags,
      language: vLanguage,
      duration: vDuration,
      resolution: vResolution,
      featured: vFeatured,
      trending: vTrending,
      isPremium: vPremium,
      isLocked: vLocked,
      status: vStatus
    };

    const url = editingVideo ? `/api/videos/${editingVideo.id}` : "/api/videos";
    const method = editingVideo ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        setShowVideoModal(false);
        onRefreshVideos();
      });
  };

  const handleDeleteVideo = (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ভিডিওটি ডিলিট করতে চান?")) return;
    fetch(`/api/videos/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => onRefreshVideos());
  };

  const handleBulkDelete = () => {
    if (bulkSelected.length === 0) return;
    if (!confirm(`আপনি কি নিশ্চিতভাবে নির্বাচিত ${bulkSelected.length} টি ভিডিও ডিলিট করতে চান?`)) return;

    fetch("/api/videos/bulk-delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: bulkSelected })
    })
      .then((res) => res.json())
      .then(() => {
        setBulkSelected([]);
        onRefreshVideos();
      });
  };

  const handleToggleBulk = (id: string) => {
    setBulkSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllVideos = () => {
    if (bulkSelected.length === videos.length) {
      setBulkSelected([]);
    } else {
      setBulkSelected(videos.map((v) => v.id));
    }
  };

  // Category Actions
  const handleOpenAddCategory = () => {
    setEditingCat(null);
    setCName("");
    setCSlug("");
    setCIcon("Tv");
    setCImage("");
    setSubCategoriesInput("");
    setShowCatModal(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCat(cat);
    setCName(cat.name);
    setCSlug(cat.slug);
    setCIcon(cat.icon);
    setCImage(cat.image);
    const subNames = cat.subCategories ? cat.subCategories.map((sub: any) => sub.name).join(", ") : "";
    setSubCategoriesInput(subNames);
    setShowCatModal(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subsArray = subCategoriesInput
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .map((item) => ({
        name: item,
        slug: item.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
      }));

    const payload = { name: cName, slug: cSlug, icon: cIcon, image: cImage, subCategories: subsArray };
    const url = editingCat ? `/api/categories/${editingCat.slug}` : "/api/categories";
    const method = editingCat ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        return data;
      })
      .then(() => {
        setShowCatModal(false);
        onRefreshCategories();
      })
      .catch((err) => alert(err.message));
  };

  const handleDeleteCategory = (slugStr: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই ক্যাটাগরি ডিলিট করতে চান?")) return;
    fetch(`/api/categories/${slugStr}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => onRefreshCategories());
  };

  // Comment Actions
  const handleApproveComment = (videoId: string, commentId: string) => {
    fetch(`/api/comments/${videoId}/${commentId}/approve`, { method: "PUT" })
      .then((res) => res.json())
      .then(() => {
        fetchComments();
        onRefreshVideos();
      });
  };

  const handleDeleteComment = (videoId: string, commentId: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই মন্তব্যটি মুছে ফেলতে চান?")) return;
    fetch(`/api/comments/${videoId}/${commentId}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => {
        fetchComments();
        onRefreshVideos();
      });
  };

  // Users Actions
  const handleToggleUserBan = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === "banned" ? "active" : "banned";
    fetch(`/api/users/${id}/ban`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus })
    })
      .then((res) => res.json())
      .then(() => onRefreshUsers());
  };

  const handleSaveUserRole = () => {
    if (!selectedRoleUser) return;
    
    fetch(`/api/users/${selectedRoleUser.id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        role: selectedRole,
        permissions: selectedPermissions
      })
    })
      .then((res) => res.json())
      .then(() => {
        setSelectedRoleUser(null);
        alert("ইউজার পদবী ও পারমিশন সফলভাবে আপডেট করা হয়েছে! 🛡️");
        onRefreshUsers();
      })
      .catch((err) => {
        console.error("Error saving user role:", err);
        alert("ইউজার পদবী আপডেট করতে সমস্যা হয়েছে।");
      });
  };

  // Payment Request Actions
  const handleUpdatePaymentStatus = (id: string, status: "approved" | "rejected") => {
    fetch(`/api/payments/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          alert(`পেমেন্ট সফলভাবে ${status === "approved" ? "অনুমোদন" : "প্রত্যাখ্যান"} করা হয়েছে!`);
          fetchPayments();
          onRefreshUsers(); // Refresh user isPremium status
        } else {
          alert("পেমেন্ট আপডেট করতে সমস্যা হয়েছে।");
        }
      })
      .catch((err) => {
        console.error("Error updating payment:", err);
        alert("পেমেন্ট আপডেট ব্যর্থ হয়েছে।");
      });
  };

  // Ads Actions
  const handleOpenAddAd = () => {
    setEditingAd(null);
    setAName("");
    setAType("Banner Ads");
    setAPlacement("header");
    setACode("");
    setAEnabled(true);
    setADevices("both");
    setAStartDate("");
    setAEndDate("");
    setShowAdModal(true);
  };

  const handleOpenEditAd = (ad: Ad) => {
    setEditingAd(ad);
    setAName(ad.name);
    setAType(ad.type);
    setAPlacement(ad.placement);
    setACode(ad.code);
    setAEnabled(ad.enabled);
    setADevices(ad.devices);
    setAStartDate(ad.startDate || "");
    setAEndDate(ad.endDate || "");
    setShowAdModal(true);
  };

  const handleAdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: aName,
      type: aType,
      placement: aPlacement,
      code: aCode,
      enabled: aEnabled,
      devices: aDevices,
      startDate: aStartDate,
      endDate: aEndDate
    };

    const url = editingAd ? `/api/ads/${editingAd.id}` : "/api/ads";
    const method = editingAd ? "PUT" : "POST";

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        setShowAdModal(false);
        onRefreshAds();
      });
  };

  const handleDeleteAd = (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই বিজ্ঞাপন ক্যাম্পেইন ডিলিট করতে চান?")) return;
    fetch(`/api/ads/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => onRefreshAds());
  };

  // Section-specific Settings Save helper
  const handleSaveSection = (sectionKey: string, sectionLabel: string) => {
    setSavingSection(sectionKey);
    setSavedSection(null);

    const payload = {
      websiteName: sName,
      logo: sLogo,
      favicon: sFavicon,
      themeColor: sTheme,
      contactEmail: sEmail,
      socialLinks: { facebook: sFb, youtube: sYt, twitter: sTw },
      seoSettings: { metaTitle: sMetaTitle, metaDescription: sMetaDesc, metaKeywords: sMetaKeys },
      smtpConfig: { host: sSmtpHost, port: sSmtpPort, user: sSmtpUser, pass: sSmtpPass },
      analyticsConfig: { googleAnalytics: sGa, googleSearchConsole: sGsc },
      
      // Live stream and auth page branding properties
      liveStreamIframe: sLiveStreamIframe,
      liveStreamThumbnail: sLiveStreamThumbnail,
      liveStreamEnabled: sLiveStreamEnabled,
      liveStreamPremiumOnly: sLiveStreamPremiumOnly,
      liveStreamServers: sLiveStreamServers,
      bottomBannerEnabled: sBottomBannerEnabled,
      bottomBannerText: sBottomBannerText,
      bottomBannerBtnText: sBottomBannerBtnText,
      bottomBannerLink: sBottomBannerLink,
      
      paymentBkashNumber: sPaymentBkashNumber,
      paymentBkashType: sPaymentBkashType,
      paymentBkashLogo: sPaymentBkashLogo,
      paymentNagadNumber: sPaymentNagadNumber,
      paymentNagadType: sPaymentNagadType,
      paymentNagadLogo: sPaymentNagadLogo,
      paymentRocketNumber: sPaymentRocketNumber,
      paymentRocketType: sPaymentRocketType,
      paymentRocketLogo: sPaymentRocketLogo,

      loginPageTitle: sLoginPageTitle,
      loginPageSubtitle: sLoginPageSubtitle,
      registerPageTitle: sRegisterPageTitle,
      registerPageSubtitle: sRegisterPageSubtitle,
      languages: sLanguages.split(",").map(l => l.trim()).filter(l => l.length > 0),
      adminUsername: sAdminUsername,
      adminPassword: sAdminPassword
    };

    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        setSavingSection(null);
        setSavedSection(sectionKey);
        onRefreshSettings();
        setTimeout(() => {
          setSavedSection((current) => current === sectionKey ? null : current);
        }, 3000);
      })
      .catch((err) => {
        console.error("Error saving section:", err);
        setSavingSection(null);
        alert(`${sectionLabel} সংরক্ষণ করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।`);
      });
  };

  // Settings Save
  const handleSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      websiteName: sName,
      logo: sLogo,
      favicon: sFavicon,
      themeColor: sTheme,
      contactEmail: sEmail,
      socialLinks: { facebook: sFb, youtube: sYt, twitter: sTw },
      seoSettings: { metaTitle: sMetaTitle, metaDescription: sMetaDesc, metaKeywords: sMetaKeys },
      smtpConfig: { host: sSmtpHost, port: sSmtpPort, user: sSmtpUser, pass: sSmtpPass },
      analyticsConfig: { googleAnalytics: sGa, googleSearchConsole: sGsc },
      
      // Live stream and auth page branding properties
      liveStreamIframe: sLiveStreamIframe,
      liveStreamThumbnail: sLiveStreamThumbnail,
      liveStreamEnabled: sLiveStreamEnabled,
      liveStreamPremiumOnly: sLiveStreamPremiumOnly,
      liveStreamServers: sLiveStreamServers,
      bottomBannerEnabled: sBottomBannerEnabled,
      bottomBannerText: sBottomBannerText,
      bottomBannerBtnText: sBottomBannerBtnText,
      bottomBannerLink: sBottomBannerLink,
      
      paymentBkashNumber: sPaymentBkashNumber,
      paymentBkashType: sPaymentBkashType,
      paymentBkashLogo: sPaymentBkashLogo,
      paymentNagadNumber: sPaymentNagadNumber,
      paymentNagadType: sPaymentNagadType,
      paymentNagadLogo: sPaymentNagadLogo,
      paymentRocketNumber: sPaymentRocketNumber,
      paymentRocketType: sPaymentRocketType,
      paymentRocketLogo: sPaymentRocketLogo,

      loginPageTitle: sLoginPageTitle,
      loginPageSubtitle: sLoginPageSubtitle,
      registerPageTitle: sRegisterPageTitle,
      registerPageSubtitle: sRegisterPageSubtitle,
      languages: sLanguages.split(",").map(l => l.trim()).filter(l => l.length > 0),
      adminUsername: sAdminUsername,
      adminPassword: sAdminPassword
    };

    fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then(() => {
        alert("ওয়েবসাইট কনফিগারেশন সেটিংস সফলভাবে আপডেট করা হয়েছে! ⚙️");
        onRefreshSettings();
      });
  };

  // Render Login Form if unauthorized
  if (!isAuthorized) {
    return (
      <div className="max-w-md mx-auto my-16 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-8 rounded-3xl shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
            <Lock size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {lang === "en" ? "Admin Panel Login" : "অ্যাডমিন প্যানেল লগইন"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
            {lang === "en" ? "Login to access secure dashboard" : "নিরাপদ ড্যাশবোর্ড অ্যাক্সেস করতে লগইন করুন"}
          </p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {lang === "en" ? "Username" : "ইউজারনেম"}
            </label>
            <input
              type="text"
              required
              placeholder={lang === "en" ? "Enter username" : "ইউজারনেম লিখুন"}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-gray-300">
              {lang === "en" ? "Password" : "পাসওয়ার্ড"}
            </label>
            <input
              type="password"
              required
              placeholder={lang === "en" ? "Enter password" : "পাসওয়ার্ড লিখুন"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
            />
          </div>

          {loginError && (
            <div className="bg-rose-50 dark:bg-rose-950/20 text-rose-800 dark:text-rose-300 p-3 rounded-xl border border-rose-200 dark:border-rose-900/50 text-xs font-semibold flex items-center gap-2">
              <AlertTriangle size={14} className="text-rose-500" />
              {loginError}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20 cursor-pointer"
          >
            {lang === "en" ? "Login" : "লগইন করুন"}
          </button>
        </form>
      </div>
    );
  }

  // Calculate stats for Dashboard Tab
  const totalViews = videos.reduce((acc, v) => acc + (v.views || 0), 0);
  const totalComments = videos.reduce((acc, v) => acc + (v.comments?.length || 0), 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12">
      {/* Admin Panel Side Navigation Menu */}
      <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-5 rounded-3xl shadow-sm h-fit space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-gray-900 dark:text-white">অ্যাডমিন ড্যাশবোর্ড</h3>
            <span className="text-[10px] font-semibold text-emerald-500 uppercase">● অনলাইন (ACTIVE)</span>
          </div>
        </div>

        <nav className="flex flex-col gap-1.5 text-xs font-bold text-gray-600 dark:text-gray-400">
          {[
            { id: "dashboard", label: "ড্যাশবোর্ড (Dashboard)", icon: LayoutDashboard },
            { id: "videos", label: "ভিডিও ডিরেক্টরি (Videos)", icon: Film },
            { id: "categories", label: "ক্যাটাগরি ম্যানেজমেন্ট", icon: Tv },
            { id: "comments", label: `মন্তব্য মডারেশন (${allComments.filter((c) => !c.approved).length})`, icon: MessageSquare },
            { id: "payments", label: `পেমেন্ট অ্যাক্টিভেশন (${payments.filter((p) => p.status === "pending").length})`, icon: CreditCard },
            { id: "ads", label: "অ্যাড ম্যানেজার (Ads Control)", icon: Sliders },
            { id: "users", label: "ইউজার লিস্ট (Users)", icon: Users },
            { id: "offers", label: "অফার ডিরেক্টরি (Offers)", icon: Gift },
            { id: "settings", label: "ওয়েবসাইট সেটিংস", icon: Settings }
          ].filter((tab) => adminRole === "admin" || adminPermissions.includes(tab.id))
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2.5 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20"
                  : "hover:bg-gray-50 dark:hover:bg-gray-850"
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}

          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all mt-4 cursor-pointer"
          >
            <LogOut size={16} />
            লগআউট (Log Out)
          </button>
        </nav>
      </div>

      {/* Main Admin Tab Panel Contents */}
      <div className="lg:col-span-3 space-y-6">
        {/* 1. DASHBOARD TAB */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">ওয়েবসাইট পরিসংখ্যান</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">মোট ভিডিও</span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{videos.length}</h3>
                  <span className="text-indigo-500"><Film size={20} /></span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">মোট ভিউয়ার্স</span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalViews.toLocaleString()}</h3>
                  <span className="text-amber-500"><Star size={20} /></span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">মোট ক্যাটাগরি</span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{categories.length}</h3>
                  <span className="text-emerald-500"><Tv size={20} /></span>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-2">
                <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">মোট কমেন্টস</span>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white">{totalComments}</h3>
                  <span className="text-purple-500"><MessageSquare size={20} /></span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Storage Stats Box */}
              <div className="md:col-span-1 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-xs text-gray-800 dark:text-gray-200 uppercase flex items-center gap-1">
                  <Database size={14} className="text-indigo-500" /> স্টোরেজ লিমিট
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>ব্যবহৃত স্পেস</span>
                    <span className="font-bold">১২.৪ MB / ৫০ GB</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: "2%" }} />
                  </div>
                  <p className="text-[10px] text-gray-400 leading-snug">
                    ভিডিওগুলো সরাসরি ক্লাউড সার্ভার অথবা ইউটিউব লিঙ্ক ব্যবহার করে আপলোড করায় হোস্টিং ডিস্ক স্পেস সম্পূর্ণ সুরক্ষিত রয়েছে।
                  </p>
                </div>
              </div>

              {/* Secure Login Logs */}
              <div className="md:col-span-2 p-5 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm space-y-4">
                <h4 className="font-extrabold text-xs text-gray-800 dark:text-gray-200 uppercase">
                  নিরাপত্তা ও লগইন ইতিহাস (Login History)
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold">
                        <th className="pb-2">ব্যবহারকারী</th>
                        <th className="pb-2">আইপি এড্রেস</th>
                        <th className="pb-2">সময়</th>
                        <th className="pb-2 text-right">অবস্থা</th>
                      </tr>
                    </thead>
                    <tbody className="font-medium text-gray-600 dark:text-gray-300">
                      {loginHistory.slice(0, 5).map((log) => (
                        <tr key={log.id} className="border-b border-gray-50 dark:border-gray-850 py-2">
                          <td className="py-2.5 font-bold">{log.username}</td>
                          <td className="py-2.5 font-mono text-[10px]">{log.ip}</td>
                          <td className="py-2.5 text-[10px]">{new Date(log.time).toLocaleString("bn-BD")}</td>
                          <td className="py-2.5 text-right">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[9px] font-bold ${
                                log.status === "success"
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                                  : "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                              }`}
                            >
                              {log.status === "success" ? "সফল" : "ব্যর্থ"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. VIDEO DIRECTORY TAB */}
        {activeTab === "videos" && (
          showVideoModal ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 w-full space-y-4 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3.5 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">ভিডিও ম্যানেজার</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-0.5">
                    {editingVideo ? "ভিডিও সম্পাদনা" : "নতুন ভিডিও আপলোড"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  ← ফিরে যান
                </button>
              </div>

              <form onSubmit={handleVideoSubmit} className="space-y-6 text-xs">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Left and Middle columns: main video details */}
                  <div className="lg:col-span-2 space-y-4">
                    <div className="space-y-1">
                      <label className="font-bold text-gray-600 dark:text-gray-400">ভিডিও টাইটেল (Video Title)</label>
                      <input
                        type="text"
                        required
                        value={vTitle}
                        onChange={(e) => setVTitle(e.target.value)}
                        placeholder="ভিডিওর শিরোনাম লিখুন..."
                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-600 dark:text-gray-400">ভিডিওর বর্ণনা (Description)</label>
                      <textarea
                        rows={5}
                        value={vDesc}
                        onChange={(e) => setVDesc(e.target.value)}
                        placeholder="ভিডিওর বিস্তারিত বর্ণনা এখানে লিখুন..."
                        className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-sans"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Video URL section */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-gray-600 dark:text-gray-400 flex items-center justify-between">
                          <span>ভিডিওর সোর্স ইউআরএল (Video URL)</span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">লোকাল ফাইল বা অনলাইন ইউআরএল</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={vUrl}
                          onChange={(e) => setVUrl(e.target.value)}
                          placeholder="e.g. https://domain.com/video.mp4 or embed url"
                          className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-mono"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleOpenGallery("video", "video_url")}
                            className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 font-bold rounded-lg transition-all duration-200 text-[10px] cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <Upload size={11} /> 📂 গ্যালারি/ফাইল থেকে আপলোড
                          </button>
                          <button
                            type="button"
                            onClick={handleDetectDuration}
                            disabled={isDetectingDuration}
                            className={`px-2.5 py-1.5 bg-teal-50 dark:bg-teal-950/40 text-teal-600 dark:text-teal-400 hover:bg-teal-600 hover:text-white dark:hover:bg-teal-600 font-bold rounded-lg transition-all duration-200 text-[10px] cursor-pointer flex items-center gap-1 shadow-sm ${isDetectingDuration ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {isDetectingDuration ? (
                              <>
                                <span className="w-2.5 h-2.5 border-2 border-teal-600 border-t-transparent rounded-full animate-spin" />
                                শনাক্ত হচ্ছে...
                              </>
                            ) : (
                              <>
                                ⏱️ অটো সময়কাল শনাক্ত
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Thumbnail URL section */}
                      <div className="space-y-1.5">
                        <label className="font-bold text-gray-600 dark:text-gray-400 flex items-center justify-between">
                          <span>থাম্বনেইল ইমেজ ইউআরএল (Thumbnail URL)</span>
                          <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-normal">পোস্টার বা কভার ইমেজ</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={vThumbnail}
                          onChange={(e) => setVThumbnail(e.target.value)}
                          placeholder="e.g. https://images.unsplash.com/..."
                          className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-mono"
                        />
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          <button
                            type="button"
                            onClick={() => handleOpenGallery("image", "video_thumbnail")}
                            className="px-2.5 py-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600 font-bold rounded-lg transition-all duration-200 text-[10px] cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <Upload size={11} /> 📂 গ্যালারি/ফাইল থেকে আপলোড
                          </button>
                          <button
                            type="button"
                            onClick={handleGenerateThumbnail}
                            disabled={isGeneratingThumbnail}
                            className={`px-2.5 py-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 hover:bg-rose-600 hover:text-white dark:hover:bg-rose-600 font-bold rounded-lg transition-all duration-200 text-[10px] cursor-pointer flex items-center gap-1 shadow-sm ${isGeneratingThumbnail ? "opacity-50 cursor-not-allowed" : ""}`}
                          >
                            {isGeneratingThumbnail ? (
                              <>
                                <span className="w-2.5 h-2.5 border-2 border-rose-600 border-t-transparent rounded-full animate-spin" />
                                জেনারেট হচ্ছে...
                              </>
                            ) : (
                              <>
                                📸 ভিডিও থেকে অটো থাম্বনেইল
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {vThumbnail && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-950/40 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col items-center gap-2">
                        <span className="font-bold text-gray-400 text-[10px] uppercase font-mono">থাম্বনেইল প্রিভিউ (Thumbnail Preview)</span>
                        <img
                          src={vThumbnail}
                          alt="Thumbnail Preview"
                          className="max-h-48 aspect-video object-cover rounded-xl border border-gray-200 dark:border-gray-800"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Right Column: classification & status settings */}
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-gray-950/40 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-4">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 dark:text-gray-400">ক্যাটাগরি</label>
                        <select
                          required
                          value={vCategory}
                          onChange={(e) => {
                            const catSlug = e.target.value;
                            setVCategory(catSlug);
                            const foundCat = categories.find(c => c.slug === catSlug);
                            if (foundCat && foundCat.subCategories && foundCat.subCategories.length > 0) {
                              setVSubCategory(foundCat.subCategories[0].slug);
                            } else {
                              setVSubCategory("");
                            }
                          }}
                          className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-xs"
                        >
                          {categories.map((cat) => (
                            <option key={cat.slug} value={cat.slug}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 dark:text-gray-400">সাব-ক্যাটাগরি</label>
                        <select
                          value={vSubCategory}
                          onChange={(e) => setVSubCategory(e.target.value)}
                          className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-xs"
                          disabled={categories.find(c => c.slug === vCategory)?.subCategories?.length === 0}
                        >
                          <option value="">কোনোটিই নয়</option>
                          {(categories.find(c => c.slug === vCategory)?.subCategories || []).map((sub) => (
                            <option key={sub.slug} value={sub.slug}>
                              {sub.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-600 dark:text-gray-400">ভাষা</label>
                          <select
                            value={vLanguage}
                            onChange={(e) => setVLanguage(e.target.value)}
                            className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-xs"
                          >
                            <option value="Bengali">Bengali</option>
                            <option value="English">English</option>
                            <option value="Hindi">Hindi</option>
                            <option value="Tamil">Tamil</option>
                            <option value="Korean">Korean</option>
                            <option value="Multilingual">Multilingual</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-gray-600 dark:text-gray-400">রেজোলিউশন</label>
                          <select
                            value={vResolution}
                            onChange={(e) => setVResolution(e.target.value)}
                            className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-xs font-mono"
                          >
                            <option value="1080p">1080p Full HD</option>
                            <option value="720p">720p HD</option>
                            <option value="4K">4K Ultra HD</option>
                            <option value="360p">360p SD</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-600 dark:text-gray-400">সময়কাল (Duration)</label>
                          <input
                            type="text"
                            required
                            value={vDuration}
                            onChange={(e) => setVDuration(e.target.value)}
                            placeholder="e.g. 15:45"
                            className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-xs font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-gray-600 dark:text-gray-400">স্ট্যাটাস</label>
                          <select
                            value={vStatus}
                            onChange={(e) => setVStatus(e.target.value as any)}
                            className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-xs"
                          >
                            <option value="publish">প্রকাশিত (Publish)</option>
                            <option value="draft">খসড়া (Draft)</option>
                            <option value="scheduled">তফসিলী (Scheduled)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 dark:text-gray-400">ট্যাগ সমূহ (কমা দিয়ে আলাদা করুন)</label>
                        <input
                          type="text"
                          value={vTags}
                          onChange={(e) => setVTags(e.target.value)}
                          placeholder="e.g. action, blockbuster, 2024"
                          className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                    </div>

                    <div className="p-4 bg-gray-50 dark:bg-gray-950/40 rounded-2xl border border-gray-100 dark:border-gray-800 space-y-3">
                      <span className="font-bold text-gray-600 dark:text-gray-400 block pb-1 border-b border-gray-100 dark:border-gray-800 text-[10px] uppercase">ফিচারসমূহ (Video Features)</span>
                      
                      <label className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">ফিচার্ড ভিডিও</span>
                          <span className="text-[10px] text-gray-400">হোমপেজের ব্যানার স্লাইডারে প্রদর্শিত হবে।</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={vFeatured}
                          onChange={(e) => setVFeatured(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <div>
                          <span className="font-bold text-gray-900 dark:text-white block">ট্রেন্ডিং ভিডিও</span>
                          <span className="text-[10px] text-gray-400">ট্রেন্ডিং ভিডিও সেকশনে প্রদর্শিত হবে।</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={vTrending}
                          onChange={(e) => setVTrending(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <div>
                          <span className="font-bold text-amber-600 block">প্রিমিয়াম ভিডিও</span>
                          <span className="text-[10px] text-gray-400">শুধুমাত্র সাবস্ক্রাইবড ইউজাররা দেখতে পাবেন।</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={vPremium}
                          onChange={(e) => setVPremium(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                      </label>

                      <label className="flex items-center justify-between p-2.5 bg-white dark:bg-gray-900 rounded-xl border border-gray-150 dark:border-gray-800 cursor-pointer hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                        <div>
                          <span className="font-bold text-rose-600 block">লকড ভিডিও</span>
                          <span className="text-[10px] text-gray-400">ভিডিওটি দেখতে লগইন করা আবশ্যিক।</span>
                        </div>
                        <input
                          type="checkbox"
                          checked={vLocked}
                          onChange={(e) => setVLocked(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowVideoModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer text-xs"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer shadow-md shadow-indigo-600/10 text-xs"
                  >
                    {editingVideo ? "ভিডিও আপডেট করুন" : "ভিডিও আপলোড করুন"}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">ভিডিও ডিরেক্টরি</h2>
                <div className="flex items-center gap-2">
                  {bulkSelected.length > 0 && (
                    <button
                      onClick={handleBulkDelete}
                      className="bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={14} /> ({bulkSelected.length}) ডিলিট
                    </button>
                  )}
                  <button
                    onClick={handleOpenAddVideo}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <PlusCircle size={14} /> নতুন ভিডিও আপলোড
                  </button>
                </div>
              </div>

              {/* Video List Table */}
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold uppercase tracking-wider">
                        <th className="p-4 w-10">
                          <input
                            type="checkbox"
                            checked={bulkSelected.length === videos.length}
                            onChange={handleSelectAllVideos}
                            className="rounded text-indigo-600 focus:ring-indigo-500"
                          />
                        </th>
                        <th className="p-4">ভিডিও থাম্বনেইল ও টাইটেল</th>
                        <th className="p-4">ক্যাটাগরি</th>
                        <th className="p-4">ভিউয়ার্স</th>
                        <th className="p-4">স্ট্যাটাস</th>
                        <th className="p-4 text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
                      {videos.map((vid) => (
                        <tr key={vid.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-850/20">
                          <td className="p-4">
                            <input
                              type="checkbox"
                              checked={bulkSelected.includes(vid.id)}
                              onChange={() => handleToggleBulk(vid.id)}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                          </td>
                          <td className="p-4 flex items-center gap-3 min-w-[240px]">
                            <img
                              src={vid.thumbnailUrl || undefined}
                              alt=""
                              className="w-14 aspect-video object-cover rounded-md border border-gray-100 dark:border-gray-800"
                            />
                            <div className="space-y-1">
                              <h4 className="font-bold text-gray-900 dark:text-white line-clamp-1">
                                {vid.title}
                              </h4>
                              <div className="flex gap-2 text-[10px] text-gray-400 font-mono">
                                <span>রেশিও: {vid.resolution}</span>
                                <span>•</span>
                                <span>ভাষা: {vid.language}</span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 capitalize font-semibold">{vid.category}</td>
                          <td className="p-4 font-mono">{vid.views.toLocaleString()}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                vid.status === "publish"
                                  ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                                  : vid.status === "draft"
                                  ? "bg-gray-100 text-gray-500 dark:bg-gray-800"
                                  : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                              }`}
                            >
                              {vid.status === "publish" ? "প্রকাশিত" : vid.status === "draft" ? "খসড়া" : "তফসিলী"}
                            </span>
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleOpenEditVideo(vid)}
                                className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 text-indigo-600 rounded-lg transition-colors cursor-pointer"
                                title="সম্পাদনা"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteVideo(vid.id)}
                                className="p-1.5 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 rounded-lg transition-colors cursor-pointer"
                                title="ডিলিট"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        )}

        {/* 3. CATEGORIES MANAGEMENT TAB */}
        {activeTab === "categories" && (
          showCatModal ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 w-full space-y-4 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3.5 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">ক্যাটাগরি ম্যানেজার</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-0.5">
                    {editingCat ? "ক্যাটাগরি সম্পাদনা" : "নতুন ক্যাটাগরি তৈরি করুন"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCatModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  ← ফিরে যান
                </button>
              </div>

              <form onSubmit={handleCategorySubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">ক্যাটাগরি নাম</label>
                  <input
                    type="text"
                    required
                    value={cName}
                    onChange={(e) => {
                      setCName(e.target.value);
                      if (!editingCat) {
                        setCSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, ""));
                      }
                    }}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">ক্যাটাগরি স্ল্যাগ (SEO Friendly Slug)</label>
                  <input
                    type="text"
                    required
                    disabled={!!editingCat}
                    value={cSlug}
                    onChange={(e) => setCSlug(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-mono disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">Lucide আইকন নাম</label>
                    <select
                      value={cIcon}
                      onChange={(e) => setCIcon(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="Film">Film (মুভি)</option>
                      <option value="Tv">Tv (নাটক/সিরিজ)</option>
                      <option value="Flame">Flame (ভাইরাল)</option>
                      <option value="Music">Music (মিউজিক)</option>
                      <option value="Trophy">Trophy (খেলাধুলা)</option>
                      <option value="Laugh">Laugh (কমেডি)</option>
                      <option value="Cpu">Cpu (প্রযুক্তি)</option>
                      <option value="BookOpen">BookOpen (শিক্ষা)</option>
                      <option value="Globe">Globe (সংবাদ)</option>
                      <option value="Sparkles">Sparkles (অ্যানিমেশন)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">আইকন প্রিভিউ</label>
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center border border-indigo-100">
                      <LucideIcon name={cIcon} size={20} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">ক্যাটাগরি ব্যানার ইমেজ URL</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={cImage}
                    onChange={(e) => setCImage(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-indigo-600 dark:text-indigo-400">সাব-ক্যাটাগরি সমূহ (কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    placeholder="IPL, PSL, BPL, T20"
                    value={subCategoriesInput}
                    onChange={(e) => setSubCategoriesInput(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                  />
                  <p className="text-[9px] text-gray-400">এই সাব-ক্যাটাগরিগুলো ক্যাটাগরি পেইজে ফিল্টার এবং ভিডিও আপলোডে প্রদর্শিত হবে।</p>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowCatModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">ক্যাটাগরি ম্যানেজমেন্ট</h2>
                <button
                  onClick={handleOpenAddCategory}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <PlusCircle size={14} /> নতুন ক্যাটাগরি যোগ করুন
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((cat) => (
                  <div
                    key={cat.slug}
                    className="p-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-2xl flex items-center justify-between shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                        <LucideIcon name={cat.icon} size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white capitalize">{cat.name}</h4>
                        <p className="text-[10px] font-mono text-gray-400">Slug: /category/{cat.slug}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditCategory(cat)}
                        className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg hover:bg-indigo-100 cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.slug)}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* 4. COMMENT MODERATION TAB */}
        {activeTab === "comments" && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">মন্তব্য মডারেশন (Comments Moderation)</h2>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold uppercase">
                      <th className="p-4">মন্তব্যকারী ও তারিখ</th>
                      <th className="p-4">ভিডিও টাইটেল</th>
                      <th className="p-4">মন্তব্যের কন্টেন্ট</th>
                      <th className="p-4 text-center">অবস্থা</th>
                      <th className="p-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
                    {allComments.map((comm) => (
                      <tr key={comm.id} className="hover:bg-gray-50/50">
                        <td className="p-4 min-w-[140px]">
                          <h4 className="font-bold text-gray-900 dark:text-white">{comm.userName}</h4>
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(comm.createdAt).toLocaleString("bn-BD")}
                          </span>
                        </td>
                        <td className="p-4 truncate max-w-[150px] font-bold text-indigo-600 dark:text-indigo-400">
                          {comm.videoTitle}
                        </td>
                        <td className="p-4 text-xs max-w-[200px] whitespace-normal leading-relaxed">
                          {comm.text}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              comm.approved
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-amber-50 text-amber-600 animate-pulse"
                            }`}
                          >
                            {comm.approved ? "অনুমোদিত" : "অপেক্ষমান"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            {!comm.approved && (
                              <button
                                onClick={() => handleApproveComment(comm.videoId!, comm.id)}
                                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg cursor-pointer"
                                title="অনুমোদন করুন"
                              >
                                <Check size={13} />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteComment(comm.videoId!, comm.id)}
                              className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {allComments.length === 0 && (
                      <tr>
                        <td colSpan={5} className="text-center py-8 text-gray-400">
                          কোনো মন্তব্য পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. ADS MANAGER TAB */}
        {activeTab === "ads" && (
          showAdModal ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 w-full space-y-4 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3.5 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">বিজ্ঞাপন ম্যানেজার</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-0.5">
                    {editingAd ? "বিজ্ঞাপন ক্যাম্পেইন সম্পাদনা" : "নতুন বিজ্ঞাপন ক্যাম্পেইন যোগ করুন"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAdModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  ← ফিরে যান
                </button>
              </div>

              <form onSubmit={handleAdSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">বিজ্ঞাপন ক্যাম্পেইন নাম</label>
                    <input
                      type="text"
                      required
                      value={aName}
                      onChange={(e) => setAName(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">বিজ্ঞাপন প্লেসমেন্ট (Placement)</label>
                    <select
                      value={aPlacement}
                      onChange={(e) => setAPlacement(e.target.value as any)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      <option value="header">Header Banner Ads</option>
                      <option value="sidebar">Sidebar Ads Space</option>
                      <option value="sticky">Sticky Bottom Footer</option>
                      <option value="footer">Footer Banner</option>
                      <option value="banner_320_50">Banner 320x50 Spot</option>
                      <option value="native_banner">Native Banner Block</option>
                      <option value="smartlink">Smartlink (Direct URL / Promo)</option>
                      <option value="social_bar">Social Bar (Floating Notice)</option>
                      <option value="popunder">Popunder Advertisement</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">টার্গেটেড ডিভাইস</label>
                    <select
                      value={aDevices}
                      onChange={(e) => setADevices(e.target.value as any)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                    >
                      <option value="both">All Devices (Both)</option>
                      <option value="mobile">Mobile Only</option>
                      <option value="desktop">Desktop Only</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">শুরুর তারিখ</label>
                    <input
                      type="date"
                      value={aStartDate}
                      onChange={(e) => setAStartDate(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">শেষের তারিখ</label>
                    <input
                      type="date"
                      value={aEndDate}
                      onChange={(e) => setAEndDate(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">বিজ্ঞাপন HTML/JS কোড (Direct AdSense or Custom HTML code)</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="<div class='bg-yellow-100 p-4 rounded-xl'>আমাদের স্পন্সর বিজ্ঞাপন দেখুন...</div>"
                    value={aCode}
                    onChange={(e) => setACode(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2 font-bold text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={aEnabled}
                    onChange={(e) => setAEnabled(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <label>এই বিজ্ঞাপন ক্যাম্পেইনটি সরাসরি লাইভ সক্রিয় করুন (Enable)</label>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowAdModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">বিজ্ঞাপন ম্যানেজার (Ad Campaign Manager)</h2>
              <button
                onClick={handleOpenAddAd}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle size={14} /> নতুন বিজ্ঞাপন ক্যাম্পেইন
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ads.map((ad) => (
                <div
                  key={ad.id}
                  className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full ${
                            ad.enabled ? "bg-emerald-500" : "bg-gray-400"
                          }`}
                        />
                        <h4 className="font-extrabold text-sm text-gray-900 dark:text-white">
                          {ad.name}
                        </h4>
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">
                        ধরন: {ad.type} | প্লেসমেন্ট: {ad.placement.toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEditAd(ad)}
                        className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg hover:bg-indigo-100 cursor-pointer"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => handleDeleteAd(ad.id)}
                        className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-950 p-3 rounded-xl text-[10px] font-mono text-gray-400 border border-gray-100 dark:border-gray-900 overflow-hidden text-ellipsis line-clamp-2">
                    {ad.code}
                  </div>

                  <div className="flex justify-between items-center text-[10px] font-semibold text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-50 dark:border-gray-800">
                    <span>টার্গেটেড ডিভাইস: {ad.devices === "both" ? "উভয় ডিভাইস" : ad.devices === "mobile" ? "মোবাইল" : "ডেস্কটপ"}</span>
                    <span>সক্রিয়: {ad.enabled ? "হ্যাঁ" : "না"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
      )}

        {/* 6. USERS MANAGEMENT TAB */}
        {activeTab === "users" && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">ইউজার তালিকা</h2>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold uppercase">
                      <th className="p-4">ইউজার আইডি</th>
                      <th className="p-4">ইউজারনেম</th>
                      <th className="p-4">ইমেইল</th>
                      <th className="p-4">নিবন্ধন তারিখ</th>
                      <th className="p-4 text-center">প্রিমিয়াম স্ট্যাটাস</th>
                      <th className="p-4 text-center">পদবী (রোল)</th>
                      <th className="p-4 text-center">অবস্থা</th>
                      <th className="p-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
                    {users.map((usr) => (
                      <tr key={usr.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-mono">{usr.id}</td>
                        <td className="p-4 font-bold">{usr.userName}</td>
                        <td className="p-4">{usr.email}</td>
                        <td className="p-4">{new Date(usr.createdAt).toLocaleDateString("bn-BD")}</td>
                        <td className="p-4 text-center">
                          {usr.isPremium ? (
                            <div className="flex flex-col items-center justify-center">
                              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-0.5 rounded-full text-[9px] font-bold">
                                <Crown size={10} className="text-amber-400 animate-pulse" /> প্রিমিয়াম
                              </span>
                              {usr.premiumUntil && (
                                <span className="text-[9px] text-gray-400 mt-1 font-mono">
                                  {new Date(usr.premiumUntil) > new Date() ? (
                                    `মেয়াদ: ${new Date(usr.premiumUntil).toLocaleDateString("bn-BD")}`
                                  ) : (
                                    <span className="text-rose-500 font-bold">মেয়াদ উত্তীর্ণ</span>
                                  )}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-[10px]">সাধারণ</span>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              usr.role === "admin"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400"
                                : usr.role === "moderator"
                                ? "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-400"
                            }`}
                          >
                            {usr.role === "admin" ? "অ্যাডমিন 👑" : usr.role === "moderator" ? "মডারেটর 🛡️" : "সাধারণ ইউজার 👤"}
                          </span>
                        </td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              usr.status === "active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-rose-50 text-rose-600"
                            }`}
                          >
                            {usr.status === "active" ? "সক্রিয়" : "নিষিদ্ধ (BANNED)"}
                          </span>
                        </td>
                        <td className="p-4 text-right flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedRoleUser(usr);
                              setSelectedRole(usr.role || "user");
                              setSelectedPermissions(usr.permissions || []);
                            }}
                            className="bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-950/40 dark:hover:bg-purple-950 dark:text-purple-400 p-1.5 rounded-lg font-bold text-[10px] px-2.5 py-1 flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Shield size={10} /> পদবী পরিবর্তন
                          </button>
                          <button
                            onClick={() => setSelectedProfileUser(usr)}
                            className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:hover:bg-indigo-950 dark:text-indigo-400 p-1.5 rounded-lg font-bold text-[10px] px-2.5 py-1 flex items-center gap-1 transition-all cursor-pointer"
                          >
                            <Users size={10} /> প্রোফাইল দেখুন
                          </button>
                          <button
                            onClick={() => handleToggleUserBan(usr.id, usr.status)}
                            className={`p-1.5 rounded-lg font-bold text-[10px] px-2.5 py-1 flex items-center gap-1 cursor-pointer transition-colors ${
                              usr.status === "active"
                                ? "bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                                : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                            }`}
                          >
                            {usr.status === "active" ? <Ban size={10} /> : <Check size={10} />}
                            {usr.status === "active" ? "Ban User" : "Unban"}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-400">
                          কোনো ইউজার নিবন্ধিত নেই।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6.1 PREMIUM ACTIVATION PAYMENTS TAB */}
        {activeTab === "payments" && (
          <div className="space-y-4">
            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">প্রিমিয়াম পেমেন্ট অ্যাক্টিভেশন অনুরোধ</h2>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold uppercase">
                      <th className="p-4">ইউজারনেম</th>
                      <th className="p-4">পেমেন্ট মাধ্যম</th>
                      <th className="p-4">প্রেরক নম্বর</th>
                      <th className="p-4">ট্রানজেকশন আইডি</th>
                      <th className="p-4">প্যাকেজ</th>
                      <th className="p-4">মূল্য</th>
                      <th className="p-4">তারিখ</th>
                      <th className="p-4 text-center">অবস্থা</th>
                      <th className="p-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
                    {payments.map((pay) => (
                      <tr key={pay.id} className="hover:bg-gray-50/50">
                        <td className="p-4 font-bold">{pay.userName}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase text-white ${
                            pay.gateway === "bkash" ? "bg-pink-600" :
                            pay.gateway === "nagad" ? "bg-orange-600" :
                            "bg-purple-600"
                          }`}>
                            {pay.gateway}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold text-gray-900 dark:text-white">{pay.senderNumber}</td>
                        <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400">{pay.transactionId}</td>
                        <td className="p-4 font-bold">{pay.packageTitle}</td>
                        <td className="p-4 font-bold text-gray-900 dark:text-white">৳{pay.packagePrice}</td>
                        <td className="p-4 text-gray-400">{new Date(pay.createdAt).toLocaleString("bn-BD")}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              pay.status === "approved"
                                ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20"
                                : pay.status === "rejected"
                                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/20"
                                : "bg-amber-50 text-amber-600 dark:bg-amber-950/20"
                            }`}
                          >
                            {pay.status === "approved" ? "অনুমোদিত" : pay.status === "rejected" ? "প্রত্যাখ্যাত" : "পেন্ডিং"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {pay.status === "pending" ? (
                            <div className="flex justify-end gap-1.5">
                              <button
                                onClick={() => handleUpdatePaymentStatus(pay.id, "approved")}
                                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <CheckCircle size={11} /> Approve
                              </button>
                              <button
                                onClick={() => handleUpdatePaymentStatus(pay.id, "rejected")}
                                className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                              >
                                <XCircle size={11} /> Reject
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    {payments.length === 0 && (
                      <tr>
                        <td colSpan={9} className="text-center py-8 text-gray-400">
                          কোনো পেমেন্ট অনুরোধ পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6.5 SPÉCIAL OFFERS MANAGEMENT TAB */}
        {activeTab === "offers" && (
          showOfferModal ? (
            <div className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-3xl p-6 w-full space-y-4 shadow-sm animate-fade-in">
              <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3.5 mb-2">
                <div>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest font-mono">অফার ম্যানেজার</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-0.5">
                    {editingOffer ? "অফার সম্পাদন করুন" : "নতুন অফার যোগ করুন"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowOfferModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  ← ফিরে যান
                </button>
              </div>

              <form onSubmit={handleOfferSubmit} className="space-y-4 text-xs font-medium">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">অফার টাইটেল</label>
                  <input
                    type="text"
                    required
                    value={oTitle}
                    onChange={(e) => setOTitle(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">অফার বিবরণ</label>
                  <textarea
                    rows={3}
                    required
                    value={oDesc}
                    onChange={(e) => setODesc(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">অফার লিংক (Action URL)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={oLink}
                      onChange={(e) => setOLink(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">অফার ইমেজ URL</label>
                    <input
                      type="text"
                      required
                      placeholder="https://..."
                      value={oImage}
                      onChange={(e) => setOImage(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">বাটন টেক্সট (Button Text)</label>
                    <input
                      type="text"
                      placeholder="অফার নিন"
                      value={oBtnText}
                      onChange={(e) => setOBtnText(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">প্রিমিয়াম মেয়াদ (Duration)</label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        required
                        value={oDurationCount}
                        onChange={(e) => setODurationCount(Number(e.target.value))}
                        className="w-20 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-bold text-center text-gray-900 dark:text-white"
                      />
                      <select
                        value={oDurationUnit}
                        onChange={(e) => setODurationUnit(e.target.value as "days" | "months")}
                        className="flex-1 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
                      >
                        <option value="months">মাস (Months)</option>
                        <option value="days">দিন (Days)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">প্যাকেজ মূল্য (Price in BDT)</label>
                    <input
                      type="number"
                      placeholder="যেমন: ৩৫০"
                      value={oPrice}
                      onChange={(e) => setOPrice(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 dark:text-gray-400">অফার স্ট্যাটাস</label>
                    <select
                      value={oStatus}
                      onChange={(e) => setOStatus(e.target.value as "active" | "draft")}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-bold"
                    >
                      <option value="active">সক্রিয় (Active)</option>
                      <option value="draft">খসড়া (Draft)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setShowOfferModal(false)}
                    className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    বাতিল
                  </button>
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
                  >
                    সংরক্ষণ করুন
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">স্পেশাল অফার ম্যানেজমেন্ট</h2>
              <button
                onClick={handleOpenAddOffer}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3.5 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <PlusCircle size={14} /> নতুন অফার যুক্ত করুন
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-950 border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold uppercase">
                      <th className="p-4">থাম্বনেইল ও টাইটেল</th>
                      <th className="p-4">বিবরণ</th>
                      <th className="p-4">লিংক / বাটন টেক্সট</th>
                      <th className="p-4">প্রিমিয়াম মেয়াদ</th>
                      <th className="p-4">প্যাকেজ মূল্য</th>
                      <th className="p-4 text-center">অবস্থা</th>
                      <th className="p-4 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800 font-medium text-gray-700 dark:text-gray-300">
                    {adminOffers.map((off) => (
                      <tr key={off.id} className="hover:bg-gray-50/50">
                        <td className="p-4 min-w-[200px]">
                          <div className="flex items-center gap-3">
                            <img
                              src={off.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=100"}
                              alt={off.title}
                              className="w-12 h-8 object-cover rounded-md bg-gray-50"
                            />
                            <div className="font-bold text-gray-900 dark:text-white line-clamp-1">{off.title}</div>
                          </div>
                        </td>
                        <td className="p-4 max-w-[200px] truncate">{off.description}</td>
                        <td className="p-4">
                          <a href={off.link} target="_blank" rel="noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                            {off.btnText || "অফার নিন"}
                          </a>
                        </td>
                        <td className="p-4 font-bold">{off.points || (off.durationDays ? `${off.durationDays} দিন` : "N/A")}</td>
                        <td className="p-4 font-black text-rose-600 dark:text-rose-400">{off.price ? `৳${off.price}` : "ফ্রি"}</td>
                        <td className="p-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              off.status === "active"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {off.status === "active" ? "সক্রিয়" : "খসড়া"}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex justify-end gap-1.5">
                            <button
                              onClick={() => handleOpenEditOffer(off)}
                              className="p-1.5 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 rounded-lg hover:bg-indigo-100 cursor-pointer"
                              title="সম্পাদনা"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={() => handleDeleteOffer(off.id)}
                              className="p-1.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-lg hover:bg-rose-100 cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {adminOffers.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-400">
                          কোনো অফার পাওয়া যায়নি।
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}

        {/* 7. WEBSITE CONFIGURATION SETTINGS */}
        {activeTab === "settings" && (
          <form onSubmit={handleSettingsSubmit} className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">ওয়েবসাইট সেটিংস</h2>
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-5 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                সেটিংস সংরক্ষণ করুন
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* General Settings */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-gray-800">
                  <h4 className="font-extrabold text-xs text-gray-800 dark:text-gray-200 uppercase">
                    সাধারণ সেটিংস
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("general", "সাধারণ সেটিংস")}
                    disabled={savingSection !== null}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      savedSection === "general"
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : savingSection === "general"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait"
                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
                    }`}
                  >
                    {savingSection === "general" ? (
                      <>
                        <span className="w-2.5 h-2.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : savedSection === "general" ? (
                      <>
                        <Check size={11} />
                        সংরক্ষিত!
                      </>
                    ) : (
                      <>
                        <CheckCircle size={11} />
                        সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">ওয়েবসাইট নাম</label>
                  <input
                    type="text"
                    value={sName}
                    onChange={(e) => setSName(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">লোগো টেক্সট</label>
                  <input
                    type="text"
                    value={sLogo}
                    onChange={(e) => setSLogo(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">কন্টাক্ট সাপোর্ট ইমেইল</label>
                  <input
                    type="email"
                    value={sEmail}
                    onChange={(e) => setSEmail(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-rose-600 dark:text-rose-400">প্ল্যাটফর্মের ভাষা সমূহ (কমা দিয়ে আলাদা করুন)</label>
                  <input
                    type="text"
                    value={sLanguages}
                    onChange={(e) => setSLanguages(e.target.value)}
                    placeholder="Bengali, English, Hindi"
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500"
                  />
                  <p className="text-[9px] text-gray-400">এই ভাষাগুলো ভিডিও আপলোড করার ফর্মে প্রদর্শিত হবে।</p>
                </div>
              </div>

              {/* SMTP configuration */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-gray-800">
                  <h4 className="font-extrabold text-xs text-gray-800 dark:text-gray-200 uppercase">
                    SMTP ইমেইল কনফিগারেশন
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("smtp", "SMTP ইমেইল সেটিংস")}
                    disabled={savingSection !== null}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      savedSection === "smtp"
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : savingSection === "smtp"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait"
                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
                    }`}
                  >
                    {savingSection === "smtp" ? (
                      <>
                        <span className="w-2.5 h-2.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : savedSection === "smtp" ? (
                      <>
                        <Check size={11} />
                        সংরক্ষিত!
                      </>
                    ) : (
                      <>
                        <CheckCircle size={11} />
                        সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">SMTP Host</label>
                  <input
                    type="text"
                    value={sSmtpHost}
                    onChange={(e) => setSSmtpHost(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1 col-span-1">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">Port</label>
                    <input
                      type="text"
                      value={sSmtpPort}
                      onChange={(e) => setSSmtpPort(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">User / Username</label>
                    <input
                      type="text"
                      value={sSmtpUser}
                      onChange={(e) => setSSmtpUser(e.target.value)}
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">SMTP Password</label>
                  <input
                    type="password"
                    value={sSmtpPass}
                    onChange={(e) => setSSmtpPass(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>
              </div>

              {/* SEO configuration */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-gray-800">
                  <h4 className="font-extrabold text-xs text-gray-800 dark:text-gray-200 uppercase">
                    SEO ও সোশ্যাল মেটা সেটিংস
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("seo", "SEO ও সোশ্যাল মেটা সেটিংস")}
                    disabled={savingSection !== null}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      savedSection === "seo"
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : savingSection === "seo"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait"
                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
                    }`}
                  >
                    {savingSection === "seo" ? (
                      <>
                        <span className="w-2.5 h-2.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : savedSection === "seo" ? (
                      <>
                        <Check size={11} />
                        সংরক্ষিত!
                      </>
                    ) : (
                      <>
                        <CheckCircle size={11} />
                        সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">গ্লোবাল মেটা টাইটেল (SEO)</label>
                  <input
                    type="text"
                    value={sMetaTitle}
                    onChange={(e) => setSMetaTitle(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">গ্লোবাল মেটা কিওয়ার্ডস (Keywords)</label>
                  <input
                    type="text"
                    value={sMetaKeys}
                    onChange={(e) => setSMetaKeys(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">গ্লোবাল মেটা ডেসক্রিপশন</label>
                  <textarea
                    rows={2}
                    value={sMetaDesc}
                    onChange={(e) => setSMetaDesc(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>
              </div>

              {/* Integrations (Analytics) */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-gray-800">
                  <h4 className="font-extrabold text-xs text-gray-800 dark:text-gray-200 uppercase">
                    গুগল এনালিটিক্স ও সার্চ কনসোল
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("analytics", "গুগল এনালিটিক্স ও সার্চ কনসোল সেটিংস")}
                    disabled={savingSection !== null}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      savedSection === "analytics"
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : savingSection === "analytics"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait"
                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
                    }`}
                  >
                    {savingSection === "analytics" ? (
                      <>
                        <span className="w-2.5 h-2.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : savedSection === "analytics" ? (
                      <>
                        <Check size={11} />
                        সংরক্ষিত!
                      </>
                    ) : (
                      <>
                        <CheckCircle size={11} />
                        সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">Google Analytics Tracking ID (G-XXXXX)</label>
                  <input
                    type="text"
                    value={sGa}
                    onChange={(e) => setSGa(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">Google Search Console Verification Code</label>
                  <input
                    type="text"
                    value={sGsc}
                    onChange={(e) => setSGsc(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs"
                  />
                </div>

                <div className="p-3 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-800 dark:text-indigo-300 rounded-xl border border-indigo-100 dark:border-indigo-900/50 text-[10px] leading-relaxed">
                  <strong>ℹ️ রোবটস ফাইল ও সাইটম্যাপ:</strong> Robots.txt এবং Sitemap.xml ফাইলগুলো সার্ভারে স্বয়ংক্রিয়ভাবে জেনারেট হয়ে SEO বুস্ট করতে সাহায্য করবে।
                </div>
              </div>

              {/* Super Admin Login Credentials Settings */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-gray-800">
                  <h4 className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 uppercase flex items-center gap-1.5">
                    🔐 অ্যাডমিন প্যানেল লগইন সেটিংস
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("adminLogin", "অ্যাডমিন লগইন সেটিংস")}
                    disabled={savingSection !== null}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      savedSection === "adminLogin"
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : savingSection === "adminLogin"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait"
                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
                    }`}
                  >
                    {savingSection === "adminLogin" ? (
                      <>
                        <span className="w-2.5 h-2.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : savedSection === "adminLogin" ? (
                      <>
                        <Check size={11} />
                        সংরক্ষিত!
                      </>
                    ) : (
                      <>
                        <CheckCircle size={11} />
                        সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">সুপার অ্যাডমিন ইউজারনেম (Default: admin)</label>
                  <input
                    type="text"
                    required
                    value={sAdminUsername}
                    onChange={(e) => setSAdminUsername(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">সুপার অ্যাডমিন পাসওয়ার্ড (Default: adminpassword)</label>
                  <input
                    type="text"
                    required
                    value={sAdminPassword}
                    onChange={(e) => setSAdminPassword(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 font-bold text-gray-900 dark:text-white"
                  />
                  <p className="text-[9px] text-gray-400 mt-1">⚠️ এই ইউজারনেম এবং পাসওয়ার্ড দিয়ে অ্যাডমিন প্যানেলে সরাসরি লগইন করা যাবে। পরিবর্তন করার পর সাবধানে সংরক্ষণ করুন।</p>
                </div>
              </div>

              {/* Live stream & Auth branding configuration */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-gray-800">
                  <h4 className="font-extrabold text-xs text-rose-600 uppercase flex items-center gap-1.5">
                    📺 লাইভ স্ট্রিমিং ও ব্র্যান্ডিং সেটিংস
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("liveAndBanner", "লাইভ স্ট্রিমিং ও ব্র্যান্ডিং সেটিংস")}
                    disabled={savingSection !== null}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      savedSection === "liveAndBanner"
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : savingSection === "liveAndBanner"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait"
                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
                    }`}
                  >
                    {savingSection === "liveAndBanner" ? (
                      <>
                        <span className="w-2.5 h-2.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : savedSection === "liveAndBanner" ? (
                      <>
                        <Check size={11} />
                        সংরক্ষিত!
                      </>
                    ) : (
                      <>
                        <CheckCircle size={11} />
                        সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-rose-500/5 rounded-xl border border-rose-500/10">
                  <div>
                    <label className="text-xs font-black text-rose-700 dark:text-rose-400 block">লাইভ সম্প্রচার সক্রিয়</label>
                    <span className="text-[10px] text-gray-400 block mt-0.5">লাইভ ভিডিও পেজ এবং স্ট্রিম দেখার সুবিধা চালু বা বন্ধ রাখুন</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sLiveStreamEnabled}
                    onChange={(e) => setSLiveStreamEnabled(e.target.checked)}
                    className="w-4 h-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-amber-500/5 rounded-xl border border-amber-500/10">
                  <div>
                    <label className="text-xs font-black text-amber-700 dark:text-amber-400 block">প্রিমিয়াম ইউজারদের জন্য লাইভ স্ট্রিম</label>
                    <span className="text-[10px] text-gray-400 block mt-0.5">এই সুবিধা চালু থাকলে শুধুমাত্র প্রিমিয়াম মেম্বাররা লাইভ ভিডিও দেখতে পারবে</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sLiveStreamPremiumOnly}
                    onChange={(e) => setSLiveStreamPremiumOnly(e.target.checked)}
                    className="w-4 h-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">লাইভ স্ট্রিম এমবেড কোড (ডিফল্ট / সার্ভার ১)</label>
                  <textarea
                    rows={2}
                    placeholder='<iframe src="https://example.com/embed" ...></iframe>'
                    value={sLiveStreamIframe}
                    onChange={(e) => setSLiveStreamIframe(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400 font-bold">লাইভ স্ট্রিম থাম্বনেইল ইমেজ URL (ডিফল্ট / সার্ভার ১)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/... অথবা গ্যালারি থেকে ফাইল সিলেক্ট করুন"
                      value={sLiveStreamThumbnail}
                      onChange={(e) => setSLiveStreamThumbnail(e.target.value)}
                      className="flex-1 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-indigo-500 text-gray-950 dark:text-gray-50"
                    />
                    <button
                      type="button"
                      onClick={() => handleOpenGallery("image", "live_stream_default_thumbnail")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-xs"
                    >
                      <Upload size={12} /> গ্যালারি
                    </button>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400 block">অন্যান্য অতিরিক্ত লাইভ সার্ভার অপশনসমূহ (Multi-Server Streaming Options)</label>
                  
                  {sLiveStreamServers.length > 0 && (
                    <div className="space-y-1.5 max-h-40 overflow-y-auto border border-gray-100 dark:border-gray-800 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-950">
                      {sLiveStreamServers.map((server, idx) => (
                        <div key={server.id || idx} className="flex items-center justify-between p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-[10px]">
                          <div>
                            <span className="font-extrabold text-gray-900 dark:text-white block">{server.name}</span>
                            <span className="text-[9px] text-gray-400 font-mono block truncate max-w-[200px]">{server.embedCode}</span>
                            {server.thumbnail && (
                              <span className="text-[8px] text-emerald-500 font-semibold block truncate max-w-[200px]">🖼️ থাম্বনেইল: {server.thumbnail}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => setSLiveStreamServers(prev => prev.filter((_, sIdx) => sIdx !== idx))}
                            className="p-1 text-rose-600 hover:bg-rose-50 rounded cursor-pointer"
                          >
                            <Trash2 size={11} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-3 bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-gray-500 block">নতুন সার্ভার যোগ করুন:</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="সার্ভার নাম (যেমন: Server 2, Direct Link)"
                        value={newServerName}
                        onChange={(e) => setNewServerName(e.target.value)}
                        className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1.5 text-[10px]"
                      />
                      <input
                        type="text"
                        placeholder="ইউটিউব লিংক / আইফ্রেম / ভিডিও URL"
                        value={newServerEmbed}
                        onChange={(e) => setNewServerEmbed(e.target.value)}
                        className="w-full border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1.5 text-[10px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-bold text-gray-500 block">সার্ভার থাম্বনেইল ইমেজ (ঐচ্ছিক):</span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="https://... অথবা গ্যালারি থেকে সিলেক্ট করুন"
                          value={newServerThumbnail}
                          onChange={(e) => setNewServerThumbnail(e.target.value)}
                          className="flex-1 border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-lg px-2.5 py-1 text-[10px] text-gray-950 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => handleOpenGallery("image", "live_stream_server_new_thumbnail")}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer flex items-center gap-1 shrink-0 text-[10px]"
                        >
                          <Upload size={10} /> গ্যালারি
                        </button>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        if (!newServerName || !newServerEmbed) {
                          alert("দয়া করে সার্ভার নাম ও এমবেড কোড উভয়ই প্রদান করুন।");
                          return;
                        }
                        const id = `server_${Date.now()}`;
                        setSLiveStreamServers(prev => [...prev, { id, name: newServerName, embedCode: newServerEmbed, thumbnail: newServerThumbnail }]);
                        setNewServerName("");
                        setNewServerEmbed("");
                        setNewServerThumbnail("");
                      }}
                      className="w-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 py-1.5 rounded-lg font-bold text-[10px] transition-colors cursor-pointer"
                    >
                      + সার্ভার যুক্ত করুন
                    </button>
                  </div>
                </div>
              </div>

              {/* Sticky Bottom Notice Banner Settings */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-gray-800">
                  <h4 className="font-extrabold text-xs text-rose-600 uppercase flex items-center gap-1.5 font-bold">
                    📢 স্টিকি বটম নোটিশ ব্যানার সেটিংস
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("bottomBanner", "স্টিকি ব্যানার নোটিশ সেটিংস")}
                    disabled={savingSection !== null}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      savedSection === "bottomBanner"
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : savingSection === "bottomBanner"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait"
                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
                    }`}
                  >
                    {savingSection === "bottomBanner" ? (
                      <>
                        <span className="w-2.5 h-2.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : savedSection === "bottomBanner" ? (
                      <>
                        <Check size={11} />
                        সংরক্ষিত!
                      </>
                    ) : (
                      <>
                        <CheckCircle size={11} />
                        সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 bg-indigo-50/5 rounded-xl border border-indigo-500/10">
                  <div>
                    <label className="text-xs font-black text-indigo-700 dark:text-indigo-400 block">স্টিকি ব্যানার নোটিশ সক্রিয়</label>
                    <span className="text-[10px] text-gray-400 block mt-0.5">ওয়েবসাইটের নিচে স্টিকি নোটিশ ব্যানার প্রদর্শন করুন</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sBottomBannerEnabled}
                    onChange={(e) => setSBottomBannerEnabled(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">স্টিকি ব্যানার নোটিশের লেখা</label>
                  <textarea
                    rows={2}
                    value={sBottomBannerText}
                    onChange={(e) => setSBottomBannerText(e.target.value)}
                    placeholder="যেমন: লাইভ আইপিএল ২০২৬ ম্যাচ আজ সন্ধ্যা ৭টায়! সম্পূর্ণ ফ্রিতে উপভোগ করুন।"
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-950 dark:text-gray-50"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">বাটন টেক্সট (Button Text)</label>
                    <input
                      type="text"
                      value={sBottomBannerBtnText}
                      onChange={(e) => setSBottomBannerBtnText(e.target.value)}
                      placeholder="যেমন: লাইভ দেখুন"
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-950 dark:text-gray-50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600 dark:text-gray-400">বাটন লিংক (Button Link - e.g. /live)</label>
                    <input
                      type="text"
                      value={sBottomBannerLink}
                      onChange={(e) => setSBottomBannerLink(e.target.value)}
                      placeholder="যেমন: /live"
                      className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3.5 py-2 text-xs font-bold text-gray-950 dark:text-gray-50 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Settings */}
              <div className="p-5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-gray-50 dark:border-gray-800">
                  <h4 className="font-extrabold text-xs text-rose-600 uppercase flex items-center gap-1.5 font-bold">
                    💳 পেমেন্ট গেটওয়ে সেটিংস
                  </h4>
                  <button
                    type="button"
                    onClick={() => handleSaveSection("payment", "পেমেন্ট গেটওয়ে সেটিংস")}
                    disabled={savingSection !== null}
                    className={`px-3 py-1.5 rounded-xl font-bold text-[10px] transition-all duration-200 cursor-pointer flex items-center gap-1.5 shadow-sm ${
                      savedSection === "payment"
                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                        : savingSection === "payment"
                        ? "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-wait"
                        : "bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-600"
                    }`}
                  >
                    {savingSection === "payment" ? (
                      <>
                        <span className="w-2.5 h-2.5 border-2 border-indigo-600 dark:border-indigo-400 border-t-transparent rounded-full animate-spin" />
                        সংরক্ষণ হচ্ছে...
                      </>
                    ) : savedSection === "payment" ? (
                      <>
                        <Check size={11} />
                        সংরক্ষিত!
                      </>
                    ) : (
                      <>
                        <CheckCircle size={11} />
                        সংরক্ষণ করুন
                      </>
                    )}
                  </button>
                </div>

                <div className="space-y-4 bg-gray-50/50 dark:bg-gray-950/20 p-4 rounded-2xl border border-gray-150 dark:border-gray-800">
                  {/* bKash */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-850 pb-1.5">
                      <span className="w-2 h-2 rounded-full bg-pink-500" />
                      <span className="text-xs font-black text-gray-900 dark:text-white">বিকাশ (bKash) কনফিগারেশন</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 block">বিকাশ নাম্বার</label>
                        <input
                          type="text"
                          value={sPaymentBkashNumber}
                          onChange={(e) => setSPaymentBkashNumber(e.target.value)}
                          placeholder="যেমন: 01777-112233"
                          className="w-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-bold font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 block">নাম্বারের ধরন (Type)</label>
                        <select
                          value={sPaymentBkashType}
                          onChange={(e) => setSPaymentBkashType(e.target.value)}
                          className="w-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-bold"
                        >
                          <option value="Personal">Personal</option>
                          <option value="Agent">Agent</option>
                          <option value="Personal Send Money">Personal Send Money</option>
                          <option value="Personal Cash In / Send Money">Personal Cash In / Send Money</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 block">বিকাশ লোগো URL</label>
                        <input
                          type="text"
                          value={sPaymentBkashLogo}
                          onChange={(e) => setSPaymentBkashLogo(e.target.value)}
                          className="w-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Nagad */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-850 pb-1.5">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      <span className="text-xs font-black text-gray-900 dark:text-white">নগদ (Nagad) কনফিগারেশন</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 block">নগদ নাম্বার</label>
                        <input
                          type="text"
                          value={sPaymentNagadNumber}
                          onChange={(e) => setSPaymentNagadNumber(e.target.value)}
                          placeholder="যেমন: 01999-445566"
                          className="w-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-bold font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 block">নাম্বারের ধরন (Type)</label>
                        <select
                          value={sPaymentNagadType}
                          onChange={(e) => setSPaymentNagadType(e.target.value)}
                          className="w-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-bold"
                        >
                          <option value="Personal">Personal</option>
                          <option value="Agent">Agent</option>
                          <option value="Merchant">Merchant</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 block">নগদ লোগো URL</label>
                        <input
                          type="text"
                          value={sPaymentNagadLogo}
                          onChange={(e) => setSPaymentNagadLogo(e.target.value)}
                          className="w-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rocket */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-850 pb-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-600" />
                      <span className="text-xs font-black text-gray-900 dark:text-white">রকেট (Rocket) কনফিগারেশন</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 block">রকেট নাম্বার</label>
                        <input
                          type="text"
                          value={sPaymentRocketNumber}
                          onChange={(e) => setSPaymentRocketNumber(e.target.value)}
                          placeholder="যেমন: 01888-778899"
                          className="w-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-bold font-mono"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 block">নাম্বারের ধরন (Type)</label>
                        <select
                          value={sPaymentRocketType}
                          onChange={(e) => setSPaymentRocketType(e.target.value)}
                          className="w-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-bold"
                        >
                          <option value="Personal">Personal</option>
                          <option value="Agent">Agent</option>
                          <option value="Merchant">Merchant</option>
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-500 block">রকেট লোগো URL</label>
                        <input
                          type="text"
                          value={sPaymentRocketLogo}
                          onChange={(e) => setSPaymentRocketLogo(e.target.value)}
                          className="w-full border border-gray-250 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}

      {/* Ads Create/Edit Modal */}
      {showAdModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 w-full max-w-xl space-y-4">
            <h3 className="text-lg font-black text-gray-900 dark:text-white">
              {editingAd ? "বিজ্ঞাপন ক্যাম্পেইন সম্পাদনা" : "নতুন বিজ্ঞাপন ক্যাম্পেইন যোগ করুন"}
            </h3>

            <form onSubmit={handleAdSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">বিজ্ঞাপন ক্যাম্পেইন নাম</label>
                  <input
                    type="text"
                    required
                    value={aName}
                    onChange={(e) => setAName(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">বিজ্ঞাপন প্লেসমেন্ট (Placement)</label>
                  <select
                    value={aPlacement}
                    onChange={(e) => setAPlacement(e.target.value as any)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-bold"
                  >
                    <option value="header">Header Banner Ads</option>
                    <option value="sidebar">Sidebar Ads Space</option>
                    <option value="sticky">Sticky Bottom Footer</option>
                    <option value="footer">Footer Banner</option>
                    <option value="banner_320_50">Banner 320x50 Spot</option>
                    <option value="native_banner">Native Banner Block</option>
                    <option value="smartlink">Smartlink (Direct URL / Promo)</option>
                    <option value="social_bar">Social Bar (Floating Notice)</option>
                    <option value="popunder">Popunder Advertisement</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">টার্গেটেড ডিভাইস</label>
                  <select
                    value={aDevices}
                    onChange={(e) => setADevices(e.target.value as any)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                  >
                    <option value="both">All Devices (Both)</option>
                    <option value="mobile">Mobile Only</option>
                    <option value="desktop">Desktop Only</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">শুরুর তারিখ</label>
                  <input
                    type="date"
                    value={aStartDate}
                    onChange={(e) => setAStartDate(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">শেষের তারিখ</label>
                  <input
                    type="date"
                    value={aEndDate}
                    onChange={(e) => setAEndDate(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 dark:text-gray-400">বিজ্ঞাপন HTML/JS কোড (Direct AdSense or Custom HTML code)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="<div class='bg-yellow-100 p-4 rounded-xl'>আমাদের স্পন্সর বিজ্ঞাপন দেখুন...</div>"
                  value={aCode}
                  onChange={(e) => setACode(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 font-bold text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={aEnabled}
                  onChange={(e) => setAEnabled(e.target.checked)}
                  className="rounded text-indigo-600"
                />
                <label>এই বিজ্ঞাপন ক্যাম্পেইনটি সরাসরি লাইভ সক্রিয় করুন (Enable)</label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setShowAdModal(false)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 rounded-xl transition-colors cursor-pointer shadow-md shadow-indigo-600/10"
                >
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User Role and Permission Management Modal */}
      {selectedRoleUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 w-full max-w-lg space-y-5 shadow-2xl relative overflow-hidden">
            
            <div className="text-center pt-2 pb-1">
              <div className="w-14 h-14 bg-gradient-to-tr from-purple-500 to-indigo-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-black shadow-lg shadow-purple-500/20 mb-3 uppercase">
                🛡️
              </div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                {selectedRoleUser.userName} এর পদবী ও পারমিশন পরিবর্তন
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">ইউজার আইডি: <span className="font-mono text-gray-500 dark:text-gray-300 font-semibold">{selectedRoleUser.id}</span></p>
            </div>

            <div className="space-y-4 text-xs">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <label className="font-bold text-gray-600 dark:text-gray-400">পদবী (Role) নির্বাচন করুন</label>
                <select
                  value={selectedRole}
                  onChange={(e) => {
                    const newRole = e.target.value as "user" | "admin" | "moderator";
                    setSelectedRole(newRole);
                    if (newRole === "admin") {
                      setSelectedPermissions(["dashboard", "videos", "categories", "comments", "payments", "ads", "users", "offers", "settings"]);
                    } else if (newRole === "user") {
                      setSelectedPermissions([]);
                    }
                  }}
                  className="w-full border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 dark:text-white"
                >
                  <option value="user">সাধারণ ইউজার (User)</option>
                  <option value="moderator">মডারেটর (Moderator)</option>
                  <option value="admin">অ্যাডমিন (Admin)</option>
                </select>
              </div>

              {/* Permissions List */}
              {selectedRole === "moderator" && (
                <div className="space-y-2 bg-purple-50/40 dark:bg-purple-950/10 p-4 border border-purple-100/40 dark:border-purple-900/20 rounded-2xl">
                  <label className="font-black text-purple-600 dark:text-purple-400 block mb-1">মডারেটর পারমিশন সমূহ (Permissions)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    {[
                      { id: "dashboard", name: "ড্যাশবোর্ড (Dashboard)" },
                      { id: "videos", name: "ভিডিও ডিরেক্টরি (Videos)" },
                      { id: "categories", name: "ক্যাটাগরি ম্যানেজমেন্ট (Categories)" },
                      { id: "comments", name: "মন্তব্য মডারেশন (Comments)" },
                      { id: "payments", name: "পেমেন্ট অ্যাক্টিভেশন (Payments)" },
                      { id: "ads", name: "অ্যাড ম্যানেজার (Ads)" },
                      { id: "users", name: "ইউজার লিস্ট (Users)" },
                      { id: "offers", name: "অফার ডিরেক্টরি (Offers)" },
                      { id: "settings", name: "ওয়েবসাইট সেটিংস (Settings)" }
                    ].map((perm) => (
                      <label key={perm.id} className="flex items-center gap-2 font-bold text-gray-700 dark:text-gray-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedPermissions.includes(perm.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedPermissions(prev => [...prev, perm.id]);
                            } else {
                              setSelectedPermissions(prev => prev.filter(p => p !== perm.id));
                            }
                          }}
                          className="rounded text-purple-600 focus:ring-purple-500"
                        />
                        <span>{perm.name}</span>
                      </label>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 font-medium">মডারেটর শুধুমাত্র নির্বাচিত ড্যাশবোর্ড অপশনগুলো অ্যাক্সেস করতে পারবেন।</p>
                </div>
              )}

              {selectedRole === "admin" && (
                <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-amber-600 dark:text-amber-400 font-bold text-[10px] leading-relaxed">
                  👑 অ্যাডমিন এর কাছে ওয়েবসাইটের সম্পূর্ণ নিয়ন্ত্রণ থাকবে। অ্যাডমিন সকল অপশন ও সেটিংস পরিবর্তন বা অ্যাক্সেস করতে পারবেন।
                </div>
              )}

              {selectedRole === "user" && (
                <div className="p-3 bg-gray-100 dark:bg-gray-800/40 rounded-2xl text-gray-500 dark:text-gray-400 font-bold text-[10px] leading-relaxed">
                  👤 সাধারণ ইউজার অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করতে পারবেন না।
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedRoleUser(null)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-2 rounded-xl transition-all cursor-pointer text-xs"
              >
                বাতিল
              </button>
              <button
                type="button"
                onClick={handleSaveUserRole}
                className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2 rounded-xl transition-all cursor-pointer text-xs shadow-md shadow-purple-600/10"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detailed User Profile View Modal */}
      {selectedProfileUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 w-full max-w-md space-y-5 shadow-2xl relative overflow-hidden">
            
            {/* Header / Banner */}
            <div className="text-center pt-2 pb-1">
              <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-rose-500 text-white rounded-full flex items-center justify-center mx-auto text-2xl font-black shadow-lg shadow-indigo-500/20 mb-3 uppercase">
                {selectedProfileUser.userName ? selectedProfileUser.userName.charAt(0) : "U"}
              </div>
              <h3 className="text-base font-black text-gray-900 dark:text-white">
                {selectedProfileUser.userName} এর বিস্তারিত প্রোফাইল
              </h3>
              <p className="text-[10px] text-gray-400 mt-1">ইউজার আইডি: <span className="font-mono text-gray-500 dark:text-gray-300 font-semibold">{selectedProfileUser.id}</span></p>
            </div>

            {/* Profile Grid Data */}
            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 bg-gray-50/50 dark:bg-gray-950/40 border border-gray-100 dark:border-gray-855 rounded-2xl space-y-2.5">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800/60">
                  <span className="text-gray-400 font-bold">ইউজারনেম</span>
                  <span className="text-gray-800 dark:text-gray-200 font-extrabold">{selectedProfileUser.userName}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800/60">
                  <span className="text-gray-400 font-bold">ইমেইল এড্রেস</span>
                  <span className="text-gray-800 dark:text-gray-200 font-bold">{selectedProfileUser.email}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-gray-800/60">
                  <span className="text-gray-400 font-bold">নিবন্ধন তারিখ</span>
                  <span className="text-gray-800 dark:text-gray-200 font-bold">
                    {selectedProfileUser.createdAt ? new Date(selectedProfileUser.createdAt).toLocaleString("bn-BD") : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-bold">একাউন্ট স্ট্যাটাস</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                      selectedProfileUser.status === "active"
                        ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400"
                        : "bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400"
                    }`}
                  >
                    {selectedProfileUser.status === "active" ? "সক্রিয় (Active)" : "নিষিদ্ধ (Banned)"}
                  </span>
                </div>
              </div>

              {/* Premium / Membership Box */}
              <div className="p-3.5 bg-rose-500/5 dark:bg-rose-500/10 border border-rose-100/50 dark:border-rose-950/40 rounded-2xl">
                <h4 className="text-[10px] uppercase font-extrabold tracking-wider text-rose-600 dark:text-rose-400 mb-2 flex items-center gap-1">
                  <Sparkles size={11} /> সাবস্ক্রিপশন ও প্রিমিয়াম মেয়াদ
                </h4>
                {selectedProfileUser.premiumUntil && new Date(selectedProfileUser.premiumUntil).getTime() > Date.now() ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">মেম্বারশিপ টাইপ:</span>
                      <span className="text-rose-600 dark:text-rose-400 font-black animate-pulse">প্রিমিয়াম গ্রাহক ⭐</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-500 dark:text-gray-400 font-medium">মেয়াদ শেষ হবে:</span>
                      <span className="text-gray-800 dark:text-gray-200 font-bold">
                        {new Date(selectedProfileUser.premiumUntil).toLocaleDateString("bn-BD")}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 dark:text-gray-400 font-medium">মেম্বারশিপ টাইপ:</span>
                    <span className="text-gray-400 font-bold">ফ্রি ইউজার (কোনো মেয়াদ নেই)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setSelectedProfileUser(null)}
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer text-center text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Media Gallery / Manager Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 w-full max-w-3xl max-h-[85vh] flex flex-col space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                  <ImageIcon size={18} className="text-indigo-600 dark:text-indigo-400" />
                  মিডিয়া গ্যালারি ও ফাইল ম্যানেজার
                </h3>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                  এখানে আপনি আপনার ছবি ও ভিডিও আপলোড এবং সিলেক্ট করতে পারবেন
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 rounded-2xl p-4 transition-colors text-center relative cursor-pointer">
              <input
                type="file"
                accept={galleryType === "video" ? "video/*" : galleryType === "image" ? "image/*" : "image/*,video/*"}
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={isUploading}
              />
              <div className="flex flex-col items-center justify-center space-y-1">
                <Upload size={24} className="text-gray-400 dark:text-gray-600" />
                <p className="text-xs font-bold text-gray-700 dark:text-gray-300">
                  {isUploading ? "ফাইল আপলোড হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন..." : "নতুন ফাইল আপলোড করতে এখানে ড্রাগ করুন বা ক্লিক করুন"}
                </p>
                <p className="text-[9px] text-gray-400 dark:text-gray-500">
                  {galleryType === "video" ? "শুধুমাত্র ভিডিও ফাইল (mp4, webm)" : galleryType === "image" ? "শুধুমাত্র ছবি (jpg, png, webp)" : "যেকোনো ছবি বা ভিডিও"}
                </p>
              </div>
            </div>

            {/* Gallery Items Grid */}
            <div className="flex-1 overflow-y-auto pr-1">
              {galleryFiles.filter(f => galleryType === "all" || f.type === galleryType).length === 0 ? (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                  কোনো {galleryType === "video" ? "ভিডিও" : galleryType === "image" ? "ছবি" : "ফাইল"} খুঁজে পাওয়া যায়নি। নতুন ফাইল আপলোড করুন।
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {galleryFiles
                    .filter(f => galleryType === "all" || f.type === galleryType)
                    .map((file, i) => {
                      const isImg = file.type === "image";
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            if (galleryTarget === "video_url") {
                              setVUrl(file.url);
                            } else if (galleryTarget === "video_thumbnail") {
                              setVThumbnail(file.url);
                            } else if (galleryTarget === "live_stream_default_thumbnail") {
                              setSLiveStreamThumbnail(file.url);
                            } else if (galleryTarget === "live_stream_server_new_thumbnail") {
                              setNewServerThumbnail(file.url);
                            } else {
                              if (galleryType === "video") {
                                setVUrl(file.url);
                              } else if (galleryType === "image") {
                                setVThumbnail(file.url);
                              } else {
                                navigator.clipboard.writeText(window.location.origin + file.url);
                                alert("ফাইল URL ক্লিপবোর্ডে কপি করা হয়েছে!");
                              }
                            }
                            setShowGalleryModal(false);
                          }}
                          className="group relative bg-gray-50 dark:bg-gray-950 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:border-indigo-500 transition-all aspect-video flex flex-col justify-between"
                        >
                          <div className="flex-1 flex items-center justify-center overflow-hidden bg-black/5 dark:bg-black/40">
                            {isImg ? (
                              <img
                                src={file.url || undefined}
                                alt={file.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="relative flex flex-col items-center text-indigo-500 dark:text-indigo-400">
                                <VideoIcon size={28} />
                                <span className="text-[8px] font-mono mt-1 font-bold">VIDEO</span>
                              </div>
                            )}
                          </div>
                          <div className="p-1.5 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-[9px] font-bold text-gray-700 dark:text-gray-300 truncate" title={file.name}>
                              {file.name.substring(file.name.indexOf("_") + 1)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100 dark:border-gray-800">
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold px-4 py-1.5 rounded-xl transition-colors cursor-pointer text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
