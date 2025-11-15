"use client";
import { useState, useEffect, useRef, MouseEvent } from "react";
import { ImageWithFallback } from "@/components/imagewithfallback/ImageWithFallback";
import { Button } from "@/components/ui/button";
import { 
  ShoppingCart, 
  Package, 
  TruckIcon, 
  Store, 
  Sprout,
  CheckCircle2,
  ArrowRight,
  LayoutDashboard,
  ClipboardList,
  ShoppingBag,
  TrendingUp,
  BarChart3,
  User,
  FileText,
  MessageSquare,
  PackageCheck,
  Clock,
  XCircle,
  Apple,
  Carrot,
  Soup,
  Bean,
  Wheat,
  Leaf,
  Sparkles,
  Moon,
  Sun,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Phone
} from "lucide-react";

// ThemeToggle Component
function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full"
    >
      {isDark ? (
        <Sun className="w-5 h-5" style={{ color: '#F97316' }} />
      ) : (
        <Moon className="w-5 h-5" style={{ color: '#16A34A' }} />
      )}
    </Button>
  );
}

// Header Component
function Header() {
  return (
    <header className="bg-white/80 dark:bg-gray-950/80 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50 backdrop-blur-xl">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sprout className="w-6 h-6 text-white" />
          </div>
          <span className="text-gray-900 dark:text-white" style={{ fontSize: '1.5rem', fontWeight: '700' }}>
            AgriLink
          </span>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="ghost"
            asChild
            className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <a href="/login">Login</a>
          </Button>
          <Button
            asChild
            className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white shadow-lg"
          >
            <a href="/signup">Register</a>
          </Button>
        </div>
      </div>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-gray-950 dark:bg-black text-white py-16 border-t border-gray-900">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="mb-4 flex items-center gap-2" style={{ fontSize: '1.75rem', fontWeight: '700' }}>
              <span className="text-green-500">AgriLink</span>
            </h3>
            <p className="text-gray-400 mb-6" style={{ lineHeight: '1.7' }}>
              Connecting farmers and vendors for smarter, fresher trade. Building a sustainable future for agriculture with technology and innovation.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-11 h-11 bg-gray-900 hover:bg-green-600 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 bg-gray-900 hover:bg-green-600 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 bg-gray-900 hover:bg-teal-600 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-11 h-11 bg-gray-900 hover:bg-teal-600 rounded-xl flex items-center justify-center transition-all hover:scale-110">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="mb-5 text-green-400" style={{ fontWeight: '600', fontSize: '1.125rem' }}>Quick Links</h4>
            <div className="flex flex-col gap-3">
              <a href="#about" className="text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2">
                → About Us
              </a>
              <a href="#farmers-features" className="text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2">
                → For Farmers
              </a>
              <a href="#vendors-features" className="text-gray-400 hover:text-teal-500 transition-colors flex items-center gap-2">
                → For Vendors
              </a>
              <a href="#how-it-works" className="text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2">
                → How It Works
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="mb-5 text-green-400" style={{ fontWeight: '600', fontSize: '1.125rem' }}>Contact</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:hello@agrilink.com" className="text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2">
                <Mail className="w-4 h-4" />
                admin@agrilink.com
              </a>
              <a href="tel:9761851010" className="text-gray-400 hover:text-green-500 transition-colors flex items-center gap-2">
                <Phone className="w-4 h-4" />
                9761851010
              </a>
              <div className="text-gray-400 flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1" />
                <span>AgriLink<br/>Makalbari, Kathmandu</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400">© 2025 AgriLink. All rights reserved.</p>
          <div className="flex gap-6 text-gray-500">
            <a href="#privacy" className="hover:text-green-500 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-green-500 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// SpotlightCard Component
interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

function SpotlightCard({ children, className = "", spotlightColor = "rgba(22, 163, 74, 0.15)" }: SpotlightCardProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleMouseEnter = () => setOpacity(1);
  const handleMouseLeave = () => setOpacity(0);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
        }}
      />
      {children}
    </div>
  );
}

// AnimatedBackground Component
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 dark:bg-green-500/5 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '4s' }} />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '6s', animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '5s', animationDelay: '1s' }} />
    </div>
  );
}

