import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { cart, user, searchQuery, setSearchQuery } = useContext(AppContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [promoIndex, setPromoIndex] = useState(0);

  const announcements = [
    "Free Shipping On Orders +$150. →",
    "Shop Now, Pay Later with Afterpay →",
    "Take Our Gift Finder Quiz →"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (["/login", "/register"].includes(location.pathname)) return null;

  const menuItems = [
    { label: "Watches", path: "/" },
    { label: "Featured Collections", path: "/" },
    { label: "Bands", path: "/" },
    { label: "Headwear & More", path: "/" },
    { label: "Gifts", path: "/" },
  ];

  return (
    <>
      {/* ── 1. ANNOUNCEMENT BAR (Nixon Style) ── */}
      <div className="bg-black text-white h-10 flex items-center justify-between px-4 overflow-hidden relative z-[110]">
        <button onClick={() => setPromoIndex((p) => (p - 1 + announcements.length) % announcements.length)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={promoIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="text-[10px] md:text-xs font-medium tracking-widest uppercase"
          >
            {announcements[promoIndex]}
          </motion.div>
        </AnimatePresence>

        <button onClick={() => setPromoIndex((p) => (p + 1) % announcements.length)}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      <header
        className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm" : "bg-white border-b border-slate-100"
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between max-w-7xl mx-auto">
          {/* Menu Button (Left) */}
          <div className="w-20 md:w-auto flex justify-start">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-start text-slate-800"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Centered Premium Logo */}
          <Link to="/" className="flex-1 text-center">
            <span className="text-xl font-bold tracking-[0.25em] text-slate-900 uppercase">
              MYSTORE
            </span>
          </Link>

          {/* Right Actions (Icons on Right) */}
          <div className="w-20 md:w-auto flex items-center justify-end gap-3 md:gap-4">
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-1">
              <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            <Link to="/cart" className="relative group p-1">
              <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Dynamic Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white border-b border-slate-100 overflow-hidden"
            >
              <div className="p-4 relative">
                <input
                  autoFocus
                  type="text"
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-12 bg-slate-50 rounded-xl border-none outline-none text-sm"
                />
                <svg className="absolute left-8 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <button onClick={() => setIsSearchOpen(false)} className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── 2. MOBILE SIDE MENU (Nixon Style) ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-[85%] max-w-sm bg-white z-[201] flex flex-col pt-[env(safe-area-inset-top,0px)]"
            >
              <div className="p-5 flex items-center justify-between border-b border-slate-50">
                <span className="text-xl font-bold uppercase tracking-widest">MYSTORE</span>
                <button onClick={() => setIsMenuOpen(false)}>
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col">
                  {menuItems.map((item, idx) => (
                    <Link
                      key={idx}
                      to={item.path}
                      onClick={() => setIsMenuOpen(false)}
                      className="p-5 flex items-center justify-between border-b border-slate-50 text-slate-800 hover:bg-slate-50"
                    >
                      <span className="font-medium text-lg">{item.label}</span>
                      <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                    </Link>
                  ))}
                </div>

                <div className="p-8 mt-10 space-y-6 text-slate-500">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">🇮🇳 IN</span>
                  </div>
                  <Link to="/orders" className="block text-lg font-medium text-slate-800">Order Status</Link>
                  <Link to="/" className="block text-lg font-medium text-slate-800">Find a Store</Link>
                  <Link to="/login" className="block text-lg font-medium text-slate-800">Sign in</Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
