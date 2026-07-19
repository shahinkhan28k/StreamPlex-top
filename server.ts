import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DB_PATH = path.join(process.cwd(), "db.json");

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Custom CORS Middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure db.json exists on launch
if (!fs.existsSync(DB_PATH)) {
  const initialDb = {
    categories: [],
    videos: [],
    ads: [],
    settings: {
      websiteName: "StreamPlex",
      logo: "StreamPlex",
      favicon: "🎥",
      themeColor: "indigo",
      liveStreamIframe: '<iframe src="https://www.youtube.com/embed/live_stream?channel=UCGF8Yn2LpvsffuEOn69e3Yg" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>',
      liveStreamEnabled: true,
      loginPageTitle: "স্ট্রীমপ্লেক্স একাউন্ট লগইন",
      loginPageSubtitle: "আপনার প্রিয় লাইভ স্পোর্টস, নাটক ও বিনোদন উপভোগ করতে লগইন করুন।",
      registerPageTitle: "নতুন একাউন্ট তৈরি করুন",
      registerPageSubtitle: "একাউন্ট তৈরি করে আনলক করুন হাজারো প্রিমিয়াম ভিডিও কনটেন্ট।"
    },
    users: [],
    loginHistory: [],
    offers: []
  };
  fs.writeFileSync(DB_PATH, JSON.stringify(initialDb, null, 2));
}

