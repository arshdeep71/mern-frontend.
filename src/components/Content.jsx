import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../App";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { gsap } from "gsap";
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import ProductDetailModal from "./ProductDetailModal";

// ── Icons ──
const CartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);
const ChevronRight = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Categories data ──
const categories = [
  { label: "Mobile",    emoji: "📱", color: "#f0f4ff" },
  { label: "Headphone", emoji: "🎧", color: "#f5f0ff" },
  { label: "Tablets",   emoji: "📟", color: "#fff0f5" },
  { label: "Laptop",    emoji: "💻", color: "#f0fff4" },
  { label: "Speakers",  emoji: "🔊", color: "#fff8f0" },
  { label: "More",      emoji: "⋯",  color: "#f0f8ff" },
];

// ── Hero slides data ──
const heroSlides = [
  {
    title: "iPhone 16 Pro",
    subtitle: "Extraordinary Visual\n& Exceptional Power",
    btn: "Shop Now",
    bg: "linear-gradient(135deg, #1a1aff 0%, #3b3bff 40%, #6b6bff 100%)",
    accent: "#fff",
  },
  {
    title: "Galaxy S25 Ultra",
    subtitle: "Next Level AI\nCamera Experience",
    btn: "Explore",
    bg: "linear-gradient(135deg, #0f172a 0%, #1e293b 40%, #334155 100%)",
    accent: "#38bdf8",
  },
  {
    title: "AirPods Pro 3",
    subtitle: "Active Noise Cancel\nCrystal Clear Sound",
    btn: "Listen Now",
    bg: "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #047857 100%)",
    accent: "#6ee7b7",
  },
];

// ── Skeleton card ──
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex-shrink-0 w-44 sm:w-auto" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
      <div className="w-full" style={{ aspectRatio: "1/1" }}>
        <Skeleton height="100%" borderRadius={0} />
      </div>
      <div className="p-3">
        <Skeleton width="60%" height={10} className="mb-2" />
        <Skeleton width="90%" height={13} className="mb-1" />
        <div className="flex justify-between items-center mt-3">
          <Skeleton width={50} height={16} />
          <Skeleton width={60} height={28} borderRadius={9999} />
        </div>
      </div>
    </div>
  );
}

