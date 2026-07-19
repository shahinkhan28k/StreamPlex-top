export interface TranslationKeys {
  // Navigation & Layout
  appName: string;
  home: string;
  liveTv: string;
  offers: string;
  categories: string;
  login: string;
  register: string;
  logout: string;
  profile: string;
  adminPanel: string;
  adminRoleLabel: string;
  moderatorRoleLabel: string;
  regularUserRoleLabel: string;
  searchPlaceholder: string;
  footerText: string;
  languageLabel: string;
  bangla: string;
  english: string;

  // Home Page
  featuredVideo: string;
  categoryLabel: string;
  durationLabel: string;
  resolutionLabel: string;
  watchNow: string;
  allCategories: string;
  allLanguages: string;
  allResolutions: string;
  latest: string;
  popular: string;
  filterBy: string;
  sortByLabel: string;
  totalVideos: string;
  prevPage: string;
  nextPage: string;
  pageOf: string;
  noVideosFound: string;
  liveLabel: string;
  liveDescription: string;
  extendedAdjectives: string[];
  extendedSuffixes: string[];

  // Video Details
  views: string;
  tags: string;
  comments: string;
  noComments: string;
  writeComment: string;
  nameLabel: string;
  commentLabel: string;
  submitComment: string;
  approvedComments: string;
  premiumLockedTitle: string;
  premiumLockedDesc: string;
  premiumLockedBtn: string;
  commentPending: string;
  deleteComment: string;
  commentsDisabled: string;

  // Live TV Page
  activeServers: string;
  switchServer: string;
  serverPremiumOnly: string;
  chatSection: string;
  chatPlaceholder: string;
  sendBtn: string;

  // Profile Page
  myProfile: string;
  username: string;
  email: string;
  premiumStatus: string;
  notPremium: string;
  premiumActive: string;
  premiumExpiry: string;
  pointsLabel: string;
  updateProfile: string;
  activeSubscriptions: string;
  noSubscriptions: string;
  paymentHistory: string;
  noPaymentHistory: string;
  gateway: string;
  senderNumber: string;
  trxId: string;
  status: string;
  date: string;
  pending: string;
  approved: string;
  rejected: string;
  package: string;
  price: string;
  profileUpdated: string;

  // Offers & Subscription Page
  offersTitle: string;
  offersSubtitle: string;
  pointsSection: string;
  availablePoints: string;
  claimOffer: string;
  alreadyPremium: string;
  insufficientPoints: string;
  claimedSuccess: string;
  premiumPackages: string;
  premiumPackagesDesc: string;
  buyNow: string;
  activeLabel: string;
  inactiveLabel: string;
  paymentModalTitle: string;
  paymentInstruction: string;
  paymentModalDesc: string;
  senderPhoneLabel: string;
  trxIdLabel: string;
  submitRequest: string;
  paymentSuccessMsg: string;
  paymentErrorMsg: string;
  closeBtn: string;

  // Login & Register Pages
  loginTitle: string;
  loginSubtitle: string;
  registerTitle: string;
  registerSubtitle: string;
  loginBtn: string;
  registerBtn: string;
  noAccount: string;
  hasAccount: string;
  invalidCredentials: string;
  loginSuccess: string;
  registerSuccess: string;

  // Admin Panel
  adminTitle: string;
  adminSubtitle: string;
  dashboard: string;
  videos: string;
  addVideo: string;
  editVideo: string;
  videoList: string;
  videoTitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  subCategoryLabel: string;
  tagsComma: string;
  featuredOption: string;
  trendingOption: string;
  premiumOption: string;
  publishStatus: string;
  draftStatus: string;
  scheduledStatus: string;
  saveVideo: string;
  actions: string;
  deleteBtn: string;
  editBtn: string;
  commentsTab: string;
  paymentsTab: string;
  adsTab: string;
  usersTab: string;
  offersTab: string;
  settingsTab: string;
  statsTotalVideos: string;
  statsTotalUsers: string;
  statsTotalEarnings: string;
  statsPendingPayments: string;
  recentActivity: string;
  welcomeAdmin: string;
  approveBtn: string;
  rejectBtn: string;
  adName: string;
  adPlacement: string;
  adCode: string;
  adStatus: string;
  enabledLabel: string;
  disabledLabel: string;
  userManagement: string;
  roleLabel: string;
  banUser: string;
  unbanUser: string;
  saveSettings: string;
  settingsSaved: string;
  detectedDuration: string;
  detectBtn: string;
  detectSuccess: string;
  detectError: string;
  bulkDelete: string;
  selectCategory: string;
  selectSubCategory: string;
}

