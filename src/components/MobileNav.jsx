import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";

// ── Icons (filled + outline variants) ──
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
    { label: "Cart",     path: "/cart",     key: "Cart", badge: cart.length },
    { label: "Profile",  path: user?.email ? "/profile" : "/login", key: "Profile" },
  ];

  return (
    /**
     * Full-width frosted glass bar — extends from pill to physical screen bottom.
     * This is how iOS native tab bars work: the material fills the entire
     * safe-area zone (home indicator area). No floating, no gap, no bad strip.
     */
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        /* Full-bleed frosted glass — covers content + safe-area zone */
        backdropFilter: "blur(24px) saturate(180%) brightness(1.05)",
        WebkitBackdropFilter: "blur(24px) saturate(180%) brightness(1.05)",
        background: "rgba(248, 248, 252, 0.88)",
        /* Top hairline border */
        borderTop: "0.5px solid rgba(0,0,0,0.10)",
        /* Extend content area below safe area using padding-bottom */
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* Tab row */}
      <div className="flex items-center justify-around px-2 py-1">
        {tabs.map(({ label, path, key, badge }) => {
          const active =
            location.pathname === path ||
            (path !== "/" && location.pathname.startsWith(path));
          const Icon = icons[key];

          return (
            <Link
              key={key}
              to={path}
              className="relative flex flex-col items-center justify-center py-2 px-3 rounded-2xl transition-all select-none"
              style={{ WebkitTapHighlightColor: "transparent", outline: "none", minWidth: 56 }}
            >
              {/* Active indicator background */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="tab-active-bg"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ type: "spring", damping: 26, stiffness: 400 }}
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: "rgba(79, 70, 229, 0.10)",
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <div className="relative">
                <motion.div
                  animate={{
                    color: active ? "#4f46e5" : "rgba(100,100,120,0.7)",
                    scale: active ? 1.08 : 1,
                  }}
                  transition={{ type: "spring", damping: 20, stiffness: 380 }}
                >
                  {active ? Icon.filled : Icon.outline}
                </motion.div>

                {/* Badge */}
                <AnimatePresence>
                  {badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", damping: 18, stiffness: 500 }}
                      className="absolute -top-1 -right-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center text-white font-black border-2 border-white"
                      style={{
                        fontSize: 9,
                        background: "#ff3b30",
                        paddingLeft: badge > 9 ? 3 : 0,
                        paddingRight: badge > 9 ? 3 : 0,
                      }}
                    >
                      {badge > 9 ? "9+" : badge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>

              {/* Label */}
              <AnimatePresence>
                {!scrolled && (
                  <motion.span
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", damping: 26, stiffness: 320 }}
                    className="overflow-hidden whitespace-nowrap mt-0.5"
                    style={{
                      fontSize: 10,
                      fontWeight: active ? 700 : 500,
                      color: active ? "#4f46e5" : "rgba(100,100,120,0.7)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
