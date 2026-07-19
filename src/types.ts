export interface Category {
  slug: string;
  name: string;
  icon: string;
  image: string;
  subCategories?: { name: string; slug: string }[];
}

export interface VideoComment {
  id: string;
  userName: string;
  text: string;
  approved: boolean;
  createdAt: string;
  videoId?: string;
  videoTitle?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  subCategory?: string;
  tags: string[];
  language: string;
  duration: string;
  resolution: string;
  views: number;
  featured: boolean;
  trending: boolean;
  isPremium?: boolean;
  isLocked?: boolean;
  status: "publish" | "draft" | "scheduled";
  createdAt: string;
  comments: VideoComment[];
}

export interface Ad {
  id: string;
  name: string;
  type: string;
  placement: "header" | "sidebar" | "sticky" | "footer" | "banner" | "banner_320_50" | "native_banner" | "smartlink" | "social_bar" | "popunder";
  code: string;
  enabled: boolean;
  devices: "mobile" | "desktop" | "both";
  startDate?: string;
  endDate?: string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  btnText: string;
  points?: string;
  price?: string;
  durationDays?: number;
  status: "active" | "inactive";
  createdAt: string;
}

export interface WebsiteSettings {
  websiteName: string;
  logo: string;
  favicon: string;
  themeColor: string;
  contactEmail?: string;
  liveStreamIframe?: string;
  liveStreamThumbnail?: string;
  liveStreamEnabled?: boolean;
  liveStreamPremiumOnly?: boolean;
  liveStreamServers?: { id: string; name: string; embedCode: string; thumbnail?: string }[];
  bottomBannerEnabled?: boolean;
  bottomBannerText?: string;
  bottomBannerBtnText?: string;
  bottomBannerLink?: string;
  paymentBkashNumber?: string;
  paymentBkashType?: string;
  paymentBkashLogo?: string;
  paymentNagadNumber?: string;
  paymentNagadType?: string;
  paymentNagadLogo?: string;
  paymentRocketNumber?: string;
  paymentRocketType?: string;
  paymentRocketLogo?: string;
  loginPageTitle?: string;
  loginPageSubtitle?: string;
  registerPageTitle?: string;
  registerPageSubtitle?: string;
  languages?: string[];
  socialLinks?: {
    facebook?: string;
    youtube?: string;
    twitter?: string;
  };
  smtpConfig?: {
    host?: string;
    port?: string;
    user?: string;
    pass?: string;
  };
  seoSettings?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
  };
  analyticsConfig?: {
    googleAnalytics?: string;
    googleSearchConsole?: string;
  };
  adminUsername?: string;
  adminPassword?: string;
}

export interface LoginHistory {
  id: string;
  username: string;
  ip: string;
  browser: string;
  time: string;
  status: "success" | "failed";
}

export interface User {
  id: string;
  userName: string;
  email: string;
  status: "active" | "banned";
  isPremium?: boolean;
  premiumUntil?: string;
  createdAt: string;
  role?: "user" | "admin" | "moderator";
  permissions?: string[];
}

export interface PaymentRequest {
  id: string;
  userId?: string;
  userName: string;
  userEmail: string;
  packageId: string;
  packageName: string;
  price: string;
  gateway: "bkash" | "nagad" | "rocket";
  senderNumber: string;
  trxId: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}
