$content = @'
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
}

const AuthModal = ({ open, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
        toast.success("Welcome back!");
      } else {
        await signup(form.name, form.email, form.password);
        toast.success("Account created! Welcome to Silk Heritage.");
      }
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl z-10"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X size={20} />
            </button>
            <div className="text-center mb-8">
              <h2 className="font-playfair text-3xl font-bold text-maroon">
                {mode === "login" ? "Welcome Back" : "Join Us"}
              </h2>
              <p className="font-inter text-muted-foreground text-sm mt-1">
                {mode === "login" ? "Sign in to your account" : "Create your Silk Heritage account"}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div>
                  <label className="font-inter text-xs text-muted-foreground mb-1 block">Full Name</label>
                  <input name="name" type="text" value={form.name} onChange={handleChange} required
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                    placeholder="Your name" />
                </div>
              )}
              <div>
                <label className="font-inter text-xs text-muted-foreground mb-1 block">Email</label>
                <input name="email" type="email" value={form.email} onChange={handleChange} required
                  className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                  placeholder="you@email.com" />
              </div>
              <div>
                <label className="font-inter text-xs text-muted-foreground mb-1 block">Password</label>
                <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6}
                  className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
                  placeholder="Min 6 characters" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader size={16} className="animate-spin" /> Please wait...</> : mode === "login" ? "Sign In" : "Create Account"}
              </button>
            </form>
            <p className="text-center font-inter text-sm text-muted-foreground mt-6">
              {mode === "login" ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setMode(mode === "login" ? "signup" : "login")} className="text-gold hover:underline font-semibold">
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
'@

Set-Content -Path "src\components\AuthModal.tsx" -Value $content -Encoding UTF8
Write-Host "Done! File size: $((Get-Item src\components\AuthModal.tsx).Length) bytes"
