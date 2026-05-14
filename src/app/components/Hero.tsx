import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

// -- 4-pointed Brars-style sparkle star -------------------------------------------
function Sparkle({
  size = 32,
  color = "white",
  opacity = 1,
  style = {} as React.CSSProperties,
}: {
  size?: number;
  color?: string;
  opacity?: number;
  style?: React.CSSProperties;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 47 47"
      fill="none"
      style={{ display: "block", opacity, ...style }}
    >
      <path
        d="M23.2496 0.345703C17.2963 12.4504 12.4733 17.2676 0.350836 23.217C12.4795 29.1664 17.3075 33.9836 23.2736 46.1089C29.2269 33.9836 34.0292 29.1664 46.1723 23.217C34.023 17.2676 29.2156 12.4504 23.2496 0.345703Z"
        fill={color}
      />
    </svg>
  );
}

const slides = [
  {
    id: 1,
    category: "FREEZE DRIED",
    subcategory: "FRUITS",
    productName: "MIXED\nBERRY BLEND",
    tagline: "97% nutrients preserved. No additives, no preservatives.",
    bgColor: "#08061a",
    accentColor: "#c4b5fd",
    glowColor: "rgba(124,58,237,0.30)",
    img: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=900&q=90",
    tags: ["No Added Sugar", "Halal Certified", "Vegan Friendly"],
  },
  {
    id: 2,
    category: "FREEZE DRIED",
    subcategory: "VEGETABLES",
    productName: "BROCCOLI\nFLORETS",
    tagline: "Crisp, shelf-stable goodness. Just add water to rehydrate.",
    bgColor: "#020f09",
    accentColor: "#5eead4",
    glowColor: "rgba(13,148,136,0.28)",
    img: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=900&q=90",
    tags: ["Gluten Free", "No Preservatives", "100% Natural"],
  },
  {
    id: 3,
    category: "FREEZE DRIED",
    subcategory: "BABY FOOD",
    productName: "SWEET POTATO\nPUREE",
    tagline: "Pure, gentle nutrition crafted for little ones.",
    bgColor: "#0d050a",
    accentColor: "#f9a8d4",
    glowColor: "rgba(217,70,239,0.22)",
    img: "https://images.unsplash.com/photo-1711205229065-89353695a869?w=900&q=90",
    tags: ["No Salt Added", "4+ Months", "Halal Certified"],
  },
  {
    id: 4,
    category: "READY TO EAT",
    subcategory: "MEALS",
    productName: "JUST ADD\nWATER",
    tagline: "Balanced nutrition, ready in minutes. No cooking needed.",
    bgColor: "#030c18",
    accentColor: "#5eead4",
    glowColor: "rgba(13,148,136,0.22)",
    img: "https://images.unsplash.com/photo-1679279726937-122c49626802?w=900&q=90",
    tags: ["Complete Nutrition", "No Cooking", "Halal Certified"],
  },
];

