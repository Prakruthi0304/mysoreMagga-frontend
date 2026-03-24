import { motion } from "framer-motion";
import { Phone, Mail, MessageCircle, MapPin, Star, Scissors, Award, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { artisans } from "@/data/sarees";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import axios from "axios";

const API = "http://localhost:5000/api";

const Artisans = () => {
  const [weavers, setWeavers] = useState<any[]>([]);
  const { language } = useLanguage();
  const label = (en: string, kn: string) => language === "en" ? en : kn;

  useEffect(() => {
    axios.get(`${API}/auth/weavers`).then(res => {
      setWeavers(res.data || []);
    }).catch(() => setWeavers([]));
  }, []);

  const allArtisans = [
    ...artisans.map(a => ({ ...a, isRegistered: false, _id: null })),
    ...weavers.map((w, i) => ({
      id: `w${i}`,
      _id: w._id,
      name: w.name,
      village: w.location || "Karnataka",
      district: "",
      experience: w.experience || 0,
      specialization: w.specialization || "Silk Weaving",
      phone: w.phone || "",
      email: w.email || "",
      whatsapp: w.phone?.replace(/\D/g, "") || "",
      bio: w.bio || `${w.name} ${label("is a registered weaver on our platform.", "ನಮ್ಮ ವೇದಿಕೆಯಲ್ಲಿ ನೋಂದಾಯಿತ ನೇಕಾರ.")}`,
      rating: 4.5,
      totalSarees: w.totalSarees || 0,
      isRegistered: true,
      verified: w.verified,
    }))
  ];

  return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-20">
        {/* Header */}
        <div className="bg-maroon py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="divider-gold w-12" />
              <span className="text-gold font-inter text-xs uppercase tracking-[0.25em]">{label("The Masters", "ಮೇರು ಕಾರಿಗರು")}</span>
              <div className="divider-gold w-12" />
            </div>
            <h1 className="font-playfair text-5xl font-bold text-gold mb-3">{label("Our Artisans", "ನಮ್ಮ ಕಾರಿಗರು")}</h1>
            <p className="font-inter text-white/70">{label("The hands that keep Mysore's heritage alive", "ಮೈಸೂರು ಪರಂಪರೆಯನ್ನು ಉಳಿಸುವ ಕೈಗಳು")}</p>
            <p className="font-inter text-white/50 text-sm mt-2">{label("Connect directly with master weavers — no middlemen", "ನೇರವಾಗಿ ನೇಕಾರರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ — ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲ")}</p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allArtisans.map((artisan, i) => (
              <motion.div
                key={artisan.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-500 group"
              >
                <div className="relative h-28 bg-gradient-to-br from-maroon to-maroon/70 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gold/20 border-4 border-gold/40 flex items-center justify-center">
                    <Scissors size={36} className="text-gold" />
                  </div>
                  {artisan.isRegistered && (
                    <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-inter px-2 py-1 rounded-full">
                      ✓ {label("Registered", "ನೋಂದಾಯಿತ")}
                    </span>
                  )}
                  {artisan.verified && (
                    <span className="absolute top-3 left-3 bg-gold text-maroon text-xs font-inter font-bold px-2 py-1 rounded-full">
                      🏛️ KSIC
                    </span>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-6 bg-white rounded-t-3xl" />
                </div>

                <div className="px-6 pb-6 pt-2">
                  <h3 className="font-playfair text-xl font-bold text-maroon text-center mb-1">{artisan.name}</h3>
                  <div className="flex items-center justify-center gap-1.5 mb-4">
                    <MapPin size={12} className="text-gold" />
                    <span className="text-muted-foreground text-xs font-inter">
                      {artisan.village}{artisan.district ? `, ${artisan.district}` : ""}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="font-inter text-xs bg-gold/10 text-gold px-3 py-1 rounded-full">
                      {artisan.specialization}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-gold fill-gold" />
                      <span className="font-inter text-sm font-semibold">{artisan.rating}</span>
                    </div>
                  </div>

                  <p className="font-inter text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">{artisan.bio}</p>

                  <div className="flex gap-4 mb-4 py-3 border-y border-border">
                    <div className="text-center flex-1">
                      <p className="font-playfair text-lg font-bold text-maroon">{artisan.experience}</p>
                      <p className="font-inter text-xs text-muted-foreground">{label("yrs exp", "ವರ್ಷ")}</p>
                    </div>
                    <div className="text-center flex-1 border-x border-border">
                      <p className="font-playfair text-lg font-bold text-maroon">{artisan.totalSarees}+</p>
                      <p className="font-inter text-xs text-muted-foreground">{label("sarees", "ಸೀರೆಗಳು")}</p>
                    </div>
                    <div className="text-center flex-1">
                      <Award size={20} className="text-gold mx-auto mb-0.5" />
                      <p className="font-inter text-xs text-muted-foreground">{label("certified", "ಪ್ರಮಾಣಿತ")}</p>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="flex gap-2 mb-3">
                    {artisan.phone && (
                      <a href={`tel:${artisan.phone}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-maroon text-gold text-xs font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all duration-300">
                        <Phone size={12} /> {label("Call", "ಕರೆ")}
                      </a>
                    )}
                    {artisan.whatsapp && (
                      <a href={`https://wa.me/${artisan.whatsapp}`} target="_blank" rel="noreferrer"
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-green-600 text-white text-xs font-inter font-semibold rounded-full hover:bg-green-700 transition-all duration-300">
                        <MessageCircle size={12} /> WhatsApp
                      </a>
                    )}
                    {artisan.email && (
                      <a href={`mailto:${artisan.email}`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-maroon text-maroon text-xs font-inter font-semibold rounded-full hover:bg-maroon hover:text-gold transition-all duration-300">
                        <Mail size={12} /> {label("Email", "ಇಮೇಲ್")}
                      </a>
                    )}
                  </div>

                  {/* View Profile Button - only for registered weavers */}
                  {artisan.isRegistered && artisan._id && (
                    <Link to={`/weaver/${artisan._id}`}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-gold/10 text-maroon text-xs font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all duration-300 border border-gold/30">
                      <ArrowRight size={12} /> {label("View Profile & Sarees", "ಪ್ರೊಫೈಲ್ ಮತ್ತು ಸೀರೆಗಳನ್ನು ನೋಡಿ")}
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Artisans;