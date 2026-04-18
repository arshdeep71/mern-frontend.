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
    <div className="min-h-screen flex flex-col bg-gray-50">
      <ConditionalHeader />
      <main className="flex-1 flex flex-col">
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
      {/* Desktop footer — hidden on mobile */}
      <div className="hidden sm:block">
        <ConditionalFooter />
      </div>
      {/* Mobile bottom nav */}
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
