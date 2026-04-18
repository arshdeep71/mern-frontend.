import { Link, useLocation } from "react-router-dom";
import { useContext, useState, useEffect, useRef } from "react";
import { AppContext } from "../App";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

// ── Icons (filled + outline variants) ──
const icons = {
  Home: {
    outline: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    filled: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 2L2 10v12a2 2 0 0 0 2 2h5v-7h6v7h5a2 2 0 0 0 2-2V10L12 2z" />
      </svg>
    ),
  },
  Chat: {
    outline: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    filled: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M21 3H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11l4 4V5a2 2 0 0 0-2-2z" />
      </svg>
    ),
  },
  Wishlist: {
    outline: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    filled: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="#ff3b5c" stroke="none">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  Cart: {
    outline: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
    ),
    filled: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M6 2H3a1 1 0 0 0 0 2h1.22l2.57 12.84A3 3 0 1 0 9 17a3 3 0 0 0-1.06.21L7.5 16h10.5a1 1 0 0 0 .98-.8l1.5-8A1 1 0 0 0 19.5 6H6.3L5.94 4.2A1 1 0 0 0 5 3.41 1 1 0 0 0 4 3H3"/>
        <circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/>
      </svg>
    ),
  },
  Profile: {
    outline: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
    filled: (
      <svg width="23" height="23" viewBox="0 0 24 24" fill="currentColor" stroke="none">
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

  // Detect scroll to shrink the bar
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

  // Don't show on auth pages
  if (["/login", "/register"].includes(location.pathname)) return null;

  const tabs = [
    { label: "Home",     path: "/",        key: "Home" },
    { label: "Chat",     path: "/chat",    key: "Chat" },
    { label: "Wishlist", path: "/wishlist",key: "Wishlist" },
    { label: "Cart",     path: "/cart",    key: "Cart",    badge: cart.length },
    { label: "Profile",  path: user?.email ? "/profile" : "/login", key: "Profile" },
  ];

  return (
    /*
      Outer shell fills from the pill TOP to the physical screen BOTTOM.
      background-color matches the app body so there is NO gap anywhere.
      The pill floats inside this same-color strip — exactly like iOS native tab bars.
    */
    <div
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center pointer-events-none"
      style={{
        /* Same color as body/html — zero visual gap at physical bottom */
        backgroundColor: "#F0F2F7",
        /* Top gap above pill */
        paddingTop: "8px",
        /* Fill the home-indicator safe zone with the same color */
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      {/* ── Liquid Glass Floating Pill ── */}
      <motion.div
        animate={scrolled ? { scale: 0.88, opacity: 0.85 } : { scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 28, stiffness: 320 }}
        className="pointer-events-auto relative"
        style={{
          /* Liquid Glass base */
          background: "rgba(255, 255, 255, 0.18)",
          backdropFilter: "blur(40px) saturate(200%) brightness(1.1)",
          WebkitBackdropFilter: "blur(40px) saturate(200%) brightness(1.1)",
          borderRadius: 9999,
          /* Specular highlight border — top bright, sides subtle */
          border: "1px solid rgba(255,255,255,0.55)",
          boxShadow: `
            0 0 0 0.5px rgba(0,0,0,0.08),
            0 8px 32px rgba(0,0,0,0.14),
            0 2px 8px rgba(0,0,0,0.08),
            inset 0 1px 0 rgba(255,255,255,0.65),
            inset 0 -1px 0 rgba(255,255,255,0.1)
          `,
        }}
      >
        {/* Inner refraction layer */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: "linear-gradient(160deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 50%, rgba(255,255,255,0.08) 100%)",
          }}
        />

        <div className="relative flex items-center px-2 py-2 gap-1">
          {tabs.map(({ label, path, key, badge }) => {
            const active = location.pathname === path ||
              (path !== "/" && location.pathname.startsWith(path));
            const Icon = icons[key];

            return (
              <Link
                key={key}
                to={path}
                className="relative flex flex-col items-center justify-center rounded-full transition-all select-none"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  outline: "none",
                }}
              >
                <motion.div
                  layout
                  className="relative flex items-center justify-center rounded-full"
                  animate={active
                    ? { paddingLeft: scrolled ? 14 : 16, paddingRight: scrolled ? 14 : 16, paddingTop: 10, paddingBottom: 10 }
                    : { paddingLeft: 14, paddingRight: 14, paddingTop: 10, paddingBottom: 10 }
                  }
                  transition={{ type: "spring", damping: 26, stiffness: 380 }}
                >
                  {/* Active pill background */}
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        key="active-bg"
                        layoutId="active-pill"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ type: "spring", damping: 28, stiffness: 400 }}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "rgba(255,255,255,0.35)",
                          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.6), 0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon */}
                  <motion.div
                    animate={{ color: active ? "#1c1c1e" : "rgba(60,60,67,0.55)" }}
                    transition={{ duration: 0.15 }}
                    className="relative z-10 flex-shrink-0"
                    style={{ filter: active ? "none" : "none" }}
                  >
                    <motion.div
                      animate={{ scale: active ? 1.05 : 1 }}
                      transition={{ type: "spring", damping: 20, stiffness: 400 }}
                    >
                      {active ? Icon.filled : Icon.outline}
                    </motion.div>
                  </motion.div>

                  {/* Cart badge */}
                  <AnimatePresence>
                    {badge > 0 && (
                      <motion.span
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", damping: 20, stiffness: 500 }}
                        className="absolute -top-0.5 -right-0.5 z-20 min-w-[16px] h-4 rounded-full flex items-center justify-center text-white font-black border-2 border-white/60"
                        style={{
                          fontSize: 9,
                          background: "#ff3b30",
                          paddingLeft: badge > 9 ? 3 : 0,
                          paddingRight: badge > 9 ? 3 : 0,
                          boxShadow: "0 1px 4px rgba(255,59,48,0.5)",
                        }}
                      >
                        {badge > 9 ? "9+" : badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Label — collapses when scrolling */}
                <AnimatePresence>
                  {!scrolled && (
                    <motion.span
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: -2 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      transition={{ type: "spring", damping: 26, stiffness: 320 }}
                      style={{
                        fontSize: 10,
                        fontWeight: active ? 700 : 500,
                        color: active ? "#1c1c1e" : "rgba(60,60,67,0.55)",
                        letterSpacing: "0.01em",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        paddingBottom: 2,
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
      </motion.div>

      {/* Bottom spacer — 8px gap between pill and home-indicator fill */}
      <div className="pointer-events-none" style={{ height: 8 }} />
    </div>
  );
}
