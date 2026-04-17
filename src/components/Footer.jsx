import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const links = [
  { label: "Home", to: "/" },
  { label: "Cart", to: "/cart" },
  { label: "Orders", to: "/orders" },
  { label: "Profile", to: "/profile" },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className="mt-16 border-t border-slate-100"
      style={{ background: "rgba(248,248,250,0.9)", backdropFilter: "blur(12px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200/60">
              <span className="text-white font-bold text-xs">M</span>
            </div>
            <span className="text-[13px] font-semibold text-slate-800 tracking-tight">MyStore</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            {links.map((l) => (
              <motion.div key={l.label} whileHover={{ y: -1 }}>
                <Link
                  to={l.to}
                  className="text-[12px] font-medium text-slate-400 hover:text-slate-700 transition-colors duration-150 no-underline"
                >
                  {l.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[11px] text-slate-400 font-normal">
            © 2026 MyStore. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}