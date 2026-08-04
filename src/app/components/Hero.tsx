import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

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

const BIG_PKT = "/images/big%20packets%20no%20background";
const slides = [
  {
    id: 1,
    category: "FREEZE DRIED",
    subcategory: "FRUITS",
    productName: "BLUEBERRY BURST",
    tagline: "97% nutrients preserved. No additives, no preservatives.",
    bgColor: "#08061a",
    accentColor: "#c4b5fd",
    blobColor: "rgba(124,58,237,0.32)",
    img: `${BIG_PKT}/WB_Blueberry_Front_-removebg-preview.png`,
    tags: ["No Added Sugar", "Halal Certified", "Vegan Friendly"],
    isPacket: true,
  },
  {
    id: 2,
    category: "FREEZE DRIED",
    subcategory: "VEGETABLES",
    productName: "BITTER GOURD",
    tagline: "Crisp, shelf-stable goodness. Just add water to rehydrate.",
    bgColor: "#020f09",
    accentColor: "#5eead4",
    blobColor: "rgba(13,148,136,0.30)",
    img: `${BIG_PKT}/WB_Bitter_Gourd_Front_-removebg-preview.png`,
    tags: ["Gluten Free", "No Preservatives", "100% Natural"],
    isPacket: true,
  },
  {
    id: 3,
    category: "FREEZE DRIED",
    subcategory: "BABY FOOD",
    productName: "SWEET POTATO",
    tagline: "Pure, gentle nutrition crafted for little ones.",
    bgColor: "#0d050a",
    accentColor: "#f9a8d4",
    blobColor: "rgba(217,70,239,0.26)",
    img: `${BIG_PKT}/WB_potato_front-removebg-preview.png`,
    tags: ["No Salt Added", "4+ Months", "Halal Certified"],
    isPacket: true,
  },
  {
    id: 4,
    category: "READY TO EAT",
    subcategory: "MEALS",
    productName: "MANGO DELIGHT",
    tagline: "Balanced nutrition, ready in minutes. No cooking needed.",
    bgColor: "#030c18",
    accentColor: "#fde68a",
    blobColor: "rgba(245,158,11,0.22)",
    img: `${BIG_PKT}/WB_Mango_front-removebg-preview.png`,
    tags: ["Complete Nutrition", "No Cooking", "Halal Certified"],
    isPacket: true,
  },
];

// Prev/next peek use the food bowl images for the arch peeks
const peekImgs = [
  "/images/other%20images/mixed%20berry%20bowl.png",
  "/images/other%20images/brocoli%20florets.png",
  "/images/other%20images/puree.png",
  "/images/other%20images/healthy%20bowl.png",
];
const contentVariants = {
  enter: { opacity: 0, scale: 0.96 },
  center: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.52, ease: [0.23, 1, 0.32, 1] },
  },
  exit: {
    opacity: 0,
    scale: 1.03,
    transition: { duration: 0.3, ease: [0.55, 0, 1, 0.45] },
  },
};