// Database Helper
function readDb() {
  try {
    const raw = fs.readFileSync(DB_PATH, "utf-8");
    const data = JSON.parse(raw);
    if (!data.offers) data.offers = [];
    if (!data.payments) data.payments = [];
    if (!data.settings) data.settings = {};
    if (data.settings.liveStreamPremiumOnly === undefined) {
      data.settings.liveStreamPremiumOnly = false;
    }
    if (!data.settings.liveStreamServers) {
      data.settings.liveStreamServers = [
        {
          id: "srv_1",
          name: "সার্ভার ১ (YouTube Live)",
          embedCode: '<iframe src="https://www.youtube.com/embed/live_stream?channel=UCGF8Yn2LpvsffuEOn69e3Yg" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>'
        },
        {
          id: "srv_2",
          name: "সার্ভার ২ (T Sports Direct)",
          embedCode: '<iframe src="https://www.youtube.com/embed/S_8q0gV_W-E" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>'
        }
      ];
    }
    if (!data.settings.liveStreamIframe) {
      data.settings.liveStreamIframe = '<iframe src="https://www.youtube.com/embed/live_stream?channel=UCGF8Yn2LpvsffuEOn69e3Yg" width="100%" height="100%" frameborder="0" allowfullscreen></iframe>';
      data.settings.liveStreamEnabled = true;
    }
    if (!data.settings.loginPageTitle) {
      data.settings.loginPageTitle = "স্ট্রীমপ্লেক্স একাউন লগইন";
      data.settings.loginPageSubtitle = "আপনার প্রিয় লাইভ স্পোর্টস, নাটক ও বিনোদন উপভোগ করতে লগইন করুন।";
      data.settings.registerPageTitle = "নতুন একাউন্ট তৈরি করুন";
      data.settings.registerPageSubtitle = "একাউন্ট তৈরি করে আনলক করুন হাজারো প্রিমিয়াম ভিডিও কনটেন্ট।";
    }
    if (data.settings.paymentBkashNumber === undefined) {
      data.settings.paymentBkashNumber = "01777-112233";
      data.settings.paymentBkashType = "Personal";
      data.settings.paymentBkashLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bkash_logo_without_text.svg/512px-Bkash_logo_without_text.svg.png";
    }
    if (data.settings.paymentNagadNumber === undefined) {
      data.settings.paymentNagadNumber = "01999-445566";
      data.settings.paymentNagadType = "Personal";
      data.settings.paymentNagadLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nagad_logo.svg/512px-Nagad_logo.svg.png";
    }
    if (data.settings.paymentRocketNumber === undefined) {
      data.settings.paymentRocketNumber = "01888-778899";
      data.settings.paymentRocketType = "Personal";
      data.settings.paymentRocketLogo = "https://upload.wikimedia.org/wikipedia/commons/e/ea/DBBL_Rocket_Logo.svg";
    }
    if (data.settings.bottomBannerEnabled === undefined) {
      data.settings.bottomBannerEnabled = true;
    }
    if (!data.settings.bottomBannerText) {
      data.settings.bottomBannerText = "লাইভ আইপিএল ২০২৬ ম্যাচ আজ সন্ধ্যা ৭টায়! সম্পূর্ণ ফ্রিতে উপভোগ করুন।";
    }
    if (!data.settings.bottomBannerBtnText) {
      data.settings.bottomBannerBtnText = "লাইভ দেখুন";
    }
    if (!data.settings.bottomBannerLink) {
      data.settings.bottomBannerLink = "/live";
    }

    // Seed default premium offers if empty
    if (data.offers.length === 0) {
      data.offers = [
        {
          id: "off_premium_monthly",
          title: "মাসিক প্রিমিয়াম পাস (Monthly Premium Pass)",
          description: "৩০ দিন মেয়াদে সমস্ত লাইভ স্পোর্টস ও প্রিমিয়াম ভিডিও বিজ্ঞাপনহীন এইচডি কোয়ালিটিতে উপভোগ করুন। বিকাশ, নগদ বা রকেট দিয়ে পেমেন্ট করুন।",
          image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600",
          link: "#",
          btnText: "প্রিমিয়াম পাস কিনুন ⚡",
          points: "১ মাস মেয়াদ",
          price: "৯৯ টাকা",
          status: "active",
          createdAt: new Date().toISOString()
        },
        {
          id: "off_premium_yearly",
          title: "বার্ষিক প্রিমিয়াম পাস (Yearly Premium Pass)",
          description: "১ বছর মেয়াদে সমস্ত লাইভ স্পোর্টস এবং আনলিমিটেড প্রিমিয়াম মুভি ও নাটক কোনো বিজ্ঞাপন ছাড়াই ফুল এইচডি-তে উপভোগ করুন।",
          image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600",
          link: "#",
          btnText: "প্রিমিয়াম পাস কিনুন ⚡",
          points: "১২ মাস মেয়াদ (ডিসকাউন্ট)",
          price: "৩০০ টাকা",
          status: "active",
          createdAt: new Date().toISOString()
        }
      ];
    }
    return data;
  } catch (e) {
    console.error("Error reading database", e);
    return {
      categories: [],
      videos: [],
      ads: [],
      settings: {
        websiteName: "StreamPlex",
        logo: "StreamPlex",
        favicon: "🎥",
        themeColor: "indigo",
        liveStreamIframe: "",
        liveStreamEnabled: false,
        liveStreamPremiumOnly: false,
        liveStreamServers: []
      },
      users: [],
      loginHistory: [],
      offers: [],
      payments: []
    };
  }
}

function writeDb(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error writing to database", e);
  }
}

// API Routes

