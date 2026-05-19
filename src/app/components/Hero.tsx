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

const slides = [
  {
    id: 1,
    category: "FREEZE DRIED",
    subcategory: "FRUITS",
    productName: "MIXED\nBERRY BLEND",
    tagline: "97% nutrients preserved. No additives, no preservatives.",
    bgColor: "#08061a",
    accentColor: "#c4b5fd",
    blobColor: "rgba(124,58,237,0.22)",
    // TODO: Replace with actual NutroFreeze Berry Blend product packet photo
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
    blobColor: "rgba(13,148,136,0.22)",
    // TODO: Replace with actual NutroFreeze Broccoli product packet photo
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
    blobColor: "rgba(217,70,239,0.18)",
    // TODO: Replace with actual NutroFreeze Sweet Potato product packet photo
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
    blobColor: "rgba(13,148,136,0.22)",
    // TODO: Replace with actual NutroFreeze ready meal product packet photo
    img: "https://images.unsplash.com/photo-1679279726937-122c49626802?w=900&q=90",
    tags: ["Complete Nutrition", "No Cooking", "Halal Certified"],
  },
];

// Crossfade: entering panel fades/scales in over exiting one â€” no horizontal slide clash
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

// Static sparkles â€” rendered once, outside AnimatePresence so they never restart
const bgSparkles = [
  { top: "13%", left: "14%", size: 15, delay: 0, dur: 5.2 },
  { top: "8%", left: "66%", size: 10, delay: 1.5, dur: 6.4 },
  { top: "68%", left: "84%", size: 12, delay: 0.7, dur: 7.1 },
  { top: "27%", left: "81%", size: 7, delay: 3.2, dur: 5.0 },
];
// Per-slide packet images [TL, BL, TR, BR]
const BIG = "/images/big%20packets%20no%20background";
const slidePackets: [string, string, string, string][] = [
  [ // slide 0 — purple / berry
    `${BIG}/WB_Blueberry_Front_-removebg-preview.png`,
    `${BIG}/WB_strawberry_front-removebg-preview.png`,
    `${BIG}/WB_pineapple_front-removebg-preview.png`,
    `${BIG}/WB_raspberry_front-removebg-preview.png`,
  ],
  [ // slide 1 — teal / vegetable
    `${BIG}/PC_Carrot-removebg-preview.png`,
    `${BIG}/WB_corn_front-removebg-preview.png`,
    `${BIG}/WB_Peas_front-removebg-preview.png`,
    `${BIG}/WB_Zucchini_front-removebg-preview.png`,
  ],
  [ // slide 2 — pink / tropical
    `${BIG}/WB_Mango_front-removebg-preview.png`,
    `${BIG}/WB_Papaya_Front-removebg-preview.png`,
    `${BIG}/WB_Banana_front-removebg-preview.png`,
    `${BIG}/WB_Kiwi_front-removebg-preview.png`,
  ],
  [ // slide 3 — teal / hearty
    `${BIG}/WB_potato_front-removebg-preview.png`,
    `${BIG}/WB_Bitter_Gourd_Front_-removebg-preview.png`,
    `${BIG}/WB_Red_bell_pepper_front-removebg-preview.png`,
    `${BIG}/WB_Amla_Front-removebg-preview.png`,
  ],
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
        height: "calc(100vh - 72px)",
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
          width: "min(74vw, 920px)",
          height: "min(74vw, 920px)",
          borderRadius: "50%",
          filter: "blur(8px)",
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

      {/* Floating product packets — bob containers stay mounted; only the img src crossfades */}
      {/* Top-left */}
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        style={{ left: "2%", top: "8%", zIndex: 2, rotate: -12, width: "clamp(100px, 11vw, 170px)" }}
        animate={{ y: [0, -18, 0], rotate: [-12, -9, -12] }}
        transition={{ duration: 6.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <AnimatePresence mode="wait">
          <motion.img key={current + "-tl"} src={slidePackets[current][0]} alt=""
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ width: "100%", display: "block", filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.5))" }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Bottom-left */}
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        style={{ left: "5%", bottom: "12%", zIndex: 2, rotate: 8, width: "clamp(90px, 10vw, 155px)" }}
        animate={{ y: [0, 16, 0], rotate: [8, 11, 8] }}
        transition={{ duration: 7.8, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
      >
        <AnimatePresence mode="wait">
          <motion.img key={current + "-bl"} src={slidePackets[current][1]} alt=""
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ width: "100%", display: "block", filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.5))" }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Top-right */}
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        style={{ right: "3%", top: "6%", zIndex: 2, rotate: 14, width: "clamp(95px, 10.5vw, 162px)" }}
        animate={{ y: [0, -14, 0], rotate: [14, 11, 14] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
      >
        <AnimatePresence mode="wait">
          <motion.img key={current + "-tr"} src={slidePackets[current][2]} alt=""
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ width: "100%", display: "block", filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.5))" }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Bottom-right */}
      <motion.div
        className="absolute pointer-events-none hidden md:block"
        style={{ right: "4%", bottom: "14%", zIndex: 2, rotate: -9, width: "clamp(88px, 9.8vw, 150px)" }}
        animate={{ y: [0, 20, 0], rotate: [-9, -6, -9] }}
        transition={{ duration: 8.4, repeat: Infinity, ease: "easeInOut", delay: 2.6 }}
      >
        <AnimatePresence mode="wait">
          <motion.img key={current + "-br"} src={slidePackets[current][3]} alt=""
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            style={{ width: "100%", display: "block", filter: "drop-shadow(0 14px 28px rgba(0,0,0,0.5))" }}
          />
        </AnimatePresence>
      </motion.div>

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
          {/* â”€â”€ TOP: category label + headline â”€â”€ */}
          <div
            style={{
              flexShrink: 0,
              textAlign: "center",
              paddingTop: "clamp(20px, 2.8vw, 44px)",
              paddingLeft: "24px",
              paddingRight: "24px",
            }}
          >
            <p
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: "5px",
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
                fontSize: "clamp(48px, 7vw, 110px)",
                color: "white",
                lineHeight: 0.9,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                margin: 0,
                whiteSpace: "pre-line",
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
              paddingBottom: "44px",
            }}
          >
            {/* PREV â€” left edge */}
            <motion.div
              className="absolute hidden md:block"
              style={{
                left: 0,
                top: "50%",
                translateY: "-50%",
                cursor: "pointer",
                width: "clamp(100px, 10vw, 168px)",
                height: "clamp(168px, 30vh, 360px)",
                borderRadius: "999px 999px 22px 22px",
                overflow: "hidden",
                opacity: 0.32,
                filter: "brightness(0.55) saturate(0.5)",
              }}
              whileHover={{ opacity: 0.62, scale: 1.04, x: 8 }}
              transition={{ duration: 0.2 }}
              onClick={() => goTo(prevIdx)}
            >
              <img
                src={slides[prevIdx].img}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </motion.div>

            {/* CENTER: spin badge + sparkle + arch frame */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              {/* Spin badge */}
              <div style={{ position: "absolute", top: "18px", left: "-40px", zIndex: 20 }}>
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
                      <textPath href="#arc-hero-text">{"NUTROFREEZE \u00B7 SINGAPORE \u00B7\u00A0"}</textPath>
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
                    <span style={{ fontFamily: "'Bangers',cursive", fontSize: "12px", color: "white" }}>
                      NF
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkle beside arch */}
              <motion.div
                style={{
                  position: "absolute",
                  top: "14%",
                  right: "-22px",
                  zIndex: 20,
                  pointerEvents: "none",
                }}
                animate={{ rotate: [0, 18, -12, 0], scale: [1, 1.15, 0.9, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkle size={28} color={slide.accentColor} opacity={0.85} />
              </motion.div>

              {/* Arch frame â€” standing-pouch proportions */}
              {/* TODO: Replace slide.img with actual NutroFreeze product packet photo per slide */}
              <div
                style={{
                  width: "clamp(180px, 18vw, 270px)",
                  height: "clamp(300px, 46vh, 440px)",
                  borderRadius: "999px 999px 20px 20px",
                  overflow: "hidden",
                  boxShadow: `0 32px 72px rgba(0,0,0,0.5), 0 0 0 2px ${slide.accentColor}40, 0 0 48px ${slide.accentColor}18`,
                }}
              >
                <img
                  src={slide.img}
                  alt={slide.productName}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
              </div>
            </div>

            {/* NEXT â€” right edge */}
            <motion.div
              className="absolute hidden md:block"
              style={{
                right: 0,
                top: "50%",
                translateY: "-50%",
                cursor: "pointer",
                width: "clamp(100px, 10vw, 168px)",
                height: "clamp(168px, 30vh, 360px)",
                borderRadius: "999px 999px 22px 22px",
                overflow: "hidden",
                opacity: 0.32,
                filter: "brightness(0.55) saturate(0.5)",
              }}
              whileHover={{ opacity: 0.62, scale: 1.04, x: -8 }}
              transition={{ duration: 0.2 }}
              onClick={() => goTo(nextIdx)}
            >
              <img
                src={slides[nextIdx].img}
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
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 50,
          display: "flex",
          gap: "18px",
          alignItems: "center",
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
                fontSize: "8px",
                fontWeight: 700,
                letterSpacing: "2.5px",
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