export const translations: Record<"en" | "bn", TranslationKeys> = {
  en: {
    appName: "StreamPlex",
    home: "Home",
    liveTv: "Live TV",
    offers: "Offers",
    categories: "Categories",
    login: "Login",
    register: "Register",
    logout: "Logout",
    profile: "Profile",
    adminPanel: "Admin Panel",
    adminRoleLabel: "Admin 👑",
    moderatorRoleLabel: "Moderator 🛡️",
    regularUserRoleLabel: "Regular User 👤",
    searchPlaceholder: "Search movies, dramas, sports or comedy videos...",
    footerText: "StreamPlex © 2026 - All Rights Reserved.",
    languageLabel: "Language",
    bangla: "বাংলা (BN)",
    english: "English (EN)",

    // Home Page
    featuredVideo: "Featured Video",
    categoryLabel: "Category",
    durationLabel: "Duration",
    resolutionLabel: "Resolution",
    watchNow: "Watch Now",
    allCategories: "All Categories",
    allLanguages: "All Languages",
    allResolutions: "All Resolutions",
    latest: "Latest",
    popular: "Popular",
    filterBy: "Filter By",
    sortByLabel: "Sort By",
    totalVideos: "Total Videos",
    prevPage: "Previous",
    nextPage: "Next",
    pageOf: "Page {current} of {total}",
    noVideosFound: "No videos found matching your filters.",
    liveLabel: "LIVE",
    liveDescription: "Watch Live Sports & Entertainment",
    extendedAdjectives: ["Best", "New", "Awesome", "Exclusive", "Special", "Popular", "Superb Collection", "Blockbuster", "Epic", "Stunning", "Thrilling", "Mega", "Superhit", "Classic", "Amazing"],
    extendedSuffixes: ["Part 2", "HD", "New Episode", "Full Movie", "Special Edition", "Review", "Clip", "Short", "Uncut", "Special Release", "HD Quality"],

    // Video Details
    views: "views",
    tags: "Tags",
    comments: "Comments",
    noComments: "No comments yet. Be the first to share your thoughts!",
    writeComment: "Write a comment",
    nameLabel: "Your Name",
    commentLabel: "Comment Content",
    submitComment: "Post Comment",
    approvedComments: "Comments",
    premiumLockedTitle: "Premium Locked Content 🔒",
    premiumLockedDesc: "This video is exclusive to Premium subscribers. Buy a subscription package to access all premium content.",
    premiumLockedBtn: "Upgrade to Premium 👑",
    commentPending: "Your comment is submitted and pending admin approval.",
    deleteComment: "Delete",
    commentsDisabled: "Comments are disabled for this video.",

    // Live TV Page
    activeServers: "Active Live Servers",
    switchServer: "Switch Server",
    serverPremiumOnly: "This live server is exclusive to Premium members. Upgrade your account to enjoy uninterrupted live streaming.",
    chatSection: "Live Discussion",
    chatPlaceholder: "Say something...",
    sendBtn: "Send",

    // Profile Page
    myProfile: "My Profile",
    username: "Username",
    email: "Email Address",
    premiumStatus: "Premium Account",
    notPremium: "Free Member 👤",
    premiumActive: "Premium Member 👑",
    premiumExpiry: "Expires on: {date}",
    pointsLabel: "Earned Points",
    updateProfile: "Update Profile Info",
    activeSubscriptions: "Active Subscriptions",
    noSubscriptions: "No active subscriptions found.",
    paymentHistory: "Payment History",
    noPaymentHistory: "No billing/payment history found.",
    gateway: "Gateway",
    senderNumber: "Sender No",
    trxId: "Transaction ID",
    status: "Status",
    date: "Date",
    pending: "Pending ⏱️",
    approved: "Approved ✅",
    rejected: "Rejected ❌",
    package: "Package",
    price: "Price",
    profileUpdated: "Profile updated successfully!",

    // Offers & Subscription Page
    offersTitle: "Streamplex Rewards & Premium Packs",
    offersSubtitle: "Claim high-speed premium server access or exchange reward points for memberships",
    pointsSection: "Your Points",
    availablePoints: "Available Points",
    claimOffer: "Redeem with {points} Points",
    alreadyPremium: "Already Premium",
    insufficientPoints: "Insufficient points to claim this offer.",
    claimedSuccess: "Offer claimed successfully! Enjoy Premium access.",
    premiumPackages: "Premium Subscription Packages",
    premiumPackagesDesc: "Get premium fast servers, zero ads, and access to exclusive content.",
    buyNow: "Purchase Plan",
    activeLabel: "Active",
    inactiveLabel: "Inactive",
    paymentModalTitle: "Purchase {packageName}",
    paymentInstruction: "Please make a manual Payment to our bkash, Nagad or Rocket merchant number. Then submit the form below with your payment reference details.",
    paymentModalDesc: "Amount to Send: {price} Taka",
    senderPhoneLabel: "Your Sender Number",
    trxIdLabel: "TrxID (Transaction ID)",
    submitRequest: "Submit Payment Verification",
    paymentSuccessMsg: "Payment request submitted! Admin will verify and activate your premium status shortly.",
    paymentErrorMsg: "Please fill out all the payment fields correctly.",
    closeBtn: "Close",

    // Login & Register Pages
    loginTitle: "Admin & Member Login",
    loginSubtitle: "Sign in to access your dashboard, rewards, and play history.",
    registerTitle: "Create a Free Account",
    registerSubtitle: "Join Streamplex to earn reward points, comment, and save video playback.",
    loginBtn: "Sign In",
    registerBtn: "Create Account",
    noAccount: "Don't have an account yet?",
    hasAccount: "Already have an account?",
    invalidCredentials: "Invalid credentials. Please try again.",
    loginSuccess: "Successfully logged in!",
    registerSuccess: "Registration successful! Welcome to StreamPlex.",

    // Admin Panel
    adminTitle: "StreamPlex Management Hub",
    adminSubtitle: "Admin & Moderator Control Panel",
    dashboard: "Dashboard",
    videos: "Videos",
    addVideo: "Add New Video",
    editVideo: "Edit Video",
    videoList: "Video Catalog",
    videoTitle: "Video Title",
    videoUrl: "Video Source URL",
    thumbnailUrl: "Thumbnail URL",
    subCategoryLabel: "Sub-Category",
    tagsComma: "Tags (comma separated)",
    featuredOption: "Featured Slider (Hero)",
    trendingOption: "Trending Section",
    premiumOption: "Premium Only Content",
    publishStatus: "Published",
    draftStatus: "Draft",
    scheduledStatus: "Scheduled",
    saveVideo: "Save Video Details",
    actions: "Actions",
    deleteBtn: "Delete",
    editBtn: "Edit",
    commentsTab: "Comments Manager",
    paymentsTab: "Billing / Payments",
    adsTab: "Ad Placements",
    usersTab: "User Database",
    offersTab: "Rewards & Offers",
    settingsTab: "System Settings",
    statsTotalVideos: "Total Videos",
    statsTotalUsers: "Registered Users",
    statsTotalEarnings: "Estimated Earnings",
    statsPendingPayments: "Pending Approvals",
    recentActivity: "Recent System History",
    welcomeAdmin: "Welcome back, {name}! Standard system operations are normal.",
    approveBtn: "Approve ✅",
    rejectBtn: "Reject ❌",
    adName: "Campaign Name",
    adPlacement: "Placement Location",
    adCode: "Ad HTML/Script Code",
    adStatus: "Campaign Status",
    enabledLabel: "Enabled",
    disabledLabel: "Disabled",
    userManagement: "User Permissions",
    roleLabel: "User Role",
    banUser: "Ban User",
    unbanUser: "Unban User",
    saveSettings: "Save Configurations",
    settingsSaved: "All settings saved successfully!",
    detectedDuration: "Detected Video Duration",
    detectBtn: "Auto Detect Duration ⏱️",
    detectSuccess: "Video duration detected: {duration} ⏱️",
    detectError: "Could not auto-detect duration. CORS restrictions or invalid URL.",
    bulkDelete: "Bulk Action: Delete Selected",
    selectCategory: "Select Category",
    selectSubCategory: "Select Sub-Category"
  },
  bn: {
    appName: "স্ট্রীমপ্লেক্স",
    home: "হোম",
    liveTv: "লাইভ টিভি",
    offers: "অফার",
    categories: "ক্যাটাগরি সমূহ",
    login: "লগইন",
    register: "নিবন্ধন",
    logout: "লগআউট",
    profile: "প্রোফাইল",
    adminPanel: "অ্যাডমিন প্যানেল",
    adminRoleLabel: "অ্যাডমিন 👑",
    moderatorRoleLabel: "মডারেটর 🛡️",
    regularUserRoleLabel: "সাধারণ ইউজার 👤",
    searchPlaceholder: "আপনার প্রিয় মুভি, নাটক বা কমেডি ভিডিও খুঁজুন...",
    footerText: "স্ট্রীমপ্লেক্স © ২০২৬ - সর্বস্বত্ব সংরক্ষিত।",
    languageLabel: "ভাষা",
    bangla: "বাংলা (BN)",
    english: "English (EN)",

    // Home Page
    featuredVideo: "ফিচার্ড ভিডিও",
    categoryLabel: "ক্যাটাগরি",
    durationLabel: "সময়",
    resolutionLabel: "রেজোলিউশন",
    watchNow: "এখনই দেখুন",
    allCategories: "সকল ক্যাটাগরি",
    allLanguages: "সকল ভাষা",
    allResolutions: "সকল রেজোলিউশন",
    latest: "সর্বশেষ",
    popular: "জনপ্রিয়",
    filterBy: "ফিল্টার করুন",
    sortByLabel: "ক্রমানুসারে",
    totalVideos: "মোট ভিডিও সংখ্যা",
    prevPage: "পূর্ববর্তী",
    nextPage: "পরবর্তী",
    pageOf: "পৃষ্ঠা {current} এর {total}",
    noVideosFound: "আপনার ফিল্টারের সাথে মিল থাকা কোনো ভিডিও পাওয়া যায়নি।",
    liveLabel: "লাইভ",
    liveDescription: "লাইভ স্পোর্টস ও বিনোদন উপভোগ করুন",
    extendedAdjectives: ["সেরা", "নতুন", "দারুণ", "এক্সক্লুসিভ", "স্পেশাল", "পপুলার", "সেরা কালেকশন", "ব্লকবাস্টার", "এপিক", "মনোরম", "রোমাঞ্চকর", "মেগা", "সুপারহিট", "কালজয়ী", "অসাধারণ"],
    extendedSuffixes: ["পার্ট ২", "এইচডি", "নতুন পর্ব", "ফুল মুভি", "বিশেষ সংস্করণ", "রিভিউ", "ক্লিপ", "শর্টকাট", "আনকাট", "স্পেশাল রিলিজ", "এইচডি কোয়ালিটি"],

    // Video Details
    views: "বার দেখা হয়েছে",
    tags: "ট্যাগসমূহ",
    comments: "মন্তব্যসমূহ",
    noComments: "এখনো কোনো মন্তব্য নেই। আপনার মূল্যবান মন্তব্যটি প্রথম লিখুন!",
    writeComment: "একটি মন্তব্য লিখুন",
    nameLabel: "আপনার নাম",
    commentLabel: "মন্তব্যের বিষয়বস্তু",
    submitComment: "মন্তব্য পোস্ট করুন",
    approvedComments: "মন্তব্যসমূহ",
    premiumLockedTitle: "প্রিমিয়াম লকড কনটেন্ট 🔒",
    premiumLockedDesc: "এই ভিডিওটি শুধুমাত্র প্রিমিয়াম সাবস্ক্রাইবারদের জন্য। সকল প্রিমিয়াম কনটেন্ট দেখতে সাবস্ক্রিপশন প্যাকেজ কিনুন।",
    premiumLockedBtn: "প্রিমিয়াম সাবস্ক্রিপশন কিনুন 👑",
    commentPending: "আপনার মন্তব্যটি সফলভাবে জমা দেওয়া হয়েছে এবং অ্যাডমিন অনুমোদনের অপেক্ষায় আছে।",
    deleteComment: "মুছে ফেলুন",
    commentsDisabled: "এই ভিডিওর জন্য মন্তব্য বন্ধ করা আছে।",

    // Live TV Page
    activeServers: "সক্রিয় লাইভ সার্ভারসমূহ",
    switchServer: "সার্ভার পরিবর্তন",
    serverPremiumOnly: "এই লাইভ সার্ভারটি প্রিমিয়াম মেম্বারদের জন্য এক্সক্লুসিভ। নির্বিঘ্নে খেলা দেখতে আপনার অ্যাকাউন্ট আপগ্রেড করুন।",
    chatSection: "লাইভ আলোচনা",
    chatPlaceholder: "কিছু বলুন...",
    sendBtn: "পাঠান",

    // Profile Page
    myProfile: "আমার প্রোফাইল",
    username: "ইউজারনেম",
    email: "ইমেইল এড্রেস",
    premiumStatus: "প্রিমিয়াম অ্যাকাউন্ট",
    notPremium: "ফ্রি মেম্বার 👤",
    premiumActive: "প্রিমিয়াম মেম্বার 👑",
    premiumExpiry: "মেয়াদ শেষ হবে: {date}",
    pointsLabel: "অর্জিত পয়েন্ট",
    updateProfile: "প্রোফাইল তথ্য আপডেট করুন",
    activeSubscriptions: "সক্রিয় সাবস্ক্রিপশন",
    noSubscriptions: "কোনো সক্রিয় সাবস্ক্রিপশন পাওয়া যায়নি।",
    paymentHistory: "পেমেন্ট হিস্ট্রি",
    noPaymentHistory: "কোনো পেমেন্ট হিস্ট্রি পাওয়া যায়নি।",
    gateway: "গেটওয়ে",
    senderNumber: "প্রেরক নাম্বার",
    trxId: "ট্রানজেকশন আইডি",
    status: "অবস্থা",
    date: "তারিখ",
    pending: "অপেক্ষাধীন ⏱️",
    approved: "অনুমোদিত ✅",
    rejected: "প্রত্যাখ্যাত ❌",
    package: "প্যাকেজ",
    price: "মূল্য",
    profileUpdated: "প্রোফাইল সফলভাবে আপডেট করা হয়েছে!",

    // Offers & Subscription Page
    offersTitle: "স্ট্রীমপ্লেক্স রিওয়ার্ড ও প্রিমিয়াম প্যাক",
    offersSubtitle: "হাই-স্পীড প্রিমিয়াম সার্ভার অ্যাক্সেস পান বা পয়েন্ট এক্সচেঞ্জ করে মেম্বারশিপ নিন",
    pointsSection: "আপনার পয়েন্ট",
    availablePoints: "উপলব্ধ পয়েন্ট",
    claimOffer: "{points} পয়েন্ট দিয়ে এক্সচেঞ্জ করুন",
    alreadyPremium: "ইতিমধ্যে প্রিমিয়াম মেম্বার",
    insufficientPoints: "এই অফারটি নেওয়ার জন্য পর্যাপ্ত পয়েন্ট নেই।",
    claimedSuccess: "অফারটি সফলভাবে নেওয়া হয়েছে! প্রিমিয়াম সার্ভিস উপভোগ করুন।",
    premiumPackages: "প্রিমিয়াম সাবস্ক্রিপশন প্যাকেজসমূহ",
    premiumPackagesDesc: "পান হাই-স্পীড বিজ্ঞাপন মুক্ত সার্ভার এবং এক্সক্লুসিভ সকল ভিডিও কনটেন্ট দেখার সুবিধা।",
    buyNow: "প্যাকেজটি কিনুন",
    activeLabel: "সক্রিয়",
    inactiveLabel: "নিষ্ক্রিয়",
    paymentModalTitle: "{packageName} প্যাকেজটি কিনুন",
    paymentInstruction: "আমাদের বিকাশ, নগদ বা রকেট মার্চেন্ট নাম্বারে ম্যানুয়াল পেমেন্ট বা সেন্ড মানি করুন। এরপর নিচের ফর্মটি পূরণ করে সাবমিট করুন।",
    paymentModalDesc: "পাঠানোর পরিমাণ: {price} টাকা",
    senderPhoneLabel: "আপনার প্রেরক নাম্বার (যে নাম্বার থেকে টাকা পাঠিয়েছেন)",
    trxIdLabel: "ট্রানজেকশন আইডি (TrxID)",
    submitRequest: "পেমেন্ট ভেরিফিকেশন রিকোয়েস্ট পাঠান",
    paymentSuccessMsg: "আপনার পেমেন্ট রিকোয়েস্ট জমা হয়েছে! অ্যাডমিন যাচাই করে দ্রুত অ্যাকাউন্ট প্রিমিয়াম করে দেবে।",
    paymentErrorMsg: "অনুগ্রহ করে পেমেন্ট ফর্মের সকল তথ্য সঠিকভাবে পূরণ করুন।",
    closeBtn: "বন্ধ করুন",

    // Login & Register Pages
    loginTitle: "অ্যাডমিন ও মেম্বার লগইন",
    loginSubtitle: "আপনার ড্যাশবোর্ড, রিওয়ার্ড এবং প্লে হিস্ট্রি দেখতে লগইন করুন।",
    registerTitle: "একটি নতুন অ্যাকাউন্ট তৈরি করুন",
    registerSubtitle: "স্ট্রীমপ্লেক্স-এ যোগ দিয়ে রিওয়ার্ড পয়েন্ট অর্জন করুন, মন্তব্য করুন ও ভিডিও সেভ করুন।",
    loginBtn: "লগইন করুন",
    registerBtn: "অ্যাকাউন্ট তৈরি করুন",
    noAccount: "এখনো অ্যাকাউন্ট নেই?",
    hasAccount: "ইতিমধ্যে অ্যাকাউন্ট আছে?",
    invalidCredentials: "ভুল ইউজারনেম বা পাসওয়ার্ড। আবার চেষ্টা করুন।",
    loginSuccess: "সফলভাবে লগইন করা হয়েছে!",
    registerSuccess: "নিবন্ধন সফল হয়েছে! স্ট্রীমপ্লেক্স-এ আপনাকে স্বাগতম।",

    // Admin Panel
    adminTitle: "স্ট্রীমপ্লেক্স ম্যানেজমেন্ট হাব",
    adminSubtitle: "অ্যাডমিন ও মডারেটর কন্ট্রোল প্যানেল",
    dashboard: "ড্যাশবোর্ড",
    videos: "ভিডিও সমূহ",
    addVideo: "নতুন ভিডিও যুক্ত করুন",
    editVideo: "ভিডিও এডিট করুন",
    videoList: "ভিডিও ক্যাটালগ",
    videoTitle: "ভিডিওর শিরোনাম",
    videoUrl: "ভিডিও সোর্স URL",
    thumbnailUrl: "থাম্বনেইল URL",
    subCategoryLabel: "সাব-ক্যাটাগরি",
    tagsComma: "ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)",
    featuredOption: "ফিচার্ড স্লাইডার (হিরো ব্যানার)",
    trendingOption: "ট্রেন্ডিং সেকশনে দেখান",
    premiumOption: "শুধুমাত্র প্রিমিয়াম কনটেন্ট",
    publishStatus: "পাবলিশড",
    draftStatus: "ড্রাফট",
    scheduledStatus: "শিডিউলড",
    saveVideo: "ভিডিওর তথ্য সংরক্ষণ করুন",
    actions: "অ্যাকশন",
    deleteBtn: "মুছে ফেলুন",
    editBtn: "এডিট",
    commentsTab: "মন্তব্য ম্যানেজার",
    paymentsTab: "বিলিং ও পেমেন্টস",
    adsTab: "বিজ্ঞাপন প্লেসমেন্ট",
    usersTab: "ইউজার ডাটাবেজ",
    offersTab: "রিওয়ার্ড ও অফার্স",
    settingsTab: "সিস্টেম সেটিংস",
    statsTotalVideos: "মোট ভিডিও",
    statsTotalUsers: "নিবন্ধিত ইউজার",
    statsTotalEarnings: "আনুমানিক আয়",
    statsPendingPayments: "অনুমোদনের অপেক্ষায়",
    recentActivity: "সাম্প্রতিক সিস্টেম হিস্ট্রি",
    welcomeAdmin: "স্বাগতম, {name}! সিস্টেমের স্বাভাবিক কার্যক্রম সচল রয়েছে।",
    approveBtn: "অনুমোদন করুন ✅",
    rejectBtn: "প্রত্যাখ্যান করুন ❌",
    adName: "ক্যাম্পেইন নাম",
    adPlacement: "বিজ্ঞাপন প্লেসমেন্ট অবস্থান",
    adCode: "বিজ্ঞাপন HTML/স্ক্রিপ্ট কোড",
    adStatus: "বিজ্ঞাপন স্ট্যাটাস",
    enabledLabel: "সক্রিয়",
    disabledLabel: "নিষ্ক্রিয়",
    userManagement: "ইউজার পারমিশন",
    roleLabel: "ইউজারের রোল",
    banUser: "ব্যান করুন",
    unbanUser: "আনব্যান করুন",
    saveSettings: "কনফিগারেশন সংরক্ষণ করুন",
    settingsSaved: "সকল সেটিংস সফলভাবে সংরক্ষণ করা হয়েছে!",
    detectedDuration: "শনাক্তকৃত ভিডিও সময়কাল",
    detectBtn: "সময়কাল স্বয়ংক্রিয় শনাক্ত করুন ⏱️",
    detectSuccess: "ভিডিও সময়কাল শনাক্ত করা হয়েছে: {duration} ⏱️",
    detectError: "ভিডিও সময়কাল শনাক্ত করা যায়নি। CORS বা অবৈধ লিঙ্ক হতে পারে।",
    bulkDelete: "বাল্ক অ্যাকশন: সিলেক্টেড ভিডিও ডিলিট",
    selectCategory: "ক্যাটাগরি সিলেক্ট করুন",
    selectSubCategory: "সাব-ক্যাটাগরি সিলেক্ট করুন"
  }
};
