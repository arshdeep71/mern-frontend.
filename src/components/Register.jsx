import React, { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../App";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

// ── Inline icons ──
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="5"/><path d="M3 21v-1a8 8 0 0 1 16 0v1"/>
  </svg>
);
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
const CheckIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ── Floating Label Input ──
function FloatInput({ id, label, icon: Icon, type = "text", value, onChange, error, rightEl, autoComplete }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value;
  return (
    <div className="relative">
      <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-150 pointer-events-none ${active ? "text-indigo-500" : "text-slate-400"}`}>
        <Icon />
      </span>
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
      {rightEl && <span className="absolute right-3.5 top-1/2 -translate-y-1/2">{rightEl}</span>}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
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

// ── Password strength dot ──
function PwStrength({ value }) {
  if (!value) return null;
  const checks = [value.length >= 8, /[A-Z]/.test(value), /[0-9]/.test(value), /@/.test(value)];
  const score = checks.filter(Boolean).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-emerald-400"];
  return (
    <div className="flex items-center gap-1.5 mt-2 ml-0.5">
      {checks.map((ok, i) => (
        <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i < score ? colors[score - 1] : "bg-slate-200"}`} />
      ))}
      <span className="text-[10px] font-medium text-slate-400 ml-1">
        {["", "Weak", "Fair", "Good", "Strong"][score]}
      </span>
    </div>
  );
}