// Main Page Component
export default function Page() {
  const products = [
    {
      name: "Fresh Fruits",
      description: "Seasonal and tropical fruits, ripe and ready",
      image: "https://images.unsplash.com/photo-1607130813443-243737c21f7d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGZyZXNoJTIwZnJ1aXRzfGVufDF8fHx8MTc2MzEzNjczM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: <Apple className="w-6 h-6" />
    },
    {
      name: "Vegetables",
      description: "Farm-fresh vegetables delivered daily",
      image: "https://images.unsplash.com/photo-1657288649124-b80bdee3c17e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcmdhbmljJTIwdmVnZXRhYmxlcyUyMGZyZXNofGVufDF8fHx8MTc2MzA4NTEwOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: <Carrot className="w-6 h-6" />
    },
    {
      name: "Spices",
      description: "Authentic spices from local farms",
      image: "https://images.unsplash.com/photo-1602237514002-c2d8ae2da393?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBzcGljZXMlMjB2aWJyYW50fGVufDF8fHx8MTc2MzEzNjczM3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: <Soup className="w-6 h-6" />
    },
    {
      name: "Pulses",
      description: "High-quality lentils, beans, and legumes",
      image: "https://images.unsplash.com/photo-1607863376392-35c6ff892349?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsZW50aWxzJTIwYmVhbnMlMjBjb2xvcmZ1bHxlbnwxfHx8fDE3NjMxMzY3MzN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: <Bean className="w-6 h-6" />
    },
    {
      name: "Grains",
      description: "Premium wheat, rice, barley, and more",
      image: "https://images.unsplash.com/photo-1595360584848-6404da6fe097?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGVhdCUyMGdyYWluJTIwaGFydmVzdHxlbnwxfHx8fDE3NjMxMDYyMDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: <Wheat className="w-6 h-6" />
    },
    {
      name: "Leafy Vegetables",
      description: "Fresh greens like spinach, lettuce, kale",
      image: "https://images.unsplash.com/photo-1657411658219-573d47e402c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMGdyZWVuJTIwbGV0dHVjZXxlbnwxfHx8fDE3NjMwNjU2Njh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      icon: <Leaf className="w-6 h-6" />
    }
  ];

  const farmerFeatures = [
    {
      icon: <LayoutDashboard className="w-8 h-8" />,
      title: "Dashboard Overview",
      description: "Get a complete view of your farm business with analytics and insights"
    },
    {
      icon: <ClipboardList className="w-8 h-8" />,
      title: "Order Management",
      description: "Track orders with statuses: Delivered, Pending, In Transit, Confirmed, Cancelled"
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Market Hub",
      description: "View vendor orders and submit competitive proposals to win contracts"
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Product Management",
      description: "Add, edit, update, and delete your products with complete control"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trending Products",
      description: "See what's in demand and adjust your inventory accordingly"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Reports & Statistics",
      description: "Price prediction, revenue forecasting, and market demand trend analysis"
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Profile Management",
      description: "Manage your farm profile, contact details, and business information"
    }
  ];

  const vendorFeatures = [
    {
      icon: <LayoutDashboard className="w-8 h-8" />,
      title: "Dashboard Analytics",
      description: "View total orders, pending orders, total spent, monthly orders, and top products"
    },
    {
      icon: <ShoppingBag className="w-8 h-8" />,
      title: "Products Catalog",
      description: "Browse accepted products from farmers with real-time available quantities"
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Trending Products",
      description: "Discover popular products and make informed purchasing decisions"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "My Orders",
      description: "Manage and track all your current orders in one place"
    },
    {
      icon: <Store className="w-8 h-8" />,
      title: "Market Hub",
      description: "Place orders directly to farmers and receive instant confirmations"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Requests Management",
      description: "Accept one farmer request per order to ensure quality and reliability"
    },
    {
      icon: <PackageCheck className="w-8 h-8" />,
      title: "All Orders Tracking",
      description: "View accepted orders with statuses: Delivered, Pending, In Transit, Confirmed, Cancel"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Reports & Predictions",
      description: "Price prediction (past 6 months to future 6 months), demand & revenue forecasting"
    },
    {
      icon: <User className="w-8 h-8" />,
      title: "Profile Management",
      description: "Update vendor details, preferences, and business credentials"
    }
  ];

  const steps = [
    {
      icon: <Sprout className="w-12 h-12" />,
      title: "Farmers List Products",
      description: "Farmers easily upload their fresh produce with pricing and availability"
    },
    {
      icon: <ShoppingCart className="w-12 h-12" />,
      title: "Vendors Place Orders",
      description: "Vendors browse, select, and order products directly from farmers"
    },
    {
      icon: <TruckIcon className="w-12 h-12" />,
      title: "Direct Delivery",
      description: "Fast, reliable delivery from farm to vendor with real-time tracking"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <AnimatedBackground />
        
        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900">
                <Sparkles className="w-4 h-4 text-green-600 dark:text-green-400" />
                <span className="text-green-700 dark:text-green-300" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                  Next-Gen Agriculture Platform
                </span>
              </div>
              
              <h1 className="text-gray-900 dark:text-white" style={{ fontSize: '4rem', fontWeight: '800', lineHeight: '1.1' }}>
                Empowering <span className="text-green-600 dark:text-green-400">Farmers</span> & Vendors to Trade Smarter
              </h1>
              
              <p className="text-gray-600 dark:text-gray-400" style={{ fontSize: '1.25rem', lineHeight: '1.7' }}>
                Connect directly with farmers and vendors. Manage orders, track deliveries, and grow your agricultural business with powerful analytics.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white shadow-lg hover:shadow-xl transition-all"
                  style={{ fontSize: '1.125rem', padding: '1.5rem 2.5rem' }}
                >
                  <a href="/signup" className="flex items-center gap-2">
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-green-600 text-green-600 hover:bg-green-50 dark:border-green-500 dark:text-green-400 dark:hover:bg-green-950/50"
                  style={{ fontSize: '1.125rem', padding: '1.5rem 2.5rem' }}
                >
                  <a href="/login">Login</a>
                </Button>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-6">
                <div className="space-y-1">
                  <div className="text-green-600 dark:text-green-400" style={{ fontSize: '2rem', fontWeight: '700' }}>10K+</div>
                  <div className="text-gray-600 dark:text-gray-500" style={{ fontSize: '0.875rem' }}>Farmers</div>
                </div>
                <div className="space-y-1">
                  <div className="text-green-600 dark:text-green-400" style={{ fontSize: '2rem', fontWeight: '700' }}>500+</div>
                  <div className="text-gray-600 dark:text-gray-500" style={{ fontSize: '0.875rem' }}>Vendors</div>
                </div>
                <div className="space-y-1">
                  <div className="text-green-600 dark:text-green-400" style={{ fontSize: '2rem', fontWeight: '700' }}>98%</div>
                  <div className="text-gray-600 dark:text-gray-500" style={{ fontSize: '0.875rem' }}>Success</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl ring-1 ring-gray-200 dark:ring-gray-800">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1747503331142-27f458a1498c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXJtZXJzJTIwbWFya2V0JTIwZnJlc2glMjBwcm9kdWNlfGVufDF8fHx8MTc2MzEzNjczNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Farmers market fresh produce"
                  className="w-full h-auto"
                    fallbackSrc="https://via.placeholder.com/1080x720?text=Image+Unavailable"

                />
              </div>
              
              {/* Floating Cards */}
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-950 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white" style={{ fontWeight: '700' }}>+25%</div>
                    <div className="text-gray-500 dark:text-gray-400" style={{ fontSize: '0.75rem' }}>Growth</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-4 border border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-xl flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-gray-900 dark:text-white" style={{ fontWeight: '700' }}>2.5K+</div>
                    <div className="text-gray-500 dark:text-gray-400" style={{ fontSize: '0.75rem' }}>Orders</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50" id="products">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 mb-6">
              <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-emerald-700 dark:text-emerald-300" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                Product Categories
              </span>
            </div>
            <h2 className="text-gray-900 dark:text-white mb-4" style={{ fontSize: '3rem', fontWeight: '700' }}>
              Fresh Products Available
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Browse our wide selection of farm-fresh produce
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <SpotlightCard key={index} className="h-full">
                <div className="group relative bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-800 h-full">
                  <div className="aspect-[4/3] overflow-hidden relative">
                    <ImageWithFallback
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 right-4 w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl backdrop-blur-md bg-green-500/90 dark:bg-green-600/90">
                      <div className="text-white">{product.icon}</div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-gray-900 dark:text-white mb-2" style={{ fontSize: '1.375rem', fontWeight: '600' }}>
                      {product.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {product.description}
                    </p>
                  </div>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Farmers Features Section */}
      <section className="py-24 bg-white dark:bg-gray-950 relative overflow-hidden" id="farmers-features">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-green-500 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-900 mb-6">
              <Sprout className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="text-green-700 dark:text-green-300" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                For Farmers
              </span>
            </div>
            <h2 className="text-gray-900 dark:text-white mb-4" style={{ fontSize: '3rem', fontWeight: '700' }}>
              Powerful Tools for Farmers
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Everything you need to manage and grow your farm business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {farmerFeatures.map((feature, index) => (
              <SpotlightCard key={index} spotlightColor="rgba(22, 163, 74, 0.1)">
                <div className="group bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-green-600 dark:bg-green-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400" style={{ lineHeight: '1.6' }}>
                    {feature.description}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* Vendors Features Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50 relative overflow-hidden" id="vendors-features">
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 max-w-7xl relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-900 mb-6">
              <Store className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span className="text-teal-700 dark:text-teal-300" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
                For Vendors
              </span>
            </div>
            <h2 className="text-gray-900 dark:text-white mb-4" style={{ fontSize: '3rem', fontWeight: '700' }}>
              Complete Vendor Management Suite
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Streamline your sourcing and ordering process with advanced tools
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendorFeatures.map((feature, index) => (
              <SpotlightCard key={index} spotlightColor="rgba(184, 108, 20, 0.1)">
                <div className="group bg-white dark:bg-gray-900 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-800 h-full">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-6 bg-orange-600 dark:bg-orange-500 text-white shadow-lg group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-gray-900 dark:text-white mb-3" style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400" style={{ lineHeight: '1.6' }}>
                    {feature.description}
                  </p>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white dark:bg-gray-950" id="how-it-works">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-20">
            <h2 className="text-gray-900 dark:text-white mb-4" style={{ fontSize: '3rem', fontWeight: '700' }}>
              How It Works
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Three simple steps to connect farmers and vendors
            </p>
          </div>
          
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-24 left-[16.66%] right-[16.66%] h-0.5 bg-gradient-to-r from-green-200 via-emerald-200 to-teal-200 dark:from-green-900 dark:via-emerald-900 dark:to-teal-900" />
            
            <div className="grid md:grid-cols-3 gap-12 relative">
              {steps.map((step, index) => {
  
  // Color sets for icon card + step badge
  const colors = {
    green: {
      icon: "from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500",
      badge: "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-300",
    },
    orange: {
      icon: "from-orange-500 to-yellow-500 dark:from-orange-600 dark:to-yellow-600",
      badge: "bg-orange-100 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300",
    }
  };

  const selected =
    index === 1     // step 2
      ? colors.orange
      : colors.green // step 1 & 3

  return (
    <div key={index} className="text-center relative">
      
      {/* ICON CARD */}
      <div
        className={`inline-flex items-center justify-center w-32 h-32 rounded-3xl mb-8 bg-gradient-to-br ${selected.icon} text-white shadow-2xl relative z-10`}
      >
        {step.icon}
      </div>

      {/* STEP BADGE */}
      <div
        className={`inline-block px-4 py-2 rounded-full mb-4 ${selected.badge}`}
        style={{ fontSize: "0.875rem", fontWeight: "600" }}
      >
        Step {index + 1}
      </div>

      <h3
        className="text-gray-900 dark:text-white mb-4"
        style={{ fontSize: "1.5rem", fontWeight: "600" }}
      >
        {step.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400" style={{ lineHeight: "1.6" }}>
        {step.description}
      </p>
    </div>
  );
})}

            </div>
          </div>
        </div>
      </section>

      {/* Order Status Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-gray-900 dark:text-white mb-4" style={{ fontSize: '3rem', fontWeight: '700' }}>
              Real-Time Order Tracking
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Stay updated with every stage of your orders
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
              { icon: <Clock className="w-8 h-8" />, label: "Pending", color: "#F59E0B" },
              { icon: <CheckCircle2 className="w-8 h-8" />, label: "Confirmed", color: "#16A34A" },
              { icon: <TruckIcon className="w-8 h-8" />, label: "In Transit", color: "#14B8A6" },
              { icon: <PackageCheck className="w-8 h-8" />, label: "Delivered", color: "#059669" },
              { icon: <XCircle className="w-8 h-8" />, label: "Cancelled", color: "#DC2626" }
            ].map((status, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center hover:shadow-2xl transition-all border border-gray-200 dark:border-gray-800 group"
              >
                <div 
                  className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${status.color}15`, color: status.color }}
                >
                  {status.icon}
                </div>
                <p className="text-gray-900 dark:text-white" style={{ fontWeight: '600', fontSize: '1.125rem' }}>
                  {status.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        {/* Background with green gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-green-700 dark:from-green-950 dark:via-emerald-950 dark:to-green-900" />
        
        {/* Animated patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" 
               style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>
        
        <div className="container mx-auto px-4 max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-white" style={{ fontSize: '0.875rem', fontWeight: '600' }}>
              Join thousands of users
            </span>
          </div>
          
          <h2 className="text-white mb-6" style={{ fontSize: '3.5rem', fontWeight: '800' }}>
            Start Your Journey Today
          </h2>
          <p className="text-white/90 mb-12" style={{ fontSize: '1.375rem', lineHeight: '1.7' }}>
            Connect with farmers or vendors and experience seamless agricultural trade
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 shadow-2xl hover:shadow-3xl transition-all"
              style={{ fontSize: '1.25rem', padding: '1.75rem 3rem' }}
            >
              <a href="/register" className="flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-6 h-6" />
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white text-black hover:bg-white/10 shadow-2xl hover:shadow-3xl transition-all backdrop-blur-sm"
              style={{ fontSize: '1.25rem', padding: '1.75rem 3rem' }}
            >
              <a href="/login">Login</a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
