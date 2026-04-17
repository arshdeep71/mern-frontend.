import React, { useState, useContext, useEffect } from "react";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

// ── Consistent 16px stroke icons ──
const Icon = {
  User: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M3 21v-1a7 7 0 0 1 14 0v1"/></svg>,
  Mail: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
  Lock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  Phone: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.11 9.91a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  Map: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Edit: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Check: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  X: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Eye: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  EyeOff: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>,
  Cart: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  Bag: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>,
  Logout: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  ChevronRight: () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Star: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
};

/* ── Field row ── */
function Field({ icon: Ico, label, value, editing, inputProps }) {
  return (
    <div className="flex items-start gap-3.5 py-3.5 px-1 group rounded-xl hover:bg-slate-50 transition-colors duration-150">
      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
        <Ico />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] mb-1">{label}</p>
        {editing ? (
          <input
            {...inputProps}
            className="w-full text-[13px] font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 transition-all placeholder:text-slate-300"
          />
        ) : (
          <p className="text-[13px] font-medium text-slate-800 truncate">
            {value || <span className="text-slate-300 font-normal">—</span>}
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Stat chip ── */
function Stat({ label, value }) {
  return (
    <div className="text-center py-4 px-3">
      <p className="text-[20px] font-bold text-slate-900 tracking-tight leading-none mb-1">{value}</p>
      <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-[0.18em]">{label}</p>
    </div>
  );
}

/* ── Main ── */
export default function Profile() {
  const { user, setUser, cart } = useContext(AppContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [toast, setToast] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });

  useEffect(() => {
    if (!user?.email) navigate("/login");
    setForm({ name: user?.name || "", email: user?.email || "", password: "", phone: user?.phone || "", address: user?.address || "" });
  }, [user]);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {};
      if (form.name)     payload.name     = form.name.trim();
      if (form.email)    payload.email    = form.email.trim();
      if (form.phone)    payload.phone    = form.phone.trim();
      if (form.address)  payload.address  = form.address.trim();
      if (form.password) payload.password = form.password;

      // PUT /admin/profile → axios interceptor in App.jsx automatically
      // attaches `Authorization: Bearer <token>` from user.token in localStorage
      const res = await axios.put(`${API_URL}/admin/profile`, payload);

      // Merge the server-confirmed data back into context + localStorage
      const updated = { ...user, ...res.data };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));

      setEditing(false);
      showToast("Profile updated successfully.");
    } catch (err) {
      const msg = err?.response?.data?.message || "Update failed. Please try again.";
      showToast(msg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => { setUser({}); localStorage.removeItem("user"); navigate("/login"); };

  const initials = (() => {
    const n = (user?.name || user?.email || "U").trim().split(" ");
    return n.length > 1 ? (n[0][0] + n[n.length - 1][0]).toUpperCase() : n[0][0].toUpperCase();
  })();

  // ── Single subtle page entry ──
  const pageAnim = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
  };

  return (
    <motion.div {...pageAnim} className="min-h-screen bg-[#F9F9FB]">
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-16">

        {/* ── Page label ── */}
        <div className="mb-10">
          <p className="text-[10px] font-semibold text-indigo-500 uppercase tracking-[0.25em] mb-2">Account</p>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-[-0.02em]">My Profile</h1>
        </div>

        {/* ── Layout ── */}
        <div className="grid lg:grid-cols-[300px_1fr] gap-7 items-start">

          {/* ═════ LEFT COLUMN ═════ */}
          <div className="space-y-4">

            {/* Profile card - Clean White SaaS Style */}
            <div
              className="rounded-2xl overflow-hidden bg-white border border-slate-200/60"
              style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.03)" }}
            >
              <div className="px-6 pt-8 pb-7 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4 shadow-sm">
                  <span className="text-slate-700 font-bold text-2xl tracking-tight">{initials}</span>
                </div>

                {/* Name & email */}
                <h2 className="text-slate-900 font-bold text-[17px] tracking-tight mb-0.5 truncate w-full">{user?.name || "Explorer"}</h2>
                <p className="text-slate-500 text-[12px] font-medium truncate mb-5 w-full">{user?.email}</p>

                {/* Status badge */}
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-100/50 rounded-full px-3 py-1.5 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-emerald-700 text-[10px] font-bold tracking-wide uppercase">Pro Plan</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-slate-100 mx-5" />

              {/* Stats */}
              <div className="grid grid-cols-2 divide-x divide-slate-100 py-4 pb-5">
                <div className="text-center">
                  <p className="text-slate-900 font-bold text-[16px] mb-0.5">{cart.length}</p>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.1em]">In Cart</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-900 font-bold text-[16px] mb-0.5">Active</p>
                  <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.1em]">Status</p>
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div
              className="rounded-2xl overflow-hidden bg-white border border-slate-200/60"
              style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.03)" }}
            >
              {[
                { Ico: Icon.Bag, label: "My Orders", sub: "Track purchases", path: "/orders" },
                { Ico: Icon.Cart, label: "My Cart", sub: `${cart.length} item${cart.length !== 1 ? "s" : ""}`, path: "/cart" },
              ].map((a, i) => (
                <motion.button
                  key={a.label}
                  whileHover={{ backgroundColor: "#F8FAFC" }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => navigate(a.path)}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 text-left transition-colors ${i === 0 ? "" : "border-t border-slate-100"}`}
                >
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 flex-shrink-0">
                    <a.Ico />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-800 font-medium text-[13px]">{a.label}</p>
                    <p className="text-slate-400 text-[11px]">{a.sub}</p>
                  </div>
                  <span className="text-slate-300"><Icon.ChevronRight /></span>
                </motion.button>
              ))}

              <div className="border-t border-slate-100" />

              <motion.button
                whileHover={{ backgroundColor: "#FFF5F5" }}
                whileTap={{ scale: 0.99 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-3.5 px-5 py-4 text-left transition-colors group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-rose-50 group-hover:text-rose-400 transition-colors flex-shrink-0">
                  <Icon.Logout />
                </div>
                <div>
                  <p className="text-slate-800 group-hover:text-rose-500 font-medium text-[13px] transition-colors">Sign Out</p>
                  <p className="text-slate-400 text-[11px]">End your session</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* ═════ RIGHT COLUMN ═════ */}
          <div className="space-y-5">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Cart Items", value: cart.length },
                { label: "Member Since", value: "2024" },
                { label: "Account Type", value: "Pro" },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  whileHover={{ y: -1, transition: { duration: 0.15 } }}
                  className="bg-white rounded-2xl px-5 py-5 text-center"
                  style={{ border: "1px solid rgba(15,15,20,0.07)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
                >
                  <p className="text-[22px] font-bold text-slate-900 tracking-tight leading-none mb-1.5">{s.value}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em]">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* Personal info card */}
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: "1px solid rgba(15,15,20,0.07)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
            >
              {/* Card header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
                <div>
                  <h3 className="text-slate-900 font-semibold text-[14px]">Personal Information</h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {editing ? "Edit your details below" : "Your saved account details"}
                  </p>
                </div>

                <AnimatePresence mode="wait">
                  {!editing ? (
                    <motion.button
                      key="edit-btn"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditing(true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 text-[11px] font-semibold rounded-xl transition-colors uppercase tracking-wide cursor-pointer"
                    >
                      <Icon.Edit /> Edit
                    </motion.button>
                  ) : (
                    <motion.div
                      key="save-btns"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="flex items-center gap-2"
                    >
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={handleSave} disabled={saving}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white text-[11px] font-semibold rounded-xl hover:bg-indigo-700 transition-colors uppercase tracking-wide cursor-pointer disabled:opacity-50"
                      >
                        {saving
                          ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          : <Icon.Check />}
                        {saving ? "Saving…" : "Save"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => setEditing(false)}
                        className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-500 text-[11px] font-semibold rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
                      >
                        <Icon.X />
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Fields */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={editing ? "e" : "v"}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  className="px-5 py-4 space-y-0.5"
                >
                  <Field icon={Icon.User} label="Full Name" value={user?.name} editing={editing}
                    inputProps={{ value: form.name, onChange: e => setForm({ ...form, name: e.target.value }), placeholder: "Your full name" }} />
                  <Field icon={Icon.Mail} label="Email Address" value={user?.email} editing={editing}
                    inputProps={{ type: "email", value: form.email, onChange: e => setForm({ ...form, email: e.target.value }), placeholder: "your@email.com" }} />
                  <Field icon={Icon.Phone} label="Phone" value={user?.phone} editing={editing}
                    inputProps={{ type: "tel", value: form.phone, onChange: e => setForm({ ...form, phone: e.target.value }), placeholder: "+91 00000 00000" }} />
                  <Field icon={Icon.Map} label="Delivery Address" value={user?.address} editing={editing}
                    inputProps={{ value: form.address, onChange: e => setForm({ ...form, address: e.target.value }), placeholder: "Your delivery address" }} />

                  {editing && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-start gap-3.5 py-3.5 px-1"
                    >
                      <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 flex-shrink-0 mt-0.5">
                        <Icon.Lock />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-slate-400 uppercase tracking-[0.15em] mb-1">New Password</p>
                        <div className="relative">
                          <input
                            type={showPw ? "text" : "password"}
                            value={form.password}
                            onChange={e => setForm({ ...form, password: e.target.value })}
                            placeholder="Leave blank to keep current"
                            className="w-full pr-10 text-[13px] font-medium text-slate-800 bg-white border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10 transition-all placeholder:text-slate-300"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw(v => !v)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                          >
                            {showPw ? <Icon.EyeOff /> : <Icon.Eye />}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CTA banner — clean, modern, dark SaaS style */}
            <div
              className="rounded-2xl px-7 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 bg-slate-900 border border-slate-800 relative overflow-hidden"
              style={{ boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1)" }}
            >
              {/* Subtle tech background grid/glow */}
              <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

              <div className="relative z-10 w-full">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse"></span>
                  <p className="text-[9px] font-bold text-indigo-400 uppercase tracking-[0.2em]">Exclusive Offer</p>
                </div>
                <p className="text-white font-bold text-[17px] tracking-tight">Flat 50% off this week.</p>
                <p className="text-slate-400 text-[12px] mt-0.5">Limited time — shop high-end tech before it ends.</p>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/")}
                className="relative z-10 flex-shrink-0 bg-white text-slate-900 text-[11px] font-bold px-5 py-2.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer border border-white/10"
              >
                Shop Collection →
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <div className="fixed inset-x-0 bottom-8 z-[9999] flex justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.2 }}
              className="toast-panel flex items-center gap-3 px-5 py-3.5"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${toast.type === "error" ? "bg-red-400" : "bg-indigo-400"}`} />
              <p className="text-white/80 text-[12px] font-medium">{toast.msg}</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
