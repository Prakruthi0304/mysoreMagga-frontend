import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ShoppingCart, Eye, Heart, MapPin } from "lucide-react";
import { Saree } from "@/data/sarees";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";
import AuthenticityBadge from "@/components/AuthenticityBadge";

interface SareeCardProps {
  saree: Saree;
  index?: number;
}

const SareeCard = ({ saree, index = 0 }: SareeCardProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!saree.inStock) return;
    addToCart(saree);
    toast.success(`${saree.name} added to cart`, {
      description: `Rs.${saree.price.toLocaleString("en-IN")}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.1 }}
      className="group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-hover transition-all duration-500"
    >
      <Link to={`/product/${saree.id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-silk-cream img-zoom">
          <img
            src={saree.image}
            alt={saree.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600&h=800&fit=crop";
            }}
          />
          <div className="absolute inset-0 bg-maroon/0 group-hover:bg-maroon/20 transition-all duration-500" />

          {saree.badge && (
            <div className="absolute top-3 left-3">
              <span className="bg-gold text-maroon text-[10px] font-bold px-2.5 py-1 rounded-full font-inter uppercase tracking-wide">
                {saree.badge}
              </span>
            </div>
          )}

          {!saree.inStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-inter text-sm font-medium bg-black/60 px-4 py-2 rounded-full">
                Out of Stock
              </span>
            </div>
          )}

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300">
            <button className="p-2 bg-white rounded-full shadow-md hover:bg-gold hover:text-maroon transition-colors">
              <Heart size={14} />
            </button>
            <Link to={`/product/${saree.id}`}
              className="p-2 bg-white rounded-full shadow-md hover:bg-gold hover:text-maroon transition-colors">
              <Eye size={14} />
            </Link>
          </div>

          {saree.inStock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
              <button onClick={handleAddToCart}
                className="w-full py-3 bg-maroon text-gold font-inter text-sm font-medium tracking-wide hover:bg-gold hover:text-maroon transition-colors duration-300 flex items-center justify-center gap-2 shine">
                <ShoppingCart size={15} /> Add to Cart
              </button>
            </div>
          )}
        </div>
      </Link>

      <Link to={`/product/${saree.id}`} className="block p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-playfair text-foreground font-semibold text-sm leading-tight line-clamp-2 group-hover:text-maroon transition-colors">
            {saree.name}
          </h3>
        </div>

        <div className="flex items-center gap-1 mb-2">
          <MapPin size={11} className="text-gold shrink-0" />
          <span className="text-muted-foreground text-[11px] font-inter truncate">
            {saree.artisanName} · {saree.location.split(",")[0]}
          </span>
        </div>

        <div className="text-[11px] text-muted-foreground font-inter mb-2">
          {saree.fabric} · {saree.color}
        </div>

        <div className="mb-3">
          <AuthenticityBadge size="sm" saree={{ name: saree.name, fabric: saree.fabric, weaverName: saree.artisanName, weaverLocation: saree.location }} />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-playfair text-maroon font-bold text-lg">
              Rs.{saree.price.toLocaleString("en-IN")}
            </span>
            {saree.originalPrice && (
              <span className="text-muted-foreground text-xs line-through">
                Rs.{saree.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
          </div>
          {saree.inStock && (
            <span className="text-[10px] text-emerald-600 font-medium font-inter bg-emerald-50 px-2 py-0.5 rounded-full">
              In Stock
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default SareeCard;
