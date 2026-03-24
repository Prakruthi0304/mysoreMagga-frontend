import { useCart } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const Cart = () => {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isLoggedIn) {
      toast.error("Please sign in to proceed to checkout");
      return;
    }
    navigate("/checkout");
  };

  if (cart.length === 0) return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-40 text-center pb-20">
        <ShoppingBag size={56} className="text-gold mx-auto mb-4" />
        <h2 className="font-playfair text-3xl text-maroon mb-2">Your cart is empty</h2>
        <p className="font-inter text-muted-foreground mb-6">Discover our curated collection of Mysore silk</p>
        <Link to="/shop" className="px-8 py-4 bg-maroon text-gold rounded-full font-inter font-semibold hover:bg-gold hover:text-maroon transition-all">Shop Now</Link>
      </div>
      <Footer />
    </div>
  );

  return (
    <div className="min-h-screen bg-silk">
      <Navbar />
      <div className="pt-24 pb-16 container mx-auto px-4">
        <h1 className="font-playfair text-4xl font-bold text-maroon mb-10">Your Cart ({cart.length})</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, i) => (
              <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl p-5 shadow-card flex gap-5">
                <div className="w-24 h-28 rounded-xl overflow-hidden shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "/sarees/s1.jpg"; }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair font-semibold text-maroon">{item.name}</h3>
                  <p className="font-inter text-xs text-muted-foreground mt-1">{item.color} · {item.fabric}</p>
                  <p className="font-inter text-xs text-muted-foreground">{item.artisanName}</p>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-2 border border-border rounded-full px-3 py-1">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-muted-foreground hover:text-maroon"><Minus size={13} /></button>
                      <span className="font-inter text-sm font-medium w-5 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-muted-foreground hover:text-maroon"><Plus size={13} /></button>
                    </div>
                    <span className="font-playfair text-maroon font-bold">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-card h-fit sticky top-24">
            <h2 className="font-playfair text-xl font-bold text-maroon mb-6">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between font-inter text-sm"><span className="text-muted-foreground">Subtotal</span><span>₹{cartTotal.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between font-inter text-sm"><span className="text-muted-foreground">Shipping</span><span className="text-emerald-600">Free</span></div>
              <div className="flex justify-between font-inter text-sm"><span className="text-muted-foreground">Insurance</span><span className="text-emerald-600">Included</span></div>
            </div>
            <div className="divider-gold mb-4" />
            <div className="flex justify-between font-playfair font-bold text-maroon text-xl mb-6">
              <span>Total</span>
              <span>₹{cartTotal.toLocaleString("en-IN")}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full py-4 bg-maroon text-gold font-inter font-semibold rounded-full hover:bg-gold hover:text-maroon transition-all shine shadow-gold">
              Proceed to Checkout
            </button>
            <Link to="/shop" className="block text-center mt-4 font-inter text-sm text-muted-foreground hover:text-gold transition-colors">Continue Shopping</Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Cart;