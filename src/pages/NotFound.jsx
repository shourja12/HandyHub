import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white flex items-center justify-center overflow-hidden px-4">
      <AnimatedBackground />

      <div className="relative z-10 text-center max-w-md">
        {/* Glowing 404 */}
        <div className="text-8xl md:text-9xl font-extrabold mb-4 select-none"
          style={{
            background: "linear-gradient(135deg, #818cf8, #c084fc, #67e8f9)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            filter: "drop-shadow(0 0 40px rgba(99,102,241,0.4))",
          }}
        >
          404
        </div>

        <div className="glass-strong rounded-3xl p-8 border border-white/10
                        shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
          <p className="text-4xl mb-4">🔭</p>
          <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">
            This page doesn't exist. You might have followed a broken link or typed the wrong URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-2.5 rounded-2xl font-semibold text-white text-sm
                         bg-gradient-to-r from-indigo-500 to-violet-500
                         hover:from-indigo-400 hover:to-violet-400
                         shadow-[0_0_20px_rgba(99,102,241,0.35)]
                         hover:shadow-[0_0_30px_rgba(99,102,241,0.5)]
                         transition-all duration-300 hover:scale-105"
            >
              🏠 Go Home
            </button>
            <button
              onClick={() => window.history.back()}
              className="px-6 py-2.5 rounded-2xl font-semibold text-sm text-gray-300
                         glass border border-white/10 hover:border-indigo-500/30
                         hover:text-white transition-all duration-300 hover:scale-105"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
