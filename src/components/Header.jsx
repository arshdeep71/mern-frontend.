import { Link, useLocation, useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import { useContext, useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaUser, FaShoppingBag, FaSignOutAlt, FaChevronDown, FaShoppingCart, FaBell } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";

function Header() {
  const { user, setUser, cart } = useContext(AppContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setUser({});
    localStorage.removeItem("user");
    setProfileOpen(false);
    navigate("/login");
  };

  // Generate avatar initials
  const getInitials = () => {
    if (!user?.name) return user?.email?.[0]?.toUpperCase() || "U";
    const parts = user.name.trim().split(" ");
    return parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0][0].toUpperCase();
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Cart", path: "/cart", count: cart.length },
  ];
  if (user?.email) navLinks.push({ name: "Orders", path: "/orders" });

  return (
    <header 
      className="glass sticky top-0 left-0 right-0 z-[60]" 
      style={{ 
        paddingTop: "env(safe-area-inset-top, 0px)",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px) saturate(160%)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-2 group-hover:rotate-12 transition-transform shadow-md shadow-indigo-200">
              <span className="text-white font-black italic">M</span>
            </div>
            <span className="text-xl font-black tracking-tighter text-slate-900 uppercase italic">MyStore</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden sm:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-semibold transition-colors hover:text-indigo-600 relative py-1 ${
                  location.pathname === link.path ? "text-indigo-600" : "text-slate-500"
                }`}
              >
                {link.name}
                {link.count > 0 && (
                  <span className="ml-1.5 bg-indigo-600 text-white px-1.5 py-0.5 rounded-full text-[9px] font-black">
                    {link.count}
                  </span>
                )}
                {location.pathname === link.path && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
                )}
              </Link>
            ))}

            <div className="h-4 w-px bg-slate-100 mx-1" />

            {user?.email ? (
              /* ── Profile Dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex items-center space-x-2.5 pl-1 pr-3 py-1 rounded-full border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all group"
                >
                  {/* Avatar */}
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md shadow-indigo-200 flex-shrink-0">
                    <span className="text-white font-black text-xs">{getInitials()}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-700 hidden md:block max-w-[100px] truncate">
                    {user.name || user.email?.split("@")[0]}
                  </span>
                  <FaChevronDown
                    className={`text-slate-400 text-[10px] transition-transform duration-300 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Panel */}
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-[calc(100%+8px)] w-[240px] bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden z-50 py-1"
                      >
                        {/* User identity block */}
                        <div className="px-4 py-3 border-b border-slate-100 mb-1">
                          <p className="text-slate-900 font-semibold text-[13px] truncate leading-tight">
                            {user.name || "User"}
                          </p>
                          <p className="text-slate-500 text-[11px] truncate mt-0.5">
                            {user.email}
                          </p>
                          <div className="flex items-center space-x-1.5 mt-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            <span className="text-slate-500 text-[10px] font-medium uppercase tracking-[0.05em]">Pro Plan</span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="px-1.5">
                          <Link
                            to="/profile"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <FaUser className="text-slate-400 group-hover:text-slate-700 transition-colors text-[13px]" />
                              <span className="text-slate-700 font-medium text-[13px]">My Profile</span>
                            </div>
                          </Link>

                          <Link
                            to="/orders"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <FaShoppingBag className="text-slate-400 group-hover:text-slate-700 transition-colors text-[13px]" />
                              <span className="text-slate-700 font-medium text-[13px]">Orders</span>
                            </div>
                          </Link>

                          <Link
                            to="/cart"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-slate-50 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <FaShoppingCart className="text-slate-400 group-hover:text-slate-700 transition-colors text-[13px]" />
                              <span className="text-slate-700 font-medium text-[13px]">Cart</span>
                            </div>
                            {cart.length > 0 && (
                              <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.5 rounded-md">
                                {cart.length}
                              </span>
                            )}
                          </Link>
                        </div>

                        <div className="h-px bg-slate-100 my-1 mx-3" />

                        <div className="px-1.5 mb-0.5">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-rose-50 transition-colors group cursor-pointer"
                          >
                            <div className="flex items-center space-x-3">
                              <FaSignOutAlt className="text-slate-400 group-hover:text-rose-500 transition-colors text-[13px]" />
                              <span className="text-slate-700 group-hover:text-rose-600 font-medium text-[13px] transition-colors">Sign Out</span>
                            </div>
                          </button>
                        </div>
                      </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="text-sm font-black bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition shadow-sm shadow-indigo-200 uppercase tracking-wide"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile */}
          <div className="sm:hidden flex items-center space-x-3">
            <Link to="/cart" className="relative p-2 text-slate-600 hover:text-indigo-600 transition-colors">
              <FaShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[9px] rounded-full w-4 h-4 flex items-center justify-center font-black">
                  {cart.length}
                </span>
              )}
            </Link>
            {user?.email ? (
              <button
                onClick={() => navigate("/profile")}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center shadow-md"
              >
                <span className="text-white font-black text-xs">{getInitials()}</span>
              </button>
            ) : (
              <Link to="/login" className="text-sm font-black text-indigo-600">Sign In</Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
