import { createContext, useContext, useState, ReactNode } from "react";

type Language = "en" | "kn";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  "nav.shop": { en: "Shop", kn: "ಅಂಗಡಿ" },
  "nav.bridal": { en: "Bridal", kn: "ಮದುವೆ" },
  "nav.weaverMarket": { en: "Weaver Market", kn: "ನೇಕಾರ ಮಾರುಕಟ್ಟೆ" },
  "nav.artisans": { en: "Artisans", kn: "ಕಾರಿಗರು" },
  "nav.learning": { en: "Learning", kn: "ಕಲಿಕೆ" },
  "nav.preloved": { en: "Pre-Loved", kn: "ಹಳೆಯ ಸೀರೆ" },
  "nav.signIn": { en: "Sign In", kn: "ಲಾಗಿನ್" },
  "nav.signOut": { en: "Sign Out", kn: "ಲಾಗ್ ಔಟ್" },
  "nav.dashboard": { en: "Dashboard", kn: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್" },

  // Home page
  "home.discover": { en: "Discover Collections", kn: "ಸಂಗ್ರಹಗಳನ್ನು ಅನ್ವೇಷಿಸಿ" },
  "home.shopByCategory": { en: "Shop By Category", kn: "ವರ್ಗದ ಪ್ರಕಾರ ಖರೀದಿ" },
  "home.artisanSpotlight": { en: "Artisan Spotlight", kn: "ಕಾರಿಗರ ವಿಶೇಷ" },
  "home.meetArtisans": { en: "Meet All Artisans", kn: "ಎಲ್ಲ ಕಾರಿಗರನ್ನು ಭೇಟಿ" },
  "home.heritageTitle": { en: "Centuries of Silk, Woven with Love", kn: "ಶತಮಾನಗಳ ರೇಷ್ಮೆ, ಪ್ರೀತಿಯಿಂದ ನೇಯ್ದ" },
  "home.preloved": { en: "Browse Pre-Loved", kn: "ಹಳೆಯ ಸೀರೆ ನೋಡಿ" },
  "home.sellSaree": { en: "Sell Your Saree", kn: "ನಿಮ್ಮ ಸೀರೆ ಮಾರಿ" },

  // Shop
  "shop.title": { en: "Our Collection", kn: "ನಮ್ಮ ಸಂಗ್ರಹ" },
  "shop.search": { en: "Search sarees...", kn: "ಸೀರೆ ಹುಡುಕಿ..." },
  "shop.addToCart": { en: "Add to Cart", kn: "ಬುಟ್ಟಿಗೆ ಹಾಕಿ" },
  "shop.buyNow": { en: "Buy Now", kn: "ಈಗ ಕೊಳ್ಳಿ" },
  "shop.inStock": { en: "In Stock", kn: "ಸ್ಟಾಕ್ ಇದೆ" },
  "shop.outOfStock": { en: "Out of Stock", kn: "ಸ್ಟಾಕ್ ಇಲ್ಲ" },
  "shop.filters": { en: "Filters", kn: "ಫಿಲ್ಟರ್" },
  "shop.sortBy": { en: "Sort By", kn: "ವಿಂಗಡಿಸಿ" },

  // Auth
  "auth.login": { en: "Welcome Back", kn: "ಸ್ವಾಗತ" },
  "auth.signup": { en: "Join Us", kn: "ಸೇರಿ" },
  "auth.email": { en: "Email", kn: "ಇಮೇಲ್" },
  "auth.password": { en: "Password", kn: "ಪಾಸ್‌ವರ್ಡ್" },
  "auth.name": { en: "Full Name", kn: "ಪೂರ್ಣ ಹೆಸರು" },
  "auth.phone": { en: "Phone", kn: "ಫೋನ್" },
  "auth.location": { en: "Village / Location", kn: "ಊರು / ಸ್ಥಳ" },
  "auth.specialization": { en: "Specialization", kn: "ವಿಶೇಷತೆ" },
  "auth.experience": { en: "Years of Experience", kn: "ಅನುಭವದ ವರ್ಷಗಳು" },
  "auth.signIn": { en: "Sign In", kn: "ಲಾಗಿನ್ ಮಾಡಿ" },
  "auth.createAccount": { en: "Create Account", kn: "ಖಾತೆ ತೆರೆಯಿರಿ" },
  "auth.consumer": { en: "Consumer", kn: "ಗ್ರಾಹಕ" },
  "auth.weaver": { en: "Weaver", kn: "ನೇಕಾರ" },
  "auth.farmer": { en: "Silk Farmer", kn: "ರೇಷ್ಮೆ ರೈತ" },
  "auth.store": { en: "Retail Store", kn: "ಅಂಗಡಿ" },
  "auth.iAm": { en: "I am a...", kn: "ನಾನು..." },
  "auth.continueAs": { en: "Continue as", kn: "ಮುಂದುವರಿ" },
  "auth.haveAccount": { en: "Already have an account?", kn: "ಖಾತೆ ಇದೆಯೇ?" },
  "auth.noAccount": { en: "Don't have an account?", kn: "ಖಾತೆ ಇಲ್ಲವೇ?" },

  // Artisans
  "artisans.title": { en: "Our Artisans", kn: "ನಮ್ಮ ಕಾರಿಗರು" },
  "artisans.subtitle": { en: "The hands that keep Mysore's heritage alive", kn: "ಮೈಸೂರು ಪರಂಪರೆಯನ್ನು ಉಳಿಸುವ ಕೈಗಳು" },
  "artisans.call": { en: "Call", kn: "ಕರೆ" },
  "artisans.email": { en: "Email", kn: "ಇಮೇಲ್" },
  "artisans.experience": { en: "yrs exp", kn: "ವರ್ಷ ಅನುಭವ" },
  "artisans.sarees": { en: "sarees", kn: "ಸೀರೆಗಳು" },
  "artisans.certified": { en: "certified", kn: "ಪ್ರಮಾಣಿತ" },

  // Learning
  "learning.title": { en: "The Silk Learning Center", kn: "ರೇಷ್ಮೆ ಕಲಿಕಾ ಕೇಂದ್ರ" },
  "learning.subtitle": { en: "Discover the art, history, and science of Mysore silk weaving", kn: "ಮೈಸೂರು ರೇಷ್ಮೆ ನೇಯ್ಗೆಯ ಕಲೆ, ಇತಿಹಾಸ ಮತ್ತು ವಿಜ್ಞಾನ ಕಂಡುಕೊಳ್ಳಿ" },
  "learning.articles": { en: "Heritage Articles", kn: "ಪರಂಪರೆ ಲೇಖನಗಳು" },
  "learning.steps": { en: "Step-by-Step Weaving Tutorial", kn: "ಹಂತ ಹಂತವಾಗಿ ನೇಯ್ಗೆ ಕಲಿಯಿರಿ" },

  // Common
  "common.loading": { en: "Loading...", kn: "ಲೋಡ್ ಆಗುತ್ತಿದೆ..." },
  "common.registered": { en: "Registered", kn: "ನೋಂದಾಯಿತ" },
  "common.verified": { en: "Verified", kn: "ಪರಿಶೀಲಿಸಲಾಗಿದೆ" },
  "common.free": { en: "Free Shipping", kn: "ಉಚಿತ ಶಿಪ್ಪಿಂಗ್" },
  "common.authentic": { en: "Authenticated Silk", kn: "ಪ್ರಮಾಣಿತ ರೇಷ್ಮೆ" },
  "common.giTagged": { en: "GI Tagged", kn: "ಜಿಐ ಟ್ಯಾಗ್" },
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  toggleLanguage: () => {},
  t: (key) => key,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "kn" : "en"));
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);