// Admin Authentication
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;
  const db = readDb();
  
  // 1. Check Super Admin
  const targetUsername = db.settings?.adminUsername || "admin";
  const targetPassword = db.settings?.adminPassword || "adminpassword";

  if (username === targetUsername && password === targetPassword) {
    const newHistory = {
      id: "lh_" + Date.now(),
      username: targetUsername,
      ip: req.ip || "127.0.0.1",
      browser: req.headers["user-agent"] || "Unknown Browser",
      time: new Date().toISOString(),
      status: "success"
    };
    db.loginHistory = [newHistory, ...(db.loginHistory || [])];
    writeDb(db);

    return res.json({ 
      success: true, 
      token: "admin_jwt_session_token_2026", 
      role: "admin", 
      permissions: ["dashboard", "videos", "categories", "comments", "payments", "ads", "users", "offers", "settings"] 
    });
  }
  
  // 2. Check Database Users with admin/moderator roles
  let user = db.users?.find((u: any) => 
    (u.userName?.toLowerCase() === username?.toLowerCase() || u.email?.toLowerCase() === username?.toLowerCase()) &&
    (u.role === "admin" || u.role === "moderator")
  );

  const adminEmails = ["shahinkhan28r@gmail.com", "shahinkhan28uu@gmail.com", "shahinkhan28ddd@gmail.com"];
  if (!user && username && adminEmails.includes(username.toLowerCase())) {
    user = {
      id: "u_fallback_admin_" + Date.now(),
      userName: username.split("@")[0],
      email: username,
      role: "admin",
      permissions: ["dashboard", "videos", "categories", "comments", "payments", "ads", "users", "offers", "settings"]
    };
  }

  if (user) {
    const newHistory = {
      id: "lh_" + Date.now(),
      username: user.userName,
      ip: req.ip || "127.0.0.1",
      browser: req.headers["user-agent"] || "Unknown Browser",
      time: new Date().toISOString(),
      status: "success"
    };
    db.loginHistory = [newHistory, ...(db.loginHistory || [])];
    writeDb(db);

    return res.json({
      success: true,
      token: "admin_token_" + user.id,
      role: user.role,
      permissions: user.role === "admin" 
        ? ["dashboard", "videos", "categories", "comments", "payments", "ads", "users", "offers", "settings"]
        : (user.permissions || [])
    });
  }

  // Failed Login History
  const newHistory = {
    id: "lh_" + Date.now(),
    username: username || "unknown",
    ip: req.ip || "127.0.0.1",
    browser: req.headers["user-agent"] || "Unknown Browser",
    time: new Date().toISOString(),
    status: "failed"
  };
  db.loginHistory = [newHistory, ...(db.loginHistory || [])];
  writeDb(db);

  res.status(401).json({ success: false, message: "অবৈধ ইউজারনেম অথবা পাসওয়ার্ড!" });
});

app.get("/api/admin/history", (req, res) => {
  const db = readDb();
  res.json(db.loginHistory || []);
});

// Settings Management
app.get("/api/settings", (req, res) => {
  const db = readDb();
  res.json(db.settings || {});
});

app.put("/api/settings", (req, res) => {
  const db = readDb();
  db.settings = { ...db.settings, ...req.body };
  writeDb(db);
  res.json({ success: true, settings: db.settings });
});

// Categories Management
app.get("/api/categories", (req, res) => {
  const db = readDb();
  res.json(db.categories || []);
});

app.post("/api/categories", (req, res) => {
  const db = readDb();
  const { name, slug, icon, image, subCategories } = req.body;
  
  if (!name || !slug) {
    return res.status(400).json({ error: "ক্যাটাগরির নাম ও স্ল্যাগ প্রয়োজন।" });
  }

  const exists = db.categories.some((c: any) => c.slug === slug);
  if (exists) {
    return res.status(400).json({ error: "এই স্ল্যাগের ক্যাটাগরি ইতিমধ্যে তৈরি আছে।" });
  }

  const newCategory = { 
    name, 
    slug: slug.toLowerCase(), 
    icon: icon || "Tv", 
    image: image || "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600",
    subCategories: subCategories || []
  };
  db.categories.push(newCategory);
  writeDb(db);
  res.status(201).json(newCategory);
});

app.put("/api/categories/:slug", (req, res) => {
  const db = readDb();
  const { slug } = req.params;
  const { name, icon, image, subCategories } = req.body;

  const idx = db.categories.findIndex((c: any) => c.slug === slug);
  if (idx === -1) {
    return res.status(404).json({ error: "ক্যাটাগরি পাওয়া যায়নি।" });
  }

  db.categories[idx] = { ...db.categories[idx], name, icon, image, subCategories: subCategories || [] };
  writeDb(db);
  res.json(db.categories[idx]);
});

app.delete("/api/categories/:slug", (req, res) => {
  const db = readDb();
  const { slug } = req.params;
  db.categories = db.categories.filter((c: any) => c.slug !== slug);
  writeDb(db);
  res.json({ success: true });
});

// Videos Management
app.get("/api/videos", (req, res) => {
  const db = readDb();
  res.json(db.videos || []);
});

