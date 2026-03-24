import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, User, Search, Menu, X, Heart, LayoutDashboard, Home } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import AuthModal from "@/components/AuthModal";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const location = useLocation();
  const { cartCount } = useCart();
  const { isLoggedIn, user, logout } = useAuth();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: t("nav.shop"), path: "/shop" },
    { label: t("nav.bridal"), path: "/shop?category=Bridal+Silk" },
    { label: t("nav.weaverMarket"), path: "/weaver-market" },
    { label: t("nav.artisans"), path: "/artisans" },
    { label: t("nav.learning"), path: "/learning" },
    { label: t("nav.preloved"), path: "/preloved" },
  ];

  const isHome = location.pathname === "/";

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled || !isHome
            ? "bg-white/95 backdrop-blur-md shadow-card border-b border-gold/20"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="flex flex-col">
              <span className={`font-playfair text-2xl md:text-3xl font-bold tracking-wide transition-colors duration-300 ${
                scrolled || !isHome ? "text-maroon" : "text-gold"
              }`}>
                ಮೈಸೂರುಮಗ್ಗ
              </span>
              <span className={`text-[10px] font-inter tracking-[0.2em] uppercase transition-colors duration-300 ${
                scrolled || !isHome ? "text-muted-foreground" : "text-gold/70"
              }`}>
                Heritage Silk Commerce
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-inter text-sm font-medium tracking-wide gold-underline transition-colors duration-300 ${
                    scrolled || !isHome
                      ? "text-foreground hover:text-gold"
                      : "text-white/90 hover:text-gold"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-2">

              {/* Home Icon */}
              <Link to="/" className={`p-2 rounded-full transition-colors duration-300 hover:bg-gold/10 ${
                scrolled || !isHome ? "text-foreground" : "text-white"
              }`}>
                <Home size={18} />
              </Link>

              {/* Language Toggle */}
              <button
                onClick={toggleLanguage}
                className={`px-3 py-1.5 rounded-full text-xs font-bold font-inter border-2 transition-all duration-300 ${
                  scrolled || !isHome
                    ? "border-maroon text-maroon hover:bg-maroon hover:text-gold"
                    : "border-gold text-gold hover:bg-gold hover:text-maroon"
                }`}
                title={language === "en" ? "Switch to Kannada" : "Switch to English"}
              >
                {language === "en" ? "ಕನ್ನಡ" : "EN"}
              </button>

              <button className={`p-2 rounded-full transition-colors duration-300 hover:bg-gold/10 ${
                scrolled || !isHome ? "text-foreground" : "text-white"
              }`}>
                <Search size={18} />
              </button>
              <Link to="/shop" className={`relative p-2 rounded-full transition-colors duration-300 hover:bg-gold/10 ${
                scrolled || !isHome ? "text-foreground" : "text-white"
              }`}>
                <Heart size={18} />
                {user?.wishlist && user.wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {user.wishlist.length}
                  </span>
                )}
              </Link>
              <Link to="/cart" className={`relative p-2 rounded-full transition-colors duration-300 hover:bg-gold/10 ${
                scrolled || !isHome ? "text-foreground" : "text-white"
              }`}>
                <ShoppingCart size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold text-maroon text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isLoggedIn ? (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/dashboard"
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium font-inter transition-all duration-300 ${
                      scrolled || !isHome
                        ? "bg-maroon text-gold hover:bg-maroon/90"
                        : "glass text-white hover:bg-white/20"
                    }`}>
                    <LayoutDashboard size={14} />
                    {user?.name}
                  </Link>
                  <button onClick={logout}
                    className={`px-3 py-2 rounded-full text-xs font-inter transition-all ${
                      scrolled || !isHome
                        ? "text-muted-foreground hover:text-maroon"
                        : "text-white/70 hover:text-white"
                    }`}>
                    {t("nav.signOut")}
                  </button>
                </div>
              ) : (
                <button onClick={() => setAuthOpen(true)}
                  className={`hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium font-inter transition-all duration-300 ${
                    scrolled || !isHome
                      ? "bg-maroon text-gold hover:bg-maroon/90"
                      : "glass text-white hover:bg-white/20"
                  }`}>
                  <User size={14} />
                  {t("nav.signIn")}
                </button>
              )}

              <button
                className={`md:hidden p-2 ${scrolled || !isHome ? "text-foreground" : "text-white"}`}
                onClick={() => setMobileOpen(!mobileOpen)}>
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 bg-maroon pt-20">
            <div className="flex flex-col p-8 gap-6">
              {navLinks.map((link, i) => (
                <motion.div key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <Link to={link.path} onClick={() => setMobileOpen(false)}
                    className="font-playfair text-3xl text-gold hover:text-gold-light transition-colors block">
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="divider-gold my-2 w-24" />
              <button
                onClick={toggleLanguage}
                className="font-inter text-white/80 text-lg text-left">
                {language === "en" ? "🇮🇳 ಕನ್ನಡದಲ್ಲಿ ನೋಡಿ" : "🇬🇧 View in English"}
              </button>
              {isLoggedIn ? (
                <>
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}
                    className="font-inter text-white/80 text-lg flex items-center gap-2">
                    <LayoutDashboard size={18} /> {t("nav.dashboard")}
                  </Link>
                  <button onClick={() => { logout(); setMobileOpen(false); }}
                    className="font-inter text-white/50 text-base text-left">
                    {t("nav.signOut")} ({user?.name})
                  </button>
                </>
              ) : (
                <button onClick={() => { setAuthOpen(true); setMobileOpen(false); }}
                  className="font-inter text-white/80 text-lg text-left">
                  {t("nav.signIn")} / Register
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
};

export default Navbar;