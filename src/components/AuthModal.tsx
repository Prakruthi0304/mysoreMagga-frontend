import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader, ShoppingBag, Scissors, Leaf, Store, Upload, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [step, setStep] = useState<"role" | "details">("role");
  const [selectedRole, setSelectedRole] = useState("consumer");
  const [form, setForm] = useState({ name: "", email: "", password: "", businessName: "", location: "", specialization: "", phone: "", experience: "" });
  const [ksicFile, setKsicFile] = useState<File | null>(null);
  const [ksicPreview, setKsicPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const { language, t } = useLanguage();

  const roles = [
    { id: "consumer", label: t("auth.consumer"), desc: language === "en" ? "Buy & sell sarees" : "ಸೀರೆ ಖರೀದಿ ಮತ್ತು ಮಾರಾಟ", icon: ShoppingBag },
    { id: "weaver", label: t("auth.weaver"), desc: language === "en" ? "Sell your handcrafted sarees" : "ನಿಮ್ಮ ಕೈನೇಯ್ದ ಸೀರೆ ಮಾರಿ", icon: Scissors },
    { id: "farmer", label: t("auth.farmer"), desc: language === "en" ? "Sell raw silk directly" : "ನೇರವಾಗಿ ರೇಷ್ಮೆ ಮಾರಿ", icon: Leaf },
    { id: "store", label: t("auth.store"), desc: language === "en" ? "Bulk procurement" : "ಸಗಟು ಖರೀದಿ", icon: Store },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleKsicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKsicFile(file);
      const reader = new FileReader();
      reader.onload = () => setKsicPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "weaver" && !ksicFile && mode === "signup") {
      toast.error(language === "en" ? "Please upload your KSIC certificate for verification" : "ದಯವಿಟ್ಟು ನಿಮ್ಮ KSIC ಪ್ರಮಾಣಪತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಿ");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success(language === "en" ? "Welcome back!" : "ಸ್ವಾಗತ!");
      } else {
        await signup(form.name, form.email, form.password, selectedRole, {
          businessName: form.businessName,
          location: form.location,
          specialization: form.specialization,
          phone: form.phone,
          experience: form.experience,
          ksicCertificate: ksicPreview || "",
          verified: false,
        });
        toast.success(language === "en" ? "Account created! Pending KSIC verification." : "ಖಾತೆ ರಚಿಸಲಾಗಿದೆ! KSIC ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ.");
      }
      onClose();
      setStep("role");
      setForm({ name: "", email: "", password: "", businessName: "", location: "", specialization: "", phone: "", experience: "" });
      setKsicFile(null);
      setKsicPreview("");
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const isProducer = selectedRole === "weaver" || selectedRole === "farmer";
  const label = (en: string, kn: string) => language === "en" ? en : kn;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl z-10 max-h-[90vh] overflow-y-auto">
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>

            <div className="text-center mb-6">
              <h2 className="font-playfair text-3xl font-bold text-maroon">
                {mode === "login" ? t("auth.login") : t("auth.signup")}
              </h2>
              <p className="font-inter text-muted-foreground text-sm mt-1">
                {mode === "login"
                  ? label("Sign in to your account", "ನಿಮ್ಮ ಖಾತೆಗೆ ಲಾಗಿನ್ ಮಾಡಿ")
                  : label("Create your Silk Heritage account", "ನಿಮ್ಮ ರೇಷ್ಮೆ ಖಾತೆ ತೆರೆಯಿರಿ")}
              </p>
            </div>

            {mode === "signup" && step === "role" && (
              <div>
                <p className="font-inter text-sm font-semibold text-maroon mb-3">{t("auth.iAm")}</p>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button key={role.id} type="button" onClick={() => setSelectedRole(role.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all ${selectedRole === role.id ? "border-maroon bg-maroon/5 shadow-md" : "border-border hover:border-gold"}`}>
                        <Icon size={22} className={selectedRole === role.id ? "text-maroon" : "text-muted-foreground"} />
                        <p className={`font-inter text-sm font-bold mt-2 ${selectedRole === role.id ? "text-maroon" : "text-foreground"}`}>{role.label}</p>
                        <p className="font-inter text-xs text-muted-foreground mt-0.5">{role.desc}</p>
                      </button>
                    );
                  })}
                </div>
                {selectedRole === "weaver" && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <p className="font-inter text-xs text-amber-800 font-semibold">
                      🏛️ {label("KSIC Certificate Required", "KSIC ಪ್ರಮಾಣಪತ್ರ ಅಗತ್ಯ")}
                    </p>
                    <p className="font-inter text-xs text-amber-700 mt-1">
                      {label("You'll need to upload your KSIC certificate to verify your identity as a genuine Mysore silk weaver.", "ನೈಜ ಮೈಸೂರು ರೇಷ್ಮೆ ನೇಕಾರ ಎಂದು ಪರಿಶೀಲಿಸಲು KSIC ಪ್ರಮಾಣಪತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಬೇಕು.")}
                    </p>
                  </div>
                )}
                <button onClick={() => setStep("details")}
                  className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all">
                  {t("auth.continueAs")} {roles.find(r => r.id === selectedRole)?.label} →
                </button>
              </div>
            )}

            {mode === "signup" && step === "details" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <button type="button" onClick={() => setStep("role")} className="text-xs text-muted-foreground hover:text-gold font-inter mb-2">
                  ← {label("Change role", "ಪಾತ್ರ ಬದಲಿಸಿ")}
                </button>
                <div>
                  <label className="font-inter text-xs text-muted-foreground mb-1 block">{t("auth.name")} *</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange} required
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                    placeholder={label("Your name", "ನಿಮ್ಮ ಹೆಸರು")} />
                </div>
                {isProducer && (
                  <div>
                    <label className="font-inter text-xs text-muted-foreground mb-1 block">
                      {selectedRole === "weaver" ? label("Weaving Business Name", "ನೇಯ್ಗೆ ವ್ಯಾಪಾರದ ಹೆಸರು") : label("Farm Name", "ಜಮೀನಿನ ಹೆಸರು")}
                    </label>
                    <input name="businessName" type="text" value={form.businessName} onChange={handleChange}
                      className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                      placeholder={selectedRole === "weaver" ? label("e.g. Ramaiah Silk Works", "ಉದಾ: ರಾಮಯ್ಯ ರೇಷ್ಮೆ") : label("e.g. Karnataka Silk Farm", "ಉದಾ: ಕರ್ನಾಟಕ ರೇಷ್ಮೆ ಜಮೀನು")} />
                  </div>
                )}
                {isProducer && (
                  <div>
                    <label className="font-inter text-xs text-muted-foreground mb-1 block">{t("auth.location")}</label>
                    <input name="location" type="text" value={form.location} onChange={handleChange}
                      className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                      placeholder={label("e.g. Mysore, Karnataka", "ಉದಾ: ಮೈಸೂರು, ಕರ್ನಾಟಕ")} />
                  </div>
                )}
                {selectedRole === "weaver" && (
                  <div>
                    <label className="font-inter text-xs text-muted-foreground mb-1 block">{t("auth.specialization")}</label>
                    <input name="specialization" type="text" value={form.specialization} onChange={handleChange}
                      className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                      placeholder={label("e.g. Gold Zari Weaving", "ಉದಾ: ಚಿನ್ನದ ಜರಿ ನೇಯ್ಗೆ")} />
                  </div>
                )}
                {selectedRole === "weaver" && (
                  <div>
                    <label className="font-inter text-xs text-muted-foreground mb-1 block">{t("auth.experience")}</label>
                    <input name="experience" type="number" value={form.experience} onChange={handleChange}
                      className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                      placeholder={label("e.g. 10", "ಉದಾ: ೧೦")} />
                  </div>
                )}
                <div>
                  <label className="font-inter text-xs text-muted-foreground mb-1 block">{t("auth.phone")}</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange}
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                    placeholder="+91 98765 43210" />
                </div>
                <div>
                  <label className="font-inter text-xs text-muted-foreground mb-1 block">{t("auth.email")} *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                    placeholder="you@email.com" />
                </div>
                <div>
                  <label className="font-inter text-xs text-muted-foreground mb-1 block">{t("auth.password")} *</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6}
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                    placeholder={label("Min 6 characters", "ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳು")} />
                </div>

                {/* KSIC Certificate Upload for Weavers */}
                {selectedRole === "weaver" && (
                  <div>
                    <label className="font-inter text-xs text-muted-foreground mb-1 block">
                      🏛️ {label("KSIC Certificate *", "KSIC ಪ್ರಮಾಣಪತ್ರ *")}
                    </label>
                    <div className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${ksicFile ? "border-emerald-400 bg-emerald-50" : "border-gold/40 hover:border-gold bg-gold/5"}`}
                      onClick={() => document.getElementById("ksic-upload")?.click()}>
                      <input id="ksic-upload" type="file" accept="image/*,.pdf" onChange={handleKsicUpload} className="hidden" />
                      {ksicFile ? (
                        <div className="flex items-center justify-center gap-2">
                          <CheckCircle size={20} className="text-emerald-500" />
                          <span className="font-inter text-sm text-emerald-700 font-semibold">{ksicFile.name}</span>
                        </div>
                      ) : (
                        <div>
                          <Upload size={24} className="text-gold mx-auto mb-2" />
                          <p className="font-inter text-sm text-muted-foreground">
                            {label("Click to upload KSIC certificate", "KSIC ಪ್ರಮಾಣಪತ್ರ ಅಪ್ಲೋಡ್ ಮಾಡಲು ಕ್ಲಿಕ್ ಮಾಡಿ")}
                          </p>
                          <p className="font-inter text-xs text-muted-foreground mt-1">
                            {label("JPG, PNG or PDF accepted", "JPG, PNG ಅಥವಾ PDF ಸ್ವೀಕಾರಾರ್ಹ")}
                          </p>
                        </div>
                      )}
                    </div>
                    <p className="font-inter text-xs text-amber-600 mt-1">
                      ⚠️ {label("Required to verify you as a genuine KSIC certified weaver", "ನೈಜ KSIC ನೇಕಾರ ಎಂದು ಪರಿಶೀಲಿಸಲು ಅಗತ್ಯ")}
                    </p>
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <><Loader size={16} className="animate-spin" /> {label("Please wait...", "ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...")}</> : t("auth.createAccount")}
                </button>
              </form>
            )}

            {mode === "login" && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-inter text-xs text-muted-foreground mb-1 block">{t("auth.email")}</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                    placeholder="you@email.com" />
                </div>
                <div>
                  <label className="font-inter text-xs text-muted-foreground mb-1 block">{t("auth.password")}</label>
                  <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6}
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                    placeholder={label("Min 6 characters", "ಕನಿಷ್ಠ ೬ ಅಕ್ಷರಗಳು")} />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? <><Loader size={16} className="animate-spin" /> {label("Please wait...", "ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...")}</> : t("auth.signIn")}
                </button>
              </form>
            )}

            <p className="text-center font-inter text-sm text-muted-foreground mt-6">
              {mode === "login" ? t("auth.noAccount") : t("auth.haveAccount")}{" "}
              <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setStep("role"); }}
                className="text-gold hover:underline font-semibold">
                {mode === "login" ? t("auth.signup") : t("auth.signIn")}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;