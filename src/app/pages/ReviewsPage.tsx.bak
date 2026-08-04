import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ChevronRight, ArrowLeft, Send } from "lucide-react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";
import { NewsletterSection } from "../components/NewsletterSection";
import logoTeal from "figma:asset/63f075396d2230b34317d96df2ffe4349aa76ae1.png";
import logoPurple from "figma:asset/aafaf68bfaf5334abed5fe55a7f7a8843cbf3197.png";

/* ─── Data ─────────────────────────────────────── */
const TABS = ["Latest Reviews", "Customer Reviews", "Press Reviews"];
const SORT_OPTIONS = ["Default", "Most Recent"];

type HeroSlide = {
  id: number;
  tag: string;
  title: string;
  desc: string;
  img1: string;
  img2: string;
};

type ReviewCardData = {
  id: number;
  tab: "Customer Reviews" | "Press Reviews";
  color: string;
  img: string;
  title: string;
  desc: string;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

const WIDE_CARD = {
  tag: "Customer Review",
  title: "LOADED WITH\nFLAVOUR, LIGHT\nON EFFORT",
  desc: "\"I am always on the go and I need fast, nutritious meals. NutroFreeze ready-to-eat meals have everything I need. Clean ingredients, real nutrition and ready in just minutes. I recommend it to everyone.\"",
  author: "Marcus O., Busy Parent and NutroFreeze Fan",
  img: "https://images.unsplash.com/photo-1592578630143-fac65cda7a67?w=700&q=90",
};

const SIDE_CARDS = [
  {
    id: "s1",
    color: "#7c1d6f",
    img: "https://images.unsplash.com/photo-1639771884984-88fa62ac7e19?w=400&q=80",
    title: "OUR RECIPE FOR GROWTH? VISION PLUS VALUES",
    desc: "NutroFreeze is growing while staying true to our core promise. Pure ingredients, no preservatives, real nutrition for every family.",
  },
  {
    id: "s2",
    color: "#0891b2",
    img: "https://images.unsplash.com/photo-1727041423608-c15f1a145cc2?w=400&q=80",
    title: "HELPING MORE FAMILIES EAT BETTER",
    desc: "NutroFreeze partners with community programmes to bring healthy, freeze-dried nutrition to families across Singapore.",
  },
];

/* ─── Sparkle / Diamond SVG ────────────────────── */
function Sparkle({ size = 24, color = "white" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 0L14.5 9.5L24 12L14.5 14.5L12 24L9.5 14.5L0 12L9.5 9.5Z" />
    </svg>
  );
}

/* ─── Star rating ───────────────────────────────── */
function Stars({ n = 5 }: { n?: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill={i < n ? "#facc15" : "#d1d5db"}>
          <path d="M8 1l1.8 3.6L14 5.5l-3 2.9.7 4.1L8 10.4l-3.7 2.1.7-4.1-3-2.9 4.2-.9z" />
        </svg>
      ))}
    </div>
  );
}

