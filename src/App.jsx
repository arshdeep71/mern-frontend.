import React, { createContext, useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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

function NewsletterPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(sessionStorage.getItem("newsletter_dismissed"));

  useEffect(() => {
    if (dismissed) return;
    const timer = setTimeout(() => setShow(true), 4000); 
    return () => clearTimeout(timer);
  }, [dismissed]);

  const close = () => {
    setShow(false);
    sessionStorage.setItem("newsletter_dismissed", "true");
    setDismissed("true");
  };

  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
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
            className="relative w-full max-w-lg bg-white p-10 shadow-2xl overflow-hidden"
          >
            <button onClick={close} className="absolute top-4 right-4 text-slate-400 hover:text-black">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="text-center space-y-6">
               <h2 className="text-3xl font-black text-slate-900 leading-tight">
                 Before you go, subscribe to get <span className="text-indigo-600">10% OFF</span> your first order.
               </h2>
               <div className="space-y-4 pt-4">
                 <input 
                   type="email" 
                   placeholder="Email" 
                   className="w-full h-14 px-6 bg-slate-100 border-none rounded-sm text-lg focus:ring-2 focus:ring-black outline-none"
                 />
                 <button className="w-full h-14 bg-black text-white font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition-colors">
                   Submit & continue
                 </button>
               </div>
               <button onClick={close} className="text-slate-400 font-medium hover:text-black hover:underline transition-all">
                 No thanks
               </button>
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
