import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Truck, RefreshCw, Award, Scissors } from "lucide-react";
import { artisans } from "@/data/sarees";
import artisanWeavingImg from "@/assets/artisan-weaving.jpg";
import heritageImg from "@/assets/heritage-bg.jpg";
import sareeCloseupImg from "@/assets/saree-closeup.jpg";

const HeritageStory = () => {
  return (
    <section className="section-py bg-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative z-10 img-zoom rounded-2xl overflow-hidden shadow-luxury">
              <img src={artisanWeavingImg} alt="Mysore silk artisan weaving" className="w-full h-[480px] object-cover" />
            </div>
            <div className="absolute -bottom-8 -right-8 w-56 h-56 img-zoom rounded-xl overflow-hidden shadow-gold z-20 border-4 border-white">
              <img src={sareeCloseupImg} alt="Silk saree close-up" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gold/10 rounded-full" />
            <div className="absolute top-1/2 -left-3 w-4 h-40 gradient-gold rounded-full opacity-60" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="divider-gold w-12 h-0.5" />
              <span className="font-inter text-gold text-xs uppercase tracking-[0.25em]">Our Story</span>
            </div>
            <h2 className="font-playfair text-4xl md:text-5xl font-bold text-maroon mb-6 leading-tight">
              Centuries of Silk,<br />Woven with Love
            </h2>
            <p className="font-inter text-muted-foreground text-base leading-relaxed mb-6">
              Mysore silk has been the pride of Karnataka since the reign of Maharaja Krishnaraja Wadiyar IV.
              The royal looms of Mysore created the world's most exquisite silk — a tradition our platform carries
              forward by directly connecting you with master weavers.
            </p>
            <p className="font-inter text-muted-foreground text-base leading-relaxed mb-8">
              Every thread tells a story. Every motif carries history. By purchasing from ಮೈಸೂರುಮಗ್ಗ,
              you support over 500 artisan families in 25+ villages across Karnataka.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { icon: Shield, text: "100% Authenticated Silk" },
                { icon: Award, text: "GI Tagged Products" },
                { icon: Truck, text: "Free Insured Shipping" },
                { icon: RefreshCw, text: "Easy 15-Day Returns" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <div className="p-2 bg-gold/10 rounded-full">
                    <Icon size={16} className="text-gold" />
                  </div>
                  <span className="font-inter text-sm font-medium text-foreground">{text}</span>
                </div>
              ))}
            </div>

            <Link
              to="/learning"
              className="group inline-flex items-center gap-2 font-inter text-sm font-semibold text-maroon hover:text-gold transition-colors gold-underline"
            >
              Discover Our Heritage Story
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const ArtisanSpotlight = () => {
  return (
    <section className="section-py bg-maroon overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="divider-gold w-16 h-0.5" />
            <span className="font-inter text-gold text-xs uppercase tracking-[0.25em]">The People Behind Every Thread</span>
            <div className="divider-gold w-16 h-0.5" />
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-gold mb-4">Artisan Spotlight</h2>
          <p className="font-inter text-white/70 text-lg max-w-xl mx-auto">
            Meet the masters whose hands create your heirloom
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisans.slice(0, 3).map((artisan, i) => (
            <motion.div
              key={artisan.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-gold rounded-2xl p-6 hover:shadow-gold transition-all duration-500 group"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 shrink-0 flex items-center justify-center">
                  <Scissors size={28} className="text-gold" />
                </div>
                <div>
                  <h3 className="font-playfair text-gold font-semibold text-lg">{artisan.name}</h3>
                  <p className="font-inter text-white/60 text-xs">{artisan.village}, {artisan.district}</p>
                  <p className="font-inter text-gold/70 text-xs mt-1">{artisan.experience} years · {artisan.specialization}</p>
                </div>
              </div>
              <p className="font-inter text-white/65 text-sm leading-relaxed mb-4">{artisan.bio}</p>
              <div className="flex items-center justify-between">
                <span className="font-inter text-xs text-gold/60">{artisan.totalSarees}+ sarees crafted</span>
                <div className="flex items-center gap-1">
                  <span className="text-gold text-sm">★</span>
                  <span className="font-inter text-white/70 text-xs">{artisan.rating}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-10"
        >
          <Link
            to="/artisans"
            className="group inline-flex items-center gap-2 px-8 py-4 border border-gold text-gold font-inter font-medium text-sm rounded-full hover:bg-gold hover:text-maroon transition-all duration-300"
          >
            Meet All Artisans
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

const CategorySection = () => {
  const categories = [
    { name: "Traditional Mysore Silk", count: 18, img: "/sarees/s1.jpg", path: "/shop?category=Traditional+Mysore+Silk" },
    { name: "Bridal Silk", count: 16, img: "/sarees/s19.jpg", path: "/shop?category=Bridal+Silk" },
    { name: "Temple Border", count: 14, img: "/sarees/s51.jpg", path: "/shop?category=Temple+Border+Silk" },
    { name: "Premium Gold Zari", count: 16, img: "/sarees/s65.jpg", path: "/shop?category=Premium+Gold+Zari+Silk" },
    { name: "Soft Silk", count: 16, img: "/sarees/s35.jpg", path: "/shop?category=Soft+Silk" },
    { name: "Designer Collection", count: 20, img: "/sarees/s81.jpg", path: "/shop?category=Designer+Collection" },
  ];

  return (
    <section className="section-py bg-silk">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="divider-gold w-16 h-0.5" />
            <span className="font-inter text-gold text-xs uppercase tracking-[0.25em]">Shop By Category</span>
            <div className="divider-gold w-16 h-0.5" />
          </div>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-maroon">
            Discover Collections
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={cat.path} className="group block relative aspect-[3/4] rounded-2xl overflow-hidden img-zoom shadow-card hover:shadow-hover transition-all duration-500">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-maroon/85 via-maroon/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <h3 className="font-playfair text-white font-bold text-lg group-hover:text-gold transition-colors">{cat.name}</h3>
                  <p className="font-inter text-white/60 text-sm mt-1">{cat.count} pieces</p>
                </div>
                <div className="absolute top-4 right-4 p-2 rounded-full bg-gold/0 group-hover:bg-gold transition-all duration-300">
                  <ArrowRight size={16} className="text-transparent group-hover:text-maroon transition-colors" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PreviewBanner = () => {
  return (
    <section
      className="relative py-24 overflow-hidden"
      style={{ backgroundImage: `url(${heritageImg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-maroon/80" />
      <div className="relative container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <p className="font-inter text-gold text-xs uppercase tracking-[0.3em] mb-4">Sustainable Commerce</p>
          <h2 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-6">
            Have an Old Silk Saree?<br />
            <span className="text-gold">Give it New Life</span>
          </h2>
          <p className="font-inter text-white/70 text-lg mb-8">
            Our Pre-Loved marketplace connects vintage silk lovers. Sell your cherished sarees or find a rare vintage piece.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              to="/preloved"
              className="px-8 py-4 bg-gold text-maroon font-inter font-semibold text-sm rounded-full hover:bg-gold-light transition-all shine shadow-gold"
            >
              Browse Pre-Loved
            </Link>
            <Link
              to="/preloved#sell"
              className="px-8 py-4 glass text-white font-inter font-medium text-sm rounded-full hover:bg-white/20 transition-all"
            >
              Sell Your Saree
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { HeritageStory, ArtisanSpotlight, CategorySection, PreviewBanner };