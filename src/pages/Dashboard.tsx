import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Loader, ShoppingBag, Leaf, Scissors, Bell, CheckCheck, Package, Video } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/context/AuthContext";
import { ordersApi } from "@/lib/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const WeavingVideoSection = () => {
  const { user, updateUser } = useAuth();
  const [videoUrl, setVideoUrl] = useState(user?.weavingVideoUrl || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUser({ weavingVideoUrl: videoUrl } as any);
      toast.success("Weaving video URL saved!");
    } catch {
      toast.error("Failed to save video URL");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card">
      <div className="flex items-center gap-2 mb-4">
        <Video size={20} className="text-gold" />
        <h2 className="font-playfair text-xl font-bold text-maroon">My Weaving Video</h2>
      </div>
      <p className="font-inter text-sm text-muted-foreground mb-4">
        Add your YouTube video showing your weaving process. This will be displayed on your public profile so customers can see your craft!
      </p>
      <div className="flex gap-3">
        <input
          type="text"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="e.g. https://www.youtube.com/watch?v=..."
          className="flex-1 border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
        />
        <button onClick={handleSave} disabled={saving}
          className="px-6 py-3 bg-maroon text-gold font-inter font-semibold rounded-xl hover:bg-gold hover:text-maroon transition-all disabled:opacity-60 flex items-center gap-2">
          {saving ? <Loader size={14} className="animate-spin" /> : null}
          Save
        </button>
      </div>
      {videoUrl && (
        <p className="font-inter text-xs text-emerald-600 mt-2">✓ Video URL saved — visible on your public profile</p>
      )}
    </div>
  );
};

const WeaverListingForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState({ name: "", price: "", description: "", color: "", fabric: "Pure Silk", occasion: "Casual", image: "", stockCount: "1" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("silk_token");
      const res = await fetch(`${API}/dashboard/weaver/sarees`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, price: Number(form.price), stockCount: Number(form.stockCount) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Saree listed successfully!");
      setForm({ name: "", price: "", description: "", color: "", fabric: "Pure Silk", occasion: "Casual", image: "", stockCount: "1" });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to list saree");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card space-y-4">
      <h3 className="font-playfair text-xl font-bold text-maroon">List a New Saree</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Saree Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
            placeholder="e.g. Royal Crimson Zari Silk" />
        </div>
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Price (₹) *</label>
          <input name="price" type="number" value={form.price} onChange={handleChange} required min="1"
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
            placeholder="e.g. 12000" />
        </div>
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Color *</label>
          <input name="color" value={form.color} onChange={handleChange} required
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
            placeholder="e.g. Crimson Red" />
        </div>
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Stock Count</label>
          <input name="stockCount" type="number" value={form.stockCount} onChange={handleChange} min="1"
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold" />
        </div>
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Fabric</label>
          <select name="fabric" value={form.fabric} onChange={handleChange}
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold bg-white">
            <option>Pure Silk</option>
            <option>Soft Silk</option>
            <option>Crepe Silk</option>
            <option>Raw Silk</option>
            <option>Tussar Silk</option>
          </select>
        </div>
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Occasion</label>
          <select name="occasion" value={form.occasion} onChange={handleChange}
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold bg-white">
            <option>Casual</option>
            <option>Wedding</option>
            <option>Festival</option>
            <option>Bridal</option>
            <option>Office</option>
          </select>
        </div>
      </div>
      <div>
        <label className="font-inter text-xs text-muted-foreground mb-1 block">Description *</label>
        <textarea name="description" value={form.description} onChange={handleChange} required rows={3}
          className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold resize-none"
          placeholder="Describe the saree — weaving technique, special features..." />
      </div>
      <div>
        <label className="font-inter text-xs text-muted-foreground mb-1 block">Photo URL (optional)</label>
        <input name="image" value={form.image} onChange={handleChange}
          className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
          placeholder="Paste image link from imgur.com" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? <><Loader size={16} className="animate-spin" /> Listing...</> : <><Plus size={16} /> List Saree</>}
      </button>
    </form>
  );
};

const FarmerListingForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [form, setForm] = useState({ silkType: "Mulberry", quantity: "", pricePerKg: "", quality: "Grade A", description: "", location: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("silk_token");
      const res = await fetch(`${API}/dashboard/farmer/silk`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ ...form, quantity: Number(form.quantity), pricePerKg: Number(form.pricePerKg) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      toast.success("Silk batch listed successfully!");
      setForm({ silkType: "Mulberry", quantity: "", pricePerKg: "", quality: "Grade A", description: "", location: "" });
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to list silk");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-card space-y-4">
      <h3 className="font-playfair text-xl font-bold text-maroon">List Raw Silk Batch</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Silk Type *</label>
          <select name="silkType" value={form.silkType} onChange={handleChange}
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold bg-white">
            <option>Mulberry</option>
            <option>Tussar</option>
            <option>Eri</option>
            <option>Muga</option>
          </select>
        </div>
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Quality Grade</label>
          <select name="quality" value={form.quality} onChange={handleChange}
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold bg-white">
            <option>Grade A</option>
            <option>Grade B</option>
            <option>Grade C</option>
          </select>
        </div>
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Quantity (kg) *</label>
          <input name="quantity" type="number" value={form.quantity} onChange={handleChange} required min="1"
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
            placeholder="e.g. 50" />
        </div>
        <div>
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Price per kg (₹) *</label>
          <input name="pricePerKg" type="number" value={form.pricePerKg} onChange={handleChange} required min="1"
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
            placeholder="e.g. 3500" />
        </div>
        <div className="md:col-span-2">
          <label className="font-inter text-xs text-muted-foreground mb-1 block">Farm Location</label>
          <input name="location" value={form.location} onChange={handleChange}
            className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold"
            placeholder="e.g. Ramanagara, Karnataka" />
        </div>
      </div>
      <div>
        <label className="font-inter text-xs text-muted-foreground mb-1 block">Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} rows={3}
          className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold resize-none"
          placeholder="Describe the silk quality, harvesting method..." />
      </div>
      <button type="submit" disabled={loading}
        className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center justify-center gap-2 disabled:opacity-60">
        {loading ? <><Loader size={16} className="animate-spin" /> Listing...</> : <><Leaf size={16} /> List Silk Batch</>}
      </button>
    </form>
  );
};

