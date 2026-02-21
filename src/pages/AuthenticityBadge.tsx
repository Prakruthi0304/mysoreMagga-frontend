import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Leaf, Scissors, MapPin, X, Award } from "lucide-react";

interface AuthenticityBadgeProps {
  saree?: {
    name?: string;
    fabric?: string;
    weaverName?: string;
    weaverLocation?: string;
    farmerName?: string;
    farmerLocation?: string;
    silkType?: string;
    verified?: boolean;
  };
  size?: "sm" | "md";
}

const AuthenticityBadge = ({ saree, size = "md" }: AuthenticityBadgeProps) => {
  const [open, setOpen] = useState(false);

  // Default values for static sarees
  const data = {
    name: saree?.name || "Mysore Silk Saree",
    fabric: saree?.fabric || "Pure Silk",
    weaverName: saree?.weaverName || "Ramaiah Silk Works",
    weaverLocation: saree?.weaverLocation || "Mysore, Karnataka",
    farmerName: saree?.farmerName || "Karnataka Silk Farm",
    farmerLocation: saree?.farmerLocation || "Ramanagara, Karnataka",
    silkType: saree?.silkType || "Mulberry",
    verified: saree?.verified !== false,
  };

  if (!data.verified) return null;

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className={`inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full font-inter font-semibold hover:bg-emerald-100 transition-all ${
          size === "sm" ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1"
        }`}
      >
        <ShieldCheck size={size === "sm" ? 10 : 12} />
        Verified Silk
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setOpen(false)} />

            <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              className="relative bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl z-10">

              <button onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>

              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
                  <ShieldCheck size={24} className="text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-playfair text-xl font-bold text-maroon">Verified Authentic</h3>
                  <p className="font-inter text-xs text-muted-foreground">Source verified by Silk Heritage</p>
                </div>
              </div>

              {/* Authenticity Chain */}
              <div className="space-y-3">

                {/* Silk Type */}
                <div className="bg-silk rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Award size={14} className="text-gold" />
                    <span className="font-inter text-xs font-bold text-muted-foreground uppercase tracking-wide">Silk Type</span>
                  </div>
                  <p className="font-inter font-semibold text-maroon">{data.silkType} Silk — {data.fabric}</p>
                </div>

                {/* Divider with arrow */}
                <div className="flex items-center justify-center">
                  <div className="text-muted-foreground text-xs font-inter">↓ sourced from</div>
                </div>

                {/* Farmer */}
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Leaf size={14} className="text-green-600" />
                    <span className="font-inter text-xs font-bold text-green-700 uppercase tracking-wide">Silk Farmer</span>
                  </div>
                  <p className="font-inter font-semibold text-maroon">{data.farmerName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-muted-foreground" />
                    <p className="font-inter text-xs text-muted-foreground">{data.farmerLocation}</p>
                  </div>
                </div>

                {/* Divider with arrow */}
                <div className="flex items-center justify-center">
                  <div className="text-muted-foreground text-xs font-inter">↓ woven by</div>
                </div>

                {/* Weaver */}
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Scissors size={14} className="text-red-600" />
                    <span className="font-inter text-xs font-bold text-red-700 uppercase tracking-wide">Master Weaver</span>
                  </div>
                  <p className="font-inter font-semibold text-maroon">{data.weaverName}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin size={11} className="text-muted-foreground" />
                    <p className="font-inter text-xs text-muted-foreground">{data.weaverLocation}</p>
                  </div>
                </div>

              </div>

              <p className="font-inter text-xs text-muted-foreground text-center mt-5">
                🌱 Direct from farm to weaver to you — no middlemen
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AuthenticityBadge;