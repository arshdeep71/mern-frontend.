import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../App";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { gsap } from "gsap";
import axios from "axios";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ── Icons ──
const TrashIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);
const EditIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const LockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const ArrowRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const PromoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);
const ChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

// ── Mobile Cart Row ──
function MobileCartRow({ item, onIncrement, onDecrement, API_URL }) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgSrc = item.imageUrl?.startsWith("data:")
    ? item.imageUrl
    : item.imageUrl?.startsWith("http")
      ? `${API_URL}/proxy/image?url=${encodeURIComponent(item.imageUrl)}`
      : `${API_URL}${item.imageUrl}`;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 40, height: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 py-4"
    >
      {/* Image */}
      <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-100">
        {!imgLoaded && <div className="absolute inset-0"><Skeleton height="100%" borderRadius={0} /></div>}
        <img src={imgSrc} alt={item.name} className="w-full h-full object-cover" onLoad={() => setImgLoaded(true)} />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 text-[14px] truncate">{item.name}</h3>
        <p className="text-[11px] text-indigo-500 font-semibold mt-0.5">{item.brand || "Brand"}</p>
        <p className="text-[11px] text-slate-400 mt-0.5">Color: Natural</p>
        <p className="text-[15px] font-bold text-slate-900 mt-1.5">₹{item.price * item.quantity}</p>

        {/* Edit + counter + delete */}
        <div className="flex items-center justify-between mt-2">
          <button className="flex items-center gap-1 text-[11px] font-semibold text-indigo-500 hover:text-indigo-700 transition-colors">
            <EditIcon /> Edit
          </button>

          <div className="flex items-center gap-1.5">
            <motion.button
              whileTap={{ scale: 0.82 }}
              onClick={() => onDecrement(item._id)}
              className="w-7 h-7 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-base hover:border-indigo-300 hover:text-indigo-600 transition-all"
            >−</motion.button>
            <motion.span
              key={item.quantity}
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-[13px] font-bold text-slate-800 w-5 text-center"
            >{item.quantity}</motion.span>
            <motion.button
              whileTap={{ scale: 0.82 }}
              onClick={() => onIncrement(item._id)}
              className="w-7 h-7 rounded-full border-2 border-indigo-500 flex items-center justify-center text-indigo-500 font-bold text-base hover:bg-indigo-50 transition-all"
            >+</motion.button>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onDecrement(item._id)}
            className="w-7 h-7 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
          >
            <TrashIcon />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// ── Desktop Cart Row ──