const Dashboard = () => {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [bulkOrders, setBulkOrders] = useState<any[]>([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) return;
    setLoading(true);
    const token = localStorage.getItem("silk_token");

    const fetchData = async () => {
      try {
        if (user?.role === "consumer") {
          const o = await ordersApi.getMyOrders();
          setOrders(Array.isArray(o) ? o : []);
        } else if (user?.role === "weaver") {
          const [sareesRes, notifRes] = await Promise.all([
            fetch(`${API}/dashboard/weaver/sarees`, { headers: { Authorization: `Bearer ${token}` } }),
            fetch(`${API}/bulk-orders/weaver-notifications`, { headers: { Authorization: `Bearer ${token}` } }),
          ]);
          const sarees = await sareesRes.json();
          const notifs = await notifRes.json();
          setMyListings(Array.isArray(sarees) ? sarees : []);
          setBulkOrders(Array.isArray(notifs) ? notifs : []);
        } else if (user?.role === "farmer") {
          const res = await fetch(`${API}/dashboard/farmer/silk`, { headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          setMyListings(Array.isArray(data) ? data : []);
        } else if (user?.role === "store") {
          const res = await fetch(`${API}/bulk-orders/my`, { headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          setBulkOrders(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isLoggedIn, user, refresh]);

  const markSeen = async (id: string) => {
    const token = localStorage.getItem("silk_token");
    await fetch(`${API}/bulk-orders/seen/${id}`, { method: "PUT", headers: { Authorization: `Bearer ${token}` } });
    setBulkOrders(prev => prev.map(o => o._id === id ? { ...o, seenByWeaver: true } : o));
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-silk">
        <Navbar />
        <div className="pt-40 text-center">
          <h2 className="font-playfair text-3xl text-maroon mb-4">Please sign in to view your dashboard</h2>
          <Link to="/" className="text-gold hover:underline font-inter">Go Home</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const roleColors: Record<string, string> = {
    consumer: "bg-amber-100 text-amber-800",
    weaver: "bg-red-100 text-red-800",
    farmer: "bg-green-100 text-green-800",
    store: "bg-blue-100 text-blue-800",
  };

  const unseenCount = bulkOrders.filter(o => !o.seenByWeaver).length;

  return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="font-playfair text-4xl font-bold text-maroon">Welcome, {user?.name}!</h1>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-inter font-bold ${roleColors[user?.role || "consumer"]}`}>
              {user?.role?.charAt(0).toUpperCase()}{user?.role?.slice(1)}
            </span>
            {user?.role === "weaver" && unseenCount > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-inter font-bold bg-emerald-100 text-emerald-800 animate-pulse">
                <Bell size={12} /> {unseenCount} New Order{unseenCount > 1 ? "s" : ""}!
              </span>
            )}
          </div>
          {user?.businessName && <p className="font-inter text-muted-foreground">{user.businessName} · {user.location}</p>}
          {user?.specialization && <p className="font-inter text-sm text-gold">{user.specialization}</p>}
        </motion.div>

        {/* CONSUMER */}
        {user?.role === "consumer" && (
          <div>
            <h2 className="font-playfair text-2xl font-bold text-maroon mb-6">My Orders</h2>
            {loading ? (
              <div className="text-center py-12 font-inter text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow-card text-center">
                <ShoppingBag size={48} className="text-gold mx-auto mb-4" />
                <h3 className="font-playfair text-2xl text-maroon mb-2">No orders yet</h3>
                <p className="font-inter text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Link to="/shop" className="px-8 py-3 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all">
                  Browse Sarees
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order._id} className="bg-white rounded-2xl p-6 shadow-card">
                    <div className="flex items-center justify-between mb-4">
                      <p className="font-inter text-sm font-semibold">{order._id}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-inter font-bold ${
                        order.status === "delivered" ? "bg-green-100 text-green-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>{order.status}</span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="font-inter text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString("en-IN")}</span>
                      <span className="font-playfair font-bold text-maroon">₹{order.totalAmount?.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WEAVER */}
        {user?.role === "weaver" && (
          <div className="space-y-8">

            {/* Bulk Order Notifications */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Bell size={20} className="text-maroon" />
                <h2 className="font-playfair text-2xl font-bold text-maroon">Bulk Order Requests</h2>
                {unseenCount > 0 && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unseenCount} new</span>
                )}
              </div>
              {loading ? (
                <div className="text-center py-6 font-inter text-muted-foreground">Loading...</div>
              ) : bulkOrders.length === 0 ? (
                <div className="bg-white rounded-2xl p-6 shadow-card text-center">
                  <Bell size={32} className="text-gold/40 mx-auto mb-2" />
                  <p className="font-inter text-muted-foreground">No bulk orders yet. List your sarees to start receiving orders!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {bulkOrders.map((order) => (
                    <motion.div key={order._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className={`bg-white rounded-2xl p-5 shadow-card border-l-4 ${!order.seenByWeaver ? "border-emerald-500" : "border-transparent"}`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {!order.seenByWeaver && (
                              <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">NEW</span>
                            )}
                            <h3 className="font-inter font-semibold text-maroon">{order.storeName}</h3>
                            <span className="font-inter text-xs text-muted-foreground">wants to buy</span>
                          </div>
                          <p className="font-playfair text-lg font-bold text-maroon">{order.sareeName}</p>
                          <div className="grid grid-cols-3 gap-3 mt-3">
                            <div className="bg-silk rounded-xl p-2 text-center">
                              <p className="font-inter text-xs text-muted-foreground">Quantity</p>
                              <p className="font-inter font-bold text-sm">{order.quantity} pcs</p>
                            </div>
                            <div className="bg-silk rounded-xl p-2 text-center">
                              <p className="font-inter text-xs text-muted-foreground">Per Piece</p>
                              <p className="font-inter font-bold text-sm">₹{order.pricePerPiece?.toLocaleString("en-IN")}</p>
                            </div>
                            <div className="bg-silk rounded-xl p-2 text-center">
                              <p className="font-inter text-xs text-muted-foreground">Total</p>
                              <p className="font-playfair font-bold text-sm text-maroon">₹{order.totalAmount?.toLocaleString("en-IN")}</p>
                            </div>
                          </div>
                          {order.notes && <p className="font-inter text-xs text-muted-foreground mt-2">Note: {order.notes}</p>}
                          <p className="font-inter text-xs text-muted-foreground mt-1">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                        </div>
                        {!order.seenByWeaver && (
                          <button onClick={() => markSeen(order._id)}
                            className="ml-4 flex items-center gap-1 px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-inter font-semibold hover:bg-emerald-200 transition-all">
                            <CheckCheck size={12} /> Mark Read
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Weaving Video URL */}
            <WeavingVideoSection />

            <WeaverListingForm onSuccess={() => setRefresh(r => r + 1)} />

            <div>
              <h2 className="font-playfair text-2xl font-bold text-maroon mb-6">My Listed Sarees</h2>
              {loading ? (
                <div className="text-center py-8 font-inter text-muted-foreground">Loading...</div>
              ) : myListings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-card text-center">
                  <Scissors size={40} className="text-gold mx-auto mb-3" />
                  <p className="font-playfair text-xl text-maroon">No sarees listed yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {myListings.map((saree: any) => (
                    <div key={saree._id} className="bg-white rounded-2xl overflow-hidden shadow-card">
                      {saree.image && (
                        <img src={saree.image} alt={saree.name} className="w-full h-48 object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      )}
                      <div className="p-4">
                        <h3 className="font-playfair text-maroon font-semibold">{saree.name}</h3>
                        <p className="font-inter text-xs text-muted-foreground mt-1">{saree.color} · {saree.fabric}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-playfair text-maroon font-bold">₹{saree.price?.toLocaleString("en-IN")}</span>
                          <span className="font-inter text-xs text-muted-foreground">Stock: {saree.stockCount}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FARMER */}
        {user?.role === "farmer" && (
          <div className="space-y-8">
            <FarmerListingForm onSuccess={() => setRefresh(r => r + 1)} />
            <div>
              <h2 className="font-playfair text-2xl font-bold text-maroon mb-6">My Silk Batches</h2>
              {loading ? (
                <div className="text-center py-8 font-inter text-muted-foreground">Loading...</div>
              ) : myListings.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 shadow-card text-center">
                  <Leaf size={40} className="text-gold mx-auto mb-3" />
                  <p className="font-playfair text-xl text-maroon">No silk batches listed yet</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {myListings.map((batch: any) => (
                    <div key={batch._id} className="bg-white rounded-2xl p-5 shadow-card">
                      <h3 className="font-playfair text-maroon font-semibold">{batch.silkType} Silk</h3>
                      <p className="font-inter text-xs text-muted-foreground">{batch.quality} · {batch.location}</p>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-silk rounded-xl p-3 text-center">
                          <p className="font-inter text-xs text-muted-foreground">Quantity</p>
                          <p className="font-playfair text-maroon font-bold">{batch.quantity} kg</p>
                        </div>
                        <div className="bg-silk rounded-xl p-3 text-center">
                          <p className="font-inter text-xs text-muted-foreground">Price/kg</p>
                          <p className="font-playfair text-maroon font-bold">₹{batch.pricePerKg?.toLocaleString("en-IN")}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* STORE */}
        {user?.role === "store" && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Package size={20} className="text-maroon" />
              <h2 className="font-playfair text-2xl font-bold text-maroon">My Bulk Orders</h2>
            </div>
            {loading ? (
              <div className="text-center py-12 font-inter text-muted-foreground">Loading...</div>
            ) : bulkOrders.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow-card text-center">
                <Package size={48} className="text-gold mx-auto mb-4" />
                <h3 className="font-playfair text-2xl text-maroon mb-2">No bulk orders yet</h3>
                <p className="font-inter text-muted-foreground mb-6">Browse the Weaver Market to place bulk orders</p>
                <Link to="/weaver-market" className="px-8 py-3 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all">
                  Go to Weaver Market
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bulkOrders.map((order) => (
                  <div key={order._id} className="bg-white rounded-2xl p-6 shadow-card">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="font-playfair text-maroon font-semibold">{order.sareeName}</h3>
                        <p className="font-inter text-xs text-muted-foreground">by {order.weaverName}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-inter font-bold ${
                        order.status === "confirmed" ? "bg-green-100 text-green-800" :
                        order.status === "cancelled" ? "bg-red-100 text-red-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>{order.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-silk rounded-xl p-2 text-center">
                        <p className="font-inter text-xs text-muted-foreground">Quantity</p>
                        <p className="font-inter font-bold text-sm">{order.quantity} pcs</p>
                      </div>
                      <div className="bg-silk rounded-xl p-2 text-center">
                        <p className="font-inter text-xs text-muted-foreground">Per Piece</p>
                        <p className="font-inter font-bold text-sm">₹{order.pricePerPiece?.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="bg-silk rounded-xl p-2 text-center">
                        <p className="font-inter text-xs text-muted-foreground">Total</p>
                        <p className="font-playfair font-bold text-sm text-maroon">₹{order.totalAmount?.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                    <p className="font-inter text-xs text-muted-foreground mt-3">{new Date(order.createdAt).toLocaleDateString("en-IN")}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;