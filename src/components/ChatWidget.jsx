import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';
import { io } from 'socket.io-client';

// The chat panel UI — used both by the floating desktop widget AND the mobile Chat tab
export function ChatPanel({ isOpen, onClose, isMobilePage = false }) {
  const { user } = useContext(AppContext);
  const [messages, setMessages] = useState([]);
  const [topic, setTopic] = useState(null);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const bottomRef = useRef(null);

  const topics = [
    "Issue with a product",
    "Wrong product delivered",
    "Where is my order?",
    "Other issue"
  ];

  useEffect(() => {
    if (!user?.email || !isOpen) return;
    const newSocket = io(API_URL);
    setSocket(newSocket);
    newSocket.emit("join_support", { email: user.email });
    newSocket.on("receive_support_msg", (data) => {
      setMessages(prev => {
        const exists = prev.some(m => m.createdAt === data.message.createdAt);
        return exists ? prev : [...prev, data.message];
      });
    });
    newSocket.on("support_resolved", () => {
      setMessages(prev => [...prev, { sender: 'bot', text: 'This support ticket has been closed by admin. Thank you!', createdAt: new Date() }]);
      setTopic(null);
    });
    return () => newSocket.disconnect();
  }, [user, isOpen, API_URL]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectTopic = (selectedTopic) => {
    setTopic(selectedTopic);
    const initialMsg = { sender: 'user', text: `I need help with: ${selectedTopic}`, createdAt: new Date() };
    setMessages([initialMsg]);
    if (socket) {
      socket.emit("send_support_msg", {
        email: user.email,
        name: user.name,
        text: `User selected topic: ${selectedTopic}`,
        topic: selectedTopic,
        sender: 'bot'
      });
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: 'An agent will be with you shortly.', createdAt: new Date() }]);
      }, 500);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !socket) return;
    const newMsg = { sender: 'user', text: input.trim(), createdAt: new Date() };
    setMessages(prev => [...prev, newMsg]);
    socket.emit("send_support_msg", {
      email: user.email,
      name: user.name,
      text: input.trim(),
      sender: 'user',
      topic: topic || 'General Support'
    });
    setInput('');
  };

  if (!user?.email) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <h3 className="text-[15px] font-bold text-slate-800 mb-1">Sign in to chat</h3>
        <p className="text-[13px] text-slate-400">Our support team is available once you log in.</p>
      </div>
    );
  }

  const panelContent = (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-5 py-4 text-white flex justify-between items-center flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center border border-white/30">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a9 9 0 0 0-9 9c0 3.3 1.9 6.2 4.7 7.8L9 22l4-2h.5A9 9 0 1 0 12 2Z" />
              </svg>
            </div>
            <div className="absolute top-0 right-0 w-2 h-2 bg-emerald-400 border border-white rounded-full translate-x-1/4 -translate-y-1/4" />
          </div>
          <div>
            <h3 className="font-bold text-[13px] tracking-tight">Support Team</h3>
            <p className="text-[9px] text-white/80 font-medium uppercase tracking-[0.12em] mt-0.5">Typically replies instantly</p>
          </div>
        </div>
        {onClose && !isMobilePage && (
          <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-5 bg-slate-50/50" style={{ scrollbarWidth: "none" }}>
        {!topic ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a9 9 0 0 0-9 9c0 3.3 1.9 6.2 4.7 7.8L9 22l4-2h.5A9 9 0 1 0 12 2Z" />
                </svg>
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm text-[12px] text-slate-700 font-medium leading-relaxed">
                Hi {user?.name?.split(' ')[0]}! 👋<br />How can our team help you today?
              </div>
            </div>
            <div className="space-y-2 mt-4 ml-10">
              {topics.map(t => (
                <button
                  key={t}
                  onClick={() => selectTopic(t)}
                  className="block w-full text-left px-4 py-2.5 bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-sm rounded-[10px] text-[12px] font-semibold text-slate-700 transition"
                >
                  {t} <span className="float-right text-slate-300">→</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => {
              const isBot = msg.sender === 'bot';
              const isUser = msg.sender === 'user';
              return (
                <div key={i} className={`flex ${isUser ? 'justify-end' : 'items-end gap-2'}`}>
                  {!isUser && (
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 mb-1 ${isBot ? 'bg-slate-200' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'}`}>
                      {isBot ? <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 22l10-3 10 3L12 2z" /></svg> : <span className="text-[9px] font-bold">A</span>}
                    </div>
                  )}
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-[1.25rem] text-[12.5px] font-medium leading-relaxed shadow-sm ${
                    isUser ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-br-sm' :
                    isBot ? 'bg-slate-100 border border-slate-200 text-slate-600 rounded-bl-sm italic' :
                    'bg-white border border-slate-100 text-slate-800 rounded-bl-sm'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`p-3 bg-white border-t border-slate-100 flex-shrink-0 ${!topic ? 'opacity-50 pointer-events-none' : ''}`}>
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-[12px] px-4 py-2.5 text-[13px] font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all placeholder:text-slate-400"
            disabled={!topic}
          />
          <button
            type="submit"
            disabled={!topic}
            className="w-11 h-11 aspect-square bg-indigo-600 rounded-[12px] shadow-md shadow-indigo-200/50 flex items-center justify-center text-white disabled:opacity-50 hover:bg-indigo-700 transition cursor-pointer"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </div>
    </>
  );

  // Mobile page mode: fills the space without absolute positioning
  if (isMobilePage) {
    return (
      <div className="flex flex-col h-full bg-white" style={{ minHeight: "calc(100vh - 120px)" }}>
        {panelContent}
      </div>
    );
  }

  // Desktop floating panel mode
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="absolute bottom-16 right-0 w-80 bg-white/90 backdrop-blur-3xl rounded-[1.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden flex flex-col"
          style={{ height: '420px' }}
        >
          {panelContent}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Desktop-only floating button widget (hidden on mobile via CSS)
export default function ChatWidget() {
  const { user } = useContext(AppContext);
  const [isOpen, setIsOpen] = useState(false);

  if (!user?.email) return null;

  return (
    <div className="hidden sm:block fixed bottom-6 right-6 z-50">
      <ChatPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-indigo-600 rounded-full shadow-lg shadow-indigo-600/30 flex items-center justify-center text-white cursor-pointer"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isOpen ? (
            <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
          ) : (
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
          )}
        </svg>
      </motion.button>
    </div>
  );
}