function DesktopCartRow({ item, onIncrement, onDecrement, API_URL }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgSrc = item.imageUrl?.startsWith("data:")
    ? item.imageUrl
    : item.imageUrl?.startsWith("http")
      ? `${API_URL}/proxy/image?url=${encodeURIComponent(item.imageUrl)}`
      : `${API_URL}${item.imageUrl}`;

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      exit={{ opacity: 0, x: 20, height: 0, marginBottom: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-slate-100 p-4 sm:p-5 flex items-center gap-5 group"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" }}
      whileHover={{ borderColor: "rgba(99,102,241,0.15)", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0 border border-slate-100">
        {!imgLoaded && <div className="absolute inset-0 z-0"><Skeleton height="100%" borderRadius={0} /></div>}
        <motion.img
          src={imgSrc}
          alt={item.name}
          className="w-full h-full object-cover relative z-10"
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}
          onLoad={() => setImgLoaded(true)}
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="font-semibold text-slate-800 text-[15px] truncate">{item.name}</h3>
          <motion.p key={item.price * item.quantity} initial={{ scale: 1.15, color: "#6366f1" }} animate={{ scale: 1, color: "#0f172a" }} transition={{ duration: 0.3 }} className="font-bold text-slate-900 text-[15px] flex-shrink-0">
            ₹{item.price * item.quantity}
          </motion.p>
        </div>
        <p className="text-[12px] text-slate-400 mb-4">₹{item.price} each</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center bg-slate-50 border border-slate-100 rounded-full px-1 py-0.5 gap-0.5">
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => onDecrement(item._id)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-slate-500 transition-all text-lg font-bold leading-none">−</motion.button>
            <motion.span key={item.quantity} initial={{ y: -8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="w-8 text-center text-[13px] font-bold text-slate-700">{item.quantity}</motion.span>
            <motion.button whileTap={{ scale: 0.85 }} onClick={() => onIncrement(item._id)} className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-slate-500 transition-all text-lg font-bold leading-none">+</motion.button>
          </div>
          <motion.button whileHover={{ scale: 1.05, color: "#ef4444" }} whileTap={{ scale: 0.95 }} onClick={() => onDecrement(item._id)} className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 transition-colors">
            <TrashIcon /> Remove
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const [address, setAddress]   = useState(user?.address || "");
  const [placing, setPlacing]   = useState(false);
  const [placed, setPlaced]     = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const navigate                = useNavigate();
  const summaryRef              = useRef(null);

  useEffect(() => { if (user?.address) setAddress(user.address); }, [user]);

  const orderValue = cart.reduce((sum, i) => sum + i.quantity * i.price, 0);
  const shipping   = orderValue > 0 ? 15 : 0;
  const total      = orderValue + shipping;
  const increment  = (id) => setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const decrement  = (id) => setCart(cart.map(i => i._id === id ? { ...i, quantity: Math.max(0, i.quantity - 1) } : i).filter(i => i.quantity > 0));

  useEffect(() => {
    if (summaryRef.current && cart.length) {
      gsap.fromTo(summaryRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", delay: 0.2 });
    }
  }, []);

  const placeOrder = async () => {
    if (!user?.email) return navigate("/login");
    if (!address.trim()) return;
    setPlacing(true);
    try {
      await axios.post(`${API_URL}/orders/place-order`, { email: user.email, cart, orderValue: total, address });
      setPlaced(true);
      setTimeout(() => { setCart([]); navigate("/orders"); }, 1000);
    } catch (err) {
      console.error("Order failed", err);
    } finally {
      setPlacing(false);
    }
  };

  // ── Empty cart ──
  if (cart.length === 0) {
    return (
      <>
        {/* Mobile empty */}
        <div className="sm:hidden flex flex-col items-center justify-center py-20 px-6 pb-28 text-center">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
          </motion.div>
          <h2 className="text-[22px] font-bold text-slate-900 mb-2">Your cart is empty</h2>
          <p className="text-slate-400 text-[13px] mb-8">Discover products and add items you love.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] no-underline" style={{ width: "auto" }}>
            Browse Products <ArrowRightIcon />
          </Link>
        </div>
        {/* Desktop empty */}
        <div className="hidden sm:flex max-w-7xl mx-auto px-4 py-24 text-center justify-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-sm mx-auto">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-20 h-20 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
            </motion.div>
            <h2 className="text-[22px] font-bold text-slate-900 tracking-tight mb-2">Your cart is empty</h2>
            <p className="text-slate-400 text-[13px] mb-8">Discover our featured collection and add items you love.</p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px] no-underline" style={{ width: "auto" }}>
              Browse Products <ArrowRightIcon />
            </Link>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* ───── MOBILE CART ───── */}
      <div className="sm:hidden min-h-[100dvh] bg-[#F0F2F7] pb-36">
        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
          <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <BackIcon />
          </button>
          <h1 className="text-[17px] font-bold text-slate-900">Cart</h1>
          <button
            onClick={() => setCart([])}
            className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-50 transition-all"
          >
            <TrashIcon />
          </button>
        </div>

        {/* Cart Items */}
        <div className="px-4 divide-y divide-slate-100">
          <AnimatePresence mode="popLayout">
            {cart.map((item) => (
              <MobileCartRow
                key={item._id}
                item={item}
                onIncrement={increment}
                onDecrement={decrement}
                API_URL={API_URL}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Promo code */}
        <div className="mx-4 mt-4 flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3.5">
          <span className="text-slate-400 flex-shrink-0"><PromoIcon /></span>
          <input
            type="text"
            value={promoCode}
            onChange={e => setPromoCode(e.target.value)}
            placeholder="Enter Promo Code"
            className="flex-1 bg-transparent text-[13px] text-slate-700 placeholder:text-slate-400 outline-none"
          />
          <span className="text-slate-300 flex-shrink-0"><ChevronRight /></span>
        </div>

        {/* Address (if logged in) */}
        {user?.email && (
          <div className="mx-4 mt-3">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Delivery Address</label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Enter your full shipping address…"
              rows={2}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-300 resize-none"
            />
          </div>
        )}

        {/* Order summary */}
        <div className="mx-4 mt-4 space-y-2.5">
          <div className="flex justify-between text-[13px] text-slate-500">
            <span>Sub Total</span>
            <span className="font-semibold text-slate-800">{orderValue.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[13px] text-slate-500">
            <span>Shipping & Tax</span>
            <span className="font-semibold text-slate-800">${shipping}</span>
          </div>
          <div className="flex justify-between text-[14px] font-bold text-slate-900 pt-2 border-t border-slate-100">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout CTA — sits above MobileNav floating pill */}
        <div
          className="fixed left-0 right-0 px-4 pt-3 bg-[#F0F2F7] z-40"
          style={{
            bottom: 0,
            paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 88px)",
          }}
        >
          {/* Also show bottom nav safe space */}
          <div className="sm:hidden h-14" style={{ display: "none" }} />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={placeOrder}
            disabled={placing || placed || !user?.email}
            className="w-full py-4 rounded-2xl text-[15px] font-bold text-white transition-all disabled:opacity-70"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
              boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
            }}
          >
            <AnimatePresence mode="wait">
              {placing ? (
                <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                  Placing order…
                </motion.span>
              ) : placed ? (
                <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-emerald-300">
                  ✓ Order Placed!
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {user?.email ? "Checkout" : "Sign In to Checkout"}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* ───── DESKTOP CART (unchanged) ───── */}
      <div className="hidden sm:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4"
        >
          <div>
            <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.25em] mb-1.5">Review</p>
            <h1 className="text-[30px] font-bold text-slate-900 tracking-[-0.02em]">Shopping Cart</h1>
          </div>
          <span className="text-[12px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">
            {cart.length} item{cart.length !== 1 ? "s" : ""}
          </span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 xl:col-span-8">
            <AnimatePresence mode="popLayout">
              <div className="space-y-4">
                {cart.map((item) => (
                  <DesktopCartRow key={item._id} item={item} onIncrement={increment} onDecrement={decrement} API_URL={API_URL} />
                ))}
              </div>
            </AnimatePresence>
          </div>

          <div ref={summaryRef} className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
            <div
              className="rounded-3xl p-7 relative overflow-hidden"
              style={{
                background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%)",
                boxShadow: "0 20px 60px rgba(79,70,229,0.25), 0 8px 24px rgba(0,0,0,0.12)",
              }}
            >
              <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <h2 className="text-white font-bold text-[18px] mb-7 tracking-tight">Order Summary</h2>
                <div className="space-y-3.5 mb-7">
                  <div className="flex justify-between text-slate-400 text-[13px]">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="text-white font-medium">₹{orderValue}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[13px]">
                    <span>Shipping</span>
                    <span className="text-emerald-400 font-semibold text-[11px] uppercase tracking-wider">Free</span>
                  </div>
                  <div className="border-t border-white/10 pt-3.5 flex justify-between items-center">
                    <span className="text-white font-semibold text-[15px]">Total</span>
                    <motion.span key={orderValue} initial={{ scale: 1.1, color: "#a5b4fc" }} animate={{ scale: 1, color: "#a5b4fc" }} transition={{ duration: 0.25 }} className="text-[24px] font-bold text-indigo-300">
                      ₹{orderValue}
                    </motion.span>
                  </div>
                </div>

                {user?.email && (
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Delivery Address</label>
                    <textarea
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Enter your full shipping address…"
                      rows={2}
                      className="w-full bg-white/8 border border-white/10 rounded-2xl px-4 py-3 text-[13px] text-white/90 placeholder:text-white/25 focus:outline-none focus:border-indigo-400/50 focus:ring-2 focus:ring-indigo-400/20 transition resize-none font-normal"
                    />
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={placeOrder}
                  disabled={placing || placed}
                  className="w-full relative overflow-hidden bg-white text-slate-900 font-semibold py-4 rounded-2xl text-[13px] transition-all disabled:opacity-70 cursor-pointer"
                  style={{ boxShadow: "0 4px 16px rgba(255,255,255,0.15)" }}
                >
                  <AnimatePresence mode="wait">
                    {placing ? (
                      <motion.span key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                        <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" /></svg>
                        Placing order…
                      </motion.span>
                    ) : placed ? (
                      <motion.span key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2 text-emerald-600">
                        ✓ Order Placed!
                      </motion.span>
                    ) : (
                      <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center gap-2">
                        {user?.email ? "Checkout Now" : "Sign In to Checkout"} <ArrowRightIcon />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <div className="flex items-center justify-center gap-1.5 mt-4">
                  <LockIcon />
                  <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest">SSL Secured Checkout</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
