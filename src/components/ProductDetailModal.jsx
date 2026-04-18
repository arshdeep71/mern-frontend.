import { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AppContext } from "../App";

const BackIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);
const HeartIcon = ({ filled }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? "#ef4444" : "none"} stroke={filled ? "#ef4444" : "currentColor"} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const ShareIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
);
const CartBagIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);
const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const CheckboxIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
  </svg>
);
const WifiIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" y1="20" x2="12.01" y2="20" />
  </svg>
);

export default function ProductDetailModal({ product, onClose, API_URL }) {
  const { cart, setCart } = useContext(AppContext);
  const [wishlisted, setWishlisted] = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const inCart = cart.find(i => i._id === product._id);

  const imgSrc = (url) => {
    if (!url) return "";
    if (url.startsWith("data:")) return url;
    if (url.startsWith("http")) return `${API_URL}/proxy/image?url=${encodeURIComponent(url)}`;
    return `${API_URL}${url}`;
  };

  const addToCart = () => {
    if (inCart) {
      setCart(cart.map(i => i._id === product._id ? { ...i, quantity: i.quantity + qty } : i));
    } else {
      setCart([...cart, { ...product, quantity: qty }]);
    }
    onClose();
  };

  const buyNow = () => {
    addToCart();
    // navigate to cart - parent handles this
    onClose();
  };

  const features = [
    { icon: <CheckboxIcon />, label: "4K Ultra HD XDR Display" },
    { icon: <WifiIcon />, label: "Wireless Charging System" },
    { icon: <CheckboxIcon />, label: "Pro Camera System" },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black/40 sm:flex sm:items-center sm:justify-center"
        onClick={onClose}
      >
        {/* Sheet */}
        <motion.div
          key="sheet"
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 30, stiffness: 350 }}
          onClick={e => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 sm:static sm:rounded-3xl sm:max-w-sm sm:mx-auto overflow-hidden"
          style={{
            background: "#fff",
            borderRadius: "28px 28px 0 0",
            maxHeight: "93vh",
            overflowY: "auto",
            paddingBottom: "env(safe-area-inset-bottom, 16px)",
          }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-slate-200" />
          </div>

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 py-3">
            <button
              onClick={onClose}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <BackIcon />
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setWishlisted(v => !v)}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-red-50 transition-colors"
              >
                <HeartIcon filled={wishlisted} />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <ShareIcon />
              </button>
              <button className="w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors">
                <CartBagIcon />
              </button>
            </div>
          </div>

          {/* Main image */}
          <div className="mx-5 rounded-3xl overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100" style={{ aspectRatio: "1/1" }}>
            <img
              src={imgSrc(product.imageUrl)}
              alt={product.name}
              className="w-full h-full object-contain p-6"
              style={{ mixBlendMode: "multiply" }}
            />
          </div>

          {/* Thumbnail strip */}
          <div className="flex items-center gap-2.5 px-5 mt-4">
            {[product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl].map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImg(i)}
                className="rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-200"
                style={{
                  width: 60,
                  height: 60,
                  border: selectedImg === i ? "2.5px solid #4f46e5" : "2px solid #e2e8f0",
                  background: "#f8fafc",
                }}
              >
                <img src={imgSrc(img)} alt="" className="w-full h-full object-contain p-1" style={{ mixBlendMode: "multiply" }} />
              </button>
            ))}
          </div>

          {/* Product info */}
          <div className="px-5 mt-5">
            <h2 className="text-[20px] font-bold text-slate-900 tracking-tight leading-snug">{product.name}</h2>

            {/* Brand & rating */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-[13px] text-slate-500">By</span>
              <span className="text-[13px] font-semibold text-indigo-600">{product.brand || "Brand"}</span>
              <span className="text-slate-300 text-[13px]">•</span>
              <StarIcon />
              <span className="text-[12px] font-semibold text-slate-700">4.9</span>
              <span className="text-[11px] text-slate-400">(2.2k)</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </div>

            {/* Price + qty */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <span className="text-[22px] font-bold text-slate-900">₹{product.price}</span>
                <span className="text-[14px] text-slate-400 line-through">₹{Math.round(product.price * 1.07)}</span>
              </div>
              {/* Qty stepper */}
              <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-full px-1 py-0.5">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 text-xl font-bold hover:bg-white hover:shadow-sm transition-all"
                >−</button>
                <span className="w-6 text-center text-[14px] font-bold text-slate-800">{qty}</span>
                <button
                  onClick={() => setQty(q => q + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center bg-indigo-600 text-white text-xl font-bold hover:bg-indigo-700 transition-all shadow-sm"
                >+</button>
              </div>
            </div>

            {/* A Snapshot View */}
            <div className="mt-5">
              <p className="text-[13px] font-bold text-slate-800 mb-3">A Snapshot View</p>
              <div className="space-y-2.5">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="flex-shrink-0 text-slate-400">{f.icon}</span>
                    <span
                      className="text-[13px] text-slate-500"
                      style={{ textDecoration: i === 1 ? "line-through" : "none" }}
                    >{f.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Desc */}
            {product.desc && (
              <p className="text-[13px] text-slate-400 leading-relaxed mt-4 mb-2 line-clamp-3">{product.desc}</p>
            )}
          </div>

          {/* CTA buttons */}
          <div className="flex items-center gap-3 px-5 py-5 mt-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={buyNow}
              className="flex-1 py-4 rounded-2xl text-[14px] font-bold text-slate-800 border-2 border-slate-200 bg-white hover:border-indigo-200 hover:bg-indigo-50 transition-all"
            >
              Buy Now
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={addToCart}
              className="flex-[2] py-4 rounded-2xl text-[14px] font-bold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
              }}
            >
              {inCart ? `In Cart (${inCart.quantity}) · Add More` : "Add to Cart"}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
