import { useRef } from "react";
import { motion, useInView } from "motion/react";

// Animated word reveal — each word slides up one by one
function RevealWord({ word, delay = 0, color = "white" }: { word: string; delay?: number; color?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <span ref={ref} style={{ display: "inline-block", overflow: "hidden", marginRight: "0.18em" }}>
      <motion.span
        style={{ display: "inline-block", color }}
        initial={{ y: "105%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : {}}
        transition={{ duration: 0.62, delay, ease: [0.23, 1, 0.32, 1] }}
      >
        {word}
      </motion.span>
    </span>
  );
}

const values = [
  { icon: "🍁", title: "Made in Canada", desc: "Proudly made in Canada by a family who cares." },
  { icon: "🌿", title: "No Preservatives", desc: "Clean ingredients, no artificial additives." },
  { icon: "❄️", title: "Flash Frozen", desc: "Frozen at peak freshness to lock in flavour." },
  { icon: "🏠", title: "Family Recipe", desc: "Recipes passed down through generations." },
];

export function Heritage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const valInView = useInView(valuesRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} id="about" style={{ backgroundColor: "#0f172a", overflow: "hidden" }}>

      {/* ────────────────────────────────────────────────────────
          BIG OVERLAPPING HEADING SECTION — Brars style
      ──────────────────────────────────────────────────────── */}
      <div className="relative" style={{ paddingTop: "72px" }}>

        {/* "OUR STORY" pill */}
        <div className="px-6 lg:px-16 mb-4">
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: "#0d9488", fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "2.5px", color: "white", textTransform: "uppercase" }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Our Story
          </motion.div>
        </div>

        {/* ROOTED IN TRADITION */}
        <div className="px-4 lg:px-12" style={{ lineHeight: 0.88 }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(72px, 14vw, 180px)",
              textTransform: "uppercase",
              letterSpacing: "-3px",
              lineHeight: 0.88,
            }}
          >
            <div>
              {["ROOTED", "IN"].map((w, i) => (
                <RevealWord key={w} word={w} delay={i * 0.12} color="white" />
              ))}
            </div>
            <div>
              {["TRADITION,"].map((w, i) => (
                <RevealWord key={w} word={w} delay={0.2 + i * 0.12} color="white" />
              ))}
            </div>
          </div>

          {/* Product images row overlapping text */}
          <div className="relative" style={{ margin: "0 -16px", zIndex: 10 }}>
            <div className="flex items-end justify-center gap-4 px-4" style={{ minHeight: "clamp(180px, 22vw, 300px)" }}>
              {/* Left product */}
              <motion.div
                className="flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl"
                style={{ width: "clamp(120px, 14vw, 200px)", height: "clamp(150px, 18vw, 240px)" }}
                initial={{ opacity: 0, x: -60, rotate: -4 }}
                whileInView={{ opacity: 1, x: 0, rotate: -3 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ scale: 1.05, rotate: 0 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=400&q=80"
                  alt="Mixed Berry"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Center product — tallest */}
              <motion.div
                className="relative flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl z-20"
                style={{ width: "clamp(180px, 20vw, 280px)", height: "clamp(220px, 26vw, 360px)" }}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.18, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ scale: 1.04 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1679279726937-122c49626802?w=500&q=80"
                  alt="Gym Food"
                  className="w-full h-full object-cover"
                />
                {/* Circular badge on center product */}
                <motion.div
                  className="absolute top-3 right-3 w-20 h-20 rounded-full flex flex-col items-center justify-center text-center"
                  style={{ border: "2px solid rgba(255,255,255,0.4)", backgroundColor: "rgba(13,148,136,0.85)", backdropFilter: "blur(6px)" }}
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                >
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "7px", fontWeight: 800, color: "white", letterSpacing: "0.8px", textTransform: "uppercase", lineHeight: 1.4, textAlign: "center" }}>
                    FREEZE<br />DRIED<br />PURE
                  </span>
                </motion.div>
              </motion.div>

              {/* Right product */}
              <motion.div
                className="flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl"
                style={{ width: "clamp(120px, 14vw, 200px)", height: "clamp(150px, 18vw, 240px)" }}
                initial={{ opacity: 0, x: 60, rotate: 4 }}
                whileInView={{ opacity: 1, x: 0, rotate: 3 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ scale: 1.05, rotate: 0 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1662611284583-f34180194370?w=400&q=80"
                  alt="Broccoli"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              {/* Right description text (like Brars) */}
              <motion.div
                className="hidden lg:flex flex-col gap-4 flex-1 max-w-xs pb-4"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.72)", lineHeight: 1.75 }}>
                  We're on a mission to share our love of wholesome frozen food with every Canadian family. That's why you'll never see anything on our shelves we wouldn't serve at our own table.
                </p>
                <motion.a
                  href="/about"
                  className="inline-flex items-center gap-2 bg-white text-[#0f172a] px-6 py-3 rounded-full self-start hover:bg-[#5eead4] transition-all"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Learn More →
                </motion.a>
              </motion.div>
            </div>
          </div>

          {/* GROWING WITH COMMUNITY */}
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(72px, 14vw, 180px)",
              textTransform: "uppercase",
              letterSpacing: "-3px",
              lineHeight: 0.88,
            }}
          >
            <div>
              {["GROWING", "WITH"].map((w, i) => (
                <RevealWord key={w} word={w} delay={0.5 + i * 0.1} color="#5eead4" />
              ))}
            </div>
            <div>
              {["COMMUNITY"].map((w, i) => (
                <RevealWord key={w} word={w} delay={0.7 + i * 0.1} color="#5eead4" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Mobile "Learn More" ─── */}
      <div className="lg:hidden px-6 pt-6 pb-2">
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.65)", lineHeight: 1.75 }}>
          We're on a mission to share wholesome frozen food with every Canadian family. Real ingredients, authentic flavour.
        </p>
        <a
          href="/about"
          className="inline-flex items-center gap-2 mt-5 bg-white text-[#0f172a] px-7 py-3.5 rounded-full hover:bg-[#5eead4] transition-all"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700 }}
        >
          Learn More →
        </a>
      </div>

      {/* ─── Values strip ─── */}
      <div ref={valuesRef} className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "60px" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="text-center px-6 py-10"
                style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                initial={{ opacity: 0, y: 40 }}
                animate={valInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 + i * 0.1, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ backgroundColor: "rgba(13,148,136,0.06)" }}
              >
                <motion.div
                  className="text-4xl mb-4"
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 2.6 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                >
                  {v.icon}
                </motion.div>
                <div
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "16px",
                    fontWeight: 800,
                    fontStyle: "italic",
                    color: "#5eead4",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "8px",
                    lineHeight: 1.2,
                  }}
                >
                  {v.title}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.48)", lineHeight: 1.7 }}>
                  {v.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}