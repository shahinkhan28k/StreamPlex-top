import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Offer, PaymentRequest, WebsiteSettings } from "../types";
import { Gift, ExternalLink, Sparkles, Award, CreditCard, CheckCircle2, Clock, XCircle, Smartphone, History, User, Check, Crown, Copy } from "lucide-react";

export default function Offers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  
  // Payment states
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [gateway, setGateway] = useState<"bkash" | "nagad" | "rocket">("bkash");
  const [senderNumber, setSenderNumber] = useState("");
  const [trxId, setTrxId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Payment History
  const [paymentHistory, setPaymentHistory] = useState<PaymentRequest[]>([]);

  useEffect(() => {
    // 1. Fetch offers
    fetch("/api/offers")
      .then((res) => res.json())
      .then((data) => {
        setOffers(data.filter((o: Offer) => o.status === "active"));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching offers:", err);
        setLoading(false);
      });

    // Fetch settings
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
      })
      .catch((err) => {
        console.error("Error fetching settings:", err);
      });

    // 2. Load current user and fetch their payment history
    const saved = localStorage.getItem("streamplex_logged_user");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCurrentUser(parsed);
        fetchUserPayments(parsed.email);
      } catch (e) {
        console.error("Error parsing logged user info:", e);
      }
    }
  }, []);

  const fetchUserPayments = (email: string) => {
    fetch(`/api/payments/user/${encodeURIComponent(email)}`)
      .then((res) => res.json())
      .then((data) => {
        setPaymentHistory(data);
      })
      .catch((err) => {
        console.error("Error fetching user payments:", err);
      });
  };

  const handleOpenPayment = (offer: Offer) => {
    if (!currentUser) {
      alert("পেমেন্ট করতে অনুগ্রহ করে প্রথমে আপনার একাউন্টে লগইন করুন।");
      return;
    }
    setSelectedOffer(offer);
    setGateway("bkash");
    setSenderNumber("");
    setTrxId("");
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !selectedOffer) return;
    
    if (!senderNumber.trim() || !trxId.trim()) {
      setErrorMsg("দয়া করে প্রেরক নম্বর এবং ট্রানজেকশন আইডি প্রদান করুন।");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      userName: currentUser.name,
      userEmail: currentUser.email,
      packageId: selectedOffer.id,
      packageName: selectedOffer.title,
      price: selectedOffer.price || "0",
      gateway,
      senderNumber: senderNumber.trim(),
      trxId: trxId.trim()
    };

    fetch("/api/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
      .then((res) => res.json())
      .then((data) => {
        setSubmitting(false);
        if (data.error) {
          setErrorMsg(data.error);
        } else {
          setSuccessMsg("আপনার পেমেন্ট অনুরোধটি সফলভাবে পাঠানো হয়েছে! এডমিন শীঘ্রই এটি ভেরিফাই করে প্রিমিয়াম সুবিধা চালু করে দেবেন।");
          fetchUserPayments(currentUser.email);
          // Auto close modal after 3 seconds
          setTimeout(() => {
            setSelectedOffer(null);
          }, 3500);
        }
      })
      .catch((err) => {
        console.error("Payment error:", err);
        setSubmitting(false);
        setErrorMsg("পেমেন্ট অনুরোধ পাঠাতে সার্ভার ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
      });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">অফার লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="py-6 space-y-8 text-xs font-medium">
      {/* Page Header banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white p-8 md:p-12 shadow-xl border border-indigo-500/20">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <Crown size={180} className="text-amber-400" />
        </div>
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-amber-500/10 text-amber-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-amber-500/20">
            <Sparkles size={11} className="animate-pulse" />
            প্রিমিয়াম অফার ও মেম্বারশিপ
          </div>
          <h1 className="text-xl md:text-3xl font-black tracking-tight leading-tight">
            স্ট্রীমপ্লেক্স মেম্বারশিপ এবং বিশেষ অফারসমূহ 🎁
          </h1>
          <p className="text-xs text-indigo-200 leading-relaxed font-semibold">
            আমাদের চমৎকার প্রিমিয়াম সাবস্ক্রিপশন প্যাকেজ কিনে আনলক করুন লাইভ স্ট্রিম, এক্সক্লুসিভ মুভি ও বাফারিং-ফ্রি প্রিমিয়াম ভিডিওগুলো! নিচের যেকোনো অফার পছন্দ করে বিকাশ, নগদ বা রকেট এর মাধ্যমে মেম্বারশিপ অ্যাক্টিভেট করুন।
          </p>
        </div>
      </div>

      {offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8">
          <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Gift size={28} />
          </div>
          <h3 className="text-sm font-extrabold text-gray-800 dark:text-gray-200">
            বর্তমানে কোনো সক্রিয় অফার নেই
          </h3>
          <p className="text-[11px] text-gray-400 max-w-sm">
            নতুন নতুন আকর্ষনীয় অফার এবং ক্যাম্পেইন পেতে নিয়মিত আমাদের এই পেজে চোখ রাখুন। ধন্যবাদ।
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-1.5">
            <Sparkles size={16} className="text-amber-500" />
            সক্রিয় মেম্বারশিপ প্যাকেজ ও অফারসমূহ
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const isPaid = !!offer.price;
              return (
                <div
                  key={offer.id}
                  className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-gray-50 dark:bg-gray-950">
                    <img
                      src={offer.image || "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                    />
                    
                    {isPaid ? (
                      <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                        <Crown size={12} className="text-amber-300 animate-pulse" />
                        PREMIUM
                      </span>
                    ) : (
                      <span className="absolute top-3 left-3 bg-indigo-600 text-white font-black text-[10px] uppercase px-3 py-1 rounded-full shadow-md">
                        FREE
                      </span>
                    )}

                    {(offer.durationDays || offer.points) && (
                      <span className="absolute top-3 right-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-[10px] uppercase px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                        <Clock size={12} />
                        {offer.points ? offer.points : `${offer.durationDays} দিন মেয়াদ`}
                      </span>
                    )}
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors pt-0.5">
                          {offer.title}
                        </h3>
                        {isPaid && (
                          <span className="text-base font-black text-rose-600 dark:text-rose-400">৳{offer.price}</span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                        {offer.description}
                      </p>
                    </div>

                    {isPaid ? (
                      <button
                        onClick={() => handleOpenPayment(offer)}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/10 cursor-pointer"
                      >
                        <CreditCard size={14} />
                        <span>সাবস্ক্রাইব করুন (Subscribe)</span>
                      </button>
                    ) : (
                      <a
                        href={offer.link}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/10 cursor-pointer"
                      >
                        <span>{offer.btnText || "অফার নিন"}</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment History section shown if logged in */}
      {currentUser && (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-5 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-50 dark:border-gray-800">
            <History size={16} className="text-indigo-500" />
            <h2 className="text-sm font-extrabold text-gray-900 dark:text-white">আপনার পূর্ববর্তী পেমেন্ট ও অ্যাক্টিভেশন হিস্টোরি</h2>
          </div>

          {paymentHistory.length === 0 ? (
            <p className="text-[11px] text-gray-400 py-4 text-center">আপনি এখনো কোনো পেমেন্ট অনুরোধ সাবমিট করেননি।</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-gray-800 text-gray-400 font-bold uppercase">
                    <th className="py-2.5 px-3">প্যাকেজ নাম</th>
                    <th className="py-2.5 px-3">মূল্য</th>
                    <th className="py-2.5 px-3">গেটওয়ে</th>
                    <th className="py-2.5 px-3">প্রেরক নম্বর</th>
                    <th className="py-2.5 px-3">ট্রানজেকশন আইডি</th>
                    <th className="py-2.5 px-3">তারিখ</th>
                    <th className="py-2.5 px-3 text-right">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                  {paymentHistory.map((history) => (
                    <tr key={history.id} className="hover:bg-gray-50/50">
                      <td className="py-2.5 px-3 font-bold">{history.packageName}</td>
                      <td className="py-2.5 px-3 font-bold text-gray-950 dark:text-white">৳{history.price}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[9px] uppercase font-bold text-white ${
                          history.gateway === "bkash" ? "bg-pink-600" :
                          history.gateway === "nagad" ? "bg-orange-600" :
                          "bg-purple-600"
                        }`}>
                          {history.gateway}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-bold">{history.senderNumber}</td>
                      <td className="py-2.5 px-3 font-mono text-indigo-600 dark:text-indigo-400 font-bold">{history.trxId}</td>
                      <td className="py-2.5 px-3 text-gray-400">{new Date(history.createdAt).toLocaleDateString("bn-BD")}</td>
                      <td className="py-2.5 px-3 text-right">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                          history.status === "approved" ? "bg-emerald-50 text-emerald-600" :
                          history.status === "rejected" ? "bg-rose-50 text-rose-600" :
                          "bg-amber-50 text-amber-600"
                        }`}>
                          {history.status === "approved" ? <CheckCircle2 size={10} /> :
                           history.status === "rejected" ? <XCircle size={10} /> :
                           <Clock size={10} className="animate-spin" />}
                          {history.status === "approved" ? "অনুমোদিত (Active)" :
                           history.status === "rejected" ? "প্রত্যাখ্যাত" : "পেন্ডিং"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Manual Payment Verification Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-gray-150 dark:border-gray-800 pb-3">
              <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center gap-1.5">
                <Crown size={15} className="text-amber-500 animate-pulse" />
                প্রিমিয়াম অ্যাক্টিভেশন ফর্ম
              </h3>
              <button
                onClick={() => setSelectedOffer(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-900 dark:text-indigo-300 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 space-y-2">
              <p className="font-bold text-xs">বিকাশ, নগদ বা রকেটের মাধ্যমে ম্যানুয়াল পেমেন্ট করুন:</p>
              <div className="space-y-2 pt-1">
                {[
                  {
                    id: "bkash",
                    name: "bKash",
                    number: settings?.paymentBkashNumber || "01777-112233",
                    type: settings?.paymentBkashType || "Personal",
                    logo: settings?.paymentBkashLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Bkash_logo_without_text.svg/512px-Bkash_logo_without_text.svg.png",
                    color: "text-pink-600 border-pink-500/10 bg-pink-500/5 dark:bg-pink-950/5",
                  },
                  {
                    id: "nagad",
                    name: "Nagad",
                    number: settings?.paymentNagadNumber || "01999-445566",
                    type: settings?.paymentNagadType || "Personal",
                    logo: settings?.paymentNagadLogo || "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Nagad_logo.svg/512px-Nagad_logo.svg.png",
                    color: "text-orange-600 border-orange-500/10 bg-orange-500/5 dark:bg-orange-950/5",
                  },
                  {
                    id: "rocket",
                    name: "Rocket",
                    number: settings?.paymentRocketNumber || "01888-778899",
                    type: settings?.paymentRocketType || "Personal",
                    logo: settings?.paymentRocketLogo || "https://upload.wikimedia.org/wikipedia/commons/e/ea/DBBL_Rocket_Logo.svg",
                    color: "text-purple-600 border-purple-500/10 bg-purple-500/5 dark:bg-purple-950/5",
                  },
                ].map((item) => (
                  <div key={item.id} className={`flex items-center justify-between p-2 rounded-xl border ${item.color}`}>
                    <div className="flex items-center gap-2">
                      <img src={item.logo} alt={item.name} className="w-6 h-6 object-contain rounded-md" referrerPolicy="no-referrer" />
                      <div>
                        <span className="font-extrabold text-[11px] block text-gray-800 dark:text-gray-100">
                          {item.name} ({item.type})
                        </span>
                        <span className="font-black text-xs font-mono text-gray-950 dark:text-white block">
                          {item.number}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(item.number, item.id)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 rounded-lg transition-all flex items-center gap-1 active:scale-95 cursor-pointer shadow-sm shrink-0"
                    >
                      {copiedId === item.id ? (
                        <>
                          <Check size={11} className="text-emerald-500" />
                          <span className="text-emerald-500 font-extrabold">কপিড!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>কপি করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-amber-600 dark:text-amber-400 font-bold leading-relaxed pt-1.5">
                ⚠️ সতর্কতা: প্যাকেজের নির্ধারিত মূল্য (<span className="text-rose-600 font-extrabold text-xs">৳{selectedOffer.price}</span>) উপরোক্ত যেকোনো নাম্বারে সেন্ড মানি করুন। এরপর নিচে পেমেন্ট ফর্মটি সঠিক ট্রানজেকশন আইডি সহ সাবমিট করুন। এডমিন ভেরিফাই করে ৫ মিনিটের মধ্যে একাউন্ট চালু করে দিবে।
              </p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">নির্বাচিত প্যাকেজ</label>
                  <input
                    type="text"
                    disabled
                    value={selectedOffer.title}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl px-3 py-2 font-bold text-gray-700 dark:text-gray-300"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">প্যাকেজ মূল্য (BDT)</label>
                  <input
                    type="text"
                    disabled
                    value={`৳${selectedOffer.price}`}
                    className="w-full bg-gray-100 dark:bg-gray-950 border border-gray-150 dark:border-gray-800 rounded-xl px-3 py-2 font-extrabold text-rose-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-600 dark:text-gray-400">পেমেন্ট গেটওয়ে নির্বাচন করুন</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["bkash", "nagad", "rocket"] as const).map((gw) => (
                    <button
                      key={gw}
                      type="button"
                      onClick={() => setGateway(gw)}
                      className={`py-2 rounded-xl font-bold uppercase transition-all flex items-center justify-center gap-1 border cursor-pointer ${
                        gateway === gw
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-600/10 font-black"
                          : "bg-gray-50 border-gray-150 text-gray-700 hover:bg-gray-100 dark:bg-gray-950 dark:border-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {gw === "bkash" && <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />}
                      {gw === "nagad" && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                      {gw === "rocket" && <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />}
                      {gw}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">প্রেরক নম্বর (Sender Number)</label>
                  <input
                    type="tel"
                    required
                    placeholder="যেমন: 017XXXXXXXX"
                    value={senderNumber}
                    onChange={(e) => setSenderNumber(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-850 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 font-mono font-bold text-gray-950 dark:text-gray-50"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 dark:text-gray-400">ট্রানজেকশন আইডি (Transaction ID)</label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: K8H9F5D2S"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-850 bg-gray-50 dark:bg-gray-950 rounded-xl px-3 py-2 font-mono font-black text-indigo-600 dark:text-indigo-400"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 rounded-xl border border-rose-100 dark:border-rose-900/50 text-[10px] font-bold">
                  {errorMsg}
                </div>
              )}

              {successMsg && (
                <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl border border-emerald-100 dark:border-emerald-900/50 text-[10px] font-bold">
                  {successMsg}
                </div>
              )}

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-150 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setSelectedOffer(null)}
                  className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-250 font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-black px-5 py-2.5 rounded-xl transition-colors cursor-pointer shadow-lg shadow-rose-600/10 flex items-center gap-1.5"
                >
                  {submitting ? (
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <CheckCircle2 size={14} />
                  )}
                  পেমেন্ট সাবমিট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