// Static sparkles — rendered once, outside AnimatePresence so they never restart
const bgSparkles = [
  { top: "42%", left: "24%", size: 15, delay: 0, dur: 5.2 },
  { top: "30%", left: "60%", size: 10, delay: 1.5, dur: 6.4 },
  { top: "58%", left: "72%", size: 12, delay: 0.7, dur: 7.1 },
  { top: "22%", left: "36%", size: 7, delay: 3.2, dur: 5.0 },
];
// Per-slide packet images [TL, BL, TR, BR]
const slidePackets: [string, string, string, string][] = [
  [ // slide 0 — purple / berry
    `${BIG_PKT}/WB_Blueberry_Front_-removebg-preview.png`,
    `${BIG_PKT}/WB_strawberry_front-removebg-preview.png`,
    `${BIG_PKT}/WB_pineapple_front-removebg-preview.png`,
    `${BIG_PKT}/WB_raspberry_front-removebg-preview.png`,
  ],
  [ // slide 1 — teal / vegetable
    `${BIG_PKT}/PC_Carrot-removebg-preview.png`,
    `${BIG_PKT}/WB_corn_front-removebg-preview.png`,
    `${BIG_PKT}/WB_Peas_front-removebg-preview.png`,
    `${BIG_PKT}/WB_Zucchini_front-removebg-preview.png`,
  ],
  [ // slide 2 — pink / tropical
    `${BIG_PKT}/WB_Mango_front-removebg-preview.png`,
    `${BIG_PKT}/WB_Papaya_Front-removebg-preview.png`,
    `${BIG_PKT}/WB_Banana_front-removebg-preview.png`,
    `${BIG_PKT}/WB_Kiwi_front-removebg-preview.png`,
  ],
  [ // slide 3 — teal / hearty
    `${BIG_PKT}/WB_potato_front-removebg-preview.png`,
    `${BIG_PKT}/WB_Bitter_Gourd_Front_-removebg-preview.png`,
    `${BIG_PKT}/WB_Red_bell_pepper_front-removebg-preview.png`,
    `${BIG_PKT}/WB_Amla_Front-removebg-preview.png`,
  ],
];
export function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
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

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(media.matches);
    updateMobile();
    media.addEventListener("change", updateMobile);
    return () => media.removeEventListener("change", updateMobile);
  }, []);

  const goTo = (i: number) => {
    if (i === current) return;
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
    startTimer();
  };

  const slide = slides[current];
  const prevIdx = (current - 1 + slides.length) % slides.length;
  const nextIdx = (current + 1) % slides.length;

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100svh",
        height: "max(680px, 100svh)",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          STATIC BACKGROUND â€” outside AnimatePresence.
          These elements persist between slides and never
          restart. bg color + aura fade via CSS transition.
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}

      {/* Background color */}
      <motion.div
        style={{ position: "absolute", inset: 0, zIndex: 0 }}
        animate={{ backgroundColor: slide.bgColor }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
      />

      {/* Radial aura â€” color fades to match current slide */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: "50%", top: "58%",
          transform: "translate(-50%, -50%)",
          width: "min(90vw, 1200px)",
          height: "min(90vw, 1200px)",
          borderRadius: "50%",
          filter: "blur(6px)",
          zIndex: 1,
        }}
        animate={{
          background: `radial-gradient(ellipse at center, ${slide.blobColor} 0%, transparent 66%)`,
        }}
        transition={{ duration: 0.65, ease: "easeInOut" }}
      />

      {/* Single rotating dashed ring â€” very subtle, never restarts */}
      <motion.div
        className="absolute pointer-events-none"
        style={{ left: "50%", top: "50%", zIndex: 1, x: "-50%", y: "-50%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 720 720" width="720" height="720" fill="none" style={{ opacity: 0.048 }}>
          <circle cx="360" cy="360" r="344" stroke="white" strokeWidth="1" strokeDasharray="4 18" />
          <circle cx="360" cy="360" r="264" stroke="white" strokeWidth="1" strokeDasharray="4 18" />
        </svg>
      </motion.div>

      {/* Ambient sparkles — never restart */}
      {bgSparkles.map((p, i) => (
        <motion.div
          key={"bsp" + i}
          className="absolute pointer-events-none"
          style={{ top: p.top, left: p.left, zIndex: 1 }}
          animate={{ opacity: [0.05, 0.28, 0.05], scale: [0.7, 1.2, 0.7] }}
          transition={{ duration: p.dur, repeat: Infinity, ease: "easeInOut", delay: p.delay }}
        >
          <Sparkle size={p.size} color="white" />
        </motion.div>
      ))}

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          CONTENT â€” crossfade (no simultaneous dual-panel)
          mode="sync" + opacity means entering panel fades
          in on top of the exiting panel. No giant headlines
          sliding side-by-side.
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          variants={contentVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {/* ── TOP: category label + headline ── */}
          <div
            style={{
              flexShrink: 0,
              textAlign: "center",
              paddingTop: "clamp(100px, 10vw, 120px)",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: isMobile ? "10px" : "11px",
                fontWeight: 700,
                letterSpacing: isMobile ? "2.4px" : "5px",
                textTransform: "uppercase",
                color: slide.accentColor,
                margin: "0 0 8px",
              }}
            >
              {slide.category}{"\u00A0\u00A0\u00B7\u00A0\u00A0"}{slide.subcategory}
            </p>
            <h1
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(38px, 10vw, 96px)",
                color: "white",
                lineHeight: 0.92,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                margin: 0,
                whiteSpace: isMobile ? "normal" : "nowrap",
                maxWidth: isMobile ? "92vw" : "none",
              }}
            >
              {slide.productName}
            </h1>
          </div>

          {/* â”€â”€ MIDDLE: prev peek | arch frame | next peek â”€â”€ */}
          <div
            style={{
              flex: 1,
              minHeight: 0,
              width: "100%",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              position: "relative",
              paddingBottom: isMobile ? "72px" : "44px",
            }}
          >
            {/* PREV — left edge */}
            <motion.div
              className="absolute hidden md:block"
              style={{
                left: 0,
                top: "50%",
                translateY: "-50%",
                cursor: "pointer",
                width: "clamp(120px, 12vw, 200px)",
                height: "clamp(200px, 36vh, 430px)",
                borderRadius: "999px 999px 22px 22px",
                overflow: "hidden",
                opacity: 0.42,
                filter: "brightness(0.6) saturate(0.6)",
              }}
              whileHover={{ opacity: 0.72, scale: 1.04, x: 8 }}
              transition={{ duration: 0.2 }}
              onClick={() => goTo(prevIdx)}
            >
              <img
                src={peekImgs[prevIdx]}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </motion.div>

            {/* CENTER: decorative ring + product image + badge */}
            <div style={{ position: "relative", flexShrink: 0, display: "flex", alignItems: "flex-end", justifyContent: "center", overflow: "visible" }}>

              {/* Decorative circle behind the product — like Brrar's */}
              <motion.div
                style={{
                  position: "absolute",
                  width: "clamp(280px, 32vw, 480px)",
                  height: "clamp(280px, 32vw, 480px)",
                  borderRadius: "50%",
                  background: `radial-gradient(circle, ${slide.accentColor}30 0%, ${slide.accentColor}08 60%, transparent 100%)`,
                  border: `2px solid ${slide.accentColor}22`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
                animate={{ scale: [1, 1.04, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Second outer ring */}
              <motion.div
                style={{
                  position: "absolute",
                  width: "clamp(340px, 40vw, 580px)",
                  height: "clamp(340px, 40vw, 580px)",
                  borderRadius: "50%",
                  border: `1px solid ${slide.accentColor}14`,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 0,
                  pointerEvents: "none",
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />

              {/* Sparkle — top-left, away from badge */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "8%",
                  left: "-10px",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
                animate={{ rotate: [0, 18, -12, 0], scale: [1, 1.15, 0.9, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkle size={24} color={slide.accentColor} opacity={0.85} />
              </motion.div>

              {/* Product image */}
              <motion.div
                style={{
                  width: "clamp(260px, 28vw, 440px)",
                  height: isMobile ? "clamp(300px, 50vh, 420px)" : "clamp(380px, 58vh, 620px)",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "center",
                  position: "relative",
                  zIndex: 5,
                }}
                animate={{ y: [0, -14, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <AnimatePresence mode="wait">
                  <motion.img
                    key={slide.id + "-main"}
                    src={slide.img}
                    alt={slide.productName}
                    initial={{ opacity: 0, scale: 0.88, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.06, y: -20 }}
                    transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      display: "block",
                      filter: `drop-shadow(0 40px 80px ${slide.accentColor}88) drop-shadow(0 8px 24px rgba(0,0,0,0.7))`,
                    }}
                  />
                </AnimatePresence>
              </motion.div>

              {/* Orbiting packets — clustered around the center product */}
              {/* Top-left */}
              <motion.div
                className="hidden md:block"
                style={{ position: "absolute", top: "6%", left: "calc(-1 * clamp(90px, 12vw, 160px))", zIndex: 6, pointerEvents: "none", width: "clamp(80px, 9vw, 140px)" }}
                animate={{ y: [0, -14, 0], rotate: [-14, -10, -14] }}
                transition={{ duration: 6.4, repeat: Infinity, ease: "easeInOut" }}
              >
                <AnimatePresence mode="wait">
                  <motion.img key={current + "-tl"} src={slidePackets[current][0]} alt=""
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ width: "100%", display: "block", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.55))" }}
                  />
                </AnimatePresence>
              </motion.div>

              {/* Bottom-left */}
              <motion.div
                className="hidden md:block"
                style={{ position: "absolute", bottom: "8%", left: "calc(-1 * clamp(80px, 11vw, 150px))", zIndex: 6, pointerEvents: "none", width: "clamp(76px, 9vw, 132px)" }}
                animate={{ y: [0, 14, 0], rotate: [10, 13, 10] }}
                transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img key={current + "-bl"} src={slidePackets[current][1]} alt=""
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ width: "100%", display: "block", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.55))" }}
                  />
                </AnimatePresence>
              </motion.div>

              {/* Top-right */}
              <motion.div
                className="hidden md:block"
                style={{ position: "absolute", top: "6%", right: "calc(-1 * clamp(90px, 12vw, 160px))", zIndex: 6, pointerEvents: "none", width: "clamp(80px, 9vw, 140px)" }}
                animate={{ y: [0, -12, 0], rotate: [16, 12, 16] }}
                transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img key={current + "-tr"} src={slidePackets[current][2]} alt=""
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ width: "100%", display: "block", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.55))" }}
                  />
                </AnimatePresence>
              </motion.div>

              {/* Bottom-right */}
              <motion.div
                className="hidden md:block"
                style={{ position: "absolute", bottom: "10%", right: "calc(-1 * clamp(75px, 10vw, 148px))", zIndex: 6, pointerEvents: "none", width: "clamp(72px, 8.5vw, 128px)" }}
                animate={{ y: [0, 16, 0], rotate: [-10, -7, -10] }}
                transition={{ duration: 8.2, repeat: Infinity, ease: "easeInOut", delay: 2.2 }}
              >
                <AnimatePresence mode="wait">
                  <motion.img key={current + "-br"} src={slidePackets[current][3]} alt=""
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    style={{ width: "100%", display: "block", filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.55))" }}
                  />
                </AnimatePresence>
              </motion.div>

              {/* Spin badge — bottom-right of product, not overlapping text */}
              <div style={{ position: "absolute", bottom: "30px", right: "-44px", zIndex: 20, display: isMobile ? "none" : "block" }}>
                <div style={{ position: "relative", width: "84px", height: "84px" }}>
                  <motion.svg
                    viewBox="0 0 100 100"
                    style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                  >
                    <defs>
                      <path id="arc-hero-text" d="M 88,50 a 38,38 0 1,0 -76,0" />
                    </defs>
                    <circle cx="50" cy="50" r="48" fill={slide.accentColor} />
                    <text
                      fill="white"
                      style={{
                        fontSize: "7.5px",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontWeight: 700,
                        letterSpacing: "2.5px",
                      }}
                    >
                      <textPath href="#arc-hero-text">{"NUTROFREEZE · SINGAPORE · "}</textPath>
                    </text>
                  </motion.svg>
                  <div
                    style={{
                      position: "absolute",
                      inset: "28px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.18)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontFamily: "'Bangers',cursive", fontSize: "12px", color: "white" }}>NF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* NEXT — right edge */}
            <motion.div
              className="absolute hidden md:block"
              style={{
                right: 0,
                top: "50%",
                translateY: "-50%",
                cursor: "pointer",
                width: "clamp(120px, 12vw, 200px)",
                height: "clamp(200px, 36vh, 430px)",
                borderRadius: "999px 999px 22px 22px",
                overflow: "hidden",
                opacity: 0.42,
                filter: "brightness(0.6) saturate(0.6)",
              }}
              whileHover={{ opacity: 0.72, scale: 1.04, x: -8 }}
              transition={{ duration: 0.2 }}
              onClick={() => goTo(nextIdx)}
            >
              <img
                src={peekImgs[nextIdx]}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
          NAV DOTS â€” outside everything, always visible
         â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */}
      <div
        style={{
          position: "absolute",
          bottom: isMobile ? "10px" : "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          gap: isMobile ? "10px" : "18px",
          alignItems: "center",
          width: "100%",
          justifyContent: "center",
          padding: isMobile ? "0 8px" : "0",
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
              alignItems: "center",
              gap: "5px",
            }}
          >
            <div
              style={{
                width: "34px",
                height: "2px",
                borderRadius: "4px",
                overflow: "hidden",
                backgroundColor: "rgba(255,255,255,0.12)",
              }}
            >
              {i === current && (
                <motion.div
                  key={slides[i].id + "prog"}
                  style={{
                    height: "100%",
                    borderRadius: "4px",
                    backgroundColor: slides[i].accentColor,
                  }}
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 5.5, ease: "linear" }}
                />
              )}
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: isMobile ? "7px" : "8px",
                fontWeight: 700,
                letterSpacing: isMobile ? "1.4px" : "2.5px",
                textTransform: "uppercase",
                color: i === current ? slides[i].accentColor : "rgba(255,255,255,0.25)",
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
