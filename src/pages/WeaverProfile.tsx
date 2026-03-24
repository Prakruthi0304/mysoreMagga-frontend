import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Star, Shield, Scissors, ShoppingCart, CheckCircle, Award, Trophy, Flame, Play } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";
import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Extract YouTube video ID from URL
const getYoutubeId = (url: string) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
};

const WeaverProfile = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { language } = useLanguage();
  const [weaver, setWeaver] = useState<any>(null);
  const [sarees, setSarees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "famous" | "sold">("all");

  const label = (en: string, kn: string) => language === "en" ? en : kn;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const weaversRes = await axios.get(`${API}/auth/weavers`);
        const found = weaversRes.data.find((w: any) => w._id === id);
        setWeaver(found);

        const sareesRes = await axios.get(`${API}/dashboard/weaver/sarees/all`);
        const weaverSarees = sareesRes.data.filter((s: any) =>
          s.weaver === id || s.weaver?._id === id
        );
        setSarees(weaverSarees);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleAddToCart = (saree: any) => {
    addToCart({
      id: saree._id,
      name: saree.name,
      price: saree.price,
      image: saree.image || "/sarees/s1.jpg",
      color: saree.color,
      fabric: saree.fabric || "Pure Silk",
      artisanName: weaver?.name || "",
      inStock: saree.inStock !== false,
      quantity: 1,
    });
    toast.success(`${saree.name} ${label("added to cart!", "ಬುಟ್ಟಿಗೆ ಸೇರಿಸಲಾಗಿದೆ!")}`);
  };

  // Sort sarees for different tabs
  const famousSarees = [...sarees].sort((a, b) => (b.price || 0) - (a.price || 0)).slice(0, 4);
  const soldSarees = [...sarees].filter(s => s.stockCount <= 2 || s.inStock === false).slice(0, 4);
  const displaySarees = activeTab === "famous" ? famousSarees : activeTab === "sold" ? soldSarees : sarees;

  const youtubeId = getYoutubeId(weaver?.weavingVideoUrl || "");
  const localVideos = ["/art.mp4", "/art1.mp4", "/art2.mp4"];
  const localVideo = localVideos[Math.floor(Math.random() * localVideos.length)];

  if (loading) return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-40 text-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="font-inter text-muted-foreground">{label("Loading...", "ಲೋಡ್ ಆಗುತ್ತಿದೆ...")}</p>
      </div>
    </div>
  );

  if (!weaver) return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-40 text-center">
        <p className="font-playfair text-2xl text-maroon">{label("Weaver not found", "ನೇಕಾರ ಕಂಡುಬಂದಿಲ್ಲ")}</p>
        <Link to="/artisans" className="mt-4 inline-block text-gold hover:underline font-inter">{label("Back to Artisans", "ಹಿಂದೆ ಹೋಗಿ")}</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-silk">
      <Navbar />

      {/* Hero Banner */}
      <div className="bg-maroon pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-32 h-32 rounded-full bg-gold/20 border-4 border-gold flex items-center justify-center shrink-0">
              <Scissors size={48} className="text-gold" />
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center gap-3 justify-center md:justify-start mb-2 flex-wrap">
                <h1 className="font-playfair text-4xl font-bold text-gold">{weaver.name}</h1>
                {weaver.verified && (
                  <span className="flex items-center gap-1 bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-inter font-bold">
                    <CheckCircle size={12} /> {label("KSIC Verified", "KSIC ಪರಿಶೀಲಿತ")}
                  </span>
                )}
              </div>
              {weaver.businessName && <p className="font-inter text-gold/80 text-lg mb-1">{weaver.businessName}</p>}
              {weaver.location && (
                <p className="font-inter text-white/70 flex items-center gap-1 justify-center md:justify-start mb-2">
                  <MapPin size={14} /> {weaver.location}
                </p>
              )}
              {weaver.specialization && (
                <p className="font-inter text-gold/70 text-sm">{label("Specializes in", "ವಿಶೇಷತೆ")}: {weaver.specialization}</p>
              )}
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                [weaver.experience || 0, label("Years", "ವರ್ಷ")],
                [sarees.length, label("Sarees", "ಸೀರೆಗಳು")],
                [weaver.verified ? "✓" : "⏳", "KSIC"],
              ].map(([val, lbl], i) => (
                <div key={i}>
                  <p className="font-playfair text-3xl font-bold text-gold">{val}</p>
                  <p className="font-inter text-white/60 text-xs">{lbl}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Sidebar */}
          <div className="space-y-6">

            {/* Weaving Video */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-card">
              <div className="bg-maroon px-5 py-3 flex items-center gap-2">
                <Play size={16} className="text-gold" />
                <h3 className="font-playfair text-gold font-bold">
                  {label("Watch Weaving Process", "ನೇಯ್ಗೆ ಪ್ರಕ್ರಿಯೆ ನೋಡಿ")}
                </h3>
              </div>
              {youtubeId ? (
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="Weaving Process"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <video
                  className="w-full"
                  controls
                  style={{ maxHeight: "220px", objectFit: "cover" }}
                >
                  <source src={localVideo} type="video/mp4" />
                </video>
              )}
            </div>

            {/* About */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-playfair text-xl font-bold text-maroon mb-3">{label("About", "ಬಗ್ಗೆ")}</h3>
              <p className="font-inter text-sm text-muted-foreground leading-relaxed">
                {weaver.bio || label(
                  "A dedicated Mysore silk weaver preserving the centuries-old tradition of Karnataka's heritage textile.",
                  "ಕರ್ನಾಟಕದ ಪರಂಪರೆಯ ಜವಳಿಯ ಶತಮಾನಗಳ ಹಳೆಯ ಸಂಪ್ರದಾಯವನ್ನು ಕಾಪಾಡುವ ಮೈಸೂರು ರೇಷ್ಮೆ ನೇಕಾರ."
                )}
              </p>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-playfair text-xl font-bold text-maroon mb-4">{label("Contact", "ಸಂಪರ್ಕ")}</h3>
              <div className="space-y-3">
                {weaver.phone && (
                  <a href={`tel:${weaver.phone}`} className="flex items-center gap-3 font-inter text-sm hover:text-gold transition-colors">
                    <Phone size={16} className="text-gold" /> {weaver.phone}
                  </a>
                )}
                {weaver.email && (
                  <a href={`mailto:${weaver.email}`} className="flex items-center gap-3 font-inter text-sm hover:text-gold transition-colors">
                    <Mail size={16} className="text-gold" /> {weaver.email}
                  </a>
                )}
                {weaver.location && (
                  <div className="flex items-center gap-3 font-inter text-sm text-muted-foreground">
                    <MapPin size={16} className="text-gold" /> {weaver.location}
                  </div>
                )}
              </div>
            </div>

            {/* KSIC Verification */}
            <div className={`rounded-2xl p-6 shadow-card ${weaver.verified ? "bg-emerald-50 border border-emerald-200" : "bg-amber-50 border border-amber-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                <Award size={20} className={weaver.verified ? "text-emerald-600" : "text-amber-600"} />
                <h3 className="font-playfair text-lg font-bold text-maroon">{label("KSIC Status", "KSIC ಸ್ಥಿತಿ")}</h3>
              </div>
              {weaver.verified ? (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} className="text-emerald-500" />
                    <p className="font-inter text-sm font-semibold text-emerald-700">{label("Verified Genuine Weaver", "ಪರಿಶೀಲಿತ ನೈಜ ನೇಕಾರ")}</p>
                  </div>
                  <p className="font-inter text-xs text-emerald-600">
                    {label("Holds valid KSIC certificate — guaranteed authentic Mysore silk.", "ಮಾನ್ಯ KSIC ಪ್ರಮಾಣಪತ್ರ ಹೊಂದಿದ್ದಾರೆ.")}
                  </p>
                </>
              ) : (
                <p className="font-inter text-xs text-amber-700">
                  {label("KSIC certificate verification pending.", "KSIC ಪ್ರಮಾಣಪತ್ರ ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ.")}
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="bg-white rounded-2xl p-6 shadow-card">
              <h3 className="font-playfair text-lg font-bold text-maroon mb-4">{label("Our Promise", "ನಮ್ಮ ಭರವಸೆ")}</h3>
              <div className="space-y-3">
                {[
                  [Shield, label("GI Tagged Products", "ಜಿಐ ಟ್ಯಾಗ್ ಉತ್ಪನ್ನಗಳು")],
                  [Star, label("Pure Mysore Silk", "ಶುದ್ಧ ಮೈಸೂರು ರೇಷ್ಮೆ")],
                  [CheckCircle, label("Direct from Weaver", "ನೇಕಾರರಿಂದ ನೇರವಾಗಿ")],
                ].map(([Icon, text]) => (
                  <div key={text as string} className="flex items-center gap-2">
                    <Icon size={16} className="text-gold" />
                    <span className="font-inter text-sm text-muted-foreground">{text as string}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Sarees with tabs */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <h2 className="font-playfair text-3xl font-bold text-maroon">
                {label("Sarees", "ಸೀರೆಗಳು")} ({sarees.length})
              </h2>
              {/* Tabs */}
              <div className="flex gap-2">
                {[
                  { key: "all", icon: Scissors, label: label("All", "ಎಲ್ಲಾ") },
                  { key: "famous", icon: Trophy, label: label("Most Famous", "ಪ್ರಸಿದ್ಧ") },
                  { key: "sold", icon: Flame, label: label("Almost Sold Out", "ಮಾರಾಟವಾಗುತ್ತಿದೆ") },
                ].map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-inter font-semibold transition-all ${
                        activeTab === tab.key
                          ? "bg-maroon text-gold"
                          : "bg-white text-muted-foreground hover:border-gold border border-border"
                      }`}>
                      <Icon size={14} /> {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {displaySarees.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-card">
                <Scissors size={48} className="text-gold/40 mx-auto mb-4" />
                <p className="font-playfair text-xl text-muted-foreground">
                  {label("No sarees in this category", "ಈ ವರ್ಗದಲ್ಲಿ ಸೀರೆಗಳಿಲ್ಲ")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displaySarees.map((saree, i) => (
                  <motion.div key={saree._id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-luxury transition-all duration-300 group">
                    <div className="relative h-56 overflow-hidden">
                      <img
                        src={saree.image || "/sarees/s1.jpg"}
                        alt={saree.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { (e.target as HTMLImageElement).src = "/sarees/s1.jpg"; }}
                      />
                      {/* Badges */}
                      {activeTab === "famous" && (
                        <span className="absolute top-3 left-3 bg-gold text-maroon text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Trophy size={10} /> {label("Famous", "ಪ್ರಸಿದ್ಧ")}
                        </span>
                      )}
                      {activeTab === "sold" && (
                        <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                          <Flame size={10} /> {label("Almost Gone!", "ಮಾರಾಟವಾಗುತ್ತಿದೆ!")}
                        </span>
                      )}
                      {saree.inStock === false && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="font-inter text-white font-bold text-sm">{label("Out of Stock", "ಸ್ಟಾಕ್ ಇಲ್ಲ")}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-playfair font-bold text-maroon text-lg mb-1">{saree.name}</h3>
                      <p className="font-inter text-xs text-muted-foreground mb-1">{saree.color} · {saree.fabric || "Pure Silk"}</p>
                      <p className="font-inter text-xs text-muted-foreground mb-3 line-clamp-2">{saree.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="font-playfair text-xl font-bold text-maroon">
                          ₹{saree.price?.toLocaleString("en-IN")}
                        </p>
                        <button
                          onClick={() => handleAddToCart(saree)}
                          disabled={saree.inStock === false}
                          className="flex items-center gap-1.5 px-4 py-2 bg-maroon text-gold font-inter text-sm font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all disabled:opacity-50">
                          <ShoppingCart size={14} />
                          {label("Add to Cart", "ಬುಟ್ಟಿಗೆ ಹಾಕಿ")}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WeaverProfile;