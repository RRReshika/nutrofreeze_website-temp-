import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "motion/react";
import { Leaf, Zap, ShieldCheck, Heart } from "lucide-react";
import { Navbar } from "../components/Navbar";

/* ─── Sparkle SVG ────────────────────────────────── */
function Sparkle({ top, left, right, bottom, size, delay, color = "white" }: {
  top?: string; left?: string; right?: string; bottom?: string;
  size: number; delay: number; color?: string;
}) {
  return (
    <motion.div
      style={{ position: "absolute", top, left, right, bottom, width: size, height: size, zIndex: 5, pointerEvents: "none" }}
      animate={{ rotate: 360, scale: [1, 1.25, 1] }}
      transition={{ rotate: { duration: 18, repeat: Infinity, ease: "linear" }, scale: { duration: 3.5, repeat: Infinity, delay, ease: "easeInOut" } }}
    >
      <svg viewBox="0 0 47 47" fill={color} xmlns="http://www.w3.org/2000/svg">
        <path d="M23.2496 0.345703C17.2963 12.4504 12.4733 17.2676 0.350836 23.217C12.4795 29.1664 17.3075 33.9836 23.2736 46.1089C29.2269 33.9836 34.0292 29.1664 46.1723 23.217C34.023 17.2676 29.2156 12.4504 23.2496 0.345703Z" />
      </svg>
    </motion.div>
  );
}

/* ─── Rotating circular spin badge ──────────────── */
function SpinBadge({ text, color, size = 160, textColor = "white" }: {
  text: string; color: string; size?: number; textColor?: string;
}) {
  const r = size * 0.36;
  const cx = size / 2;
  const pathId = `badge-path-${text.replace(/[\s·]/g, "")}`;
  return (
    <motion.div
      style={{ width: size, height: size, position: "relative", flexShrink: 0 }}
      animate={{ rotate: [0, 5, -5, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
        <circle cx={cx} cy={cx} r={cx - 4} fill={color} />
        <defs>
          <path id={pathId} d={`M ${cx + r},${cx} a ${r},${r} 0 1,0 ${-r * 2},0`} />
        </defs>
        <motion.g
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${cx}px ${cx}px` }}
        >
          <text fill={textColor} style={{ fontSize: size * 0.095, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: size * 0.02 } as React.CSSProperties}>
            <textPath href={`#${pathId}`} startOffset="0%">{text}&nbsp;·&nbsp;{text}&nbsp;·&nbsp;</textPath>
          </text>
        </motion.g>
        <g transform={`translate(${cx},${cx})`}>
          <circle r={size * 0.14} fill="rgba(255,255,255,0.18)" />
          {[0, 45, 90, 135].map(a => (
            <line key={a} x1="0" y1={`-${size * 0.11}`} x2="0" y2={`${size * 0.11}`}
              stroke={textColor} strokeWidth={size * 0.02} strokeLinecap="round"
              transform={`rotate(${a})`} />
          ))}
          <circle r={size * 0.04} fill={textColor} />
        </g>
      </svg>
    </motion.div>
  );
}

/* ─── Sticker wobble badge ───────────────────────── */
function StickerBadge({ label, color, wobble = 0 }: { label: string; color: string; wobble?: number }) {
  const pts: string[] = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i * Math.PI * 2) / 16 - Math.PI / 2;
    const r = i % 2 === 0 ? 48 : 34;
    pts.push(`${50 + r * Math.cos(angle)},${50 + r * Math.sin(angle)}`);
  }
  return (
    <motion.div
      style={{ width: 120, height: 120, position: "relative", flexShrink: 0 }}
      animate={{ rotate: [wobble, wobble + 6, wobble - 3, wobble] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 100 100" width={120} height={120}>
        <polygon points={pts.join(" ")} fill={color} />
        <defs>
          <path id={`st-${label.replace(/\s/g, "")}`} d="M 85,50 a 35,35 0 1,0 -70,0" />
        </defs>
        <motion.text
          fill="white"
          style={{ fontSize: "9.5px", fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, letterSpacing: "1.5px", transformOrigin: "50px 50px" } as React.CSSProperties}
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          <textPath href={`#st-${label.replace(/\s/g, "")}`} startOffset="0%">{label} · {label} ·&nbsp;</textPath>
        </motion.text>
        <circle cx="50" cy="50" r="16" fill="rgba(255,255,255,0.25)" />
        <text x="50" y="54" textAnchor="middle" fill="white" style={{ fontSize: "8px", fontFamily: "'Bangers',cursive", letterSpacing: "0.5px" } as React.CSSProperties}>NF</text>
      </svg>
    </motion.div>
  );
}

/* ─── Word reveal animation ──────────────────────── */
function RevealWords({ text, style }: { text: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const words = text.split(" ");
  return (
    <div ref={ref} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          style={{ display: "inline-block", marginRight: "0.28em" }}
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: i * 0.06, ease: [0.23, 1, 0.32, 1] }}
        >
          {w}
        </motion.span>
      ))}
    </div>
  );
}

