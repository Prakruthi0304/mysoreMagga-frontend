import Dashboard from "./pages/Dashboard";
import WeaverMarket from "./pages/WeaverMarket";
import { AuthProvider } from "@/context/AuthContext";
import Checkout from "./pages/Checkout";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { LanguageProvider } from "@/context/LanguageContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Artisans from "./pages/Artisans";
import Learning from "./pages/Learning";
import PreLoved from "./pages/PreLoved";
import Cart from "./pages/Cart";
import WeaverProfile from "./pages/WeaverProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/artisans" element={<Artisans />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/preloved" element={<PreLoved />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/weaver-market" element={<WeaverMarket />} />
              <Route path="/weaver/:id" element={<WeaverProfile />} />
              <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;