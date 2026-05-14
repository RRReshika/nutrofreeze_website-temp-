import { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { Check } from "lucide-react";

function Sparkle({ size = 24, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0 L13.5 10.5 L24 12 L13.5 13.5 L12 24 L10.5 13.5 L0 12 L10.5 10.5 Z" />
    </svg>
  );
}

export function Newsletter() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3500);
      setEmail("");
    }
  };

  return (
    <section className="relative bg-[#0d9488] py-24 overflow-hidden" ref={ref}>
      {/* Decorative circles */}
      <div className="absolute top-0 left-[5%] w-72 h-72 rounded-full bg-black/6 -translate-y-1/2" />
      <div className="absolute bottom-0 right-[5%] w-56 h-56 rounded-full bg-black/6 translate-y-1/3" />

      {/* Sparkles */}
      {[
        { top: "15%", left: "12%" },
        { top: "70%", left: "6%" },
        { top: "20%", right: "14%" },
        { top: "65%", right: "8%" },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: pos.top, left: (pos as any).left, right: (pos as any).right }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 18, 0] }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity }}
        >
          <Sparkle size={22} color="rgba(0,0,0,0.15)" />
        </motion.div>
      ))}

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="mb-4"
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(52px, 9vw, 110px)",
              color: "white",
              textTransform: "uppercase",
              lineHeight: 0.9,
              letterSpacing: "0.03em",
            }}
          >
            STAY IN THE<br />
            <span style={{ color: "#c4b5fd" }}>LOOP</span>
          </h2>

          <p
            className="mt-5 mb-10"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "17px", color: "rgba(255,255,255,0.85)", lineHeight: 1.7 }}
          >
            Get exclusive recipes, new product announcements and special deals delivered straight to your inbox.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 bg-white text-[#0f172a] placeholder-gray-400 rounded-full px-6 py-4 outline-none focus:ring-4 focus:ring-[#c4b5fd]/50 shadow-lg transition-all"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", fontWeight: 500 }}
              required
            />
            <motion.button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#0f172a] text-white px-8 py-4 rounded-full hover:bg-[#7c3aed] transition-all shadow-lg"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 700, whiteSpace: "nowrap", letterSpacing: "0.5px" }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              {submitted ? (
                <><Check size={18} /> Subscribed!</>
              ) : (
                "Subscribe →"
              )}
            </motion.button>
          </form>

          <p
            className="mt-4"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.5)" }}
          >
            No spam, ever. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}