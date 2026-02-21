import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Tag, CheckCircle, LogIn, Upload, X, ImageIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { prelovedApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import AuthenticityBadge from "@/components/AuthenticityBadge";
import { toast } from "sonner";

const PreLoved = () => {
  const { isLoggedIn } = useAuth();
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    condition: "Good",
    image: "",
    contactPhone: "",
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    prelovedApi.getAll()
      .then(data => setListings(Array.isArray(data) ? data : []))
      .catch(() => {
        setListings([
          { _id: "1", name: "Vintage Crimson Mysore Silk - 1985", price: 4500, condition: "Excellent", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop", sellerName: "Meena R.", sellerLocation: "Mysore" },
          { _id: "2", name: "Heritage Green Zari Saree", price: 6800, condition: "Good", image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=500&fit=crop", sellerName: "Priya S.", sellerLocation: "Bangalore" },
          { _id: "3", name: "Antique Gold Border Silk", price: 8200, condition: "Very Good", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=400&h=500&fit=crop", sellerName: "Kamala D.", sellerLocation: "Mandya" },
        ]);
      })
      .finally(() => setLoadingListings(false));
  }, [submitted]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image too large! Please use an image under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImagePreview(base64);
      setForm(p => ({ ...p, image: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview("");
    setForm(p => ({ ...p, image: "" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error("Please sign in to list a saree"); return; }
    setLoading(true);
    try {
      await prelovedApi.submit({
        name: form.name,
        price: Number(form.price),
        description: form.description,
        condition: form.condition,
        image: form.image || undefined,
        contactPhone: form.contactPhone || undefined,
      });
      toast.success("Your listing has been submitted!");
      setSubmitted(true);
      setForm({ name: "", price: "", description: "", condition: "Good", image: "", contactPhone: "" });
      setImagePreview("");
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit listing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-20">
        {/* Header */}
        <div className="bg-maroon py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="divider-gold w-12" />
              <span className="text-gold font-inter text-xs uppercase tracking-[0.25em]">Sustainable Commerce</span>
              <div className="divider-gold w-12" />
            </div>
            <h1 className="font-playfair text-5xl font-bold text-gold mb-3">Pre-Loved Silk Marketplace</h1>
            <p className="font-inter text-white/70">Give vintage silk sarees a second life</p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">

          {/* Listings */}
          <div className="flex items-center gap-4 mb-8">
            <div className="divider-gold w-10" />
            <h2 className="font-playfair text-3xl font-bold text-maroon">Available Listings</h2>
          </div>

          {loadingListings ? (
            <div className="text-center py-12 font-inter text-muted-foreground">Loading listings...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-16">
              {listings.map((item, i) => (
                <motion.div key={item._id || i}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=500&fit=crop"; }} />
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-inter text-gold bg-gold/10 px-2 py-0.5 rounded-full">{item.condition}</span>
                      <AuthenticityBadge size="sm" saree={{ name: item.name }} />
                    </div>
                    <h3 className="font-playfair text-maroon font-semibold mt-2 text-sm leading-tight">{item.name}</h3>
                    <p className="font-inter text-xs text-muted-foreground mt-1">{item.sellerName} · {item.sellerLocation}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="font-playfair text-maroon font-bold text-lg">₹{item.price?.toLocaleString("en-IN")}</span>
                      <button className="px-3 py-1.5 bg-maroon text-gold text-xs font-inter rounded-full hover:bg-gold hover:text-maroon transition-all">Enquire</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Submit Form */}
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
              <div className="divider-gold w-10" />
              <h2 className="font-playfair text-3xl font-bold text-maroon">List Your Saree</h2>
            </div>

            {!isLoggedIn ? (
              <div className="bg-white rounded-2xl p-8 shadow-card text-center">
                <LogIn size={40} className="text-gold mx-auto mb-4" />
                <h3 className="font-playfair text-2xl text-maroon mb-2">Sign in to list your saree</h3>
                <p className="font-inter text-muted-foreground text-sm">You need an account to submit a pre-loved listing.</p>
              </div>
            ) : submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl p-10 shadow-card text-center">
                <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
                <h3 className="font-playfair text-2xl text-maroon mb-2">Listing Submitted!</h3>
                <p className="font-inter text-muted-foreground">Your saree has been listed on the marketplace.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-card space-y-5">

                <div>
                  <label className="font-inter text-sm font-medium text-maroon mb-1 block">Saree Name *</label>
                  <input name="name" value={form.name} onChange={handleChange} required
                    placeholder="e.g. Vintage Crimson Mysore Silk"
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold" />
                </div>

                <div>
                  <label className="font-inter text-sm font-medium text-maroon mb-1 block">Asking Price (₹) *</label>
                  <input name="price" type="number" value={form.price} onChange={handleChange} required min="1"
                    placeholder="e.g. 5000"
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold" />
                </div>

                <div>
                  <label className="font-inter text-sm font-medium text-maroon mb-1 block">Condition *</label>
                  <select name="condition" value={form.condition} onChange={handleChange}
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold bg-white">
                    <option>Like New</option>
                    <option>Excellent</option>
                    <option>Very Good</option>
                    <option>Good</option>
                    <option>Fair</option>
                  </select>
                </div>

                <div>
                  <label className="font-inter text-sm font-medium text-maroon mb-1 block">Description *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
                    placeholder="Describe the saree — fabric, color, age, any special features..."
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold resize-none" />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="font-inter text-sm font-medium text-maroon mb-1 block">
                    Saree Photo <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>

                  {imagePreview ? (
                    <div className="relative inline-block">
                      <img src={imagePreview} alt="Preview"
                        className="w-32 h-40 object-cover rounded-xl border border-border" />
                      <button type="button" onClick={removeImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600">
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:border-gold transition-all">
                      <Upload size={24} className="text-muted-foreground mx-auto mb-2" />
                      <p className="font-inter text-sm text-muted-foreground">Click to upload photo from your device</p>
                      <p className="font-inter text-xs text-muted-foreground mt-1">JPG, PNG — max 2MB</p>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden" />
                </div>

                <div>
                  <label className="font-inter text-sm font-medium text-maroon mb-1 block">
                    Contact Phone <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <input name="contactPhone" value={form.contactPhone} onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold" />
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all shine shadow-gold flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? "Submitting..." : <><Tag size={16} /> Submit Listing</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PreLoved;