app.get("/api/videos/:id", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const video = db.videos.find((v: any) => v.id === id);
  if (!video) {
    return res.status(404).json({ error: "ভিডিও পাওয়া যায়নি।" });
  }
  // Increment Views
  video.views = (video.views || 0) + 1;
  writeDb(db);
  res.json(video);
});

app.post("/api/videos", (req, res) => {
  const db = readDb();
  const videoData = req.body;
  const newVideo = {
    id: "v_" + Date.now(),
    title: videoData.title || "Untitled Video",
    description: videoData.description || "",
    videoUrl: videoData.videoUrl || "",
    thumbnailUrl: videoData.thumbnailUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800",
    category: videoData.category || "movies",
    subCategory: videoData.subCategory || "",
    tags: Array.isArray(videoData.tags) ? videoData.tags : (videoData.tags ? videoData.tags.split(",").map((t: string) => t.trim()) : []),
    language: videoData.language || "Bengali",
    duration: videoData.duration || "0:00",
    resolution: videoData.resolution || "1080p",
    featured: !!videoData.featured,
    trending: !!videoData.trending,
    isPremium: !!videoData.isPremium,
    isLocked: !!videoData.isLocked,
    status: videoData.status || "publish",
    views: videoData.views || 0,
    createdAt: new Date().toISOString(),
    comments: []
  };

  db.videos.push(newVideo);
  writeDb(db);
  res.status(201).json(newVideo);
});

app.put("/api/videos/:id", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const videoData = req.body;

  const idx = db.videos.findIndex((v: any) => v.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "ভিডিও পাওয়া যায়নি।" });
  }

  db.videos[idx] = {
    ...db.videos[idx],
    title: videoData.title,
    description: videoData.description,
    videoUrl: videoData.videoUrl,
    thumbnailUrl: videoData.thumbnailUrl,
    category: videoData.category,
    subCategory: videoData.subCategory || "",
    tags: Array.isArray(videoData.tags) ? videoData.tags : (videoData.tags ? videoData.tags.split(",").map((t: string) => t.trim()) : []),
    language: videoData.language,
    duration: videoData.duration,
    resolution: videoData.resolution,
    featured: !!videoData.featured,
    trending: !!videoData.trending,
    isPremium: !!videoData.isPremium,
    isLocked: !!videoData.isLocked,
    status: videoData.status
  };

  writeDb(db);
  res.json(db.videos[idx]);
});

app.delete("/api/videos/:id", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.videos = db.videos.filter((v: any) => v.id !== id);
  writeDb(db);
  res.json({ success: true });
});

app.post("/api/videos/bulk-delete", (req, res) => {
  const db = readDb();
  const { ids } = req.body;
  if (!Array.isArray(ids)) {
    return res.status(400).json({ error: "ভিডিও আইডি লিস্ট প্রয়োজন।" });
  }
  db.videos = db.videos.filter((v: any) => !ids.includes(v.id));
  writeDb(db);
  res.json({ success: true });
});

// User Management
app.get("/api/users", (req, res) => {
  const db = readDb();
  res.json(db.users || []);
});

app.post("/api/users", (req, res) => {
  const db = readDb();
  const { userName, email } = req.body;
  const newUser = {
    id: "u_" + Date.now(),
    userName: userName || "Unknown User",
    email: email || "unknown@gmail.com",
    status: "active",
    createdAt: new Date().toISOString()
  };
  db.users = db.users || [];
  db.users.push(newUser);
  writeDb(db);
  res.json(newUser);
});

app.put("/api/users/:id/ban", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { status } = req.body; // 'active' or 'banned'
  const user = db.users.find((u: any) => u.id === id);
  if (user) {
    user.status = status || "banned";
    writeDb(db);
  }
  res.json({ success: true, user });
});

app.put("/api/users/:id/role", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { role, permissions } = req.body; // role: 'user' | 'admin' | 'moderator', permissions: string[]
  const user = db.users.find((u: any) => u.id === id);
  if (user) {
    user.role = role || "user";
    user.permissions = permissions || [];
    writeDb(db);
    return res.json({ success: true, user });
  }
  res.status(404).json({ error: "ইউজার পাওয়া যায়নি।" });
});

// Comments Management
app.get("/api/comments", (req, res) => {
  const db = readDb();
  const commentsList: any[] = [];
  db.videos.forEach((video: any) => {
    if (video.comments) {
      video.comments.forEach((comment: any) => {
        commentsList.push({
          ...comment,
          videoId: video.id,
          videoTitle: video.title
        });
      });
    }
  });
  res.json(commentsList);
});

app.post("/api/comments/:videoId", (req, res) => {
  const db = readDb();
  const { videoId } = req.params;
  const { userName, text } = req.body;

  const video = db.videos.find((v: any) => v.id === videoId);
  if (!video) {
    return res.status(404).json({ error: "ভিডিও পাওয়া যায়নি।" });
  }

  const newComment = {
    id: "c_" + Date.now(),
    userName: userName || "Anonymous",
    text: text || "",
    approved: false, // Moderated by default
    createdAt: new Date().toISOString()
  };

  video.comments = video.comments || [];
  video.comments.push(newComment);
  writeDb(db);
  res.status(201).json(newComment);
});

app.put("/api/comments/:videoId/:commentId/approve", (req, res) => {
  const db = readDb();
  const { videoId, commentId } = req.params;
  const video = db.videos.find((v: any) => v.id === videoId);
  if (video && video.comments) {
    const comment = video.comments.find((c: any) => c.id === commentId);
    if (comment) {
      comment.approved = true;
      writeDb(db);
      return res.json({ success: true, comment });
    }
  }
  res.status(404).json({ error: "কমেন্ট পাওয়া যায়নি।" });
});

app.delete("/api/comments/:videoId/:commentId", (req, res) => {
  const db = readDb();
  const { videoId, commentId } = req.params;
  const video = db.videos.find((v: any) => v.id === videoId);
  if (video && video.comments) {
    video.comments = video.comments.filter((c: any) => c.id !== commentId);
    writeDb(db);
    return res.json({ success: true });
  }
  res.status(404).json({ error: "কমেন্ট পাওয়া যায়নি।" });
});

// Ads Management
app.get("/api/ads", (req, res) => {
  const db = readDb();
  res.json(db.ads || []);
});

app.post("/api/ads", (req, res) => {
  const db = readDb();
  const adData = req.body;
  const newAd = {
    id: "ad_" + Date.now(),
    name: adData.name || "Unnamed Ad",
    type: adData.type || "Banner Ads",
    placement: adData.placement || "header",
    code: adData.code || "<div>বিজ্ঞাপন কোড</div>",
    enabled: adData.enabled !== undefined ? adData.enabled : true,
    devices: adData.devices || "both",
    startDate: adData.startDate || "",
    endDate: adData.endDate || ""
  };
  db.ads.push(newAd);
  writeDb(db);
  res.status(201).json(newAd);
});

app.put("/api/ads/:id", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const adData = req.body;
  const idx = db.ads.findIndex((a: any) => a.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "বিজ্ঞাপন পাওয়া যায়নি।" });
  }

  db.ads[idx] = {
    ...db.ads[idx],
    name: adData.name,
    type: adData.type,
    placement: adData.placement,
    code: adData.code,
    enabled: adData.enabled !== undefined ? adData.enabled : true,
    devices: adData.devices,
    startDate: adData.startDate,
    endDate: adData.endDate
  };

  writeDb(db);
  res.json(db.ads[idx]);
});

