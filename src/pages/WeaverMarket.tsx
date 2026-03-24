import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, User, Loader, Package, CheckCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const WeaverMarket = () => {
  const { user, isLoggedIn } = useAuth();
  const [sarees, setSarees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderModal, setOrderModal] = useState<any>(null);
  const [orderForm, setOrderForm] = useState({ quantity: "10", notes: "" });
  const [ordering, setOrdering] = useState(false);
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    fetch(`${API}/dashboard/weaver/sarees/all`)
      .then(r => r.json())
      .then(data => setSarees(Array.isArray(data) ? data : []))
      .catch(() => setSarees([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBulkOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) { toast.error("Please sign in to place an order"); return; }
    setOrdering(true);
    try {
      const token = localStorage.getItem("silk_token");
      const res = await fetch(`${API}/bulk-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          sareeId: orderModal._id,
          sareeName: orderModal.name,
          weaverId: orderModal.weaver,
          weaverName: orderModal.weaverName,
          quantity: Number(orderForm.quantity),
          pricePerPiece: orderModal.price,
          totalAmount: orderModal.price * Number(orderForm.quantity),
          notes: orderForm.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrdered(true);
      toast.success("Bulk order placed! Weaver will contact you.");
      setTimeout(() => { setOrderModal(null); setOrdered(false); setOrderForm({ quantity: "10", notes: "" }); }, 2000);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setOrdering(false);
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
              <span className="text-gold font-inter text-xs uppercase tracking-[0.25em]">No Middlemen</span>
              <div className="divider-gold w-12" />
            </div>
            <h1 className="font-playfair text-5xl font-bold text-gold mb-3">Direct from Weavers</h1>
            <p className="font-inter text-white/70 max-w-xl mx-auto">
              Buy directly from skilled artisans. Fair prices, genuine silk, bulk orders welcome.
            </p>
            {user?.role === "store" && (
              <div className="mt-4 inline-flex items-center gap-2 bg-gold/20 text-gold px-4 py-2 rounded-full font-inter text-sm">
                <Package size={14} /> Retail Store — Bulk ordering enabled
              </div>
            )}
          </motion.div>
        </div>

        <div className="container mx-auto px-4 py-16">
          {loading ? (
            <div className="text-center py-20">
              <Loader size={40} className="text-gold animate-spin mx-auto mb-4" />
              <p className="font-inter text-muted-foreground">Loading weaver listings...</p>
            </div>
          ) : sarees.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-card">
              <ShoppingBag size={48} className="text-gold mx-auto mb-4" />
              <h3 className="font-playfair text-2xl text-maroon mb-2">No listings yet</h3>
              <p className="font-inter text-muted-foreground">Weavers haven't listed any sarees yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sarees.map((saree, i) => (
                <motion.div key={saree._id}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-hover transition-all duration-300">
                  {saree.image ? (
                    <img src={saree.image} alt={saree.name} className="w-full h-56 object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop"; }} />
                  ) : (
                    <div className="w-full h-56 bg-gradient-to-br from-maroon/10 to-gold/10 flex items-center justify-center">
                      <ShoppingBag size={40} className="text-gold/40" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-playfair text-maroon font-semibold text-lg leading-tight">{saree.name}</h3>
                      <span className="text-xs font-inter bg-gold/10 text-gold px-2 py-0.5 rounded-full ml-2 shrink-0">{saree.fabric}</span>
                    </div>
                    <p className="font-inter text-xs text-muted-foreground mb-1">{saree.color} · {saree.occasion}</p>
                    <div className="flex items-center gap-1 mb-3">
                      <User size={11} className="text-muted-foreground" />
                      <span className="font-inter text-xs text-muted-foreground">{saree.weaverName}</span>
                      {saree.weaverLocation && (
                        <>
                          <MapPin size={11} className="text-muted-foreground ml-1" />
                          <span className="font-inter text-xs text-muted-foreground">{saree.weaverLocation}</span>
                        </>
                      )}
                    </div>
                    {saree.description && (
                      <p className="font-inter text-xs text-muted-foreground mb-4 line-clamp-2">{saree.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-playfair text-maroon font-bold text-xl">₹{saree.price?.toLocaleString("en-IN")}</span>
                        <span className="font-inter text-xs text-muted-foreground ml-1">per piece</span>
                      </div>
                      <button onClick={() => setOrderModal(saree)}
                        className="px-4 py-2 bg-maroon text-gold text-xs font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all">
                        {user?.role === "store" ? "Bulk Order" : "Enquire"}
                      </button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <span className="font-inter text-xs text-muted-foreground">Stock: {saree.stockCount} pieces</span>
                      <span className="font-inter text-xs text-green-600 font-semibold">● In Stock</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bulk Order Modal */}
      {orderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOrderModal(null)} />
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl z-10">
            {ordered ? (
              <div className="text-center py-6">
                <CheckCircle size={56} className="text-emerald-500 mx-auto mb-4" />
                <h3 className="font-playfair text-2xl text-maroon mb-2">Order Placed!</h3>
                <p className="font-inter text-muted-foreground">The weaver will contact you soon.</p>
              </div>
            ) : (
              <>
                <h3 className="font-playfair text-2xl font-bold text-maroon mb-1">{orderModal.name}</h3>
                <p className="font-inter text-sm text-muted-foreground mb-6">by {orderModal.weaverName}</p>
                <form onSubmit={handleBulkOrder} className="space-y-4">
                  <div>
                    <label className="font-inter text-xs text-muted-foreground mb-1 block">Quantity (pieces) *</label>
                    <input type="number" value={orderForm.quantity} min="1"
                      onChange={e => setOrderForm(p => ({ ...p, quantity: e.target.value }))}
                      className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div className="bg-silk rounded-xl p-4">
                    <div className="flex justify-between font-inter text-sm">
                      <span className="text-muted-foreground">Price per piece</span>
                      <span className="font-semibold">₹{orderModal.price?.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between font-inter text-sm mt-2">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-semibold">{orderForm.quantity} pieces</span>
                    </div>
                    <div className="flex justify-between font-playfair text-maroon font-bold text-lg mt-3 pt-3 border-t border-border">
                      <span>Total</span>
                      <span>₹{(orderModal.price * Number(orderForm.quantity)).toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                  <div>
                    <label className="font-inter text-xs text-muted-foreground mb-1 block">Notes (optional)</label>
                    <textarea value={orderForm.notes} onChange={e => setOrderForm(p => ({ ...p, notes: e.target.value }))}
                      rows={2} placeholder="Any special requirements..."
                      className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold resize-none" />
                  </div>
                  <button type="submit" disabled={ordering}
                    className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {ordering ? <><Loader size={16} className="animate-spin" /> Placing Order...</> : "Place Order — UPI Payment"}
                  </button>
                  <p className="text-center font-inter text-xs text-muted-foreground">
                    Payment goes directly to the weaver via UPI
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default WeaverMarket;