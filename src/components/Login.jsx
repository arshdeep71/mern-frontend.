import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// ── Minimal icon components (no external dep noise) ──
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const EyeIcon = ({ open }) => open ? (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
  </svg>
) : (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/>
  </svg>
);
const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
);

// ── Floating Label Input ──
function FloatInput({ id, label, icon: Icon, type = "text", value, onChange, error, rightEl, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value;
  return (
    <div className="relative">
      {/* Icon */}
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150 pointer-events-none ${active ? "text-indigo-500" : "text-slate-400"}`}>
        <Icon />
      </span>
      {/* Floating label */}
      <motion.label
        htmlFor={id}
        animate={
          active
            ? { y: -22, x: -2, scale: 0.78, backgroundColor: "#ffffff", paddingLeft: "4px", paddingRight: "4px", color: focused ? "#6366f1" : "#94a3b8" }
            : { y: 0, scale: 1, backgroundColor: "transparent", paddingLeft: "0px", paddingRight: "0px", color: "#94a3b8" }
        }
        transition={{ duration: 0.16, ease: [0.4, 0, 0.2, 1] }}
        className="absolute left-11 top-1/2 -translate-y-1/2 origin-left text-sm font-medium pointer-events-none z-10"
        style={{ transformOrigin: "left center" }}
      >
        {label}
      </motion.label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        autoComplete={autoComplete}
        className={`input-premium pt-5 pb-3 ${error ? "error" : ""} ${rightEl ? "pr-10" : "pr-4"}`}
        style={{ paddingLeft: "44px" }}
      />
      {rightEl && (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</span>
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 ml-0.5 text-[11px] font-medium text-red-500/80"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Login() {
  const { user, setUser, cart } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [notice, setNotice] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // GSAP entrance on mount
  const formRef = useRef(null);
  const panelRef = useRef(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".gsap-form-item",
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.55, stagger: 0.06, ease: "power2.out", delay: 0.1 }
      );
    }, formRef);
    const pctx = gsap.context(() => {
      gsap.fromTo(".gsap-panel-item",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.3 }
      );
    }, panelRef);
    return () => { ctx.revert(); pctx.revert(); };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError("");
    try {
      const res = await axios.post(`${API_URL}/users/login`, { email, password });
      setUser(res.data);
      if (cart.length > 0) navigate("/cart");
      else navigate("/");
    } catch {
      setFormError("Invalid credentials. Please check and try again.");
    } finally {
      setLoading(false);
    }
  };

  const showMaintenance = (feature) => {
    setNotice(`${feature} is currently under maintenance.`);
    setTimeout(() => setNotice(null), 3500);
  };

  return (
    <div className="auth-bg min-h-screen flex overflow-hidden font-sans">

      {/* ────────── LEFT : Form ────────── */}
      <div className="w-full lg:w-[46%] xl:w-[42%] flex flex-col justify-center px-8 sm:px-14 lg:px-16 xl:px-20 py-10 bg-white relative z-10" ref={formRef}>

        {/* Logo */}
        <div className="gsap-form-item flex items-center gap-2.5 mb-12">
          <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200/60">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="text-[15px] font-semibold text-slate-900 tracking-tight">MyStore</span>
        </div>

        {/* Heading */}
        <div className="gsap-form-item mb-8">
          <h1 className="text-[28px] font-bold text-slate-900 tracking-[-0.02em] leading-tight mb-1.5">
            Welcome back
          </h1>
          <p className="text-[13px] text-slate-400 font-normal leading-relaxed">
            Sign in to your account to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="gsap-form-item">
            <FloatInput
              id="email"
              label="Email address"
              icon={MailIcon}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="gsap-form-item">
            <FloatInput
              id="password"
              label="Password"
              icon={LockIcon}
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              rightEl={
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="text-slate-400 hover:text-slate-600 transition-colors duration-150 cursor-pointer"
                  tabIndex={-1}
                >
                  <EyeIcon open={showPw} />
                </button>
              }
            />
          </div>

          {/* Forgot password */}
          <div className="gsap-form-item flex justify-end -mt-1">
            <button
              type="button"
              onClick={() => showMaintenance("Password recovery")}
              className="text-[12px] font-medium text-indigo-500 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Form error */}
          <AnimatePresence>
            {formError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="gsap-form-item text-[12px] text-red-500/90 font-medium bg-red-50 border border-red-100/80 rounded-xl px-4 py-3"
              >
                {formError}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="gsap-form-item pt-1">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              ) : (
                <>Sign in <ArrowIcon /></>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="gsap-form-item divider-text mt-6">
          <span>or continue with</span>
        </div>

        {/* Social */}
        <div className="gsap-form-item grid grid-cols-2 gap-3">
          <button className="btn-ghost" onClick={() => showMaintenance("Google sign-in")}>
            <FcGoogle size={17} />
            <span>Google</span>
          </button>
          <button className="btn-ghost" onClick={() => showMaintenance("Apple sign-in")}>
            <FaApple size={17} className="text-slate-800" />
            <span>Apple</span>
          </button>
        </div>

        {/* Register link */}
        <p className="gsap-form-item mt-8 text-center text-[12px] text-slate-400">
          Don't have an account?{" "}
          <Link to="/register" className="font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
            Create one free
          </Link>
        </p>
      </div>

      {/* ────────── RIGHT : Brand Panel ────────── */}
      <div
        ref={panelRef}
        className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center"
        style={{
          background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 30%, #1e1b4b 60%, #0f172a 100%)"
        }}
      >
        {/* Soft ambient blobs — GSAP-animated, not distracting */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.15, 0.22, 0.15] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-15%] right-[-10%] w-[480px] h-[480px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.7) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <motion.div
          animate={{ scale: [1, 0.92, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut", delay: 4 }}
          className="absolute bottom-[-20%] left-[-8%] w-[420px] h-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)", filter: "blur(90px)" }}
        />

        {/* Horizontal grain line */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
          backgroundSize: "100% 3px"
        }} />

        {/* Content */}
        <div className="relative z-10 max-w-[380px] px-8 text-center">
          <div className="gsap-panel-item mb-8">
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-white/60 text-[11px] font-medium tracking-wide uppercase">Trusted Worldwide</span>
            </div>
            <h2 className="text-[38px] font-bold text-white leading-[1.1] tracking-[-0.03em] mb-4">
              The store <br />
              <span className="text-indigo-300">you deserve.</span>
            </h2>
            <p className="text-white/40 text-[13px] font-normal leading-relaxed">
              Curated products. Transparent pricing.<br />Reliable delivery. Every time.
            </p>
          </div>

          {/* Feature pills */}
          <div className="gsap-panel-item flex flex-col gap-3 text-left">
            {[
              { label: "Instant checkout", sub: "One-click, zero friction" },
              { label: "Premium curation", sub: "Only the best makes it through" },
              { label: "Priority support", sub: "Real humans, real fast" },
            ].map((f, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                className="flex items-center gap-3.5 bg-white/5 border border-white/8 rounded-2xl px-4 py-3.5 backdrop-blur-sm cursor-default"
              >
                <div className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-400/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                </div>
                <div>
                  <p className="text-white/90 text-[12px] font-semibold leading-none mb-0.5">{f.label}</p>
                  <p className="text-white/35 text-[11px] font-normal">{f.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Marquee */}
          <div className="gsap-panel-item mt-10 overflow-hidden relative">
            <div className="absolute left-0 inset-y-0 w-8 bg-gradient-to-r from-[#1e1b4b] to-transparent z-10" />
            <div className="absolute right-0 inset-y-0 w-8 bg-gradient-to-l from-[#0f172a] to-transparent z-10" />
            <div className="flex gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
              {["FLAT 50% OFF", "FREE SHIPPING", "NEW ARRIVALS", "LIMITED STOCK", "FLAT 50% OFF", "FREE SHIPPING", "NEW ARRIVALS"].map((t, i) => (
                <span key={i} className="text-white/20 text-[11px] font-semibold uppercase tracking-[0.2em]">{t}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {notice && (
          <div className="fixed inset-x-0 bottom-8 z-[9999] flex justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="toast-panel flex items-center gap-3 px-5 py-3.5 max-w-sm"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
              <p className="text-white/80 text-[12px] font-medium">{notice}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
