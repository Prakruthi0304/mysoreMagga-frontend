// src/pages/Checkout.tsx
// Add route: <Route path="/checkout" element={<Checkout />} />

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, ArrowLeft, Loader } from "lucide-react";
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
        paymentMethod: "COD",
      });
      setOrderId(res.order._id);
      setSuccess(true);
      clearCart();
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
        <div className="pt-40 pb-20 text-center container mx-auto px-4">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
            <CheckCircle size={72} className="text-emerald-500 mx-auto mb-6" />
          </motion.div>
          <h1 className="font-playfair text-4xl font-bold text-maroon mb-3">Order Placed!</h1>
          <p className="font-inter text-muted-foreground mb-2">Thank you for supporting our artisans.</p>
          <p className="font-inter text-xs text-muted-foreground mb-8">Order ID: <span className="font-semibold">{orderId}</span></p>
          <div className="flex gap-4 justify-center">
            <Link to="/shop" className="px-8 py-3 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all">
              Continue Shopping
            </Link>
          </div>
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
          {/* Shipping Form */}
          <div>
            <h2 className="font-playfair text-2xl text-maroon mb-6">Shipping Details</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { label: "Full Name", name: "name", type: "text" },
                { label: "Phone Number", name: "phone", type: "tel" },
                { label: "Street Address", name: "street", type: "text" },
                { label: "City", name: "city", type: "text" },
                { label: "State", name: "state", type: "text" },
                { label: "Pincode", name: "pincode", type: "text" },
              ].map((field) => (
                <div key={field.name}>
                  <label className="font-inter text-sm text-muted-foreground mb-1 block">{field.label}</label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                    required
                    className="w-full border border-border rounded-xl px-4 py-3 font-inter text-sm focus:outline-none focus:border-gold bg-white"
                  />
                </div>
              ))}

              <div className="mt-2 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="font-inter text-sm text-amber-800 font-semibold">💵 Cash on Delivery</p>
                <p className="font-inter text-xs text-amber-700 mt-1">Pay when your order arrives. No online payment needed.</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all shine shadow-gold flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {loading ? <><Loader size={16} className="animate-spin" /> Placing Order...</> : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <h2 className="font-playfair text-2xl text-maroon mb-6">Order Summary</h2>
            <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-xl" />
                  <div className="flex-1">
                    <p className="font-playfair text-maroon font-semibold text-sm">{item.name}</p>
                    <p className="font-inter text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-playfair text-maroon font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
                </div>
              ))}
              <div className="border-t border-border pt-4 flex justify-between font-playfair text-xl font-bold text-maroon">
                <span>Total</span>
                <span>₹{cartTotal.toLocaleString("en-IN")}</span>
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