/* ─── Marquee ticker ─────────────────────────────── */
function MarqueeTicker() {
  const items = ["FREEZE DRIED", "97% NUTRIENTS PRESERVED", "NO ADDITIVES", "PURE NUTRITION", "JUST ADD WATER", "NO PRESERVATIVES", "TUMMY FRIENDLY", "REAL INGREDIENTS"];
  const doubled = [...items, ...items];
  return (
    <div style={{ backgroundColor: "#231F20", overflow: "hidden", padding: "14px 0", borderTop: "2px solid #00B2A9", borderBottom: "2px solid #00B2A9" }}>
      <motion.div
        style={{ display: "flex", whiteSpace: "nowrap" }}
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: "18px", padding: "0 28px" }}>
            <svg width="10" height="10" viewBox="0 0 10 10" fill="#00B2A9"><circle cx="5" cy="5" r="5" /></svg>
            <span style={{ fontFamily: "'Bangers', cursive", fontSize: "20px", letterSpacing: "2px", color: "white" }}>{item}</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── HERO SECTION ────────────────────────────────── */
function HeroSection() {
  return (
    <div style={{ position: "relative", backgroundColor: "#00B2A9", minHeight: "100vh", paddingTop: "120px", paddingBottom: "80px", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", zIndex: 1, opacity: 0.07, pointerEvents: "none" }}>
        <svg width="900" height="900" viewBox="0 0 900 900" fill="none">
          <path d="M450 0 C450 0 520 250 700 300 C880 350 900 450 900 450 C900 450 730 510 700 690 C670 870 450 900 450 900 C450 900 380 730 200 680 C20 630 0 450 0 450 C0 450 170 390 200 210 C230 30 450 0 450 0Z" fill="white" />
        </svg>
      </div>
      <Sparkle top="20%" left="8%" size={52} delay={0} />
      <Sparkle top="65%" left="5%" size={36} delay={1.2} />
      <Sparkle top="30%" right="6%" size={60} delay={0.4} />
      <Sparkle top="70%" right="10%" size={40} delay={1.8} />
      <Sparkle top="50%" left="50%" size={28} delay={0.8} color="rgba(255,255,255,0.5)" />

      <div style={{ position: "relative", zIndex: 10, maxWidth: "1200px", margin: "0 auto", padding: "0 24px" }}>
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
              style={{ fontFamily: "'Bangers', cursive", fontSize: "22px", color: "#231F20", marginBottom: "16px", letterSpacing: "2px" }}
            >
              ABOUT NUTROFREEZE
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(72px, 12vw, 155px)", lineHeight: 0.85, color: "#231F20", margin: "0 0 32px 0", letterSpacing: "2px" }}
            >
              REAL FOOD,<br />REAL<br /><span style={{ color: "white" }}>NUTRITION</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "clamp(15px, 1.8vw, 20px)", lineHeight: 1.65, color: "#231F20", maxWidth: "520px", fontWeight: 500 }}
            >
              NutroFreeze was founded by a mother who wanted better food for her child. Our freeze-drying process locks in natural flavours, essential vitamins, and nutrients so every family can eat well, every day.
            </motion.p>
            <motion.div
              className="flex gap-4 mt-8 flex-wrap justify-center lg:justify-start"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            >
              <motion.a
                href="/"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", backgroundColor: "#231F20", color: "white", padding: "14px 28px", borderRadius: "100px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "15px", textDecoration: "none" }}
                whileHover={{ scale: 1.05, backgroundColor: "#9D7BCE" }} whileTap={{ scale: 0.97 }}
              >
                Shop Products
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none"><path d="M1.4375 7H14.5625" stroke="white" strokeWidth="2" strokeLinecap="round" /><path d="M9.3125 1.75L14.5625 7L9.3125 12.25" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
              </motion.a>
            </motion.div>
          </div>
          <div className="hidden lg:flex flex-col items-center gap-8">
            <SpinBadge text="SINCE 2024 · SINGAPORE" color="#231F20" size={190} />
            <SpinBadge text="97% NUTRIENTS PRESERVED" color="#9D7BCE" size={155} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── STATS SECTION ──────────────────────────────── */
const STATS = [
  { value: "97%", label: "Nutrients Preserved", icon: <Zap size={28} color="#00B2A9" /> },
  { value: "23+", label: "Products Available", icon: <Leaf size={28} color="#9D7BCE" /> },
  { value: "0", label: "Additives or Preservatives", icon: <ShieldCheck size={28} color="#00B2A9" /> },
  { value: "100%", label: "Natural Ingredients", icon: <Heart size={28} color="#9D7BCE" /> },
];

function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} style={{ backgroundColor: "#231F20", padding: "80px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <RevealWords
          text="THE NUMBERS SPEAK"
          style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(48px, 8vw, 100px)", color: "white", lineHeight: 0.9, letterSpacing: "2px", textAlign: "center", marginBottom: "60px" }}
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.12 }}
              whileHover={{ backgroundColor: "rgba(255,255,255,0.1)", y: -4 }}
              style={{ backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "24px", padding: "32px 24px", textAlign: "center" }}
            >
              <div style={{ marginBottom: "12px" }}>{s.icon}</div>
              <div style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(52px, 7vw, 80px)", color: "#00B2A9", lineHeight: 0.9, letterSpacing: "1px" }}>{s.value}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.6)", marginTop: "8px", lineHeight: 1.4 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MISSION SECTION ────────────────────────────── */
function MissionSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div style={{ backgroundColor: "#ffffff", padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          <div ref={ref} className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
              style={{ fontFamily: "'Bangers', cursive", fontSize: "20px", color: "#00B2A9", marginBottom: "16px", letterSpacing: "2px" }}
            >
              OUR MISSION
            </motion.div>
            <RevealWords
              text="PURE NUTRITION. REAL CONVENIENCE. ZERO COMPROMISE."
              style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(44px, 7vw, 88px)", lineHeight: 0.88, color: "#231F20", letterSpacing: "1px", marginBottom: "28px" }}
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "18px", lineHeight: 1.7, color: "#231F20", maxWidth: "520px", fontWeight: 500 }}
            >
              To deliver convenient, 100% natural freeze-dried foods that provide complete nutrition without additives or preservatives, enabling parents to nourish their children confidently in today's busy world.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.55 }}
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "16px", lineHeight: 1.7, color: "#666", maxWidth: "520px", marginTop: "16px" }}
            >
              Every product is crafted with the same care that any parent would expect for their own child. From orchard to table, nothing is added and nothing is lost.
            </motion.p>
          </div>
          <motion.div
            className="flex-1 w-full"
            initial={{ opacity: 0, scale: 0.9, x: 40 }} animate={inView ? { opacity: 1, scale: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25 }}
            style={{ borderRadius: "48px", overflow: "hidden", height: "clamp(360px, 45vw, 560px)", position: "relative" }}
          >
            <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=900&q=90" alt="Fresh ingredients" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", bottom: "24px", right: "24px" }}>
              <StickerBadge label="PURE NUTRITION" color="#00B2A9" wobble={-8} />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── PROCESS SECTION ────────────────────────────── */