app.delete("/api/ads/:id", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.ads = db.ads.filter((a: any) => a.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// Offers Management
app.get("/api/offers", (req, res) => {
  const db = readDb();
  res.json(db.offers || []);
});

app.post("/api/offers", (req, res) => {
  const db = readDb();
  const offerData = req.body;
  const newOffer = {
    id: "off_" + Date.now(),
    title: offerData.title || "নতুন অফার",
    description: offerData.description || "",
    image: offerData.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600",
    link: offerData.link || "#",
    btnText: offerData.btnText || "অফার নিন",
    points: offerData.points || "",
    price: offerData.price || "",
    durationDays: offerData.durationDays !== undefined ? Number(offerData.durationDays) : 30,
    status: offerData.status || "active",
    createdAt: new Date().toISOString()
  };
  db.offers = db.offers || [];
  db.offers.push(newOffer);
  writeDb(db);
  res.status(201).json(newOffer);
});

app.put("/api/offers/:id", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const offerData = req.body;
  db.offers = db.offers || [];
  const idx = db.offers.findIndex((o: any) => o.id === id);
  if (idx === -1) {
    return res.status(404).json({ error: "অফার পাওয়া যায়নি।" });
  }

  db.offers[idx] = {
    ...db.offers[idx],
    title: offerData.title,
    description: offerData.description,
    image: offerData.image,
    link: offerData.link || "#",
    btnText: offerData.btnText,
    points: offerData.points,
    price: offerData.price,
    durationDays: offerData.durationDays !== undefined ? Number(offerData.durationDays) : 30,
    status: offerData.status
  };

  writeDb(db);
  res.json(db.offers[idx]);
});

app.delete("/api/offers/:id", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  db.offers = (db.offers || []).filter((o: any) => o.id !== id);
  writeDb(db);
  res.json({ success: true });
});

// User Premium Status Checking
app.get("/api/users/premium-status", (req, res) => {
  const { email } = req.query;
  if (!email) return res.json({ isPremium: false });
  const db = readDb();
  const user = db.users.find((u: any) => u.email === email);
  
  if (user && user.isPremium && user.premiumUntil) {
    const expiry = new Date(user.premiumUntil);
    if (new Date() > expiry) {
      user.isPremium = false;
      writeDb(db);
    }
  }

  res.json({ isPremium: !!user?.isPremium, premiumUntil: user?.premiumUntil });
});

// Get User Profile details
app.get("/api/users/profile", (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: "ইমেইল প্রদান করা হয়নি।" });
  
  const db = readDb();
  db.users = db.users || [];
  let user = db.users.find((u: any) => u.email === email);
  
  if (user && user.isPremium && user.premiumUntil) {
    const expiry = new Date(user.premiumUntil);
    if (new Date() > expiry) {
      user.isPremium = false;
      writeDb(db);
    }
  }

  if (!user) {
    // If user registered locally or logged in with Google/Email on preview, auto-register them
    const newUsername = String(email).split("@")[0];
    user = {
      id: "u_" + Date.now(),
      userName: newUsername,
      email: String(email),
      status: "active",
      isPremium: false,
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
    writeDb(db);
  }
  
  res.json(user);
});

// Update User Profile details
app.put("/api/users/update-profile", (req, res) => {
  const { email, userName } = req.body;
  if (!email || !userName) {
    return res.status(400).json({ error: "ইমেইল এবং নাম প্রয়োজন।" });
  }
  
  const db = readDb();
  db.users = db.users || [];
  const user = db.users.find((u: any) => u.email === email);
  
  if (!user) {
    return res.status(404).json({ error: "ব্যবহারকারী খুঁজে পাওয়া যায়নি।" });
  }
  
  user.userName = userName;
  writeDb(db);
  res.json({ success: true, user });
});

// Payments & Bill Requests Management
app.get("/api/payments", (req, res) => {
  const db = readDb();
  res.json(db.payments || []);
});

app.get("/api/payments/user/:email", (req, res) => {
  const { email } = req.params;
  const db = readDb();
  const userPayments = (db.payments || []).filter((p: any) => p.userEmail === email);
  res.json(userPayments);
});

app.post("/api/payments", (req, res) => {
  const db = readDb();
  const { userName, userEmail, packageId, packageName, price, gateway, senderNumber, trxId } = req.body;

  if (!userName || !userEmail || !packageName || !price || !gateway || !senderNumber || !trxId) {
    return res.status(400).json({ error: "অনুগ্রহ করে সকল তথ্য প্রদান করুন।" });
  }

  const newPayment = {
    id: "pay_" + Date.now(),
    userName,
    userEmail,
    packageId,
    packageName,
    price,
    packageTitle: packageName,
    packagePrice: price,
    transactionId: trxId,
    gateway,
    senderNumber,
    trxId,
    status: "pending",
    createdAt: new Date().toISOString()
  };

  db.payments = db.payments || [];
  db.payments.push(newPayment);
  writeDb(db);
  res.status(201).json(newPayment);
});

