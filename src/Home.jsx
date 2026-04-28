import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import AnimatedBackground from "./components/AnimatedBackground";
import TiltCard from "./components/TiltCard";

// ─── Floating emoji decorations ───────────────────────────────────────────────
const FLOATING = [
  { emoji: "🚀", style: { top: "8%",  left: "4%"  }, cls: "animate-float      text-3xl opacity-10" },
  { emoji: "⚡", style: { top: "15%", right: "6%"  }, cls: "animate-float-slow text-2xl opacity-10" },
  { emoji: "🎯", style: { bottom: "18%", left: "3%" }, cls: "animate-float      text-2xl opacity-10" },
  { emoji: "✨", style: { top: "50%", right: "4%"  }, cls: "animate-float-slow text-xl  opacity-10" },
];

// ─── Points Flash Hook ─────────────────────────────────────────────────────────
function useFlash() {
  const [flash, setFlash] = useState(false);
  const trigger = () => {
    setFlash(true);
    setTimeout(() => setFlash(false), 500);
  };
  return [flash, trigger];
}

export default function Home() {
  const navigate = useNavigate();

  const [tasks,       setTasks]       = useState([]);
  const [activeTasks, setActiveTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [points,      setPoints]      = useState(120);
  const [loading,     setLoading]     = useState(true);
  const [backendDown, setBackendDown] = useState(false);
  const [flashPoints, triggerFlash]   = useFlash();

  // Fetch tasks
  useEffect(() => {
    axios
      .get("http://localhost:8000/tasks")
      .then(res => { setTasks(res.data); setBackendDown(false); })
      .catch(err => { console.error("Error fetching tasks:", err); setBackendDown(true); })
      .finally(() => setLoading(false));
  }, []);

  // Accept a task
  const handleAcceptTask = (task) => {
    setTasks(prev => prev.filter(t => t.id !== task.id));
    setActiveTasks(prev => [...prev, task]);
  };

  // Complete a task
  const handleCompleteTask = (task) => {
    setActiveTasks(prev => prev.filter(t => t.id !== task.id));
    setPoints(prev => prev + (task.points || 50));
    triggerFlash();
  };

  // Search filter
  const filteredTasks = tasks.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const level = Math.floor(points / 50);

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white overflow-x-hidden selection:bg-indigo-500/30">

      {/* 🌌 3D Animated Canvas Background */}
      <AnimatedBackground />

      {/* Floating emoji decorations */}
      {FLOATING.map((f, i) => (
        <div key={i} className={`fixed pointer-events-none hidden md:block ${f.cls}`} style={f.style}>
          {f.emoji}
        </div>
      ))}

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-10 py-6 md:py-10 space-y-10">

        {/* ── NAVBAR ─────────────────────────────────────────────────── */}
        <header className="flex justify-between items-center pb-5 border-b border-white/5">
          <div
            className="cursor-pointer group"
            onClick={() => navigate("/")}
          >
            <h1 className="text-3xl md:text-4xl font-extrabold shimmer-text tracking-tight group-hover:opacity-90 transition-opacity">
              HandyHub
            </h1>
            <p className="text-gray-500 text-xs tracking-widest uppercase mt-0.5 hidden sm:block">
              Community Task Exchange
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Messages */}
            <button
              onClick={() => navigate("/chat")}
              title="Messages"
              className="relative p-2.5 rounded-2xl glass border border-white/10 hover:border-indigo-500/50
                         hover:shadow-[0_0_18px_rgba(99,102,241,0.25)] transition-all duration-300
                         text-gray-400 hover:text-indigo-400 group"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863
                     9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3
                     12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </button>

            {/* Post Task CTA */}
            <button
              onClick={() => navigate("/create")}
              className="glow-btn relative inline-flex items-center gap-2 bg-gradient-to-r
                         from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400
                         text-white font-semibold px-5 py-2.5 rounded-2xl transition-all
                         duration-300 hover:scale-105 text-sm group overflow-hidden"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
              <span className="text-lg leading-none group-hover:rotate-90 transition-transform duration-300 relative">+</span>
              <span className="relative">Post Task</span>
            </button>
          </div>
        </header>

        {/* ── STATS CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">

          {/* Points */}
          <TiltCard className="col-span-1">
            <div className="glass-strong rounded-3xl p-5 relative overflow-hidden h-full">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-green-500/10 rounded-full blur-2xl" />
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Points</p>
              <h2 className={`text-3xl font-bold text-green-400 transition-all ${flashPoints ? "points-flash" : ""}`}>
                {points}
                <span className="text-base text-green-400/60 font-medium ml-1">pts</span>
              </h2>
              <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-700"
                  style={{ width: `${Math.min((points % 50) * 2, 100)}%` }}
                />
              </div>
              <p className="text-gray-500 text-xs mt-1">{50 - (points % 50)} pts to next level</p>
            </div>
          </TiltCard>

          {/* Level */}
          <TiltCard className="col-span-1" glowColor="rgba(139,92,246,0.2)">
            <div className="glass-strong rounded-3xl p-5 relative overflow-hidden h-full">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-2xl" />
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Tier</p>
              <h2 className="text-3xl font-bold text-indigo-400 flex items-center gap-2">
                Level {level}
                <span className="text-2xl animate-bounce">🚀</span>
              </h2>
              <p className="text-gray-500 text-xs mt-3">
                {level < 3 ? "Keep going, rookie!" : level < 6 ? "Rising star 🌟" : "Elite Contributor 🎖️"}
              </p>
            </div>
          </TiltCard>

          {/* Active tasks count */}
          <TiltCard className="col-span-1" glowColor="rgba(251,191,36,0.15)">
            <div className="glass-strong rounded-3xl p-5 relative overflow-hidden h-full">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-yellow-500/10 rounded-full blur-2xl" />
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">In Progress</p>
              <h2 className="text-3xl font-bold text-yellow-400">{activeTasks.length}</h2>
              <p className="text-gray-500 text-xs mt-3">Active tasks</p>
            </div>
          </TiltCard>

          {/* Available tasks count */}
          <TiltCard className="col-span-1" glowColor="rgba(103,232,249,0.15)">
            <div className="glass-strong rounded-3xl p-5 relative overflow-hidden h-full">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-2xl" />
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-widest mb-2">Available</p>
              <h2 className="text-3xl font-bold text-cyan-400">{filteredTasks.length}</h2>
              <p className="text-gray-500 text-xs mt-3">Open tasks</p>
            </div>
          </TiltCard>

        </div>

        {/* ── SEARCH ─────────────────────────────────────────────────── */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors"
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks — 'physics notes', 'React help'..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl glass-strong text-white
                       placeholder-gray-500 focus:outline-none focus:ring-2
                       focus:ring-indigo-500/40 transition-all duration-300 text-base"
          />
          {/* Animated bottom border */}
          <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-indigo-500/0 via-indigo-500/60 to-indigo-500/0
                          scale-x-0 group-focus-within:scale-x-100 transition-transform duration-500 origin-center" />
        </div>

        {/* ── AVAILABLE TASKS ────────────────────────────────────────── */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Available Tasks</h2>
            <span className="badge-pop text-xs font-semibold text-indigo-300 bg-indigo-500/10
                             border border-indigo-500/20 px-3 py-1.5 rounded-full">
              {filteredTasks.length} found
            </span>
          </div>

          {loading ? (
            /* Skeleton loader */
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1,2,3].map(i => (
                <div key={i} className="glass rounded-3xl p-6 animate-pulse h-48">
                  <div className="h-4 bg-white/10 rounded-full w-3/4 mb-3" />
                  <div className="h-3 bg-white/5  rounded-full w-full mb-2" />
                  <div className="h-3 bg-white/5  rounded-full w-4/5" />
                </div>
              ))}
            </div>
          ) : backendDown ? (
            <div className="glass rounded-3xl p-12 text-center">
              <p className="text-5xl mb-4">🔌</p>
              <p className="text-gray-200 text-lg font-semibold mb-2">Backend Offline</p>
              <p className="text-gray-500 text-sm">The task server isn't running. Start your backend at <code className="text-indigo-400">localhost:8000</code> to see tasks.</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="glass rounded-3xl p-12 text-center">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-gray-400 text-lg">No tasks match your search.</p>
              {searchQuery && (
                <button onClick={() => setSearchQuery("")}
                  className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm underline">
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTasks.map((task, i) => (
                <TiltCard key={task.id} className={`card-enter delay-${Math.min(i * 100, 600) + 100}`}>
                  <div className="glass-strong rounded-3xl p-6 flex flex-col justify-between h-full
                                  border border-white/5 hover:border-indigo-500/25 transition-colors duration-300">
                    <div>
                      <h3 className="text-lg font-bold text-gray-100 leading-snug mb-2">{task.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">{task.description}</p>
                    </div>

                    <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                      <span className="inline-flex items-center gap-1.5 bg-green-500/10 text-green-400
                                       border border-green-500/20 px-3 py-1.5 rounded-full text-sm font-bold">
                        🟢 +{task.points || 50} pts
                      </span>
                      <button
                        onClick={() => handleAcceptTask(task)}
                        className="relative overflow-hidden bg-white/8 hover:bg-indigo-500 text-white
                                   px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                                   hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 group"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-violet-500/0
                                         group-hover:from-indigo-500 group-hover:to-violet-500 transition-all
                                         duration-300 rounded-xl" />
                        <span className="relative">Accept</span>
                      </button>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </section>

        {/* ── ACTIVE TASKS ───────────────────────────────────────────── */}
        <section className="pb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Active Tasks</h2>
            {activeTasks.length > 0 && (
              <span className="badge-pop text-xs font-semibold text-yellow-300 bg-yellow-500/10
                               border border-yellow-500/20 px-3 py-1.5 rounded-full">
                {activeTasks.length} in progress
              </span>
            )}
          </div>

          {activeTasks.length === 0 ? (
            <div className="glass rounded-3xl p-10 border border-dashed border-white/10 flex flex-col
                            items-center justify-center text-center">
              <span className="text-5xl mb-4">👀</span>
              <h3 className="text-lg font-semibold text-gray-200">No active tasks yet</h3>
              <p className="text-gray-500 mt-1 text-sm">Accept a task above to start earning points!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeTasks.map((task, i) => (
                <TiltCard key={`active-${task.id}`} glowColor="rgba(99,102,241,0.22)"
                  className={`card-enter delay-${Math.min(i * 100, 500) + 100}`}>
                  <div className="glass-strong rounded-3xl p-6 flex flex-col justify-between h-full
                                  border border-indigo-500/20 relative overflow-hidden">
                    {/* Active pulse indicator */}
                    <div className="absolute top-4 right-4 flex gap-1 items-center">
                      <span className="flex h-2.5 w-2.5 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-70" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500" />
                      </span>
                      <span className="text-xs text-indigo-400 font-medium ml-1">Live</span>
                    </div>

                    {/* Subtle background glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-violet-900/10 pointer-events-none" />

                    <div className="relative">
                      <h3 className="text-lg font-bold text-indigo-100 leading-snug mb-2 pr-16">{task.title}</h3>
                      <p className="text-indigo-200/50 text-sm line-clamp-2 leading-relaxed">{task.description}</p>
                    </div>

                    <div className="relative mt-5 pt-4 border-t border-indigo-500/20 flex justify-between items-center">
                      <span className="text-indigo-400 text-sm font-medium">In Progress</span>
                      <button
                        onClick={() => handleCompleteTask(task)}
                        className="bg-green-500 hover:bg-green-400 text-white px-5 py-2 rounded-xl
                                   text-sm font-semibold shadow-[0_0_20px_rgba(34,197,94,0.3)]
                                   hover:shadow-[0_0_28px_rgba(34,197,94,0.5)]
                                   transition-all duration-300 hover:scale-105"
                      >
                        ✓ Mark Done
                      </button>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}