/* ─── Hero Slider ───────────────────────────────── */
function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [idx, setIdx] = useState(0);
  const safeIndex = slides.length ? idx % slides.length : 0;
  const slide = slides[safeIndex];

  useEffect(() => {
    setIdx(0);
  }, [slides]);

  if (!slide) {
    return (
      <div className="relative overflow-hidden" style={{ backgroundColor: "#c4b5fd", minHeight: "clamp(380px,52vw,540px)", display: "grid", placeItems: "center" }}>
        <span style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#1c1c1e" }}>Loading featured reviews...</span>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden" style={{ backgroundColor: "#c4b5fd", minHeight: "clamp(380px,52vw,540px)" }}>
      {/* decorative blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#7c3aed]/15 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      {/* Sparkles */}
      {[
        { top: "18%", right: "42%", size: 28 },
        { top: "28%", right: "36%", size: 16 },
        { bottom: "20%", right: "43%", size: 20 },
        { top: "14%", right: "18%", size: 14 },
        { bottom: "16%", right: "14%", size: 22 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ top: s.top, right: s.right, bottom: (s as any).bottom }}
          animate={{ scale: [1, 1.3, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 2.2 + i * 0.5, repeat: Infinity }}
        >
          <Sparkle size={s.size} color="white" />
        </motion.div>
      ))}

      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          className="max-w-7xl mx-auto px-8 md:px-16 h-full flex items-center relative z-10"
          style={{ minHeight: "clamp(380px,52vw,540px)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Left text */}
          <div className="flex-1 py-16">
            <motion.p
              className="mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: "13px", letterSpacing: "3px", color: "#1c1c1e", textTransform: "uppercase" }}
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            >
              {slide.tag}
            </motion.p>

            <motion.h1
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(52px, 8vw, 96px)",
                color: "#1c1c1e",
                textTransform: "uppercase",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                whiteSpace: "pre-line",
              }}
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            >
              {slide.title}
            </motion.h1>

            <motion.p
              className="mt-5 max-w-md"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#1c1c1e", lineHeight: 1.7, opacity: 0.8 }}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.28 }}
            >
              {slide.desc}
            </motion.p>

            <motion.button
              className="mt-7 flex items-center gap-2 bg-[#1c1c1e] text-white px-7 py-4 rounded-full hover:bg-[#7c3aed] transition-all"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            >
              Read More
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center">
                <ChevronRight size={15} color="white" />
              </span>
            </motion.button>
          </div>

          {/* Right angled photos */}
          <div className="hidden md:flex flex-1 items-center justify-center relative" style={{ minHeight: "400px" }}>
            {/* Background watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span style={{ fontFamily: "'Bangers', cursive", fontSize: "140px", color: "#7c3aed", whiteSpace: "nowrap" }}>★★★★★</span>
            </div>

            {/* Main photo — tilted */}
            <motion.div
              key={slide.id + "main"}
              className="relative z-20"
              style={{ transform: "rotate(3deg)", borderRadius: "16px", overflow: "hidden", width: "clamp(200px,26vw,320px)", height: "clamp(240px,30vw,380px)", boxShadow: "0 30px 70px rgba(0,0,0,0.22)" }}
              initial={{ opacity: 0, scale: 0.88, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
            >
              <img src={slide.img1} alt="" className="w-full h-full object-cover" />
            </motion.div>

            {/* Secondary photo — behind, tilted other way */}
            <motion.div
              key={slide.id + "sec"}
              className="absolute right-6 bottom-10 z-10"
              style={{ transform: "rotate(-6deg)", borderRadius: "12px", overflow: "hidden", width: "clamp(90px,10vw,130px)", height: "clamp(100px,12vw,160px)", boxShadow: "0 12px 40px rgba(0,0,0,0.25)", border: "3px solid white" }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <img src={slide.img2} alt="" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Slider dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            style={{
              width: i === safeIndex ? "28px" : "8px", height: "8px", borderRadius: "100px",
              backgroundColor: i === safeIndex ? "#1c1c1e" : "rgba(28,28,30,0.3)",
              border: "none", cursor: "pointer", transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Category Tab Bar ──────────────────────────── */
function TabBar({ active, setActive }: { active: string; setActive: (t: string) => void }) {
  return (
    <div className="flex justify-center">
      <div
        className="flex items-center gap-1 p-1.5 rounded-2xl"
        style={{ backgroundColor: "#1c1c1e" }}
      >
        {TABS.map(tab => {
          const isActive = active === tab;
          return (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className="rounded-xl px-6 py-3 transition-all duration-200"
              style={{
                backgroundColor: isActive ? "white" : "transparent",
                border: "none",
                cursor: "pointer",
              }}
            >
              <span style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "18px",
                letterSpacing: "0.04em",
                color: isActive ? "#1c1c1e" : "rgba(255,255,255,0.8)",
                whiteSpace: "nowrap",
              }}>
                {tab}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Review Card (4-column grid) ───────────────── */
function ReviewCard({ card, index }: { card: ReviewCardData; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="rounded-2xl overflow-hidden cursor-pointer group flex flex-col"
      style={{ backgroundColor: card.color }}
      initial={{ opacity: 0, y: 48, scale: 0.94 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8, boxShadow: `0 24px 60px ${card.color}55` }}
    >
      {/* Image top half */}
      <div className="overflow-hidden" style={{ height: "clamp(140px,15vw,200px)" }}>
        <img
          src={card.img}
          alt={card.title}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <Stars n={5} />
        <h3
          className="mt-3"
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: "clamp(20px, 2vw, 26px)",
            color: "white",
            textTransform: "uppercase",
            lineHeight: 1.05,
            letterSpacing: "0.03em",
          }}
        >
          {card.title}
        </h3>
        <p
          className="mt-2 flex-1"
          style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65 }}
        >
          {card.desc}
        </p>
        <motion.button
          className="mt-4 self-start flex items-center gap-2 bg-white text-[#0f172a] px-5 py-2.5 rounded-full hover:bg-[#5eead4] transition-all"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
        >
          Read more
          <span className="w-5 h-5 rounded-full bg-[#0f172a] flex items-center justify-center flex-shrink-0">
            <ChevronRight size={11} color="white" />
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Wide Card + 2 Side Cards ──────────────────── */
function FeaturedSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className="flex flex-col md:flex-row gap-4 mt-6"
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
    >
      {/* Wide left card */}
      <div
        className="flex-1 relative rounded-2xl overflow-hidden group cursor-pointer"
        style={{ minHeight: "clamp(320px, 40vw, 520px)" }}
      >
        <img
          src={WIDE_CARD.img}
          alt={WIDE_CARD.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 50%, transparent 100%)" }} />

        <div className="absolute inset-0 flex flex-col justify-end p-8 z-10">
          {/* Tag */}
          <span
            className="self-start mb-3 px-3 py-1 rounded-full"
            style={{ backgroundColor: "#5eead4", fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 800, color: "#0f172a", letterSpacing: "1.5px", textTransform: "uppercase" }}
          >
            ✓ {WIDE_CARD.tag}
          </span>
          <Stars n={5} />
          <h2
            className="mt-2"
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(30px, 4.5vw, 52px)",
              color: "white",
              textTransform: "uppercase",
              lineHeight: 0.95,
              letterSpacing: "0.03em",
              whiteSpace: "pre-line",
            }}
          >
            {WIDE_CARD.title}
          </h2>
          <p
            className="mt-3 max-w-md"
            style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.8)", lineHeight: 1.65 }}
          >
            {WIDE_CARD.desc}
          </p>
          <p
            className="mt-2"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.55)", fontWeight: 600 }}
          >
            {WIDE_CARD.author}
          </p>
          <motion.button
            className="mt-5 self-start flex items-center gap-2 bg-white text-[#0f172a] px-6 py-3 rounded-full hover:bg-[#5eead4] transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          >
            View Review
            <span className="w-6 h-6 rounded-full bg-[#0f172a] flex items-center justify-center flex-shrink-0">
              <ChevronRight size={13} color="white" />
            </span>
          </motion.button>
        </div>
      </div>

      {/* Right two stacked cards */}
      <div className="flex flex-row md:flex-col gap-4 md:w-64 lg:w-80 flex-shrink-0">
        {SIDE_CARDS.map(sc => (
          <div
            key={sc.id}
            className="flex-1 rounded-2xl overflow-hidden cursor-pointer group relative"
            style={{ backgroundColor: sc.color, minHeight: "clamp(150px,20vw,240px)" }}
          >
            {/* Image top */}
            <div className="overflow-hidden" style={{ height: "clamp(90px,10vw,140px)" }}>
              <img
                src={sc.img}
                alt={sc.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            <div className="p-4">
              <h3
                style={{
                  fontFamily: "'Bangers', cursive",
                  fontSize: "clamp(17px, 2vw, 22px)",
                  color: "white",
                  textTransform: "uppercase",
                  lineHeight: 1.05,
                  letterSpacing: "0.03em",
                }}
              >
                {sc.title}
              </h3>
              <p
                className="mt-1.5"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.75)", lineHeight: 1.55 }}
              >
                {sc.desc}
              </p>
              <motion.button
                className="mt-3 flex items-center gap-1.5 bg-white text-[#0f172a] px-4 py-2 rounded-full hover:bg-[#5eead4] transition-all"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, border: "none", cursor: "pointer" }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
              >
                Read more
                <span className="w-5 h-5 rounded-full bg-[#0f172a] flex items-center justify-center flex-shrink-0">
                  <ChevronRight size={11} color="white" />
                </span>
              </motion.button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Interactive Newsletter / Inbox Section ─────── */
function FreezeYourInbox() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && agreed) setSubmitted(true);
  };

  return (
    /* ── Outer section: cream page background (same as Brars) ── */
    <div
      ref={ref}
      style={{
        backgroundColor: "#faf6f0",
        position: "relative",
        overflow: "hidden",
        paddingTop: "130px",
        paddingBottom: "100px",
      }}
    >
      {/* ── Large animated dark character/blob silhouette behind the card ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(580px, 85vw)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{ y: [0, -16, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 580 640" fill="#1c1c1e" xmlns="http://www.w3.org/2000/svg">
            {/* Left ear bump */}
            <ellipse cx="148" cy="110" rx="65" ry="72" />
            {/* Right ear bump */}
            <ellipse cx="432" cy="110" rx="65" ry="72" />
            {/* Head dome */}
            <ellipse cx="290" cy="178" rx="155" ry="158" />
            {/* Neck bridge */}
            <rect x="188" y="300" width="204" height="56" rx="14" />
            {/* Body */}
            <path d="M 52,346 C 28,410 22,486 48,546 C 72,598 152,634 290,636 C 428,634 508,598 532,546 C 558,486 552,410 528,346 C 488,314 394,302 290,302 C 186,302 92,314 52,346 Z" />
          </svg>
        </motion.div>
      </div>

      {/* ── Yellow starburst badge – left of card ── */}
      <div
        className="hidden lg:block"
        style={{
          position: "absolute",
          left: "max(16px, calc(50% - 510px))",
          top: "55%",
          transform: "translateY(-50%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
          style={{ width: "128px", height: "128px", position: "relative" }}
        >
          <svg viewBox="0 0 128 128" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <polygon
              points="64,4 69,49 102,20 78,52 118,50 88,66 118,80 78,78 100,110 69,82 64,124 59,82 28,110 50,78 10,80 40,66 10,50 50,52 26,20 59,49"
              fill="#facc15"
            />
          </svg>
          <div style={{
            position: "absolute", inset: "26px", borderRadius: "50%",
            backgroundColor: "#facc15",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
          }}>
            <span style={{
              fontFamily: "'Bangers', cursive", fontSize: "13px",
              color: "#1c1c1e", textAlign: "center",
              lineHeight: 1.2, letterSpacing: "0.5px",
            }}>
              EST.<br />2024
            </span>
          </div>
        </motion.div>
      </div>

      {/* ── Lavender card – centered, in front of blob ── */}
      <div style={{ position: "relative", zIndex: 5, maxWidth: "880px", margin: "0 auto", padding: "0 20px" }}>
        <div style={{
          backgroundColor: "#c4b5fd",
          borderRadius: "36px",
          padding: "clamp(44px,6vw,72px) clamp(28px,5vw,68px) clamp(44px,6vw,64px)",
          position: "relative",
        }}>

          {/* ── Rotating circular badge – overlapping top-right corner ── */}
          <div style={{
            position: "absolute", top: "-60px", right: "-44px", zIndex: 20,
            pointerEvents: "none",
          }}>
            <div style={{ position: "relative", width: "136px", height: "136px" }}>
              <motion.svg
                viewBox="0 0 136 136"
                style={{ width: "100%", height: "100%" }}
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              >
                <defs>
                  <path id="arc-nf3" d="M 122,68 a 54,54 0 1,0 -108,0" />
                </defs>
                <circle cx="68" cy="68" r="67" fill="#7c3aed" />
                <text fill="white" style={{ fontSize: "10.5px", fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, letterSpacing: "2.6px" }}>
                  <textPath href="#arc-nf3">NUTROFREEZE · MADE IN SINGAPORE · </textPath>
                </text>
              </motion.svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontFamily: "'Bangers', cursive", fontSize: "16px", color: "#7c3aed", letterSpacing: "0.5px" }}>NF</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Heading ── */}
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.65, ease: [0.23, 1, 0.32, 1] }}
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(58px, 11vw, 122px)",
              color: "#1c1c1e",
              textTransform: "uppercase",
              lineHeight: 0.88,
              letterSpacing: "0.02em",
              marginBottom: "22px",
            }}
          >
            FREEZE YOUR<br />INBOX
          </motion.h2>

          {/* ── Subtitle ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.18, duration: 0.5 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: "clamp(14px, 1.8vw, 17px)",
              color: "#1c1c1e",
              lineHeight: 1.7,
              marginBottom: "32px",
              maxWidth: "560px",
            }}
          >
            Get special offers and all the latest products, recipes, and reviews delivered to your inbox!
          </motion.p>

          {/* ── Form – matches Brars layout exactly ── */}
          {!submitted ? (
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.28, duration: 0.5 }}
            >
              {/* Inputs + Submit row */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "stretch" }}>
                <input
                  type="text"
                  placeholder="Full Name*"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  style={{
                    flex: "1 1 160px",
                    padding: "16px 20px",
                    borderRadius: "10px",
                    border: "1.5px solid #d1d5db",
                    backgroundColor: "white",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    color: "#374151",
                    outline: "none",
                  }}
                />
                <input
                  type="email"
                  placeholder="Email Address*"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    flex: "1 1 200px",
                    padding: "16px 20px",
                    borderRadius: "10px",
                    border: "1.5px solid #d1d5db",
                    backgroundColor: "white",
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "15px",
                    color: "#374151",
                    outline: "none",
                  }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04, backgroundColor: "#333" }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    padding: "16px 28px",
                    borderRadius: "10px",
                    backgroundColor: "#1c1c1e",
                    color: "white",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    flexShrink: 0,
                    transition: "background-color 0.2s",
                  }}
                >
                  Submit
                  <span style={{
                    width: "30px", height: "30px", borderRadius: "50%",
                    backgroundColor: "white",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Send size={13} color="#1c1c1e" />
                  </span>
                </motion.button>
              </div>

              {/* Checkbox */}
              <div style={{ display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "18px" }}>
                <input
                  type="checkbox"
                  id="nf-agree"
                  checked={agreed}
                  onChange={e => setAgreed(e.target.checked)}
                  style={{
                    marginTop: "3px", cursor: "pointer",
                    accentColor: "#7c3aed",
                    width: "15px", height: "15px", flexShrink: 0,
                  }}
                />
                <label htmlFor="nf-agree" style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "12px",
                  color: "rgba(28,28,30,0.72)",
                  lineHeight: 1.65,
                  cursor: "pointer",
                }}>
                  *Yes, I would like to receive updates, promotions, and offers from NutroFreeze's Retail &amp; Restaurants. I understand I can unsubscribe at any time.
                </label>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              style={{ paddingTop: "10px" }}
            >
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#0d9488", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px", marginLeft: "auto", marginRight: "auto" }}>
                <span style={{ fontFamily: "'Bangers', cursive", fontSize: "22px", color: "white", letterSpacing: "1px" }}>NF</span>
              </div>
              <h3 style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(38px, 6vw, 62px)",
                color: "#1c1c1e",
                letterSpacing: "0.03em",
                marginBottom: "10px",
              }}>
                YOU'RE IN THE FREEZER!
              </h3>
              <p style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: "16px",
                color: "rgba(28,28,30,0.75)",
              }}>
                Thanks {name}! Exclusive NutroFreeze deals are heading your way.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Footer (same as Recipes) ──────────────────── */