export default function Register() {
  const { user, setUser } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [notice, setNotice] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const formRef = useRef(null);
  const panelRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(".gsap-item",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.055, ease: "power2.out", delay: 0.08 }
      );
    }, formRef);
    const pctx = gsap.context(() => {
      gsap.fromTo(".gsap-panel",
        { opacity: 0, y: 22 },
        { opacity: 1, y: 0, duration: 0.65, stagger: 0.07, ease: "power3.out", delay: 0.35 }
      );
    }, panelRef);
    return () => { ctx.revert(); pctx.revert(); };
  }, []);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required.";
    if (!email.trim()) e.email = "Email is required.";
    if (!password) e.password = "Password is required.";
    else if (password.length < 8) e.password = "At least 8 characters.";
    else if (!/[A-Z]/.test(password)) e.password = "Include one uppercase letter.";
    else if (!/[0-9]/.test(password)) e.password = "Include one number.";
    else if (!/@/.test(password)) e.password = "Include the '@' symbol.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/users/signup`, { name, email, password });
      setUser(res.data);
      navigate("/login");
    } catch {
      setErrors({ submit: "Registration failed. This email may already be in use." });
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
        <div className="gsap-item flex items-center gap-2.5 mb-12">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200/60">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-[15px] font-semibold text-slate-900 tracking-tight">MyStore</span>
          </Link>
        </div>

        {/* Heading */}
        <div className="gsap-item mb-8">
          <h1 className="text-[28px] font-bold text-slate-900 tracking-[-0.02em] leading-tight mb-1.5">
            Create your account
          </h1>
          <p className="text-[13px] text-slate-400 font-normal leading-relaxed">
            Join thousands of shoppers on MyStore.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4" noValidate>
          <div className="gsap-item">
            <FloatInput
              id="name"
              label="Full name"
              icon={UserIcon}
              value={name}
              onChange={e => setName(e.target.value)}
              error={errors.name}
              autoComplete="name"
            />
          </div>

          <div className="gsap-item">
            <FloatInput
              id="email"
              label="Email address"
              icon={MailIcon}
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />
          </div>

          <div className="gsap-item">
            <FloatInput
              id="password"
              label="Password"
              icon={LockIcon}
              type={showPw ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
              error={errors.password}
              autoComplete="new-password"
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
            <PwStrength value={password} />
          </div>

          {/* Password strength bar only — no persistent checklist */}

          {/* Professional validation alert — shown only after failed submit */}
          <AnimatePresence>
            {errors.password && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
                className="rounded-2xl border border-amber-200/80 bg-amber-50/60 backdrop-blur-sm p-4"
                style={{ boxShadow: "0 0 0 1px rgba(217,119,6,0.08), 0 4px 16px rgba(217,119,6,0.06)" }}
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-amber-500/15 flex items-center justify-center flex-shrink-0">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                        <line x1="12" y1="9" x2="12" y2="13"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                      </svg>
                    </div>
                    <p className="text-[12px] font-semibold text-amber-800">Password requirements not met</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrors(e => ({ ...e, password: undefined }))}
                    className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0 cursor-pointer mt-0.5"
                  >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
                {/* Rule list — only unmet */}
                <div className="space-y-1.5">
                  {[
                    ["At least 8 characters", password.length >= 8],
                    ["One uppercase letter (A–Z)", /[A-Z]/.test(password)],
                    ["One number (0–9)", /[0-9]/.test(password)],
                    ["The '@' symbol", /@/.test(password)],
                  ]
                    .filter(([, met]) => !met)
                    .map(([rule]) => (
                      <div key={rule} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-amber-500/60 flex-shrink-0" />
                        <p className="text-[11px] font-medium text-amber-700/80">{rule}</p>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit error */}
          <AnimatePresence>
            {errors.submit && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[12px] text-red-500/90 font-medium bg-red-50 border border-red-100/80 rounded-xl px-4 py-3"
              >
                {errors.submit}
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA */}
          <div className="gsap-item pt-1">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                </svg>
              ) : (
                <>Create account <ArrowIcon /></>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="gsap-item divider-text mt-6">
          <span>or register with</span>
        </div>

        {/* Social */}
        <div className="gsap-item grid grid-cols-2 gap-3">
          <button className="btn-ghost" onClick={() => showMaintenance("Google sign-up")}>
            <FcGoogle size={17} />
            <span>Google</span>
          </button>
          <button className="btn-ghost" onClick={() => showMaintenance("Apple sign-up")}>
            <FaApple size={17} className="text-slate-800" />
            <span>Apple</span>
          </button>
        </div>

        {/* Login link */}
        <p className="gsap-item mt-8 text-center text-[12px] text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-500 hover:text-indigo-600 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* ────────── RIGHT : Brand Panel ────────── */}
      <div
        ref={panelRef}
        className="hidden lg:flex flex-1 relative overflow-hidden items-center justify-center"
        style={{ background: "linear-gradient(145deg, #1e1b4b 0%, #312e81 30%, #1e1b4b 60%, #0f172a 100%)" }}
      >
        {/* Ambient blobs */}
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.12, 0.2, 0.12] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-12%] w-[460px] h-[460px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(99,102,241,0.7) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
        <motion.div
          animate={{ scale: [1, 0.9, 1], opacity: [0.08, 0.16, 0.08] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
          className="absolute bottom-[-15%] left-[-10%] w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.6) 0%, transparent 70%)", filter: "blur(90px)" }}
        />
        {/* grain */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)",
          backgroundSize: "100% 3px"
        }} />

        {/* Content */}
        <div className="relative z-10 max-w-[380px] px-8 text-center">
          <div className="gsap-panel mb-8">
            <div className="inline-flex items-center gap-2 bg-white/8 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/60 text-[11px] font-medium tracking-wide uppercase">Join 10,000+ Members</span>
            </div>
            <h2 className="text-[38px] font-bold text-white leading-[1.1] tracking-[-0.03em] mb-4">
              Start your <br />
              <span className="text-indigo-300">journey today.</span>
            </h2>
            <p className="text-white/40 text-[13px] font-normal leading-relaxed">
              A shopping experience built around<br />quality, speed, and trust.
            </p>
          </div>

          {/* Benefits */}
          <div className="gsap-panel flex flex-col gap-3 text-left">
            {[
              { label: "Free account, forever", sub: "No credit card required" },
              { label: "Exclusive member pricing", sub: "Up to 50% off for members" },
              { label: "Order tracking", sub: "Real-time updates always" },
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
          <div className="gsap-panel mt-10 overflow-hidden relative">
            <div className="absolute left-0 inset-y-0 w-8 z-10" style={{ background: "linear-gradient(to right, #1e1b4b, transparent)" }} />
            <div className="absolute right-0 inset-y-0 w-8 z-10" style={{ background: "linear-gradient(to left, #0f172a, transparent)" }} />
            <div className="flex gap-8 animate-[marquee_25s_linear_infinite] whitespace-nowrap">
              {["FREE SHIPPING", "50% OFF", "NEW ARRIVALS", "MEMBERS ONLY", "FREE SHIPPING", "50% OFF", "NEW ARRIVALS"].map((t, i) => (
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
