import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Heart, Leaf, Snowflake, Shield } from "lucide-react";

// Animated word reveal â€” each word slides up one by one
function RevealWord({ word, delay = 0, color = "#1c1c1e" }: { word: string; delay?: number; color?: string }) {
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
  { Icon: Heart, title: "Mom's Promise", desc: "Born from a mother's mission to nourish her child with pure, wholesome food." },
  { Icon: Leaf, title: "No Preservatives", desc: "100% natural. No additives, no preservatives, no hidden fillers." },
  { Icon: Snowflake, title: "Freeze Dried", desc: "Gently freeze-dried to preserve up to 97% of vitamins and nutrients." },
  { Icon: Shield, title: "Tummy-Friendly", desc: "Pure, safe, and gentle nutrition for babies, toddlers, and the whole family." },
];

export function Heritage() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const valInView = useInView(valuesRef, { once: true, margin: "-60px" });

  return (
    <section ref={sectionRef} id="about" style={{ backgroundColor: "#f5f0e8", overflow: "hidden" }}>

      {/* â”€â”€ BIG OVERLAPPING HEADING SECTION â€” Brrar's style â”€â”€ */}
      <div className="relative" style={{ paddingTop: "60px" }}>

        {/* TOP TEXT â€” big black */}
        <div className="px-4 lg:px-12" style={{ lineHeight: 0.88 }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(64px, 12vw, 160px)",
              textTransform: "uppercase",
              letterSpacing: "-2px",
              lineHeight: 0.88,
              color: "#1c1c1e",
            }}
          >
            <div>
              {["BORN", "FROM"].map((w, i) => (
                <RevealWord key={w} word={w} delay={i * 0.1} />
              ))}
            </div>
            <div>
              {["A MOM'S"].map((w, i) => (
                <RevealWord key={w} word={w} delay={0.18 + i * 0.1} />
              ))}
            </div>
            <div>
              {["DREAM,"].map((w, i) => (
                <RevealWord key={w} word={w} delay={0.28 + i * 0.1} />
              ))}
            </div>
          </div>
        </div>

        {/* PRODUCT IMAGES ROW â€” sits between the two text blocks */}
        <div className="relative" style={{ margin: "0 -4px", zIndex: 10 }}>
          <div className="flex items-end justify-center px-4 relative" style={{ minHeight: "clamp(240px, 32vw, 480px)" }}>

            {/* Circular spin badge â€” top right of image area */}
            <motion.div
              className="absolute hidden lg:block"
              style={{ top: "10%", right: "8%", zIndex: 20 }}
              animate={{ rotate: [0, 5, -3, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <svg viewBox="0 0 160 160" width={160} height={160}>
                <circle cx="80" cy="80" r="76" fill="#1c1c1e" />
                <defs>
                  <path id="badge-arc" d="M 116,80 a 36,36 0 1,0 -72,0" />
                </defs>
                <motion.g
                  animate={{ rotate: 360 }}
                  transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  style={{ transformOrigin: "80px 80px" }}
                >
                  <text fill="white" style={{ fontSize: "11px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "2.5px" } as React.CSSProperties}>
                    <textPath href="#badge-arc" startOffset="0%">SINGAPORE Â· SINCE 2024 Â· &nbsp;</textPath>
                  </text>
                </motion.g>
                <circle cx="80" cy="80" r="22" fill="rgba(255,255,255,0.15)" />
                <text x="80" y="76" textAnchor="middle" fill="white" style={{ fontSize: "10px", fontFamily: "'Bangers', cursive", letterSpacing: "1px" } as React.CSSProperties}>FREEZE</text>
                <text x="80" y="89" textAnchor="middle" fill="#5eead4" style={{ fontSize: "10px", fontFamily: "'Bangers', cursive", letterSpacing: "1px" } as React.CSSProperties}>DRIED</text>
              </svg>
            </motion.div>

            {/* Sticker badge â€” bottom left */}
            <motion.div
              className="absolute hidden lg:block"
              style={{ bottom: "6%", left: "6%", zIndex: 20 }}
              animate={{ rotate: [-8, -2, -8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              {(() => {
                const pts: string[] = [];
                for (let i = 0; i < 16; i++) {
                  const angle = (i * Math.PI * 2) / 16 - Math.PI / 2;
                  const r = i % 2 === 0 ? 48 : 34;
                  pts.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
                }
                return (
                  <svg viewBox="0 0 100 100" width={110} height={110}>
                    <polygon points={pts.join(" ")} fill="#0d9488" />
                    <defs>
                      <path id="st-pure" d="M 82,50 a 32,32 0 1,0 -64,0" />
                    </defs>
                    <motion.text fill="white" style={{ fontSize: "9px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "1.5px", transformOrigin: "50px 50px" } as React.CSSProperties}
                      animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }}>
                      <textPath href="#st-pure" startOffset="0%">PURE NUTRITION Â· NF Â·&nbsp;</textPath>
                    </motion.text>
                    <circle cx="50" cy="50" r="16" fill="rgba(255,255,255,0.22)" />
                    <text x="50" y="54" textAnchor="middle" fill="white" style={{ fontSize: "8px", fontFamily: "'Bangers', cursive" } as React.CSSProperties}>NF</text>
                  </svg>
                );
              })()}
            </motion.div>

            {/* Left product */}
            <motion.div
              className="flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl"
              style={{ width: "clamp(130px, 16vw, 240px)", height: "clamp(180px, 24vw, 360px)" }}
              initial={{ opacity: 0, x: -60, rotate: -4 }}
              whileInView={{ opacity: 1, x: 0, rotate: -3 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ scale: 1.05, rotate: 0 }}
            >
              <img src="/images/other%20images/mixed%20berry%20bowl.png" alt="Mixed Berry Bowl" className="w-full h-full object-cover" />
            </motion.div>

            {/* Center product â€” tallest */}
            <motion.div
              className="relative flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl z-20 mx-3"
              style={{ width: "clamp(200px, 26vw, 400px)", height: "clamp(260px, 38vw, 560px)" }}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ scale: 1.03 }}
            >
              <img src="/images/other%20images/healthy%20bowl.png" alt="Healthy Bowl" className="w-full h-full object-cover" />
            </motion.div>

            {/* Right product */}
            <motion.div
              className="flex-shrink-0 rounded-3xl overflow-hidden shadow-2xl"
              style={{ width: "clamp(130px, 16vw, 240px)", height: "clamp(180px, 24vw, 360px)" }}
              initial={{ opacity: 0, x: 60, rotate: 4 }}
              whileInView={{ opacity: 1, x: 0, rotate: 3 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ scale: 1.05, rotate: 0 }}
            >
              <img src="/images/other%20images/brocoli%20florets.png" alt="Broccoli Florets" className="w-full h-full object-cover" />
            </motion.div>

            {/* Right description text */}
            <motion.div
              className="hidden lg:flex flex-col gap-4 flex-1 max-w-[280px] pb-6 pl-8"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", color: "#444", lineHeight: 1.75, fontWeight: 500 }}>
                NutroFreeze was founded by a mother seeking pure, convenient nutrition for her child. Every product is crafted with no additives, no preservatives. Real food, made with the same care you would give your own little one.
              </p>
              <motion.a
                href="/about"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "10px",
                  backgroundColor: "#1c1c1e", color: "white",
                  padding: "14px 28px", borderRadius: "100px",
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px",
                  textDecoration: "none", alignSelf: "flex-start",
                }}
                whileHover={{ scale: 1.05, backgroundColor: "#0d9488" }}
                whileTap={{ scale: 0.97 }}
              >
                Learn More
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none"><path d="M1.4375 7H14.5625" stroke="white" strokeWidth="2" strokeLinecap="round" /><path d="M9.3125 1.75L14.5625 7L9.3125 12.25" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
              </motion.a>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM TEXT â€” big teal/dark */}
        <div className="px-4 lg:px-12 pb-0" style={{ lineHeight: 0.88 }}>
          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(64px, 12vw, 160px)",
              textTransform: "uppercase",
              letterSpacing: "-2px",
              lineHeight: 0.88,
              color: "#1c1c1e",
            }}
          >
            <div>
              {["GROWING"].map((w, i) => (
                <RevealWord key={w} word={w} delay={0.5 + i * 0.1} color="#0d9488" />
              ))}
            </div>
            <div>
              {["WITH", "COMMUNITY"].map((w, i) => (
                <RevealWord key={w} word={w} delay={0.6 + i * 0.1} color="#0d9488" />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile learn more */}
      <div className="lg:hidden px-6 pt-6 pb-2">
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#555", lineHeight: 1.75 }}>
          NutroFreeze was founded by a mother seeking pure, convenient nutrition for her child. Real food, no additives, no compromise.
        </p>
        <a
          href="/about"
          style={{
            display: "inline-flex", alignItems: "center", gap: "8px", marginTop: "20px",
            backgroundColor: "#1c1c1e", color: "white", padding: "13px 26px",
            borderRadius: "100px", fontFamily: "'Space Grotesk', sans-serif",
            fontWeight: 700, fontSize: "14px", textDecoration: "none",
          }}
        >
          Learn More â†’
        </a>
      </div>

      {/* Values strip */}
      <div ref={valuesRef} className="py-16 px-6" style={{ borderTop: "2px solid rgba(0,0,0,0.08)", marginTop: "60px", backgroundColor: "#1c1c1e" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className="text-center px-6 py-10"
                style={{ borderRight: i < 3 ? "1px solid rgba(255,255,255,0.08)" : "none" }}
                initial={{ opacity: 0, y: 40 }}
                animate={valInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.08 + i * 0.1, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                whileHover={{ backgroundColor: "rgba(13,148,136,0.08)" }}
              >
                <motion.div
                  className="mb-4 flex items-center justify-center"
                  animate={{ y: [0, -7, 0] }}
                  transition={{ duration: 2.6 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
                >
                  <v.Icon size={30} color="#5eead4" />
                </motion.div>
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "16px", fontWeight: 800, fontStyle: "italic", color: "#5eead4", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", lineHeight: 1.2 }}>
                  {v.title}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
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

// Animated word reveal â€” each word slides up one by one
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
  { Icon: Heart, title: "Mom's Promise", desc: "Born from a mother's mission to nourish her child with pure, wholesome food." },
  { Icon: Leaf, title: "No Preservatives", desc: "100% natural. No additives, no preservatives, no hidden fillers." },
  { Icon: Snowflake, title: "Freeze Dried", desc: "Gently freeze-dried to preserve up to 97% of vitamins and nutrients." },
  { Icon: Shield, title: "Tummy-Friendly", desc: "Pure, safe, and gentle nutrition for babies, toddlers, and the whole family." },
];
