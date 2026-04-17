import React, { useContext, useEffect } from 'react';
import { AppContext } from '../App';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
  const { setUser, setCart } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Clear user and cart on logout
    setUser({});
    setCart([]);
    navigate("/");
  }, []);

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-4"></div>
      <p className="text-slate-500 font-medium">Signing out securely...</p>
    </div>
  );
}
