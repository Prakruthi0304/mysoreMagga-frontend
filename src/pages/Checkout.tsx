import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Loader, MapPin, Smartphone, Banknote, Home } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ordersApi, ShippingAddress } from "@/lib/api";
import { toast } from "sonner";

const Checkout = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [finalTotal, setFinalTotal] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI">("COD");
  const [upiId, setUpiId] = useState("");
  const [savedAddress, setSavedAddress] = useState<ShippingAddress | null>(null);

  const [form, setForm] = useState<ShippingAddress>({
    name: user?.name || "",
    phone: user?.phone || "",
    street: user?.address?.street || "",
    city: user?.address?.city || "",
    state: user?.address?.state || "Karnataka",
    pincode: user?.address?.pincode || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Please log in to place an order");
      navigate("/");
      return;
    }
    if (cart.length === 0) return;
    if (paymentMethod === "UPI" && !upiId) {
      toast.error("Please enter your UPI ID");
      return;
    }

    // Save total BEFORE clearing cart
    const total = cartTotal;
    setFinalTotal(total);
    setSavedAddress(form);

    setLoading(true);
    try {
      const res = await ordersApi.place({
        items: cart.map((item) => ({
          sareeId: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          artisanName: item.artisanName,
          color: item.color,
        })),
        shippingAddress: form,
        paymentMethod: paymentMethod,
        notes: paymentMethod === "UPI" ? `UPI ID: ${upiId}` : "",
      });
      setOrderId(res.order._id);
      clearCart();
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-silk">
        <Navbar />
        <div className="pt-40 pb-20 container mx-auto px-4 max-w-lg text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
            <div className="w-28 h-28 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={64} className="text-emerald-500" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <h1 className="font-playfair text-4xl font-bold text-maroon mb-2">ಆದೇಶ ದೃಢಪಟ್ಟಿದೆ! 🎉</h1>
            <p className="font-playfair text-2xl text-maroon mb-4">Order Confirmed!</p>
            <p className="font-inter text-muted-foreground mb-4">Thank you for supporting our artisans.</p>

            {savedAddress && (
              <div className="bg-white rounded-2xl p-4 shadow-card mb-4 text-left">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-gold mt-1 shrink-0" />
                  <div>
                    <p className="font-inter font-semibold text-maroon text-sm">{savedAddress.name}</p>
                    <p className="font-inter text-xs text-muted-foreground">{savedAddress.street}, {savedAddress.city}</p>
                    <p className="font-inter text-xs text-muted-foreground">{savedAddress.state} - {savedAddress.pincode}</p>
                    <p className="font-inter text-xs text-muted-foreground">📞 {savedAddress.phone}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gold/10 rounded-2xl p-4 mb-6">
              <p className="font-inter text-sm text-maroon font-semibold">
                {paymentMethod === "UPI" ? "💳 UPI Payment" : "💵 Cash on Delivery"}
              </p>
              <p className="font-inter text-lg font-bold text-maroon mt-1">
                Total: ₹{finalTotal.toLocaleString("en-IN")}
              </p>
              <p className="font-inter text-xs text-muted-foreground">Order ID: {orderId}</p>
            </div>

            <div className="flex gap-4 justify-center">
              <Link to="/" className="px-6 py-3 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all flex items-center gap-2">
                <Home size={16} /> Home
              </Link>
              <Link to="/shop" className="px-6 py-3 border-2 border-maroon text-maroon font-inter font-semibold rounded-full hover:bg-maroon hover:text-gold transition-all">
                Continue Shopping
              </Link>
            </div>
          </motion.div>
        </div>
        <Footer />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-silk">
        <Navbar />
        <div className="pt-40 text-center">
          <p className="font-playfair text-2xl text-maroon">Your cart is empty</p>
          <Link to="/shop" className="mt-4 inline-block text-gold hover:underline font-inter">Back to Shop</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <Link to="/cart" className="inline-flex items-center gap-2 text-muted-foreground font-inter text-sm hover:text-gold mb-8">
          <ArrowLeft size={14} /> Back to Cart
        </Link>
        <h1 className="font-playfair text-4xl font-bold text-maroon mb-10">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Shipping */}
            <div>
              <h2 className="font-playfair text-2xl text-maroon mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-gold" /> Delivery Address
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Full Name", name: "name", type: "text", placeholder: "Your full name" },
                  { label: "Phone Number", name: "phone", type: "tel", placeholder: "+91 98765 43210" },
                  { label: "Street Address", name: "street", type: "text", placeholder: "House no, Street name" },
                  { label: "City / Village", name: "city", type: "text", placeholder: "e.g. Mysore" },
                  { label: "State", name: "state", type: "text", placeholder: "Karnataka" },
                  { label: "Pincode", name: "pincode", type: "text", placeholder: "e.g. 570001" },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="font-inter text-sm text-muted-foreground mb-1 block">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      value={(form as any)[field.name]}
                      onChange={handleChange}
                      required
                      placeholder={field.placeholder}
                      className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="font-playfair text-2xl text-maroon mb-4 flex items-center gap-2">
                <Banknote size={20} className="text-gold" /> Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <button type="button" onClick={() => setPaymentMethod("COD")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === "COD" ? "border-maroon bg-maroon/5" : "border-border hover:border-gold"}`}>
                  <Banknote size={24} className={paymentMethod === "COD" ? "text-maroon" : "text-muted-foreground"} />
                  <p className={`font-inter text-sm font-bold mt-2 ${paymentMethod === "COD" ? "text-maroon" : "text-foreground"}`}>Cash on Delivery</p>
                  <p className="font-inter text-xs text-muted-foreground mt-0.5">Pay when delivered</p>
                </button>
                <button type="button" onClick={() => setPaymentMethod("UPI")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${paymentMethod === "UPI" ? "border-maroon bg-maroon/5" : "border-border hover:border-gold"}`}>
                  <Smartphone size={24} className={paymentMethod === "UPI" ? "text-maroon" : "text-muted-foreground"} />
                  <p className={`font-inter text-sm font-bold mt-2 ${paymentMethod === "UPI" ? "text-maroon" : "text-foreground"}`}>UPI Payment</p>
                  <p className="font-inter text-xs text-muted-foreground mt-0.5">GPay, PhonePe, Paytm</p>
                </button>
              </div>

              {paymentMethod === "UPI" && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl p-5 shadow-card space-y-4">
                  <div className="text-center">
                    <p className="font-inter text-sm font-semibold text-maroon mb-3">
                      Scan to Pay ₹{cartTotal.toLocaleString("en-IN")}
                    </p>
                    <div className="w-40 h-40 mx-auto bg-gray-100 rounded-xl flex items-center justify-center border-2 border-gold/30">
                      <div className="text-center">
                        <Smartphone size={40} className="text-maroon mx-auto mb-2" />
                        <p className="font-inter text-xs text-muted-foreground">UPI QR Code</p>
                        <p className="font-inter text-xs font-bold text-maroon">mysurumagga@upi</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-center text-muted-foreground font-inter text-sm">— or enter UPI ID —</div>
                  <div>
                    <label className="font-inter text-xs text-muted-foreground mb-1 block">Your UPI ID</label>
                    <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. name@gpay"
                      className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="font-inter text-xs text-blue-700">💡 After payment, click "Place Order" to confirm.</p>
                  </div>
                </motion.div>
              )}

              {paymentMethod === "COD" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <p className="font-inter text-sm text-amber-800 font-semibold">💵 Cash on Delivery</p>
                  <p className="font-inter text-xs text-amber-700 mt-1">Pay ₹{cartTotal.toLocaleString("en-IN")} when your order arrives.</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit}>
              <button type="submit" disabled={loading}
                className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all shine shadow-gold flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? <><Loader size={16} className="animate-spin" /> Placing Order...</> : `Place Order · ₹${cartTotal.toLocaleString("en-IN")}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="font-playfair text-2xl text-maroon mb-6">Order Summary</h2>
            <div className="bg-white rounded-2xl p-6 shadow-card space-y-4 sticky top-24">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-xl"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/sarees/s1.jpg"; }} />
                  <div className="flex-1">
                    <p className="font-playfair text-maroon font-semibold text-sm">{item.name}</p>
                    <p className="font-inter text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="font-inter text-xs text-muted-foreground">{item.color}</p>
                  </div>
                  <p className="font-playfair text-maroon font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
              <div className="border-t border-border pt-4">
                <div className="flex justify-between font-inter text-sm text-muted-foreground mb-2">
                  <span>Subtotal</span><span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between font-inter text-sm text-muted-foreground mb-2">
                  <span>Shipping</span><span className="text-emerald-600">Free</span>
                </div>
                <div className="flex justify-between font-playfair text-xl font-bold text-maroon pt-2 border-t border-border">
                  <span>Total</span><span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Checkout;