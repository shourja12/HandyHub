import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

export default function CreateTask() {
  const navigate     = useNavigate();
  const [title,       setTitle]       = useState("");
  const [description, setDescription] = useState("");
  const [points,      setPoints]      = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState("");

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Title and description are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/tasks", {
        title,
        description,
        points: parseInt(points) || 50,
        user_id: "123", // temporary — replace with auth token later
      });
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || "Could not create task. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white flex items-center justify-center overflow-hidden px-4">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-lg">
        <div className="glass-strong rounded-3xl p-8 md:p-10 border border-white/10
                        shadow-[0_30px_80px_rgba(0,0,0,0.55)]">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/")}
              className="p-2 rounded-xl glass border border-white/10 hover:border-indigo-500/40
                         text-gray-400 hover:text-indigo-400 transition-all duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Post a Task</h1>
              <p className="text-gray-500 text-sm">Set a challenge for your community</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400">Task Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Help me with React hooks"
                className="w-full px-4 py-3.5 rounded-2xl glass border border-white/10 text-white
                           placeholder-gray-600 focus:outline-none focus:border-indigo-500/60
                           focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm"
                maxLength={80}
              />
              <p className="text-right text-gray-600 text-xs">{title.length}/80</p>
            </div>

            {/* Description */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you need help with..."
                rows={4}
                className="w-full px-4 py-3.5 rounded-2xl glass border border-white/10 text-white
                           placeholder-gray-600 focus:outline-none focus:border-indigo-500/60
                           focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300
                           text-sm resize-none"
                maxLength={400}
              />
              <p className="text-right text-gray-600 text-xs">{description.length}/400</p>
            </div>

            {/* Points */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400">Points Reward</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 font-bold">🟢</span>
                <input
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  placeholder="50"
                  min="10"
                  max="500"
                  className="w-full pl-10 pr-4 py-3.5 rounded-2xl glass border border-white/10 text-white
                             placeholder-gray-600 focus:outline-none focus:border-indigo-500/60
                             focus:ring-2 focus:ring-indigo-500/20 transition-all duration-300 text-sm"
                />
              </div>
              <p className="text-gray-600 text-xs">Default: 50 pts. Max: 500 pts.</p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                         bg-gradient-to-r from-indigo-500 to-violet-500
                         hover:from-indigo-400 hover:to-violet-400
                         shadow-[0_0_24px_rgba(99,102,241,0.35)]
                         hover:shadow-[0_0_36px_rgba(99,102,241,0.55)]
                         transition-all duration-300 hover:scale-[1.02]
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Posting...
                </span>
              ) : "🚀 Post Task"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}