// ── Product Card ──
function ProductCard({ product, inCart, onAdd, onIncrement, onDecrement, index, onDetail, API_URL }) {
  const [justAdded, setJustAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const imgSrc = product.imageUrl?.startsWith("data:")
    ? product.imageUrl
    : product.imageUrl?.startsWith("http")
      ? `${API_URL}/proxy/image?url=${encodeURIComponent(product.imageUrl)}`
      : `${API_URL}${product.imageUrl}`;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onDetail(product)}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-pointer"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" }}
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-slate-50" style={{ aspectRatio: "1/1" }}>
        {!imgLoaded && (
          <div className="absolute inset-0 z-0"><Skeleton height="100%" borderRadius={0} /></div>
        )}
        <motion.img
          src={imgSrc}
          alt={product.name}
          className="w-full h-full object-cover relative z-10"
          style={{ opacity: imgLoaded ? 1 : 0, transition: "opacity 0.4s ease-in-out" }}
          onLoad={() => setImgLoaded(true)}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5 }}
          loading="lazy"
        />
        {/* Badge */}
        <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-indigo-600 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide shadow-sm border border-white/80">
          New
        </span>
        {inCart && (
          <div className="absolute top-2 right-2 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
            <CheckIcon />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <span className="text-[9px] font-bold text-indigo-500 uppercase tracking-widest">Premium</span>
        <h3 className="font-semibold text-slate-800 text-[13px] mt-0.5 group-hover:text-indigo-600 transition-colors truncate leading-tight">
          {product.name}
        </h3>

        <div className="mt-3 flex items-center justify-between">
          <p className="text-[15px] font-bold text-slate-900">₹{product.price}</p>

          <AnimatePresence mode="wait">
            {inCart ? (
              <motion.div
                key="counter"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-0.5 bg-indigo-50 border border-indigo-100 rounded-full px-0.5 py-0.5"
              >
                <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); onDecrement(product._id); }}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-indigo-600 font-bold text-base leading-none"
                >−</motion.button>
                <span className="w-5 text-center text-[11px] font-bold text-indigo-700">{inCart.quantity}</span>
                <motion.button whileTap={{ scale: 0.8 }} onClick={(e) => { e.stopPropagation(); onIncrement(product._id); }}
                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white text-indigo-600 font-bold text-base leading-none"
                >+</motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileTap={{ scale: 0.92 }}
                onClick={handleAdd}
                className="bg-slate-900 text-white text-[10px] font-semibold px-3 py-1.5 rounded-full hover:bg-indigo-600 transition-colors duration-200 flex items-center gap-1"
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.span key="added" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} className="flex items-center gap-1">
                      <CheckIcon /> Added
                    </motion.span>
                  ) : (
                    <motion.span key="add" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} className="flex items-center gap-1">
                      <CartIcon /> Add
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ── Notification Panel ──
function NotificationPanel({ onClose, cart, orders }) {
  // Build notification list from cart additions and recent orders
  const notifications = [
    ...cart.slice(0, 4).map((item, i) => ({
      id: `cart-${item._id}`,
      icon: "🛒",
      title: "Added to cart",
      body: item.name,
      time: "Just now",
      unread: i === 0,
    })),
    ...orders.slice(0, 6).map((o, i) => ({
      id: `order-${o._id || i}`,
      icon: o.status === "Delivered" ? "✅" : o.status === "Shipped" ? "🚚" : o.status === "Cancelled" ? "❌" : "📦",
      title: `Order ${o.status || "Placed"}`,
      body: `#${(o._id || "--").slice(-6)} · ₹${o.orderValue || ""}`,
      time: o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "Recently",
      unread: i < 2,
    })),
    { id: "welcome", icon: "🎉", title: "Welcome to MyStore!", body: "Explore our latest products.", time: "", unread: false },
    { id: "sale", icon: "🔥", title: "Flash Sale Live", body: "Up to 40% off on electronics today.", time: "", unread: false },
  ].slice(0, 10);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className="absolute top-12 right-0 w-80 bg-white rounded-3xl shadow-2xl border border-slate-100 z-[100] overflow-hidden"
      style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)" }}
    >
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100">
        <span className="text-[14px] font-bold text-slate-900">Notifications</span>
        <button onClick={onClose} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition">
          <XIcon />
        </button>
      </div>
      <div className="overflow-y-auto" style={{ maxHeight: 360, scrollbarWidth: "none" }}>
        {notifications.length === 0 ? (
          <div className="text-center py-10 text-[13px] text-slate-400">No notifications yet</div>
        ) : (
          notifications.map(n => (
            <div key={n.id} className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 last:border-0 ${n.unread ? "bg-indigo-50/40" : ""}`}>
              <div className="w-9 h-9 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-[18px] flex-shrink-0 shadow-sm">
                {n.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[12px] font-bold text-slate-800 truncate">{n.title}</p>
                  {n.unread && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                </div>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{n.body}</p>
                {n.time && <p className="text-[10px] text-slate-400 mt-0.5">{n.time}</p>}
              </div>
            </div>
          ))
        )}
      </div>
      <div className="px-4 py-3 border-t border-slate-100">
        <button onClick={onClose} className="text-[12px] font-semibold text-indigo-600 hover:text-indigo-700 w-full text-center">
          Mark all as read
        </button>
      </div>
    </motion.div>
  );
}

// ── Hero Banner ──
function HeroBanner({ user, searchQuery, onSearch, cart, orders }) {
  const [current, setCurrent] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const totalSlides = heroSlides.length;
  const unreadCount = Math.min(cart.length + orders.filter(o => o.status === "Pending").length, 9);

  // Close notif panel on outside click
  useEffect(() => {
    function handler(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setCurrent(c => (c + 1) % totalSlides), 4000);
    return () => clearInterval(t);
  }, []);

  const slide = heroSlides[current];

  return (
    <div>
      {/* Show search results header if searching */}
      {/* Show search results header if searching */}
      {searchQuery && (
        <div className="sm:hidden px-4 pb-2">
          <p className="text-[12px] text-slate-500">
            Results for <span className="font-semibold text-slate-800">"{searchQuery}"</span>
          </p>
        </div>
      )}

      {/* Hide hero/categories/flash deals when searching */}
      {!searchQuery && (
        <>
          {/* Hero Slide */}
          <div className="sm:hidden mx-4 mt-1 mb-1 rounded-3xl overflow-hidden" style={{ height: 160 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, x: 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-full flex items-center justify-between px-6 relative"
                style={{ background: slide.bg }}
              >
                <div className="z-10">
                  <h2 className="text-white text-[18px] font-black leading-tight mb-1">{slide.title}</h2>
                  <p className="text-white/70 text-[11px] leading-snug mb-3 whitespace-pre-line">{slide.subtitle}</p>
                  <button
                    className="text-[11px] font-bold px-4 py-2 rounded-full"
                    style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.3)" }}
                  >
                    {slide.btn}
                  </button>
                </div>
                <div
                  className="absolute right-0 top-0 bottom-0 w-36 flex items-center justify-end pr-4"
                  style={{ background: "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.12) 0%, transparent 70%)" }}
                >
                  <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/10" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          <div className="sm:hidden flex items-center justify-center gap-1.5 mt-2.5 mb-1">
            {heroSlides.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}>
                <motion.div
                  animate={{ width: current === i ? 20 : 6, background: current === i ? "#4f46e5" : "#cbd5e1" }}
                  transition={{ duration: 0.3 }}
                  className="h-1.5 rounded-full"
                />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Categories Section ──
function CategoriesSection({ onFilter, activeCategory }) {
  return (
    <div className="sm:hidden px-4 mt-4">
      <h2 className="text-[16px] font-bold text-slate-900 mb-3">Categories</h2>
      <div className="grid grid-cols-3 gap-3">
        {categories.map(({ label, emoji, color }) => (
          <motion.button
            key={label}
            whileTap={{ scale: 0.93 }}
            onClick={() => onFilter(label === activeCategory ? null : label)}
            className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border transition-all duration-200"
            style={{
              background: activeCategory === label ? "#eef2ff" : color,
              borderColor: activeCategory === label ? "#c7d2fe" : "transparent",
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(255,255,255,0.7)" }}
            >
              {emoji}
            </div>
            <span className="text-[11px] font-semibold text-slate-700">{label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── Main Content ──
export default function Content() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [activeCategory, setActiveCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { cart, setCart, user } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const headerRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const [res] = await Promise.all([
        axios.get(`${API_URL}/products`),
        new Promise(resolve => setTimeout(resolve, 700)),
      ]);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch orders for notification panel (if logged in)
  useEffect(() => {
    if (!user?.email) return;
    axios.get(`${API_URL}/orders/show-orders/${user.email}`)
      .then(res => setOrders(res.data.slice(0, 10)))
      .catch(() => {});
  }, [user]);

  useEffect(() => { fetchProducts(); }, []);

  // GSAP header entrance (desktop only)
  useEffect(() => {
    if (!loading && headerRef.current) {
      gsap.fromTo(headerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading]);

  const addToCart = (p) => { if (!cart.find(i => i._id === p._id)) setCart([...cart, { ...p, quantity: 1 }]); };
  const increment = (id) => setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const decrement = (id) => setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  const getItem   = (id) => cart.find(i => i._id === id);

  // Category filtering
  const categoryMap = {
    Mobile: ["phone", "iphone", "mobile", "samsung", "pixel"],
    Headphone: ["headphone", "earphone", "airpods", "earbud", "audio"],
    Tablets: ["tablet", "ipad", "tab"],
    Laptop: ["laptop", "macbook", "notebook", "computer"],
    Speakers: ["speaker", "soundbar", "sonos"],
  };

  // Combined filter: search query + active category
  const filteredProducts = products.filter(p => {
    const text = (p.name + " " + (p.desc || "")).toLowerCase();
    const matchesSearch = !searchQuery || text.includes(searchQuery.toLowerCase());
    const matchesCategory = !activeCategory ||
      (categoryMap[activeCategory] || []).some(k => text.includes(k));
    return matchesSearch && matchesCategory;
  });

  // Flash deals: pick first 6 products (not filtered by search)
  const flashDeals = products.slice(0, 6);

  return (
    <>
      {/* ── MOBILE LAYOUT ── */}
      <div className="sm:hidden">
        <HeroBanner
          user={user}
          searchQuery={searchQuery}
          onSearch={(q) => { setSearchQuery(q); setActiveCategory(null); }}
          cart={cart}
          orders={orders}
        />
        {/* Hide categories when searching */}
        {!searchQuery && <CategoriesSection onFilter={setActiveCategory} activeCategory={activeCategory} />}

        {/* Flash Deals — hidden when searching */}
        {!searchQuery && (
          <div className="mt-6 px-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[16px] font-bold text-slate-900">Flash Deals for You</h2>
              <button className="text-[12px] font-semibold text-indigo-600 flex items-center gap-0.5 hover:text-indigo-700">
                See All <ChevronRight />
              </button>
            </div>

            {loading ? (
              <div className="flex gap-3 overflow-x-auto pb-2 -mr-4 pr-4" style={{ scrollbarWidth: "none" }}>
                {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 -mr-4 pr-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
                {flashDeals.map((product, i) => (
                  <div key={product._id} className="flex-shrink-0 w-44">
                    <ProductCard
                      product={product}
                      index={i}
                      inCart={getItem(product._id)}
                      onAdd={addToCart}
                      onIncrement={increment}
                      onDecrement={decrement}
                      onDetail={setSelectedProduct}
                      API_URL={API_URL}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* All Products grid on mobile */}
        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[16px] font-bold text-slate-900">
              {activeCategory ? `${activeCategory} Products` : "All Products"}
            </h2>
            {activeCategory && (
              <button onClick={() => setActiveCategory(null)} className="text-[11px] font-semibold text-slate-400 hover:text-indigo-600">
                Clear ✕
              </button>
            )}
          </div>
          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 text-[13px]">No products in this category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredProducts.map((product, i) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  index={i}
                  inCart={getItem(product._id)}
                  onAdd={addToCart}
                  onIncrement={increment}
                  onDecrement={decrement}
                  onDetail={setSelectedProduct}
                  API_URL={API_URL}
                />
              ))}
            </div>
          )}
        </div>

        {/* 
          ── FULLSCREEN SPACER ── 
          Allows scrolling the last items above the floating nav 
          without creating a colored empty block.
        */}
        <div style={{ height: "calc(env(safe-area-inset-bottom, 0px) + 120px)" }} />
      </div>

      {/* ── DESKTOP LAYOUT (unchanged) ── */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.25em] mb-2">Curated For You</p>
            <h1 className="text-[32px] font-bold text-slate-900 tracking-[-0.02em] leading-tight">Featured Collection</h1>
            <p className="text-slate-400 text-[13px] mt-1 font-normal">Premium technology and goods, hand-picked.</p>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-[12px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full"
          >
            Showing {loading ? "…" : products.length} products
          </motion.div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ aspectRatio: "1/1" }}><Skeleton height="100%" borderRadius={0} /></div>
                <div className="p-5">
                  <Skeleton width="30%" height={10} className="mb-3" />
                  <Skeleton width="90%" height={14} className="mb-1" />
                  <Skeleton width="65%" height={14} className="mb-4" />
                  <div className="flex justify-between items-center mt-4">
                    <div><Skeleton width={40} height={10} className="mb-1 block" /><Skeleton width={60} height={18} /></div>
                    <Skeleton width={90} height={34} borderRadius={9999} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 text-[13px] font-medium">No products found in our inventory.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard
                key={product._id}
                product={product}
                index={i}
                inCart={getItem(product._id)}
                onAdd={addToCart}
                onIncrement={increment}
                onDecrement={decrement}
                onDetail={setSelectedProduct}
                API_URL={API_URL}
              />
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <ProductDetailModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            API_URL={API_URL}
          />
        )}
      </AnimatePresence>
    </>
  );
}
