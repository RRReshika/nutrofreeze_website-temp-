import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Lock, Mail } from "lucide-react";
import { useAuth } from "../lib/auth-context";

function Sparkle({ top, left, right, bottom, size, delay }: {
  top?: string; left?: string; right?: string; bottom?: string; size: number; delay: number;
}) {
  return (
    <motion.div
      style={{ position: "absolute", top, left, right, bottom, width: size, height: size, zIndex: 3, pointerEvents: "none" }}
      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
      transition={{ rotate: { duration: 18, repeat: Infinity, ease: "linear" }, scale: { duration: 4, repeat: Infinity, delay, ease: "easeInOut" } }}
    >
      <svg viewBox="0 0 47 47" fill="white" opacity={0.6}>
        <path d="M23.2496 0.345703C17.2963 12.4504 12.4733 17.2676 0.350836 23.217C12.4795 29.1664 17.3075 33.9836 23.2736 46.1089C29.2269 33.9836 34.0292 29.1664 46.1723 23.217C34.023 17.2676 29.2156 12.4504 23.2496 0.345703Z" />
      </svg>
    </motion.div>
  );
}

function SpinBadge() {
  return (
    <motion.div
      style={{ width: 130, height: 130, flexShrink: 0 }}
      initial={{ scale: 0, rotate: -20 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.5 }}
    >
      <svg viewBox="0 0 130 130" width={130} height={130}>
        <circle cx="65" cy="65" r="62" fill="#00B2A9" />
        <defs>
          <path id="login-spin-path" d="M 112,65 a 47,47 0 1,0 -94,0" />
        </defs>
        <motion.g animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} style={{ transformOrigin: "65px 65px" }}>
          <text fill="white" style={{ fontSize: "11px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "2.5px" } as React.CSSProperties}>
            <textPath href="#login-spin-path" startOffset="0%">FREEZE DRIED · PURE NUTRITION · NO ADDITIVES ·&nbsp;</textPath>
          </text>
        </motion.g>
        <circle cx="65" cy="65" r="18" fill="rgba(255,255,255,0.15)" />
        {[0, 45, 90, 135].map(a => (
          <line key={a} x1="65" y1="50" x2="65" y2="80" stroke="white" strokeWidth="2.2" strokeLinecap="round" transform={`rotate(${a} 65 65)`} />
        ))}
        <circle cx="65" cy="65" r="5" fill="white" />
      </svg>
    </motion.div>
  );
}

export function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      await signIn(email, password);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Unable to log in");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ fontFamily: "'DM Sans', sans-serif" }}>

      {/* ── Left branding panel ── */}
      <div className="relative flex flex-col justify-between overflow-hidden lg:w-[55%] min-h-[40vh] lg:min-h-screen"
        style={{ backgroundColor: "#231F20" }}>

        {/* Sparkles */}
        <Sparkle top="8%" left="6%" size={36} delay={0} />
        <Sparkle top="18%" right="10%" size={22} delay={0.8} />
        <Sparkle top="50%" left="3%" size={28} delay={1.4} />
        <Sparkle bottom="20%" left="18%" size={18} delay={0.4} />
        <Sparkle bottom="8%" right="5%" size={32} delay={1.1} />
        <Sparkle top="35%" right="6%" size={16} delay={0.6} />

        {/* Teal accent blobs */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 70% 20%, rgba(0,178,169,0.25) 0%, transparent 50%), radial-gradient(circle at 10% 80%, rgba(157,124,206,0.18) 0%, transparent 45%)", pointerEvents: "none" }} />

        {/* Nav back link */}
        <div className="relative z-10 p-8 lg:p-12">
          <Link to="/" style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none", fontSize: "13px", fontWeight: 600, letterSpacing: "0.05em", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            Back home
          </Link>
        </div>

        {/* Main headline content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center px-8 lg:px-14 pb-8 lg:pb-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{ color: "#00B2A9", fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", marginBottom: "20px" }}
          >
            NutroFreeze Singapore
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(72px, 10vw, 130px)", lineHeight: 0.88, color: "white", margin: "0 0 28px 0", letterSpacing: "2px" }}
          >
            WELCOME<br />
            <span style={{ color: "#00B2A9" }}>BACK</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ color: "rgba(255,255,255,0.65)", fontSize: "16px", lineHeight: 1.6, maxWidth: "380px", marginBottom: "40px" }}
          >
            Sign in to access your cart, wishlist and order history. Pure nutrition, delivered to your door.
          </motion.p>

          {/* Feature chips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-3"
          >
            {["97% Nutrients Preserved", "No Additives", "Just Add Water"].map(label => (
              <span key={label} style={{ border: "1px solid rgba(0,178,169,0.5)", borderRadius: "100px", padding: "6px 16px", fontSize: "12px", fontWeight: 600, color: "#00B2A9", letterSpacing: "0.05em" }}>{label}</span>
            ))}
          </motion.div>
        </div>

        {/* Spin badge bottom-right */}
        <div className="relative z-10 flex justify-end p-8 lg:p-12">
          <SpinBadge />
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-col justify-center lg:w-[45%] bg-[#faf6f0] px-8 sm:px-12 lg:px-16 py-14 lg:py-0">
        <div style={{ maxWidth: "400px", width: "100%", margin: "0 auto" }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 style={{ fontFamily: "'Bangers', cursive", fontSize: "42px", color: "#231F20", margin: "0 0 6px 0", letterSpacing: "1px" }}>SIGN IN</h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "32px", fontWeight: 500 }}>Enter your credentials to continue</p>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block">
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#231F20", letterSpacing: "0.05em", marginBottom: "8px" }}>
                  <Mail size={14} />
                  EMAIL ADDRESS
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  style={{ width: "100%", borderRadius: "14px", border: "1.5px solid #e5e7eb", background: "white", padding: "12px 16px", fontSize: "15px", color: "#111827", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  placeholder="you@example.com"
                  required
                  onFocus={e => (e.target.style.borderColor = "#00B2A9")}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                />
              </label>

              <label className="block">
                <span style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", fontWeight: 700, color: "#231F20", letterSpacing: "0.05em", marginBottom: "8px" }}>
                  <Lock size={14} />
                  PASSWORD
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  style={{ width: "100%", borderRadius: "14px", border: "1.5px solid #e5e7eb", background: "white", padding: "12px 16px", fontSize: "15px", color: "#111827", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                  placeholder="Your password"
                  required
                  onFocus={e => (e.target.style.borderColor = "#00B2A9")}
                  onBlur={e => (e.target.style.borderColor = "#e5e7eb")}
                />
              </label>

              {error && (
                <div style={{ borderRadius: "12px", border: "1px solid #fecaca", background: "#fff5f5", padding: "12px 16px", fontSize: "13px", color: "#dc2626" }}>
                  {error}
                </div>
              )}

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                style={{ width: "100%", borderRadius: "100px", background: "#231F20", color: "white", border: "none", padding: "14px", fontFamily: "'Bangers', cursive", fontSize: "22px", letterSpacing: "2px", cursor: isSubmitting ? "not-allowed" : "pointer", opacity: isSubmitting ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                {isSubmitting ? "SIGNING IN..." : "SIGN IN"}
                {!isSubmitting && <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>}
              </motion.button>
            </form>

            <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "8px" }}>
              <p style={{ fontSize: "13px", color: "#6b7280" }}>
                Need an account?{" "}
                <Link to="/signup" style={{ fontWeight: 700, color: "#00B2A9", textDecoration: "none" }}>Create one here</Link>
              </p>
              <p style={{ fontSize: "13px", color: "#9ca3af" }}>
                Admin user?{" "}
                <Link to="/admin/login" style={{ fontWeight: 700, color: "#231F20", textDecoration: "none" }}>Admin dashboard</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