const STEPS = [
  { num: "01", title: "HARVEST AT PEAK", desc: "Fruits and vegetables are selected at their nutritional peak, preserving maximum flavour and vitamins.", color: "#00B2A9" },
  { num: "02", title: "FREEZE DRY", desc: "Our gentle freeze-drying process removes moisture at low temperatures, locking in 97% of all nutrients.", color: "#9D7BCE" },
  { num: "03", title: "JUST ADD WATER", desc: "Add a little water and your food rehydrates in minutes with all its original texture and nutrition intact.", color: "#231F20" },
];

function ProcessSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ backgroundColor: "#faf6f0", padding: "120px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", fontFamily: "'Bangers', cursive", fontSize: "clamp(120px, 20vw, 260px)", color: "rgba(0,178,169,0.05)", whiteSpace: "nowrap", pointerEvents: "none", letterSpacing: "4px", lineHeight: 1 }}>
        FREEZE DRY
      </div>
      <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
            style={{ fontFamily: "'Bangers', cursive", fontSize: "20px", color: "#9D7BCE", marginBottom: "12px", letterSpacing: "2px" }}
          >
            HOW IT WORKS
          </motion.div>
          <RevealWords
            text="FROM FARM TO YOUR FAMILY"
            style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(52px, 9vw, 120px)", color: "#231F20", lineHeight: 0.88, letterSpacing: "1px" }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50, scale: 0.94 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: i * 0.15, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -8, boxShadow: `0 24px 60px ${step.color}33` }}
              style={{ backgroundColor: step.color, borderRadius: "32px", padding: "48px 36px", position: "relative", overflow: "hidden" }}
            >
              <div style={{ position: "absolute", top: "-20px", right: "-10px", fontFamily: "'Bangers', cursive", fontSize: "120px", color: "rgba(255,255,255,0.07)", lineHeight: 1, pointerEvents: "none" }}>{step.num}</div>
              <div style={{ fontFamily: "'Bangers', cursive", fontSize: "72px", color: "rgba(255,255,255,0.3)", lineHeight: 0.9, marginBottom: "16px" }}>{step.num}</div>
              <h3 style={{ fontFamily: "'Bangers', cursive", fontSize: "36px", color: "white", letterSpacing: "1px", marginBottom: "14px", lineHeight: 1 }}>{step.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── VALUES SECTION ─────────────────────────────── */
const VALUES = [
  { icon: <Leaf size={24} color="white" />, title: "100% Natural", desc: "No artificial colours, flavours, or preservatives. Ever.", color: "#00B2A9" },
  { icon: <ShieldCheck size={24} color="white" />, title: "No Additives", desc: "Clean ingredients you can pronounce. Nothing hidden.", color: "#9D7BCE" },
  { icon: <Heart size={24} color="white" />, title: "Family First", desc: "Made with the care of a parent. Safe for children and adults alike.", color: "#231F20" },
  { icon: <Zap size={24} color="white" />, title: "Just Add Water", desc: "Rehydrates in minutes. Full nutrition, zero effort.", color: "#00B2A9" },
];

function ValuesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} style={{ backgroundColor: "#ffffff", padding: "120px 24px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "72px" }}>
          <RevealWords
            text="WHAT WE STAND FOR"
            style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(52px, 9vw, 120px)", color: "#231F20", lineHeight: 0.88, letterSpacing: "1px" }}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              style={{ borderRadius: "28px", padding: "36px 28px", backgroundColor: v.color, position: "relative", overflow: "hidden" }}
            >
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>{v.icon}</div>
              <h3 style={{ fontFamily: "'Bangers', cursive", fontSize: "28px", color: "white", letterSpacing: "0.5px", marginBottom: "10px" }}>{v.title}</h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── BADGE STRIP ────────────────────────────────── */
function BadgeStrip() {
  return (
    <div style={{ backgroundColor: "#231F20", padding: "60px 24px", borderTop: "2px solid rgba(0,178,169,0.3)", borderBottom: "2px solid rgba(0,178,169,0.3)" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center", gap: "clamp(24px, 6vw, 72px)", flexWrap: "wrap" }}>
        <StickerBadge label="SINCE 2024" color="#00B2A9" wobble={-9} />
        <SpinBadge text="PURE NUTRITION · NO ADDITIVES" color="#9D7BCE" size={160} />
        <StickerBadge label="SINGAPORE" color="#231F20" wobble={6} />
        <SpinBadge text="JUST ADD WATER · REAL FOOD" color="#00B2A9" size={145} />
        <StickerBadge label="HALAL FRIENDLY" color="#7c1d6f" wobble={-12} />
      </div>
    </div>
  );
}

/* ─── BIG PARALLAX STATEMENT ─────────────────────── */
function StatementSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-28%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "28%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["-10%", "18%"]);

  return (
    <div ref={ref} style={{ backgroundColor: "#faf6f0", padding: "160px 24px", position: "relative", minHeight: "900px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <Sparkle top="10%" left="8%" size={44} delay={0} color="#00B2A9" />
      <Sparkle top="80%" right="6%" size={36} delay={1} color="#9D7BCE" />
      <motion.div className="hidden md:block" style={{ position: "absolute", top: "12%", left: "6%", width: "200px", height: "260px", borderRadius: "28px", overflow: "hidden", zIndex: 2, y: y1 }}>
        <img src="https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=85" alt="Fruits" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.div>
      <motion.div className="hidden md:block" style={{ position: "absolute", top: "20%", right: "4%", width: "280px", height: "360px", borderRadius: "28px", overflow: "hidden", zIndex: 2, y: y2 }}>
        <img src="https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&q=85" alt="Vegetables" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.div>
      <motion.div className="hidden md:block" style={{ position: "absolute", bottom: "8%", left: "2%", width: "300px", height: "210px", borderRadius: "28px", overflow: "hidden", zIndex: 2, y: y3 }}>
        <img src="https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=600&q=85" alt="Apple" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.div>
      <motion.div className="hidden md:block" style={{ position: "absolute", bottom: "12%", right: "6%", width: "175px", height: "175px", borderRadius: "28px", overflow: "hidden", zIndex: 2, y: y4 }}>
        <img src="https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&q=85" alt="Berries" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </motion.div>
      <div style={{ position: "relative", zIndex: 10, textAlign: "center", maxWidth: "1100px" }}>
        <h2 style={{ fontFamily: "'Bangers', cursive", fontSize: "clamp(64px, 12vw, 160px)", lineHeight: 0.85, color: "#231F20", margin: 0, letterSpacing: "1px" }}>
          PURE NUTRITION<br />FOR EVERY<br /><span style={{ color: "#9D7BCE" }}>FAMILY, EVERY DAY</span>
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
          style={{ marginTop: "36px" }}
        >
          <motion.a
            href="mailto:nutrofreeze@gmail.com"
            style={{ display: "inline-flex", alignItems: "center", gap: "10px", backgroundColor: "#231F20", color: "white", padding: "16px 36px", borderRadius: "100px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: "16px", textDecoration: "none" }}
            whileHover={{ scale: 1.05, backgroundColor: "#00B2A9" }} whileTap={{ scale: 0.97 }}
          >
            Get in Touch
            <svg width="16" height="14" viewBox="0 0 16 14" fill="none"><path d="M1.4375 7H14.5625" stroke="white" strokeWidth="2" strokeLinecap="round" /><path d="M9.3125 1.75L14.5625 7L9.3125 12.25" stroke="white" strokeWidth="2" strokeLinecap="round" /></svg>
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── PAGE ────────────────────────────────────────── */
export function AboutPage() {
  return (
    <div style={{ backgroundColor: "#ffffff", overflowX: "hidden", fontFamily: "'DM Sans', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <MarqueeTicker />
      <StatsSection />
      <MissionSection />
      <ProcessSection />
      <ValuesSection />
      <BadgeStrip />
      <StatementSection />
    </div>
  );
}
