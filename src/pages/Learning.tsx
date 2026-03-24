import { motion } from "framer-motion";
import { useState } from "react";
import { BookOpen, Clock, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const steps = [
  { step: "1", title: "Silk Thread Preparation", desc: "Raw silk is sourced from silkworms reared in Mysore's mulberry farms. The cocoons are boiled to unwind the silk filaments, which are then degummed and twisted." },
  { step: "2", title: "Dyeing", desc: "Silk threads are dyed using traditional and natural dye processes. Mysore silk achieves its signature vibrancy through careful dyeing techniques passed down generations." },
  { step: "3", title: "Warping & Sizing", desc: "The dyed silk threads are wound onto a warp beam. The warp threads are then sized with rice starch to add strength for the weaving process." },
  { step: "4", title: "Zari Preparation", desc: "Gold and silver zari threads are prepared separately. Pure gold zari for premium sarees involves real gold wire wrapped around a silk core." },
  { step: "5", title: "Loom Setup", desc: "The handloom is meticulously set up. The warp is threaded through heddles and reed. This process alone can take up to 2 days for complex designs." },
  { step: "6", title: "Weaving", desc: "The weaver operates the handloom using foot pedals and a shuttle. Each pass of the shuttle creates one row of weave. A single saree can take 10–30 days." },
  { step: "7", title: "Zari Work & Pallu", desc: "The elaborate pallu (end piece) with gold zari motifs is woven using the extra weft technique. This is the most skilled part of the weaving process." },
  { step: "8", title: "Finishing & Quality Check", desc: "The completed saree undergoes steam finishing, inspection, and certification. GI Tagged Mysore Silk gets a unique serial number." },
];

const articles = [
  { title: "The History of Mysore Silk", read: "8 min", category: "History", desc: "Tracing the origins of Mysore silk from the 1912 royal initiative to a global heritage craft.", url: "https://en.wikipedia.org/wiki/Mysore_silk" },
  { title: "Understanding Gold Zari Work", read: "5 min", category: "Craft", desc: "How pure gold is transformed into delicate threads that adorn the world's finest sarees.", url: "https://en.wikipedia.org/wiki/Zari" },
  { title: "Hoysala Temple Motifs in Silk", read: "6 min", category: "Art", desc: "The architectural masterpieces of Karnataka reimagined as woven motifs in temple border silks.", url: "https://en.wikipedia.org/wiki/Hoysala_architecture" },
  { title: "Caring for Your Mysore Silk", read: "3 min", category: "Guide", desc: "Expert tips to preserve the luster and longevity of your precious silk heirlooms.", url: "https://www.taneira.com/blog/how-to-care-for-silk-sarees" },
  { title: "The GI Tag & Why It Matters", read: "4 min", category: "Commerce", desc: "Understanding the Geographical Indication tag that protects authentic Mysore silk.", url: "https://ipindia.gov.in/gi.htm" },
  { title: "Artisan Communities of Mandya", read: "7 min", category: "Culture", desc: "A deep dive into the weaving communities of Mandya district and their generations of expertise.", url: "https://en.wikipedia.org/wiki/Mandya_district" },
];

const Learning = () => {
  const [openStep, setOpenStep] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-20">
        {/* Hero */}
        <div className="bg-maroon py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-center gap-4 mb-3">
              <div className="divider-gold w-12" />
              <span className="text-gold font-inter text-xs uppercase tracking-[0.25em]">Heritage Education</span>
              <div className="divider-gold w-12" />
            </div>
            <h1 className="font-playfair text-5xl font-bold text-gold mb-3">The Silk Learning Center</h1>
            <p className="font-inter text-white/70 max-w-xl mx-auto">Discover the art, history, and science of Mysore silk weaving</p>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">

          {/* Local Video Player */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mb-16 rounded-3xl overflow-hidden shadow-luxury">
            <video
              className="w-full rounded-3xl"
              controls
              autoPlay
              muted
              style={{ maxHeight: "500px", objectFit: "cover" }}
            >
              <source src="/silk-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <div className="bg-maroon px-6 py-4">
              <p className="font-playfair text-gold text-xl font-bold">The Art of Mysore Silk Weaving</p>
              <p className="font-inter text-white/70 text-sm mt-1">🎬 Our Documentary</p>
            </div>
          </motion.div>

          {/* History */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="divider-gold w-10" />
              <h2 className="font-playfair text-3xl font-bold text-maroon">The History of Mysore Silk</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                ["1912", "Royal Initiative", "Maharaja Krishnaraja Wadiyar IV established the first silk weaving factory in Mysore, making Karnataka the center of Indian silk."],
                ["1930s", "Handloom Revolution", "Mysore silk went from factory to handloom, creating thousands of artisan jobs and establishing unique weaving traditions."],
                ["2005", "GI Tag Recognition", "Mysore Silk received the Geographical Indication tag, officially recognizing it as an authentic product of Karnataka's heritage."]
              ].map(([year, title, text]) => (
                <div key={year} className="bg-white rounded-2xl p-6 shadow-card border-l-4 border-gold">
                  <div className="font-playfair text-3xl text-gold font-bold mb-2">{year}</div>
                  <h3 className="font-playfair text-maroon font-semibold text-lg mb-2">{title}</h3>
                  <p className="font-inter text-muted-foreground text-sm leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Weaving Steps */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-16">
            <div className="flex items-center gap-4 mb-6">
              <div className="divider-gold w-10" />
              <h2 className="font-playfair text-3xl font-bold text-maroon">Step-by-Step Weaving Tutorial</h2>
            </div>
            <div className="space-y-3">
              {steps.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-card overflow-hidden">
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-silk-cream transition-colors"
                    onClick={() => setOpenStep(openStep === i ? null : i)}
                  >
                    <div className="w-10 h-10 rounded-full gradient-gold flex items-center justify-center text-maroon font-bold font-inter text-sm shrink-0">{s.step}</div>
                    <span className="font-playfair text-maroon font-semibold text-lg flex-1">{s.title}</span>
                    {openStep === i ? <ChevronUp size={18} className="text-gold" /> : <ChevronDown size={18} className="text-muted-foreground" />}
                  </button>
                  {openStep === i && (
                    <div className="px-5 pb-5 pl-20">
                      <p className="font-inter text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Articles */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="divider-gold w-10" />
              <h2 className="font-playfair text-3xl font-bold text-maroon">Heritage Articles</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <motion.a
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 group cursor-pointer block"
                >
                  <span className="inline-block bg-gold/10 text-gold text-xs font-inter font-medium px-3 py-1 rounded-full mb-3">{article.category}</span>
                  <h3 className="font-playfair text-maroon font-bold text-lg mb-2 group-hover:text-gold transition-colors flex items-start gap-2">
                    {article.title}
                    <ExternalLink size={14} className="shrink-0 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h3>
                  <p className="font-inter text-muted-foreground text-sm leading-relaxed mb-4">{article.desc}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock size={12} />
                    <span className="font-inter text-xs">{article.read} read</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Learning;