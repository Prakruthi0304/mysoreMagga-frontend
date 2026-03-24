import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-maroon text-white">
      {/* Top strip */}
      <div className="divider-gold h-0.5" />

      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <h2 className="font-playfair text-3xl text-gold font-bold mb-3">ಮೈಸೂರುಮಗ್ಗ</h2>
            <p className="text-white/60 text-sm font-inter leading-relaxed mb-6">
              Preserving the royal heritage of Mysore silk weaving through direct artisan commerce since 2024.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-full border border-gold/30 text-gold/70 hover:bg-gold hover:text-maroon transition-all duration-300"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair text-gold text-lg font-semibold mb-5">Collections</h3>
            <ul className="space-y-3">
              {[
                ["Traditional Mysore Silk", "/shop?category=Traditional+Mysore+Silk"],
                ["Bridal Collection", "/shop?category=Bridal+Silk"],
                ["Soft Silk", "/shop?category=Soft+Silk"],
                ["Temple Border", "/shop?category=Temple+Border+Silk"],
                ["Premium Gold Zari", "/shop?category=Premium+Gold+Zari+Silk"],
                ["Designer Collection", "/shop?category=Designer+Collection"],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-white/60 hover:text-gold font-inter text-sm transition-colors gold-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-playfair text-gold text-lg font-semibold mb-5">Platform</h3>
            <ul className="space-y-3">
              {[
                ["Meet the Artisans", "/artisans"],
                ["Learning Center", "/learning"],
                ["Pre-Loved Sarees", "/preloved"],
                ["Bulk / Wholesale", "/wholesale"],
                ["Sell Your Saree", "/preloved#sell"],
                ["Track Order", "/orders"],
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-white/60 hover:text-gold font-inter text-sm transition-colors gold-underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-playfair text-gold text-lg font-semibold mb-5">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex gap-3 items-start">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                <span className="text-white/60 text-sm font-inter">
                  12, Silk Weavers Colony, Mysore – 570 001, Karnataka, India
                </span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone size={16} className="text-gold shrink-0" />
                <a href="tel:+918212345678" className="text-white/60 hover:text-gold text-sm font-inter transition-colors">
                  +91 821 234 5678
                </a>
              </li>
              <li className="flex gap-3 items-center">
                <Mail size={16} className="text-gold shrink-0" />
                <a href="mailto:hello@mysoremagga.in" className="text-white/60 hover:text-gold text-sm font-inter transition-colors">
                  hello@mysoremagga.in
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-white/70 text-xs font-inter mb-2 uppercase tracking-widest">Subscribe for heritage updates</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/10 border border-gold/30 text-white placeholder-white/30 text-sm px-3 py-2 rounded font-inter outline-none focus:border-gold"
                />
                <button className="bg-gold text-maroon px-3 py-2 rounded font-inter text-sm font-medium hover:bg-gold-light transition-colors">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="divider-gold mt-12 mb-6 opacity-30" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-white/40 text-xs font-inter">
          <p>© 2026 ಮೈಸೂರುಮಗ್ಗ. All rights reserved. Made with ❤ for Mysore's weavers.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">Terms of Use</Link>
            <Link to="/shipping" className="hover:text-gold transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
