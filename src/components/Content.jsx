import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../App";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { gsap } from "gsap";
import axios from "axios";

// ── Inline SVG icons ──
const CartIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// ── Skeleton card ──
function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" }}>
      <div className="aspect-square relative flex items-center justify-center bg-slate-50">
        <div className="absolute inset-0">
          <Skeleton height="100%" borderRadius={0} />
        </div>
      </div>
      <div className="p-5">
        <Skeleton width="30%" height={10} className="mb-3" />
        <Skeleton width="90%" height={14} className="mb-1" />
        <Skeleton width="65%" height={14} className="mb-4" />
        <div className="flex justify-between items-center mt-4">
          <div>
            <Skeleton width={40} height={10} className="mb-1 block" />
            <Skeleton width={60} height={18} />
          </div>
          <Skeleton width={90} height={34} borderRadius={9999} />
        </div>
      </div>
    </div>
  );
}

// ── Animated product card ──
function ProductCard({ product, inCart, onAdd, onIncrement, onDecrement, index }) {
  const [justAdded, setJustAdded] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const handleAdd = () => {
    onAdd(product);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-2xl border border-slate-100 overflow-hidden cursor-default"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03)" }}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        {!imgLoaded && (
          <div className="absolute inset-0 z-0">
            <Skeleton height="100%" borderRadius={0} />
          </div>
        )}
        <motion.img
          src={`${import.meta.env.VITE_API_URL}${product.imageUrl}`}
          alt={product.name}
          className="w-full h-full object-cover relative z-10"
          style={{ opacity: imgLoaded ? 1 : 0, transition: 'opacity 0.4s ease-in-out' }}
          onLoad={() => setImgLoaded(true)}
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          loading="lazy"
        />
        {/* New badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.06 + 0.3 }}
          className="absolute top-3 left-3"
        >
          <span className="bg-white/90 backdrop-blur-sm text-indigo-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm border border-white/80">
            New
          </span>
        </motion.div>
        {/* In-cart overlay badge */}
        <AnimatePresence>
          {inCart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-3 right-3 w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg shadow-indigo-200"
            >
              <CheckIcon />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info */}
      <div className="p-5">
        <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Premium</span>
        <h3 className="font-semibold text-slate-800 text-[15px] mt-1 group-hover:text-indigo-600 transition-colors duration-200 truncate leading-tight">
          {product.name}
        </h3>
        <p className="text-slate-400 text-[12px] mt-1.5 line-clamp-2 leading-relaxed min-h-[36px]">
          {product.desc}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-medium">Price</span>
            <p className="text-[18px] font-bold text-slate-900 tracking-tight">₹{product.price}</p>
          </div>

          <AnimatePresence mode="wait">
            {inCart ? (
              <motion.div
                key="counter"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1 bg-indigo-50 border border-indigo-100 rounded-full px-1 py-0.5"
              >
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onDecrement(product._id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-indigo-600 font-bold transition-all text-lg leading-none"
                >−</motion.button>
                <span className="w-6 text-center text-sm font-bold text-indigo-700">{inCart.quantity}</span>
                <motion.button
                  whileTap={{ scale: 0.85 }}
                  onClick={() => onIncrement(product._id)}
                  className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm text-indigo-600 font-bold transition-all text-lg leading-none"
                >+</motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="add"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="relative overflow-hidden bg-slate-900 text-white text-[12px] font-semibold px-5 py-2.5 rounded-full hover:bg-indigo-600 transition-colors duration-200"
                style={{ boxShadow: justAdded ? "0 0 0 3px rgba(99,102,241,0.3)" : "none" }}
              >
                <AnimatePresence mode="wait">
                  {justAdded ? (
                    <motion.span
                      key="added"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <CheckIcon /> Added
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ y: 10, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      className="flex items-center gap-1.5"
                    >
                      <CartIcon /> Add
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function Content() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, setCart } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const headerRef = useRef(null);

  const fetchProducts = async () => {
    try {
      const [res] = await Promise.all([
        axios.get(`${API_URL}/products`),
        new Promise(resolve => setTimeout(resolve, 800)) // ensure skeleton is visible for smoothness
      ]);
      setProducts(res.data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // GSAP header entrance
  useEffect(() => {
    if (!loading && headerRef.current) {
      gsap.fromTo(headerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power2.out" }
      );
    }
  }, [loading]);

  const addToCart    = (p) => { if (!cart.find(i => i._id === p._id)) setCart([...cart, { ...p, quantity: 1 }]); };
  const increment    = (id) => setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity + 1 } : i));
  const decrement    = (id) => setCart(cart.map(i => i._id === id ? { ...i, quantity: i.quantity - 1 } : i).filter(i => i.quantity > 0));
  const getItem      = (id) => cart.find(i => i._id === id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div ref={headerRef} className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
        <div>
          <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-[0.25em] mb-2">Curated For You</p>
          <h1 className="text-[32px] font-bold text-slate-900 tracking-[-0.02em] leading-tight">
            Featured Collection
          </h1>
          <p className="text-slate-400 text-[13px] mt-1 font-normal">
            Premium technology and goods, hand-picked.
          </p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[12px] font-medium text-slate-400 bg-slate-50 border border-slate-100 px-4 py-2 rounded-full"
        >
          Showing {loading ? "…" : products.length} products
        </motion.div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-32 bg-white rounded-3xl border border-dashed border-slate-200"
        >
          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
            </svg>
          </div>
          <p className="text-slate-400 text-[13px] font-medium">No products found in our inventory.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, i) => (
            <ProductCard
              key={product._id}
              product={product}
              index={i}
              inCart={getItem(product._id)}
              onAdd={addToCart}
              onIncrement={increment}
              onDecrement={decrement}
            />
          ))}
        </div>
      )}
    </div>
  );
}