export function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % slides.length);
    }, 5500);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
    startTimer();
  };

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden select-none"
      style={{
        minHeight: "calc(100vh - 72px)",
        backgroundColor: slide.bgColor,
        transition: "background-color 0.9s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Background radial glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + "glow"}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 70% 70% at 50% 60%, ${slide.glowColor} 0%, transparent 70%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
        />
      </AnimatePresence>

      {/* Ghost category watermark */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + "catbg"}
          className="absolute pointer-events-none"
          style={{ bottom: "-4%", left: "1%", zIndex: 1, overflow: "hidden" }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.9 }}
        >
          <span
            style={{
              fontFamily: "'Syne'",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(90px, 17vw, 260px)",
              color: slide.accentColor,
              opacity: 0.045,
              textTransform: "uppercase",
              letterSpacing: "-4px",
              lineHeight: 0.85,
              userSelect: "none",
              whiteSpace: "nowrap",
              display: "block",
            }}
          >
            {slide.subcategory}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* MAIN CONTENT: 3-column Brars-style layout */}
      <div
        className="flex-1 flex items-center relative"
        style={{
          zIndex: 10,
          padding: "clamp(24px, 4vw, 56px) clamp(24px, 5vw, 64px) clamp(16px, 2.5vw, 36px)",
          gap: "0",
        }}
      >
        {/* LEFT COLUMN: text */}
        <div
          className="flex flex-col justify-center"
          style={{ flex: "0 0 38%", minWidth: 0, order: 1, paddingRight: "clamp(16px, 3vw, 48px)" }}
        >
          {/* Category label row */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "cat"}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 18 }}
              transition={{ duration: 0.38 }}
              style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}
            >
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: slide.accentColor,
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                }}
              >
                {slide.category}
              </span>
              <Sparkle size={12} color={slide.accentColor} opacity={0.85} />
              <span
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.38)",
                  letterSpacing: "4px",
                  textTransform: "uppercase",
                }}
              >
                {slide.subcategory}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* GIANT PRODUCT NAME -- dominant element */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={slide.id + "name"}
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.58, ease: [0.23, 1, 0.32, 1] }}
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(58px, 7.5vw, 128px)",
                color: "white",
                lineHeight: 0.88,
                letterSpacing: "0.02em",
                textTransform: "uppercase",
                margin: "0 0 22px 0",
                whiteSpace: "pre-line",
              }}
            >
              {slide.productName}
            </motion.h1>
          </AnimatePresence>

          {/* Tagline */}
          <AnimatePresence mode="wait">
            <motion.p
              key={slide.id + "tagline"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.18, duration: 0.42 }}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "clamp(13px, 1.2vw, 16px)",
                color: "rgba(255,255,255,0.52)",
                marginBottom: "22px",
                lineHeight: 1.65,
                maxWidth: "380px",
              }}
            >
              {slide.tagline}
            </motion.p>
          </AnimatePresence>

          {/* Dietary tags */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "tags"}
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "8px",
                marginBottom: "32px",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.22, duration: 0.38 }}
            >
              {slide.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: slide.accentColor,
                    border: `1px solid ${slide.accentColor}35`,
                    borderRadius: "100px",
                    padding: "5px 13px",
                    letterSpacing: "0.3px",
                    textTransform: "uppercase",
                    backgroundColor: `${slide.accentColor}0a`,
                  }}
                >
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <circle cx="5" cy="5" r="5" fill={slide.accentColor} opacity="0.22" />
                    <path
                      d="M2.5 5l1.8 1.8 3.2-3.6"
                      stroke={slide.accentColor}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  {tag}
                </span>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* CTA buttons */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "cta"}
              style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              <motion.a
                href="#products"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "white",
                  textDecoration: "none",
                  padding: "13px 30px",
                  borderRadius: "999px",
                  background: "linear-gradient(135deg, #0d9488, #7c3aed)",
                  boxShadow: "0 8px 30px rgba(13,148,136,0.32)",
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                whileHover={{ scale: 1.04, y: -2, boxShadow: "0 14px 42px rgba(13,148,136,0.44)" }}
                whileTap={{ scale: 0.97 }}
              >
                Shop Now
                <svg width="14" height="12" viewBox="0 0 16 14" fill="none">
                  <path d="M1.44 7H14.56" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.31 1.75L14.56 7L9.31 12.25" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.a>
              <motion.a
                href="/about"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.65)",
                  textDecoration: "none",
                  padding: "13px 30px",
                  borderRadius: "999px",
                  border: "1px solid rgba(255,255,255,0.16)",
                  letterSpacing: "0.6px",
                  textTransform: "uppercase",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                whileHover={{
                  scale: 1.04,
                  y: -2,
                  borderColor: "rgba(255,255,255,0.38)",
                  color: "white",
                }}
                whileTap={{ scale: 0.97 }}
              >
                Learn More
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CENTRE COLUMN: large arch-framed product image */}
        <div
          className="relative hidden md:flex flex-col items-center justify-end"
          style={{
            flex: "0 0 36%",
            alignSelf: "stretch",
            order: 2,
            minHeight: "480px",
            position: "relative",
          }}
        >
          {/* Decorative concentric rings behind the image */}
          <div
            style={{
              position: "absolute",
              inset: "-60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1,
              pointerEvents: "none",
            }}
          >
            <svg
              viewBox="0 0 600 600"
              style={{ width: "100%", height: "100%", maxWidth: "600px", opacity: 0.08 }}
              fill="none"
            >
              {[260, 210, 160, 110, 60].map((r, i) => (
                <circle
                  key={r}
                  cx="300"
                  cy="300"
                  r={r}
                  stroke={slide.accentColor}
                  strokeWidth={i === 0 ? 1 : 0.75}
                  strokeDasharray={i % 2 === 0 ? "6 10" : "0"}
                />
              ))}
              {/* Radial spokes */}
              {Array.from({ length: 12 }).map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                return (
                  <line
                    key={i}
                    x1={300 + 65 * Math.cos(angle)}
                    y1={300 + 65 * Math.sin(angle)}
                    x2={300 + 255 * Math.cos(angle)}
                    y2={300 + 255 * Math.sin(angle)}
                    stroke={slide.accentColor}
                    strokeWidth="0.5"
                  />
                );
              })}
            </svg>
          </div>

          {/* Sparkles around the frame */}
          <motion.div
            style={{ position: "absolute", top: "8%", left: "12%", zIndex: 20, pointerEvents: "none" }}
            animate={{ rotate: [0, 14, -10, 0], scale: [1, 1.12, 0.94, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Sparkle size={42} color={slide.accentColor} opacity={0.9} />
          </motion.div>
          <motion.div
            style={{ position: "absolute", bottom: "18%", left: "6%", zIndex: 20, pointerEvents: "none" }}
            animate={{ opacity: [0.4, 0.85, 0.4], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
          >
            <Sparkle size={22} color="white" opacity={0.5} />
          </motion.div>
          <motion.div
            style={{ position: "absolute", top: "22%", right: "8%", zIndex: 20, pointerEvents: "none" }}
            animate={{ rotate: [0, -16, 8, 0], scale: [1, 0.9, 1.06, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
          >
            <Sparkle size={28} color="white" opacity={0.32} />
          </motion.div>

          {/* Arch-shaped image frame (tall rounded pill, flat on the bottom) */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              width: "clamp(220px, 26vw, 380px)",
              height: "clamp(320px, 60vh, 560px)",
              borderRadius: "999px 999px 120px 120px",
              overflow: "hidden",
              boxShadow: `0 40px 90px rgba(0,0,0,0.7), 0 0 0 2px ${slide.accentColor}30`,
              marginBottom: "24px",
            }}
          >
            <AnimatePresence custom={direction} mode="sync">
              <motion.div
                key={slide.id + "img"}
                custom={direction}
                variants={{
                  enter: (dir: number) => ({
                    clipPath: dir >= 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
                  }),
                  center: {
                    clipPath: "inset(0 0% 0 0%)",
                    transition: { duration: 0.92, ease: [0.77, 0, 0.175, 1] },
                  },
                  exit: (dir: number) => ({
                    clipPath: dir >= 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
                    transition: { duration: 0.66, ease: [0.77, 0, 0.175, 1] },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                style={{ position: "absolute", inset: 0, willChange: "clip-path" }}
              >
                <motion.img
                  src={slide.img}
                  alt={slide.productName}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
                />
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: `linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 45%)`,
                    pointerEvents: "none",
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* RIGHT COLUMN: stats + spin badge */}
        <div
          className="hidden lg:flex flex-col justify-center items-start"
          style={{
            flex: "0 0 26%",
            order: 3,
            paddingLeft: "clamp(16px, 2.5vw, 40px)",
            gap: "28px",
          }}
        >
          {/* Rotating circular sticker */}
          <div style={{ position: "relative", width: "118px", height: "118px" }}>
            <motion.svg
              viewBox="0 0 118 118"
              style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
            >
              <defs>
                <path
                  id="arc-hero-text"
                  d="M 103,59 a 44,44 0 1,0 -88,0"
                />
              </defs>
              <circle cx="59" cy="59" r="57" fill={slide.accentColor} opacity="0.10" />
              <circle cx="59" cy="59" r="57" fill="none" stroke={slide.accentColor} strokeWidth="1" opacity="0.35" />
              <text
                fill={slide.accentColor}
                style={{
                  fontSize: "8.5px",
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: 700,
                  letterSpacing: "2.6px",
                }}
              >
                <textPath href="#arc-hero-text">
                  NUTROFREEZE · MADE IN SINGAPORE ·{" "}
                </textPath>
              </text>
            </motion.svg>
            <div
              style={{
                position: "absolute",
                inset: "38px",
                borderRadius: "50%",
                backgroundColor: slide.accentColor,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                opacity: 0.92,
              }}
            >
              <span
                style={{
                  fontFamily: "'Bangers', cursive",
                  fontSize: "14px",
                  color: "#0f172a",
                  letterSpacing: "0.5px",
                }}
              >
                NF
              </span>
            </div>
          </div>

          {/* Stats */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {[
              { val: "97%", label: "Nutrients\nPreserved" },
              { val: "0", label: "Additives &\nPreservatives" },
              { val: "100%", label: "Natural\nIngredients" },
            ].map((stat) => (
              <AnimatePresence key={stat.val + stat.label} mode="wait">
                <motion.div
                  key={slide.id + stat.val}
                  initial={{ opacity: 0, x: 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                  style={{
                    borderLeft: `2px solid ${slide.accentColor}50`,
                    paddingLeft: "14px",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Bangers', cursive",
                      fontSize: "clamp(34px, 3.5vw, 52px)",
                      color: slide.accentColor,
                      lineHeight: 0.9,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {stat.val}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: "11px",
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.45)",
                      letterSpacing: "0.8px",
                      textTransform: "uppercase",
                      whiteSpace: "pre-line",
                      lineHeight: 1.4,
                      marginTop: "3px",
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "32px",
          padding: "0 clamp(24px, 6vw, 80px) 28px",
          zIndex: 20,
          position: "relative",
        }}
      >
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "6px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "1.5px",
                borderRadius: "4px",
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.14)",
              }}
            >
              {i === current && (
                <motion.div
                  style={{ height: "100%", borderRadius: "4px", backgroundColor: slide.accentColor }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5.5, ease: "linear" }}
                />
              )}
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: i === current ? slide.accentColor : "rgba(255,255,255,0.26)",
                transition: "color 0.4s",
              }}
            >
              {s.subcategory}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