app.put("/api/payments/:id/status", (req, res) => {
  const db = readDb();
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  if (status !== "approved" && status !== "rejected") {
    return res.status(400).json({ error: "অবৈধ স্ট্যাটাস ভ্যালু!" });
  }

  db.payments = db.payments || [];
  const payment = db.payments.find((p: any) => p.id === id);
  if (!payment) {
    return res.status(404).json({ error: "পেমেন্ট রিকোয়েস্ট পাওয়া যায়নি।" });
  }

  payment.status = status;

  // If approved, update user status to isPremium = true and calculate premiumUntil expiration date
  if (status === "approved") {
    db.users = db.users || [];
    let user = db.users.find((u: any) => u.email === payment.userEmail);
    
    // Determine package duration in days
    const offer = (db.offers || []).find((o: any) => o.id === payment.packageId);
    let days = 30; // Default fallback to 30 days
    if (offer) {
      if (offer.durationDays) {
        days = Number(offer.durationDays);
      } else if (offer.points) {
        const parsedPoints = parseInt(offer.points);
        if (!isNaN(parsedPoints) && parsedPoints > 0) {
          days = parsedPoints;
        }
      }
    }

    const expiry = new Date();
    expiry.setDate(expiry.getDate() + days);
    const premiumUntilStr = expiry.toISOString();

    if (user) {
      user.isPremium = true;
      user.premiumUntil = premiumUntilStr;
    } else {
      // Create user if they registered locally but weren't synced properly
      db.users.push({
        id: "u_" + Date.now(),
        userName: payment.userName,
        email: payment.userEmail,
        status: "active",
        isPremium: true,
        premiumUntil: premiumUntilStr,
        createdAt: new Date().toISOString()
      });
    }
  } else if (status === "rejected") {
    // Optionally downgrade premium or keep as is. Usually reject does nothing to current premium.
  }

  writeDb(db);
  res.json({ success: true, payment });
});

// Simple Simulated Media Upload
app.post("/api/upload", (req, res) => {
  const { name, base64 } = req.body;
  if (!name || !base64) {
    return res.status(400).json({ error: "ফাইলের নাম ও ডাটা প্রয়োজন।" });
  }
  try {
    const buffer = Buffer.from(base64.split(",")[1] || base64, "base64");
    const safeName = Date.now() + "_" + name.replace(/[^a-zA-Z0-9.]/g, "_");
    const filePath = path.join(uploadsDir, safeName);
    fs.writeFileSync(filePath, buffer);
    res.json({ success: true, url: `/uploads/${safeName}` });
  } catch (err: any) {
    res.status(500).json({ error: "ফাইল সেভ করতে সমস্যা হয়েছে: " + err.message });
  }
});

// List uploaded files
app.get("/api/uploads", (req, res) => {
  try {
    if (!fs.existsSync(uploadsDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(uploadsDir);
    const list = files.map(file => {
      return {
        name: file,
        url: `/uploads/${file}`,
        type: file.toLowerCase().endsWith(".mp4") || file.toLowerCase().endsWith(".webm") || file.toLowerCase().endsWith(".ogg") ? "video" : "image"
      };
    });
    // Sort newly uploaded first
    list.sort((a, b) => {
      try {
        const statA = fs.statSync(path.join(uploadsDir, a.name));
        const statB = fs.statSync(path.join(uploadsDir, b.name));
        return statB.mtimeMs - statA.mtimeMs;
      } catch (e) {
        return 0;
      }
    });
    res.json(list);
  } catch (err: any) {
    res.status(500).json({ error: "ফাইল তালিকা পড়তে সমস্যা হয়েছে: " + err.message });
  }
});

// Serve uploaded files
app.use("/uploads", express.static(uploadsDir));

// Vite Middleware & SPA Serving Configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
