import React, { createContext, useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation, Link } from "react-router-dom";
import axios from "axios";
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Configure Axios globally to pass HttpOnly cookies automatically on every request
axios.defaults.withCredentials = true;

import Footer from "./components/Footer";
import Header from "./components/Header";
import ChatWidget from "./components/ChatWidget";
import MobileNav from "./components/MobileNav";
import { motion, AnimatePresence } from "framer-motion";

// Lazy loaded route components for better performance
const Content = lazy(() => import("./components/Content"));
const Login = lazy(() => import("./components/Login"));
const Logout = lazy(() => import("./components/Logout"));
const Register = lazy(() => import("./components/Register"));
const Cart = lazy(() => import("./components/Cart"));
const Orders = lazy(() => import("./components/Orders"));
const Profile = lazy(() => import("./components/Profile"));
const ChatPage = lazy(() => import("./components/ChatPage"));

export const AppContext = createContext();

function App() {
  // Restore user from localStorage on initial load
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Restore cart from localStorage on initial load
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  // Check auth status on mount to sync with backend
  useEffect(() => {
    // If we have a token in memory, use it to verify the session
    const config = user?.token ? { headers: { Authorization: `Bearer ${user.token}` } } : {};
    
    axios.get(`${import.meta.env.VITE_API_URL}/users/me`, config)
      .then(res => {
        if (res.data) {
          // Keep the token we used to get in
          const updatedUser = { ...res.data, token: user?.token || res.data.token };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          setUser(null);
          localStorage.removeItem("user");
        }
      });
  }, []); 

  // Persist user state to localStorage (INCLUDING TOKEN for iPhone support)
  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Persist cart state to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Axios Interceptor for Security (JWT) and Global Config
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
    return () => axios.interceptors.request.eject(interceptor);
  }, [user]);

  return (
    <AppContext.Provider value={{ user, setUser, cart, setCart }}>
      <SkeletonTheme baseColor="#f1f5f9" highlightColor="#ffffff" borderRadius="0.5rem" duration={1.2}>
        <BrowserRouter>
          <LayoutWrapper user={user} setUser={setUser} cart={cart} setCart={setCart} />
        </BrowserRouter>
      </SkeletonTheme>
    </AppContext.Provider>
  );
}

function CookieBanner() {
  const [show, setShow] = useState(() => !localStorage.getItem("cookies_accepted"));
  if (!show) return null;

  const accept = () => {
    localStorage.setItem("cookies_accepted", "true");
    setShow(false);
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[2000] p-4 md:p-6"
    >
      <div className="max-w-7xl mx-auto bg-white shadow-[0_-20px_60px_rgba(0,0,0,0.1)] border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex-1 space-y-2 text-left">
          <h3 className="text-xl font-bold text-slate-900">We value your privacy</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            We use cookies and other technologies to personalize your experience, perform marketing, and collect analytics. Learn more in our <Link to="/" className="underline font-medium hover:text-black">Privacy Policy.</Link>
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <button onClick={() => setShow(false)} className="text-sm font-bold underline hover:text-indigo-600">Manage preferences</button>
          <button onClick={accept} className="flex-1 md:flex-none h-12 px-10 border-2 border-slate-900 font-bold uppercase tracking-widest hover:bg-slate-50 transition-all">Accept</button>
          <button onClick={() => setShow(false)} className="flex-1 md:flex-none h-12 px-10 border-2 border-slate-200 text-slate-400 font-bold uppercase tracking-widest hover:border-slate-900 hover:text-slate-900 transition-all">Decline</button>
        </div>
      </div>
    </motion.div>
  );
}

function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [dismissed, setDismissed] = useState(sessionStorage.getItem("newsletter_dismissed"));

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 4000); 
    return () => clearTimeout(timer);
  }, [dismissed]);

  const validate = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) {
      setError("Your Email is in an invalid format.");
      return false;
    }
    return true;
  };

  const close = () => {
    setShow(false);
    sessionStorage.setItem("newsletter_dismissed", "true");
    setDismissed("true");
  };

  const submit = () => {
    if (validate()) {
      alert("Subscription successful!");
      close();
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[3000] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-white p-8 md:p-12 shadow-2xl"
          >
            <button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-black">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {/* 🔥 Red Validation Error Box (Image 1) */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-6 overflow-hidden"
                >
                  <div className="border border-black p-4 flex items-center justify-between text-red-500 font-medium text-sm">
                    <span>{error}</span>
                    <button onClick={() => setError("")} className="font-black text-xs hover:scale-120 transition-transform">X</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="text-center space-y-8">
               <h2 className="text-4xl md:text-5xl font-serif text-slate-900 leading-[1.1]">
                 Want <span className="italic">10% OFF</span> your first order?
               </h2>
               
               <p className="text-sm md:text-base text-slate-500 leading-relaxed max-w-sm mx-auto">
                 Enter your email address and phone number to receive 10% off your first order and stay in the know.
               </p>

               <div className="space-y-4 pt-4">
                 <input 
                   type="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   placeholder="Email" 
                   className="w-full h-14 px-6 border border-slate-300 rounded-sm text-lg focus:border-black outline-none transition-all"
                 />
                 <button 
                   onClick={submit}
                   className="w-full h-16 border-2 border-black bg-white text-black font-bold uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all text-lg"
                 >
                   Submit & continue
                 </button>
               </div>
               
               <button onClick={close} className="text-slate-900 font-bold uppercase tracking-widest text-xs hover:underline">
                 No thanks
               </button>

               <p className="text-[10px] text-slate-400 pt-6 uppercase tracking-widest font-bold">
                 Cannot be combined with other offers, some exclusions apply.
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Global Skeleton Loader for Suspense Fallback
function LoadingFallback() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <Skeleton width="20%" height={24} className="mb-4 rounded-lg" />
      <Skeleton count={5} height={60} className="mb-4 rounded-xl" />
    </div>
  );
}

function LayoutWrapper({ user, setUser, cart, setCart }) {
  return (
    <div className="app-container">
      <NewsletterPopup />
      <CookieBanner />
      <ConditionalHeader />
      <main className="main-content">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route index element={<Content />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<Orders />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="logout" element={<Logout />} />
          </Routes>
        </Suspense>
      </main>
      <ConditionalFooter />
      <MobileNav />
      <ChatWidget />
    </div>
  );
}

function ConditionalHeader() {
  const { pathname } = useLocation();
  if (["/login", "/register"].includes(pathname)) return null;
  return <Header />;
}

function ConditionalFooter() {
  const { pathname } = useLocation();
  if (["/login", "/register"].includes(pathname)) return null;
  return <Footer />;
}

export default App;
