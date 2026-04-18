import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";

// ── Icons (outline + filled variants for active state) ──
const icons = {
  Home: {
    outline: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    filled: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2L2 10v12a2 2 0 0 0 2 2h5v-7h6v7h5a2 2 0 0 0 2-2V10L12 2z" />
      </svg>
    ),
  },
  Chat: {
    outline: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    filled: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M21 3H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11l4 4V5a2 2 0 0 0-2-2z" />
      </svg>
    ),
  },
  Wishlist: {
    outline: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    filled: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="#ff3b5c" stroke="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  Cart: {
    outline: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    filled: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M6 2H3a1 1 0 0 0 0 2h1.22l2.57 12.84A3 3 0 1 0 9 17a3 3 0 0 0-1.06.21L7.5 16h10.5a1 1 0 0 0 .98-.8l1.5-8A1 1 0 0 0 19.5 6H6.3L5.94 4.2A1 1 0 0 0 5 3.41 1 1 0 0 0 4 3H3" />
        <circle cx="9" cy="20" r="1.5" /><circle cx="18" cy="20" r="1.5" />
      </svg>
    ),
  },
  Profile: {
    outline: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    filled: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5.33 0-8 2.67-8 4v1h16v-1c0-1.33-2.67-4-8-4z" />
      </svg>
    ),
  },
};

export default function MobileNav() {
  const location = useLocation();
  const { cart, user } = useContext(AppContext);
  const [scrolled, setScrolled] = useState(false);
  const scrollTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(true);
      clearTimeout(scrollTimer.current);
      scrollTimer.current = setTimeout(() => setScrolled(false), 700);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimer.current);
    };
  }, []);

  if (["/login", "/register"].includes(location.pathname)) return null;

  const tabs = [
    { label: "Home",     path: "/",         key: "Home" },
    { label: "Chat",     path: "/chat",     key: "Chat" },
    { label: "Wishlist", path: "/wishlist", key: "Wishlist" },
    { label: "Cart",     path: "/cart",     key: "Cart",    badge: cart.length },
    { label: "Profile",  path: user?.email ? "/profile" : "/login", key: "Profile" },
  ];

  return (
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none"
      style={{
        paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)",
      }}
    >
      {/* ── Liquid Glass Floating Pill ── */}
      <motion.div
        animate={scrolled ? { scale: 0.88, opacity: 0.85 } : { scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="pointer-events-auto relative shadow-2xl flex items-center px-1.5 py-1.5 gap-0.5"
        style={{
          background: "rgba(255, 255, 255, 0.85)",
          backdropFilter: "blur(20px) saturate(160%)",
          WebkitBackdropFilter: "blur(20px) saturate(160%)",
          borderRadius: "999px",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow: "0 8px 32px -4px rgba(0,0,0,0.1), 0 4px 12px -2px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.8)",
        }}
      >
        {tabs.map(({ label, path, key, badge }) => {
          const active =
            location.pathname === path ||
            (path !== "/" && location.pathname.startsWith(path));
          const Icon = icons[key];

          return (
            <Link
              key={key}
              to={path}
              className="relative flex flex-col items-center justify-center transition-all select-none"
              style={{
                WebkitTapHighlightColor: "transparent",
                outline: "none",
                minWidth: scrolled ? "50px" : "64px",
              }}
            >
              <motion.div
                layout
                className="relative flex flex-col items-center justify-center py-2 px-1 rounded-full"
                transition={{ type: "spring", damping: 25, stiffness: 350 }}
              >
                <AnimatePresence>
                  {active && (
                    <motion.div
                      layoutId="active-pill-bg"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-x-0 inset-y-0 bg-indigo-50/80 rounded-full -z-10"
                    />
                  )}
                </AnimatePresence>

                <div className="relative">
                  <motion.div
                    animate={{
                      color: active ? "#4f46e5" : "rgba(60,60,67,0.6)",
                      scale: active ? 1.05 : 1,
                    }}
                  >
                    {active ? Icon.filled : Icon.outline}
                  </motion.div>

                  <AnimatePresence>
                    {badge > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 text-[9px] font-black text-white bg-red-500 min-w-[15px] h-3.5 rounded-full flex items-center justify-center border-2 border-white"
                      >
                        {badge > 9 ? "9+" : badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>

                <AnimatePresence>
                  {!scrolled && (
                    <motion.span
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-[10px] whitespace-nowrap overflow-hidden mt-0.5"
                      style={{
                        fontWeight: active ? 700 : 500,
                        color: active ? "#4f46e5" : "rgba(60,60,67,0.6)",
                      }}
                    >
                      {label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>
    </div>
  );
}
