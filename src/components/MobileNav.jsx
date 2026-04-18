import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../App";
import { motion, AnimatePresence } from "framer-motion";

const HomeIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const ChatIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const WishlistIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const CartIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const ProfileIcon = ({ filled }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

export default function MobileNav() {
  const location = useLocation();
  const { cart, user } = useContext(AppContext);

  // Don't show on auth pages
  if (["/login", "/register"].includes(location.pathname)) return null;

  const tabs = [
    { label: "Home",     path: "/",        Icon: HomeIcon },
    { label: "Chat",     path: "/chat",     Icon: ChatIcon },
    { label: "Wishlist", path: "/wishlist", Icon: WishlistIcon },
    { label: "Cart",     path: "/cart",     Icon: CartIcon,    badge: cart.length },
    { label: "Profile",  path: user?.email ? "/profile" : "/login", Icon: ProfileIcon },
  ];

  return (
    <nav
      className="sm:hidden fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(0,0,0,0.07)",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.06)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {tabs.map(({ label, path, Icon, badge }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 relative"
              style={{ minWidth: 0 }}
            >
              <motion.div
                whileTap={{ scale: 0.85 }}
                className="relative"
                style={{ color: active ? "#4f46e5" : "#94a3b8" }}
              >
                <Icon filled={active} />
                <AnimatePresence>
                  {badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1"
                    >
                      {badge > 9 ? "9+" : badge}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: active ? 700 : 500,
                  color: active ? "#4f46e5" : "#94a3b8",
                  letterSpacing: "0.01em",
                }}
              >
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-indigo-600"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
