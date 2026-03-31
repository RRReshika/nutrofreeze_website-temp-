import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

const slides = [
  {
    id: 1,
    category: "FRUITS",
    productName: "MIXED BERRY\nBLEND",
    bgColor: "#08061a",
    accentColor: "#c4b5fd",
    textColor: "rgba(196,181,253,0.12)",
    badge1: "PREMIUM\nFROZEN FRUITS",
    badge2: "NO ADDED\nSUGAR",
    img: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=700&q=90",
    leftImg: "https://images.unsplash.com/photo-1667889244854-364252b3c14a?w=400&q=80",
    rightImg: "https://images.unsplash.com/photo-1595265185654-f7b3c41c9a57?w=400&q=80",
    pieces: "600g · No Added Sugar",
    glowColor: "rgba(124,58,237,0.22)",
    labelColor: "#c4b5fd",
  },
  {
    id: 2,
    category: "VEGETABLES",
    productName: "BROCCOLI\nFLORETS",
    bgColor: "#020f09",
    accentColor: "#5eead4",
    textColor: "rgba(94,234,212,0.10)",
    badge1: "TRIPLE\nWASHED CLEAN",
    badge2: "100%\nNATURAL",
    img: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=700&q=90",
    leftImg: "https://images.unsplash.com/photo-1595265185654-f7b3c41c9a57?w=400&q=80",
    rightImg: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=400&q=80",
    pieces: "750g · Triple Washed",
    glowColor: "rgba(13,148,136,0.22)",
    labelColor: "#5eead4",
  },
  {
    id: 3,
    category: "GYM FOOD",
    productName: "PROTEIN\nQUINOA",
    bgColor: "#030c18",
    accentColor: "#5eead4",
    textColor: "rgba(94,234,212,0.10)",
    badge1: "32g\nPROTEIN",
    badge2: "MEAL\nPREP READY",
    img: "https://images.unsplash.com/photo-1679279726937-122c49626802?w=700&q=90",
    leftImg: "https://images.unsplash.com/photo-1687041568037-dab13851ea14?w=400&q=80",
    rightImg: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=400&q=80",
    pieces: "500g · 32g Protein Per Serving",
    glowColor: "rgba(13,148,136,0.22)",
    labelColor: "#5eead4",
  },
  {
    id: 4,
    category: "BABY FOOD",
    productName: "SWEET POTATO\nPURÉE",
    bgColor: "#0d050a",
    accentColor: "#f9a8d4",
    textColor: "rgba(249,168,212,0.10)",
    badge1: "NO SALT\nADDED",
    badge2: "4+ MONTHS\nREADY",
    img: "https://images.unsplash.com/photo-1711205229065-89353695a869?w=700&q=90",
    leftImg: "https://images.unsplash.com/photo-1473340186413-a68ba9c2564e?w=400&q=80",
    rightImg: "https://images.unsplash.com/photo-1667889244854-364252b3c14a?w=400&q=80",
    pieces: "300g · For 4+ Months",
    glowColor: "rgba(217,70,239,0.18)",
    labelColor: "#f9a8d4",
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
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
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
      style={{ minHeight: "calc(100vh - 72px)", backgroundColor: slide.bgColor, transition: "background-color 0.9s ease" }}
    >
      {/* BG radial glow */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + "glow"}
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 75% 60% at 50% 75%, ${slide.glowColor} 0%, transparent 72%)`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1 }}
        />
      </AnimatePresence>

      {/* ── GIANT CATEGORY TEXT fills the hero (behind everything) ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id + "catbg"}
          className="absolute inset-x-0 pointer-events-none overflow-hidden flex items-center justify-center"
          style={{ top: "14%", zIndex: 1 }}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.94 }}
          transition={{ duration: 0.75, ease: [0.23, 1, 0.32, 1] }}
        >
          <span
            style={{
              fontFamily: "'Syne'",
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(80px, 19vw, 260px)",
              color: slide.textColor,
              textTransform: "uppercase",
              letterSpacing: "-4px",
              lineHeight: 0.85,
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {slide.category}
          </span>
        </motion.div>
      </AnimatePresence>

      {/* ── NUTROFREEZE brand heading removed ── */}

      {/* ── PRODUCT SHOWCASE ROW ── */}
      <div
        className="relative flex items-end justify-center w-full px-4"
        style={{
          zIndex: 10,
          paddingTop: "clamp(120px, 18vw, 200px)",
          paddingBottom: "80px",
          minHeight: "calc(100vh - 72px)",
        }}
      >

        {/* Left side product - fade + slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + "left"}
            className="hidden md:flex items-end self-end"
            style={{ width: "clamp(130px, 13vw, 195px)", flexShrink: 0, marginBottom: "32px" }}
            initial={{ opacity: 0, x: -80 }}
            animate={{ opacity: 0.65, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            <div
              className="w-full rounded-2xl overflow-hidden relative"
              style={{ height: "clamp(170px, 21vw, 280px)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}
            >
              <img
                src={slide.leftImg}
                alt="product"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.6) saturate(0.6)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ── CENTER FEATURED — CLIP-PATH WIPE (Brars-style) ── */}
        <div
          className="relative flex flex-col items-center mx-5 md:mx-10 flex-shrink-0"
          style={{ zIndex: 15 }}
        >
          {/* Left floating badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "b1"}
              className="absolute -left-14 md:-left-28 bottom-36 z-20 hidden md:block"
              initial={{ opacity: 0, rotate: -30, scale: 0 }}
              animate={{ opacity: 1, rotate: -14, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.55, type: "spring", stiffness: 220, damping: 18 }}
            >
              <div
                className="rounded-full flex flex-col items-center justify-center text-center p-3"
                style={{ width: 104, height: 104, backgroundColor: "rgba(255,255,253,0.1)", backdropFilter: "blur(12px)", border: `1px solid ${slide.labelColor}40` }}
              >
                <span style={{ fontSize: "20px", marginBottom: "3px" }}>❄️</span>
                {slide.badge1.split("\n").map((l, i) => (
                  <span key={i} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "8px", fontWeight: 800, color: "white", letterSpacing: "0.7px", textTransform: "uppercase", lineHeight: 1.4 }}>
                    {l}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Product image — CLIP-PATH WIPE transition */}
          <div
            style={{
              width: "clamp(220px, 29vw, 380px)",
              height: "clamp(280px, 37vw, 500px)",
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: "0 56px 110px rgba(0,0,0,0.6), 0 20px 48px rgba(0,0,0,0.35)",
              position: "relative",
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
                    transition: { duration: 0.9, ease: [0.77, 0, 0.175, 1] },
                  },
                  exit: (dir: number) => ({
                    clipPath: dir >= 0 ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)",
                    transition: { duration: 0.65, ease: [0.77, 0, 0.175, 1] },
                  }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  position: "absolute",
                  inset: 0,
                  willChange: "clip-path",
                }}
              >
                <motion.img
                  src={slide.img}
                  alt={slide.productName}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.1, ease: [0.23, 1, 0.32, 1] }}
                />
                {/* Overlay gradient */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0) 55%)",
                    pointerEvents: "none",
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Product name overlay — sits on top, always visible */}
            <div className="absolute bottom-0 left-0 right-0 p-5" style={{ zIndex: 5 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={slide.id + "name"}
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -8, opacity: 0 }}
                  transition={{ delay: 0.45, duration: 0.45 }}
                >
                  <div
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: "clamp(22px, 3vw, 36px)",
                      color: slide.accentColor,
                      textTransform: "uppercase",
                      letterSpacing: "0px",
                      lineHeight: 0.95,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {slide.productName}
                  </div>
                  <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", marginTop: "4px" }}>
                    {slide.pieces}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right floating badge */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "b2"}
              className="absolute -right-14 md:-right-28 bottom-20 z-20 hidden md:block"
              initial={{ opacity: 0, rotate: 30, scale: 0 }}
              animate={{ opacity: 1, rotate: 14, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: 0.65, type: "spring", stiffness: 220, damping: 18 }}
            >
              <div
                className="rounded-full flex flex-col items-center justify-center text-center p-3"
                style={{ width: 94, height: 94, backgroundColor: "#0d9488", boxShadow: `0 8px 28px rgba(13,148,136,0.5)` }}
              >
                <span style={{ fontSize: "18px", marginBottom: "3px" }}>🍁</span>
                {slide.badge2.split("\n").map((l, i) => (
                  <span key={i} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "7.5px", fontWeight: 800, color: "white", letterSpacing: "0.7px", textTransform: "uppercase", lineHeight: 1.4 }}>
                    {l}
                  </span>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Shop Now CTA */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id + "cta"}
              className="mt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.5 }}
            >
              <motion.a
                href="#products"
                className="flex items-center gap-3"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "white",
                  textDecoration: "none",
                  padding: "12px 28px",
                  borderRadius: "999px",
                  background: `linear-gradient(135deg, #0d9488, #7c3aed)`,
                  boxShadow: "0 8px 30px rgba(13,148,136,0.35)",
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
                whileHover={{ scale: 1.06, y: -3, boxShadow: "0 14px 42px rgba(13,148,136,0.45)" }}
                whileTap={{ scale: 0.97 }}
              >
                Shop Now
                <span style={{ fontSize: "16px" }}>→</span>
              </motion.a>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right side product - fade + slide */}
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id + "right"}
            className="hidden md:flex items-end self-end"
            style={{ width: "clamp(130px, 13vw, 195px)", flexShrink: 0, marginBottom: "32px" }}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 0.65, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            transition={{ duration: 0.65, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            <div
              className="w-full rounded-2xl overflow-hidden relative"
              style={{ height: "clamp(170px, 21vw, 280px)", boxShadow: "0 16px 48px rgba(0,0,0,0.5)" }}
            >
              <img
                src={slide.rightImg}
                alt="product"
                className="w-full h-full object-cover"
                style={{ filter: "brightness(0.6) saturate(0.6)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── BOTTOM NAVIGATION ── */}
      <div className="absolute bottom-5 left-0 right-0 flex items-center justify-center gap-8 z-20">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}
          >
            {/* Progress line */}
            <div style={{ width: "40px", height: "1.5px", borderRadius: "4px", overflow: "hidden", backgroundColor: "rgba(255,255,255,0.15)" }}>
              {i === current && (
                <motion.div
                  style={{ height: "100%", borderRadius: "4px", backgroundColor: slide.labelColor }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5.5, ease: "linear" }}
                />
              )}
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "8.5px",
                fontWeight: 700,
                letterSpacing: "2.5px",
                textTransform: "uppercase",
                color: i === current ? slide.labelColor : "rgba(255,255,255,0.28)",
                transition: "color 0.4s",
              }}
            >
              {s.category}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}