function ReviewsFooter() {
  const navCols = [
    ["HOME", "PRODUCTS", "WHERE TO BUY", "RECIPES"],
    ["ABOUT US", "REVIEWS", "CONTACT US", "TERMS OF USE", "PRIVACY POLICY"],
  ];
  const socials = [
    { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
    { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
    { label: "TikTok", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
  ];

  return (
    <footer style={{ backgroundColor: "#0f172a", paddingTop: "60px" }}>
      <div className="text-center px-6 pb-10 border-b border-white/10">
        <div className="flex justify-center mb-4">
          <img src={logoTeal} alt="NutroFreeze" style={{ height: "32px", width: "auto", objectFit: "contain" }} />
        </div>
        <h2 style={{
          fontFamily: "'Bangers', cursive",
          fontSize: "clamp(32px, 7vw, 88px)",
          color: "#5eead4",
          textTransform: "uppercase",
          lineHeight: 0.95,
          letterSpacing: "0.03em",
        }}>
          #FROZENFLAVOUR<span style={{ color: "#c4b5fd" }}>DONEBETTER</span>
        </h2>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {navCols.map((col, ci) => (
          <div key={ci}>
            <ul className="space-y-2.5">
              {col.map(item => (
                <li key={item}>
                  <Link to="/"
                    style={{ fontFamily: "'Bangers', cursive", fontSize: "20px", letterSpacing: "0.05em", color: "rgba(255,255,255,0.7)", textDecoration: "none", display: "block", transition: "color 0.2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#5eead4")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                  >{item}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <p style={{ fontFamily: "'Bangers', cursive", fontSize: "22px", letterSpacing: "0.05em", color: "white", marginBottom: "10px" }}>CONTACT US</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
            +65 8503 9022<br />nutrofreeze@gmail.com
          </p>
        </div>
        <div>
          <p style={{ fontFamily: "'Bangers', cursive", fontSize: "22px", letterSpacing: "0.05em", color: "white", marginBottom: "10px" }}>FOLLOW US</p>
          <div className="flex gap-4 mt-2">
            {socials.map(s => (
              <a key={s.label} href="#" aria-label={s.label}
                style={{ color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#5eead4")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "20px", height: "20px" }}>
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
          © 2026 NutroFreeze. All rights reserved.
        </span>
        <Link to="/" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "rgba(255,255,255,0.3)", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
          <ArrowLeft size={13} /> Back to Home
        </Link>
      </div>
    </footer>
  );
}

/* ─── Main Page ─────────────────────────────────── */
export function ReviewsPage() {
  const [activeTab, setActiveTab] = useState("Latest Reviews");
  const [activeSort, setActiveSort] = useState("Default");
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [reviewCards, setReviewCards] = useState<ReviewCardData[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadReviewContent = async () => {
      try {
        setIsLoadingReviews(true);
        setReviewsError(null);

        const [heroResponse, cardsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/content/reviews/hero`),
          fetch(`${API_BASE_URL}/content/reviews/cards`),
        ]);

        if (!heroResponse.ok || !cardsResponse.ok) {
          throw new Error(`Unable to load reviews (${heroResponse.status}/${cardsResponse.status})`);
        }

        const [heroData, cardsData]: [HeroSlide[], ReviewCardData[]] = await Promise.all([
          heroResponse.json(),
          cardsResponse.json(),
        ]);

        if (isActive) {
          setHeroSlides(heroData);
          setReviewCards(cardsData);
        }
      } catch (error) {
        if (isActive) {
          setReviewsError(error instanceof Error ? error.message : "Unable to load review content");
        }
      } finally {
        if (isActive) {
          setIsLoadingReviews(false);
        }
      }
    };

    loadReviewContent();

    return () => {
      isActive = false;
    };
  }, []);

  const filtered = reviewCards
    .filter(c => activeTab === "Latest Reviews" || c.tab === activeTab)
    .sort((a, b) => {
      if (activeSort === "Most Recent") return b.id - a.id;
      return 0;
    });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f0e8", overflowX: "hidden" }}>
      <Navbar />

      {/* ── Hero Slider ── */}
      <HeroSlider slides={heroSlides} />

      {/* ── Tab Bar (floats below hero just like Brars screenshot) ── */}
      <div className="flex flex-col items-center py-8 gap-6 px-4" style={{ backgroundColor: "#f5f0e8" }}>
        <TabBar active={activeTab} setActive={setActiveTab} />
      </div>

      {/* ── Sort + Cards ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {/* Sort buttons */}
        <div className="flex justify-end gap-2 mb-7">
          {SORT_OPTIONS.map(s => (
            <motion.button
              key={s}
              onClick={() => setActiveSort(s)}
              whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
              style={{
                fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700,
                padding: "10px 26px", borderRadius: "100px",
                backgroundColor: s === activeSort ? "#0f172a" : "white",
                color: s === activeSort ? "white" : "#374151",
                border: s === activeSort ? "none" : "2px solid #d1d5db",
                cursor: "pointer", transition: "all 0.2s",
              }}
            >
              {s}
            </motion.button>
          ))}
        </div>

        {/* 4-column card grid */}
        {isLoadingReviews && (
          <div className="py-20 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#374151" }}>
            Loading reviews...
          </div>
        )}

        {!isLoadingReviews && reviewsError && (
          <div className="py-20 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#991b1b" }}>
            {reviewsError}
          </div>
        )}

        {!isLoadingReviews && !reviewsError && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + activeSort}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filtered.map((card, i) => (
                <ReviewCard key={card.id} card={card} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* ── Wide + 2 side cards (screenshot 3 layout) ── */}
        <FeaturedSection />
      </div>

      {/* ── FREEZE YOUR INBOX newsletter ── */}
      <NewsletterSection />

      <ReviewsFooter />
    </div>
  );
}