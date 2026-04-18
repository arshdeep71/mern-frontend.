import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const { cart, user, searchQuery, setSearchQuery } = useContext(AppContext);
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if we are on a page where we want a simple header
  const isAuthPage = ["/login", "/register"].includes(location.pathname);
  if (isAuthPage) return null;

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-sm" : "bg-white"
      }`}
      style={{
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* ── Desktop Header ── */}
      <div className="hidden md:flex flex-col">
        <div className="max-w-7xl mx-auto w-full h-20 px-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
              <span className="font-black italic text-xl">M</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900">MYSTORE</span>
          </Link>

          <div className="flex-1 max-w-lg mx-12">
            <div className="relative group">
              <input
                type="text"
                placeholder="Search premium tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-slate-100 rounded-2xl border-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all duration-300 text-slate-600 outline-none"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/notification" className="w-11 h-11 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all relative">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <div className="absolute top-2.5 right-3 w-2 h-2 bg-indigo-600 border-2 border-white rounded-full"></div>
            </Link>
            <Link to="/cart" className="flex items-center gap-2 px-5 h-11 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 transition-all shadow-md active:scale-95">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span className="font-bold">{cart.length}</span>
            </Link>
            <Link to={user?.email ? "/profile" : "/login"} className="w-11 h-11 rounded-full bg-indigo-100 border-2 border-indigo-200 flex items-center justify-center overflow-hidden active:scale-95 transition-all">
              {user?.email ? <span className="text-indigo-700 font-bold uppercase">{user.email[0]}</span> : <svg className="w-6 h-6 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" /></svg>}
            </Link>
          </div>
        </div>
      </div>

      {/* ── 🔥 NEW MOBILE HEADER (Nixon-Style) ── */}
      <div className="md:hidden flex flex-col">
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-100">
          {/* Menu Button */}
          <button className="w-10 h-10 flex items-center justify-start text-slate-800">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          {/* Centered Premium Logo */}
          <Link to="/" className="flex-1 text-center">
            <span className="text-lg font-bold tracking-[0.25em] text-slate-900 uppercase">
              MYSTORE
            </span>
          </Link>

          {/* Right Actions */}
          <div className="flex items-center justify-end gap-3 w-10">
            <Link to="/cart" className="relative group p-1">
              <svg className="w-6 h-6 text-slate-800 group-active:scale-90 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <AnimatePresence>
                {cart.length > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center border-2 border-white"
                  >
                    {cart.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
        
        {/* Simple Mobile Search Bar (Toggles for cleanliness) */}
        <div className="px-5 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500/10 transition-all outline-none"
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
}
