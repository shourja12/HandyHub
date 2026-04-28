import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AnimatedBackground from "../components/AnimatedBackground";

export default function Login() {
  const navigate   = useNavigate();
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/auth/login", { email, password });
      console.log(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0F172A] text-white flex items-center justify-center overflow-hidden px-4">
      <AnimatedBackground />

      <div className="relative z-10 w-full max-w-md">

        {/* Card */}
        <div className="glass-strong rounded-3xl p-8 md:p-10 border border-white/10
                        shadow-[0_30px_80px_rgba(0,0,0,0.6)]">

          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold shimmer-text mb-1">HandyHub</h1>
            <p className="text-gray-500 text-sm">Welcome back! Sign in to your account.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl px-4 py-3 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3.5 rounded-2xl glass border border-white/10
                           text-white placeholder-gray-600 focus:outline-none
                           focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20
                           transition-all duration-300 text-sm"
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-2xl glass border border-white/10
                           text-white placeholder-gray-600 focus:outline-none
                           focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20
                           transition-all duration-300 text-sm"
                autoComplete="current-password"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-semibold text-white text-sm
                         bg-gradient-to-r from-indigo-500 to-violet-500
                         hover:from-indigo-400 hover:to-violet-400
                         shadow-[0_0_24px_rgba(99,102,241,0.35)]
                         hover:shadow-[0_0_32px_rgba(99,102,241,0.55)]
                         transition-all duration-300 hover:scale-[1.02]
                         disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Signing in...
                </span>
              ) : "Sign In"}
            </button>

          </form>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-6">
            Don't have an account?{" "}
            <button onClick={() => navigate("/register")}
              className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
              Register
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}