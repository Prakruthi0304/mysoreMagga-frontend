import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Phone, Mail, Star, Shield, Truck, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { sarees, artisans } from "@/data/sarees";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { isLoggedIn, toggleWishlist, isInWishlist } = useAuth();
  const navigate = useNavigate();
  const saree = sarees.find((s) => s.id === id);
  const [imgError, setImgError] = useState(false);

  if (!saree) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="font-playfair text-3xl text-maroon mb-4">Saree not found</h2>
        <Link to="/shop" className="text-gold hover:underline">Back to Shop</Link>
      </div>
    </div>
  );

  const artisan = artisans.find((a) => a.id === saree.artisanId);
  const wishlisted = isInWishlist(saree.id);

  const handleAddToCart = () => {
    if (!saree.inStock) return;
    addToCart(saree);
    toast.success(`${saree.name} added to cart`);
  };

  const handleBuyNow = () => {
    if (!saree.inStock) return;
    if (!isLoggedIn) {
      toast.error("Please sign in to buy");
      return;
    }
    addToCart(saree);
    navigate("/checkout");
  };

  const handleWishlist = async () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to add to wishlist");
      return;
    }
    try {
      await toggleWishlist(saree.id);
      toast.success(wishlisted ? "Removed from wishlist" : "Added to wishlist ❤️");
    } catch {
      toast.error("Failed to update wishlist");
    }
  };

  return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <Link to="/shop" className="inline-flex items-center gap-2 font-inter text-sm text-muted-foreground hover:text-gold mb-8 transition-colors">
            <ArrowLeft size={14} /> Back to Collection
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Image */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-luxury img-zoom">
                <img
                  src={imgError ? "/sarees/s1.jpg" : saree.image}
                  alt={saree.name}
                  className="w-full h-full object-cover"
                  onError={() => setImgError(true)}
                />
                {/* Wishlist button on image */}
                <button
                  onClick={handleWishlist}
                  className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
                    wishlisted ? "bg-red-500 text-white" : "bg-white/80 text-muted-foreground hover:bg-red-50 hover:text-red-500"
                  }`}
                >
                  <Heart size={18} className={wishlisted ? "fill-white" : ""} />
                </button>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
              {saree.badge && (
                <span className="inline-block bg-gold text-maroon text-xs font-bold px-3 py-1 rounded-full font-inter uppercase tracking-wide mb-4">
                  {saree.badge}
                </span>
              )}
              <h1 className="font-playfair text-4xl font-bold text-maroon mb-2">{saree.name}</h1>
              <p className="font-inter text-muted-foreground text-sm mb-4">{saree.category}</p>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-playfair text-4xl font-bold text-maroon">
                  ₹{saree.price.toLocaleString("en-IN")}
                </span>
                {saree.originalPrice && (
                  <span className="text-muted-foreground line-through text-xl">
                    ₹{saree.originalPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <p className="font-inter text-foreground leading-relaxed mb-6">{saree.description}</p>

              {/* Details grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  ["Fabric", saree.fabric],
                  ["Color", saree.color],
                  ["Zari Type", saree.zariType || "—"],
                  ["Weight", saree.weight || "—"],
                  ["Occasion", saree.occasion || "—"],
                  ["Care", saree.careInstructions || "Dry clean only"],
                ].map(([label, value]) => (
                  <div key={label} className="bg-white rounded-xl p-3 shadow-card">
                    <p className="font-inter text-xs text-muted-foreground mb-0.5">{label}</p>
                    <p className="font-inter text-sm font-medium text-foreground">{value}</p>
                  </div>
                ))}
              </div>

              {/* Artisan */}
              {artisan && (
                <div className="bg-white rounded-2xl p-5 shadow-card mb-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div>
                      <p className="font-playfair font-semibold text-maroon">{artisan.name}</p>
                      <p className="font-inter text-xs text-muted-foreground">{artisan.village} · {artisan.experience} years experience</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <a href={`tel:${artisan.phone}`} className="flex items-center gap-1.5 text-xs font-inter text-gold hover:underline">
                      <Phone size={12} /> Call
                    </a>
                    <a href={`https://wa.me/${artisan.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-xs font-inter text-gold hover:underline">
                      WhatsApp
                    </a>
                    <a href={`mailto:${artisan.email}`} className="flex items-center gap-1.5 text-xs font-inter text-gold hover:underline">
                      <Mail size={12} /> Email
                    </a>
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={!saree.inStock}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shine"
                >
                  <ShoppingCart size={17} />
                  {saree.inStock ? "Add to Cart" : "Out of Stock"}
                </button>
                {saree.inStock && (
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 py-4 border-2 border-maroon text-maroon font-inter font-semibold rounded-full hover:bg-maroon hover:text-gold transition-all duration-300"
                  >
                    Buy Now
                  </button>
                )}
                <button
                  onClick={handleWishlist}
                  className={`w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    wishlisted ? "border-red-500 bg-red-50 text-red-500" : "border-border text-muted-foreground hover:border-red-400 hover:text-red-400"
                  }`}
                >
                  <Heart size={20} className={wishlisted ? "fill-red-500" : ""} />
                </button>
              </div>

              {/* Trust */}
              <div className="flex gap-6 mt-6 pt-6 border-t border-border">
                {[[Shield, "Authenticated"], [Truck, "Free Shipping"], [Star, "GI Tagged"]].map(([Icon, text]) => (
                  <div key={text as string} className="flex items-center gap-1.5">
                    <Icon size={14} className="text-gold" />
                    <span className="font-inter text-xs text-muted-foreground">{text as string}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetail;