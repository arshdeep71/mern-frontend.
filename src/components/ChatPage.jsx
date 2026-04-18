import { ChatPanel } from "./ChatWidget";

export default function ChatPage() {
  return (
    <div className="sm:hidden flex flex-col pb-20" style={{ minHeight: "calc(100dvh - 64px)" }}>
      {/* Page header */}
      <div className="px-4 pt-4 pb-3 border-b border-slate-100 bg-white flex-shrink-0">
        <h1 className="text-[17px] font-bold text-slate-900">Support Chat</h1>
        <p className="text-[12px] text-slate-400 mt-0.5">We're here to help you</p>
      </div>
      <div className="flex-1">
        <ChatPanel isOpen={true} onClose={null} isMobilePage={true} />
      </div>
    </div>
  );
}
