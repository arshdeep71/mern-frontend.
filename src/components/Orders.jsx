import React, { useContext, useEffect, useState, useRef } from "react";
import { AppContext } from "../App";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { gsap } from "gsap";
import axios from "axios";
import { io } from "socket.io-client";

const statusConfig = {
  Pending:    { bg: "bg-amber-50",   border: "border-amber-200",  text: "text-amber-700",   dot: "bg-amber-400"   },
  Delivered:  { bg: "bg-emerald-50", border: "border-emerald-200",text: "text-emerald-700", dot: "bg-emerald-400" },
  Shipped:    { bg: "bg-blue-50",    border: "border-blue-200",   text: "text-blue-700",    dot: "bg-blue-400"    },
  Cancelled:  { bg: "bg-red-50",     border: "border-red-100",    text: "text-red-600",     dot: "bg-red-400"     },
};

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ── Skeleton order card ──
function SkeletonOrder({ index }) {
  const isOdd = index % 2 !== 0;
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden mb-6" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" }}>
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
        <div className="flex items-center gap-5">
          <div>
            <Skeleton width={50} height={8} className="mb-1 block" />
            <Skeleton width={80} height={14} />
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <Skeleton width={40} height={8} className="mb-1 block" />
            <Skeleton width={70} height={14} />
          </div>
        </div>
        <Skeleton width={90} height={26} borderRadius={9999} />
      </div>
      <div className="p-6">
        <Skeleton width={120} height={10} className="mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[1, 2].map(i => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100">
              <Skeleton width={44} height={44} borderRadius={12} className="flex-shrink-0" />
              <div className="space-y-1.5 flex-1">
                <Skeleton width={isOdd ? "85%" : "70%"} height={12} />
                <Skeleton width={isOdd ? "45%" : "55%"} height={10} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Single order card ──
function OrderCard({ order, index, API_URL }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const cfg = statusConfig[order.status] || statusConfig.Pending;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(0,0,0,0.08)" }}
      className="bg-white rounded-3xl border border-slate-100 overflow-hidden transition-shadow duration-300"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" }}
    >
      {/* Header */}
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
        <div className="flex items-center gap-5">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Order ID</span>
            <span className="text-[12px] font-mono font-semibold text-slate-600">#{order._id.slice(-8)}</span>
          </div>
          <div className="h-6 w-px bg-slate-200" />
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">Total</span>
            <span className="text-[13px] font-bold text-slate-800">₹{order.orderValue}</span>
          </div>
        </div>

        {/* Status badge with animated dot */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.border} ${cfg.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${order.status === "Pending" ? "animate-pulse" : ""}`} />
          {order.status}
        </div>
      </div>

      {/* Items */}
      <div className="p-6">
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-4">Items Summary</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {order.cart.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: index * 0.08 + idx * 0.06 + 0.15 }}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50/80 border border-slate-100 group hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors duration-200"
            >
              <div className="w-11 h-11 bg-white border border-slate-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                <img src={`${API_URL}${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-semibold text-slate-800 truncate">{item.name}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {item.quantity} × <span className="font-medium text-slate-500">₹{item.price}</span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function Orders() {
  const { user } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL;
  const headerRef = useRef(null);

  useEffect(() => {
    if (!user?.email) { setLoading(false); return; }
    
    Promise.all([
      axios.get(`${API_URL}/orders/show-orders/${user.email}`),
      new Promise(resolve => setTimeout(resolve, 800)) // ensure skeleton is visible for smoothness
    ])
      .then(([res]) => setOrders(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  useEffect(() => {
    if (!loading && headerRef.current) {
      gsap.fromTo(headerRef.current.children,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power2.out" }
      );
    }
  }, [loading]);

  // LIVE SOCKET IMPLEMENTATION
  useEffect(() => {
    if (!user?.email) return;
    
    // Connect to the backend
    const socket = io(API_URL);
    
    socket.on("order_updated", (data) => {
      // Automatically inject or update the active state if this order involves us
      setOrders(prev => {
        const found = prev.some(o => o._id === data.orderId);
        if (found) {
          // Replace it with the newly fired version
          return prev.map(o => o._id === data.orderId ? data.order : o);
        } else if (data.order.email === user.email) {
          // Push it inside if it's a completely newly placed order we didn't have
          return [data.order, ...prev];
        }
        return prev;
      });
    });

    return () => socket.disconnect();
  }, [user, API_URL]);

  if (!user?.email) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-[22px] font-bold text-slate-900 mb-2">Sign in to view your orders</h2>
          <p className="text-slate-400 text-[13px] mb-8">Your order history is available after signing in.</p>
          <Link to="/login" className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-full text-[13px]" style={{ width: "auto" }}>
            Sign In
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div ref={headerRef} className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.25em] mb-1.5">Your Account</p>
          <h1 className="text-[30px] font-bold text-slate-900 tracking-[-0.02em]">Order History</h1>
        </div>
        <span className="text-[12px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full">
          {loading ? "Loading…" : `${orders.length} total`}
        </span>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map(i => <SkeletonOrder key={i} index={i} />)}
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200"
        >
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-5"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/>
            </svg>
          </motion.div>
          <p className="text-slate-400 text-[13px] font-medium mb-1">No orders yet.</p>
          <Link to="/" className="text-indigo-500 text-[13px] font-semibold hover:text-indigo-600 transition-colors">
            Start shopping →
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, i) => (
            <OrderCard key={order._id} order={order} index={i} API_URL={API_URL} />
          ))}
        </div>
      )}
    </div>
  );
}
