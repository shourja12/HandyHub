import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DEMO_CHATS = [
  { id: 1, name: "Rahul",  avatar: "https://i.pravatar.cc/40?img=1", lastMsg: "Is the task still open?" },
  { id: 2, name: "Aman",   avatar: "https://i.pravatar.cc/40?img=2", lastMsg: "Thanks for accepting! 🙌" },
  { id: 3, name: "Priya",  avatar: "https://i.pravatar.cc/40?img=5", lastMsg: "When can you start?" },
];

const DEMO_MESSAGES = [
  { text: "Hey! Is the task still open?", sender: "other", time: "10:30" },
  { text: "Yes bro, you can take it 👍",  sender: "me",    time: "10:31" },
  { text: "Awesome! I'll start tonight.", sender: "other", time: "10:32" },
  { text: "Perfect, DM me if you need anything.", sender: "me", time: "10:33" },
];

export default function Chat() {
  const navigate     = useNavigate();
  const [chats]      = useState(DEMO_CHATS);
  const [activeChat, setActiveChat] = useState(DEMO_CHATS[0]);
  const [messages,   setMessages]   = useState(DEMO_MESSAGES);
  const [input,      setInput]      = useState("");
  const [sideOpen,   setSideOpen]   = useState(true);
  const endRef       = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => [...prev, { text: input.trim(), sender: "me", time: now }]);
    setInput("");
  };

  return (
    <div className="h-screen bg-[#0F172A] text-white flex overflow-hidden">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <div className={`${sideOpen ? "w-72" : "w-0 overflow-hidden"} flex-shrink-0
                       glass-strong border-r border-white/5 flex flex-col
                       transition-all duration-300`}>

        {/* Header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <button onClick={() => navigate("/")}
              className="text-xl font-extrabold shimmer-text cursor-pointer block">HandyHub</button>
            <p className="text-xs text-gray-500 mt-0.5">Messages</p>
          </div>
          <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2 py-0.5 rounded-full border border-indigo-500/20">
            {chats.length}
          </span>
        </div>

        {/* Chat list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => setActiveChat(chat)}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl text-left transition-all duration-200
                ${activeChat.id === chat.id
                  ? "bg-indigo-500/15 border border-indigo-500/25"
                  : "hover:bg-white/5 border border-transparent"
                }`}
            >
              <div className="relative flex-shrink-0">
                <img src={chat.avatar} alt={chat.name} className="w-10 h-10 rounded-full ring-2 ring-white/10" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full ring-2 ring-[#0F172A]" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-gray-100 truncate">{chat.name}</p>
                <p className="text-xs text-gray-500 truncate">{chat.lastMsg}</p>
              </div>
            </button>
          ))}
        </div>

      </div>

      {/* ── Chat Area ────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5 glass-strong flex-shrink-0">
          {/* Sidebar toggle */}
          <button
            onClick={() => setSideOpen(o => !o)}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="relative">
            <img src={activeChat.avatar} alt={activeChat.name} className="w-9 h-9 rounded-full" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full ring-2 ring-[#0F172A]" />
          </div>
          <div>
            <p className="font-semibold text-sm">{activeChat.name}</p>
            <p className="text-xs text-green-400">Online</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`px-4 py-2.5 rounded-2xl max-w-xs shadow-lg text-sm
                  ${msg.sender === "me"
                    ? "bg-gradient-to-r from-indigo-500 to-violet-500 rounded-br-md"
                    : "glass border border-white/8 rounded-bl-md text-gray-100"
                  }`}
              >
                <p>{msg.text}</p>
                <span className="text-xs opacity-60 block mt-1 text-right">{msg.time}</span>
              </div>
            </div>
          ))}
          <div ref={endRef} />
        </div>

        {/* Input bar */}
        <div className="px-5 py-4 border-t border-white/5 glass-strong flex gap-3 flex-shrink-0">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            className="flex-1 px-4 py-3 rounded-2xl glass border border-white/10 text-white
                       placeholder-gray-600 focus:outline-none focus:border-indigo-500/50
                       focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className="bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400
                       px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300
                       hover:scale-105 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100"
          >
            Send ↑
          </button>
        </div>

      </div>
    </div>
  );
}