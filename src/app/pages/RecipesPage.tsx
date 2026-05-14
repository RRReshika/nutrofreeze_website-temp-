import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ChevronRight, ArrowLeft, Search, X } from "lucide-react";
import { Link } from "react-router";
import { Navbar } from "../components/Navbar";

function HeroSparkle({ top, left, right, bottom, size, delay }: {
  top?: string; left?: string; right?: string; bottom?: string; size: number; delay: number;
}) {
  return (
    <motion.div
      style={{ position: "absolute", top, left, right, bottom, width: size, height: size, zIndex: 8, pointerEvents: "none" }}
      animate={{ rotate: 360, scale: [1, 1.25, 1] }}
      transition={{ rotate: { duration: 16, repeat: Infinity, ease: "linear" }, scale: { duration: 3.5, repeat: Infinity, delay, ease: "easeInOut" } }}
    >
      <svg viewBox="0 0 47 47" fill="white" opacity={0.55}>
        <path d="M23.2496 0.345703C17.2963 12.4504 12.4733 17.2676 0.350836 23.217C12.4795 29.1664 17.3075 33.9836 23.2736 46.1089C29.2269 33.9836 34.0292 29.1664 46.1723 23.217C34.023 17.2676 29.2156 12.4504 23.2496 0.345703Z" />
      </svg>
    </motion.div>
  );
}

/* ─── Category filter config ─────────────────── */
const CATEGORIES = [
  { label: "All recipes", dot: null, icon: "♦" },
  { label: "Snacks", dot: "#f97316", icon: null },
  { label: "Meal Prep", dot: "#38bdf8", icon: null },
  { label: "Desserts", dot: "#c084fc", icon: null },
  { label: "Smoothies", dot: "#34d399", icon: null },
];

const SORT_OPTIONS = ["Default", "A - Z", "Most Popular"];
const DIETARY_FILTERS = ["Vegetarian", "Vegan", "High in Protein"];

const CARD_COLORS = [
  "#c4a000", "#7c3aed", "#0891b2", "#9f1239",
  "#0d9488", "#6d28d9", "#0369a1", "#be185d",
];

type Recipe = {
  id: number;
  name: string;
  category: string;
  time: string;
  serves: number;
  dietary: string[];
  protein: boolean;
  img: string;
  desc: string;
  rating: number;
  popular: boolean;
};

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

/* ─── Recipe Card ─────────────────────────────── */
function RecipeCard({ recipe, index, color }: { recipe: Recipe; index: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{ backgroundColor: color, minHeight: "300px" }}
      initial={{ opacity: 0, y: 50, scale: 0.93 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
      whileHover={{ y: -8, boxShadow: `0 24px 60px ${color}55` }}
    >
      <div className="absolute top-4 right-4 z-10 bg-white rounded-full px-3 py-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>
        {recipe.time}
      </div>

      {/* Circular image with zoom on hover */}
      <div className="p-5 pt-6">
        <div className="w-28 h-28 rounded-full overflow-hidden mx-auto"
          style={{ border: "4px solid rgba(255,255,255,0.25)" }}>
          <img
            src={recipe.img}
            alt={recipe.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
          />
        </div>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-1.5"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 600, color: "rgba(255,255,255,0.8)" }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="6.5" fill="rgba(255,255,255,0.25)" />
            <path d="M3.5 6.5L5.5 8.5L9.5 4.5" stroke="white" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {recipe.dietary[0]}
          {recipe.protein && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.2)", fontSize: "10px", color: "white", fontWeight: 700 }}>
              High Protein
            </span>
          )}
        </div>
      </div>

      {/* Recipe name — Bangers */}
      <div className="px-5 mt-2 mb-5">
        <h3 style={{
          fontFamily: "'Bangers', cursive",
          fontSize: "clamp(22px, 2.5vw, 30px)",
          color: "white",
          textTransform: "uppercase",
          lineHeight: 1.0,
          letterSpacing: "0.04em",
        }}>
          {recipe.name}
        </h3>
      </div>

      <div className="px-5 pb-5">
        <motion.button
          className="flex items-center gap-2 bg-white text-[#0f172a] px-5 py-2.5 rounded-full hover:bg-[#5eead4] transition-all"
          style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700, border: "none", cursor: "pointer" }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          View Recipe
          <span className="w-6 h-6 rounded-full bg-[#0f172a] flex items-center justify-center flex-shrink-0">
            <ChevronRight size={13} color="white" />
          </span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ─── Hero slider ─────────────────────────────── */
const heroRecipes = [
  {
    id: 1, label: "NUTROFREEZE RECIPES",
    name: "MIXED BERRY\nSMOOTHIE BOWL",
    product: "Mixed Berry Blend",
    desc: "Rehydrate our freeze dried mixed fruits with a splash of water, blend and top with granola. A wholesome breakfast ready in under 10 minutes.",
    img: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=600&q=90",
    bg: "#0d9488",
  },
  {
    id: 2, label: "NUTROFREEZE RECIPES",
    name: "QUICK VEGGIE\nSOUP IN MINUTES",
    product: "Freeze Dried Vegetables",
    desc: "Add our freeze dried vegetables straight into your broth and they rehydrate in minutes with all nutrients preserved.",
    img: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=600&q=90",
    bg: "#1e1b4b",
  },
  {
    id: 3, label: "NUTROFREEZE RECIPES",
    name: "BABY PUREE\nIN SECONDS",
    product: "Freeze Dried Baby Food",
    desc: "Mix our freeze dried puree powder with a little water for a smooth, nutritious meal for your baby. No fillers, pure ingredients.",
    img: "https://images.unsplash.com/photo-1711205229065-89353695a869?w=600&q=90",
    bg: "#7c1d6f",
  },
];

function DiamondIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="white" opacity={0.8}>
      <path d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5Z" />
    </svg>
  );
}

/* ─── Category Filter Bar (screenshot 3) ──────── */
function CategoryFilterBar({ active, setActive }: { active: string; setActive: (c: string) => void }) {
  return (
    <div className="flex justify-start mb-6">
      <div
        className="flex items-center gap-1 p-1.5 rounded-2xl"
        style={{ backgroundColor: "#1c1c1e" }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.label;
          return (
            <button
              key={cat.label}
              onClick={() => setActive(cat.label)}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all duration-200"
              style={{
                backgroundColor: isActive ? "white" : "transparent",
                border: isActive ? "none" : "none",
                cursor: "pointer",
              }}
            >
              {cat.icon ? (
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "14px",
                  color: isActive ? "#1c1c1e" : "rgba(255,255,255,0.7)",
                }}>
                  {cat.icon}
                </span>
              ) : (
                <span
                  className="inline-block rounded-full flex-shrink-0"
                  style={{ width: "10px", height: "10px", backgroundColor: cat.dot! }}
                />
              )}
              <span style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "17px",
                letterSpacing: "0.04em",
                color: isActive ? "#1c1c1e" : "rgba(255,255,255,0.85)",
                whiteSpace: "nowrap",
              }}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Spice Up Your Inbox ──────────────────────── */
function SpiceUpInbox() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && email) {
      setDone(true);
      setTimeout(() => setDone(false), 3500);
      setFullName(""); setEmail(""); setAgreed(false);
    }
  };

  return (
    <motion.div
      ref={ref}
      className="mt-16 rounded-3xl overflow-hidden relative text-center"
      style={{ backgroundColor: "#c4b5fd", padding: "clamp(48px, 7vw, 88px) clamp(24px, 5vw, 80px)" }}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7 }}
    >
      {/* Blob decorations */}
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-white/10 translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[#7c3aed]/15 -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10">
        {/* Big heading — matching Brars exactly */}
        <h2 style={{
          fontFamily: "'Bangers', cursive",
          fontSize: "clamp(56px, 12vw, 130px)",
          color: "#1c1c1e",
          textTransform: "uppercase",
          lineHeight: 0.88,
          letterSpacing: "0.02em",
          marginBottom: "20px",
        }}>
          SPICE UP YOUR<br />INBOX
        </h2>

        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "16px",
          color: "#1c1c1e",
          lineHeight: 1.6,
          marginBottom: "32px",
          opacity: 0.8,
          maxWidth: "500px",
          margin: "0 auto 32px",
        }}>
          Get special offers and all the latest products, recipes, and news delivered to your inbox!
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 w-full max-w-2xl mx-auto">
          {/* Three inputs in a row — exactly like Brars screenshot */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              placeholder="Full Name*"
              required
              className="flex-1 bg-white text-[#0f172a] placeholder-gray-400 rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-[#7c3aed]/30"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px" }}
            />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email Address*"
              required
              className="flex-1 bg-white text-[#0f172a] placeholder-gray-400 rounded-xl px-5 py-4 outline-none focus:ring-4 focus:ring-[#7c3aed]/30"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px" }}
            />
            <motion.button
              type="submit"
              className="flex items-center justify-center gap-2 bg-[#1c1c1e] text-white px-8 py-4 rounded-xl hover:bg-[#7c3aed] transition-all flex-shrink-0"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "15px", fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {done ? "✓ Done!" : <>Submit <span style={{ marginLeft: "4px" }}>›</span></>}
            </motion.button>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-3 text-left w-full max-w-lg">
            <div
              className="w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer border-2"
              style={{ borderColor: "#1c1c1e", backgroundColor: agreed ? "#1c1c1e" : "white" }}
              onClick={() => setAgreed(!agreed)}
            >
              {agreed && (
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <path d="M1.5 5.5L4 8L9.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </div>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#1c1c1e", opacity: 0.7, lineHeight: 1.5 }}>
              *Yes, I would like to receive updates, promotions, and offers from NutroFreeze Retail & Restaurants. I understand I can unsubscribe at any time.
            </span>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

/* ─── Dark Footer ──────────────────────────────── */
function RecipesFooter() {
  const [fname, setFname] = useState("");
  const [femail, setFemail] = useState("");
  const [fagreed, setFagreed] = useState(false);

  const navCols = [
    ["HOME", "PRODUCTS", "WHERE TO BUY", "RECIPES"],
    ["ABOUT US", "NEWS", "CONTACT US", "TERMS OF USE", "PRIVACY POLICY"],
  ];

  const socials = [
    { label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" },
    { label: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" },
    { label: "TikTok", path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" },
  ];

  return (
    <footer style={{ backgroundColor: "#0f172a", paddingTop: "60px" }}>
      {/* Brand + Hashtag centered */}
      <div className="text-center px-6 pb-10 border-b border-white/10">
        <div style={{
          fontFamily: "'Gagalin', sans-serif", fontSize: "28px", letterSpacing: "2px",
          background: "linear-gradient(135deg, #5eead4 0%, #c4b5fd 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
          marginBottom: "8px",
        }}>
          NutroFreeze
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

      {/* Grid: nav + subscribe + contact */}
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

        {/* Subscribe column */}
        <div>
          <p style={{ fontFamily: "'Bangers', cursive", fontSize: "22px", letterSpacing: "0.05em", color: "white", marginBottom: "6px" }}>SUBSCRIBE</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "16px" }}>
            Sign up for the latest updates and exclusive offers from NutroFreeze.
          </p>
          <div className="space-y-3">
            <div style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "8px" }}>
              <input type="text" value={fname} onChange={e => setFname(e.target.value)} placeholder="Full Name*"
                className="w-full bg-transparent outline-none text-white"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "white" }}
              />
            </div>
            <div className="flex items-center" style={{ borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: "8px" }}>
              <input type="email" value={femail} onChange={e => setFemail(e.target.value)} placeholder="Email Address*"
                className="flex-1 bg-transparent outline-none text-white"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "white" }}
              />
              <button style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "18px", padding: "0 4px" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#5eead4")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
              >→</button>
            </div>
            <label className="flex items-start gap-2 cursor-pointer">
              <div className="w-4 h-4 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all cursor-pointer"
                style={{ border: fagreed ? "none" : "1.5px solid rgba(255,255,255,0.35)", backgroundColor: fagreed ? "#0d9488" : "transparent" }}
                onClick={() => setFagreed(!fagreed)}>
                {fagreed && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1.5 5L3.5 7.5L8.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>}
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "11px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5 }}>
                *Yes, I would like to receive updates, promotions, and offers from NutroFreeze. I understand I can unsubscribe at any time.
              </span>
            </label>
          </div>
          <div className="flex gap-3 mt-6">
            {socials.map(s => (
              <a key={s.label} href="#" aria-label={s.label}
                style={{ color: "rgba(255,255,255,0.45)", transition: "color 0.2s" }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = "#5eead4")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)")}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: "18px", height: "18px" }}>
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Contact column */}
        <div>
          <p style={{ fontFamily: "'Bangers', cursive", fontSize: "22px", letterSpacing: "0.05em", color: "white", marginBottom: "10px" }}>CONTACT US</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
            +65 8503 9022<br />nutrofreeze@gmail.com
          </p>
          <p style={{ fontFamily: "'Bangers', cursive", fontSize: "22px", letterSpacing: "0.05em", color: "white", marginTop: "22px", marginBottom: "10px" }}>HEADQUARTERS</p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.9 }}>
            NutroFreeze Pte Ltd<br />Singapore
          </p>
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

/* ─── Main Page ────────────────────────────────── */
export function RecipesPage() {
  const [activeSort, setActiveSort] = useState("Default");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietary, setDietary] = useState<string[]>([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [activeCategory, setActiveCategory] = useState("All recipes");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoadingRecipes, setIsLoadingRecipes] = useState(true);
  const [recipesError, setRecipesError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadRecipes = async () => {
      try {
        setIsLoadingRecipes(true);
        setRecipesError(null);
        const response = await fetch(`${API_BASE_URL}/content/recipes`);
        if (!response.ok) {
          throw new Error(`Unable to load recipes (${response.status})`);
        }
        const data: Recipe[] = await response.json();
        if (isActive) {
          setRecipes(data);
        }
      } catch (error) {
        if (isActive) {
          setRecipesError(error instanceof Error ? error.message : "Unable to load recipes");
        }
      } finally {
        if (isActive) {
          setIsLoadingRecipes(false);
        }
      }
    };

    loadRecipes();

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    const t = setInterval(() => setHeroIdx(i => (i + 1) % heroRecipes.length), 5000);
    return () => clearInterval(t);
  }, []);

  const toggleDiet = (d: string) =>
    setDietary(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);

  const clearAll = () => { setSearchQuery(""); setDietary([]); setActiveCategory("All recipes"); };

  const filtered = recipes
    .filter(r => {
      if (activeCategory !== "All recipes" && r.category !== activeCategory) return false;
      if (searchQuery && !r.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (dietary.includes("High in Protein") && !r.protein) return false;
      if (dietary.filter(d => d !== "High in Protein").length > 0) {
        const ok = dietary.filter(d => d !== "High in Protein").every(d => r.dietary.includes(d));
        if (!ok) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (activeSort === "A - Z") return a.name.localeCompare(b.name);
      if (activeSort === "Most Popular") return (b.popular ? 1 : 0) - (a.popular ? 1 : 0);
      return 0;
    });

  const hero = heroRecipes[heroIdx];

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#f5f0e8" }}>

      {/* ── Navbar ── */}
      <Navbar />

      {/* ── Hero Slider ── */}
      <div className="relative overflow-hidden" style={{ height: "clamp(380px, 50vw, 560px)" }}>
        <AnimatePresence mode="wait">
          <motion.div key={hero.id} className="absolute inset-0 flex"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }} style={{ backgroundColor: hero.bg }}>

            <div className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 relative z-10">
              <div className="absolute top-8 right-8 opacity-40 hidden md:block"><DiamondIcon /></div>
              <div className="absolute bottom-12 left-6 opacity-25 hidden md:block"><DiamondIcon /></div>
              <HeroSparkle top="12%" left="5%" size={28} delay={0} />
              <HeroSparkle top="25%" left="55%" size={18} delay={0.7} />
              <HeroSparkle bottom="18%" left="40%" size={22} delay={1.2} />

              <motion.span className="mb-3 block"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 800, letterSpacing: "3px", color: "rgba(255,255,255,0.6)", textTransform: "uppercase" }}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                {hero.label}
              </motion.span>

              {/* Hero title — Bangers, very large, matching screenshot 2 weight */}
              <motion.h1
                style={{
                  fontFamily: "'Bangers', cursive",
                  fontSize: "clamp(48px, 8vw, 100px)",
                  color: "white",
                  textTransform: "uppercase",
                  lineHeight: 0.92,
                  letterSpacing: "0.03em",
                  whiteSpace: "pre-line",
                }}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, ease: [0.23, 1, 0.32, 1], duration: 0.5 }}>
                {hero.name}
              </motion.h1>

              <motion.div className="mt-4 flex items-center gap-3"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}>
                <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0"
                  style={{ border: "2px solid rgba(255,255,255,0.3)" }}>
                  <img src={hero.img} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "1px" }}>
                    Featured Product
                  </div>
                  <div style={{ fontFamily: "'Bangers', cursive", fontSize: "18px", letterSpacing: "0.04em", color: "white" }}>
                    {hero.product}
                  </div>
                </div>
              </motion.div>

              <motion.p className="mt-4 max-w-sm"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7 }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.36 }}>
                {hero.desc}
              </motion.p>

              <motion.button
                className="mt-6 self-start flex items-center gap-2 bg-white text-[#0f172a] px-7 py-3.5 rounded-full hover:bg-[#5eead4] transition-all"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 }}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                See Recipe
                <span className="w-7 h-7 rounded-full bg-[#0f172a] flex items-center justify-center flex-shrink-0">
                  <ChevronRight size={15} color="white" />
                </span>
              </motion.button>
            </div>

            {/* Right image */}
            <div className="hidden md:flex flex-1 items-center justify-center relative p-8">
              <div className="absolute rounded-full" style={{ width: "clamp(200px,28vw,360px)", height: "clamp(200px,28vw,360px)", border: "2px solid rgba(255,255,255,0.12)", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
              {[{ top: "14%", right: "10%" }, { top: "18%", left: "14%" }, { bottom: "20%", right: "8%" }, { bottom: "12%", left: "16%" }].map((pos, i) => (
                <motion.div key={i} className="absolute" style={{ ...pos }}
                  animate={{ scale: [1, 1.4, 1], rotate: [0, 15, 0] }}
                  transition={{ duration: 2.5 + i * 0.4, repeat: Infinity }}>
                  <DiamondIcon />
                </motion.div>
              ))}
              <motion.img key={hero.id + "img"} src={hero.img} alt={hero.name}
                className="rounded-2xl object-cover relative z-10"
                style={{ width: "clamp(180px,26vw,340px)", height: "clamp(200px,30vw,380px)", boxShadow: "0 30px 80px rgba(0,0,0,0.35)" }}
                initial={{ opacity: 0, scale: 0.88, x: 30 }} animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0 }} transition={{ duration: 0.52, ease: [0.23, 1, 0.32, 1] }} />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dots */}
        <div className="absolute bottom-5 left-0 right-0 flex justify-center gap-2 z-20">
          {heroRecipes.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)} style={{
              width: i === heroIdx ? "28px" : "8px", height: "8px", borderRadius: "100px",
              backgroundColor: i === heroIdx ? "white" : "rgba(255,255,255,0.35)",
              border: "none", cursor: "pointer", transition: "all 0.3s",
            }} />
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-8">

        {/* Sidebar */}
        <aside className="md:w-72 flex-shrink-0">
          <div className="rounded-xl overflow-hidden mb-3" style={{ backgroundColor: "#eee9df", border: "1px solid rgba(0,0,0,0.06)" }}>
            <div className="flex items-center px-4 py-3 gap-3">
              <Search size={16} color="#64748b" />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search"
                className="bg-transparent outline-none flex-1"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#0f172a" }} />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600"><X size={14} /></button>}
            </div>
          </div>

          <div className="rounded-xl p-5" style={{ backgroundColor: "#eee9df", border: "1px solid rgba(0,0,0,0.06)" }}>
            <h4 className="mb-4" style={{ fontFamily: "'Bangers', cursive", fontSize: "20px", letterSpacing: "0.04em", color: "#0f172a", textTransform: "uppercase" }}>
              Dietary Preference
            </h4>
            <div className="space-y-3">
              {DIETARY_FILTERS.map(d => (
                <label key={d} className="flex items-center gap-3 cursor-pointer">
                  <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ border: dietary.includes(d) ? "none" : "2px solid #d1d5db", backgroundColor: dietary.includes(d) ? "#0f172a" : "white" }}
                    onClick={() => toggleDiet(d)}>
                    {dietary.includes(d) && <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6L4.5 8.5L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>}
                  </div>
                  <span onClick={() => toggleDiet(d)} style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#374151", cursor: "pointer" }}>{d}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-6">
              <motion.button className="flex-1 py-3 rounded-full bg-[#0f172a] text-white"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Search</motion.button>
              <motion.button className="flex-1 py-3 rounded-full bg-transparent text-[#0f172a]"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, border: "2px solid #d1d5db", cursor: "pointer" }}
                onClick={clearAll} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>Clear all</motion.button>
            </div>
          </div>
        </aside>

        {/* Grid area */}
        <div className="flex-1 min-w-0">

          {/* Sort row */}
          <div className="flex items-center justify-end gap-2 mb-5">
            {SORT_OPTIONS.map(s => (
              <motion.button key={s} onClick={() => setActiveSort(s)}
                whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
                style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700,
                  padding: "10px 22px", borderRadius: "100px",
                  border: s === activeSort ? "none" : "2px solid #d1d5db",
                  backgroundColor: s === activeSort ? "#0f172a" : "white",
                  color: s === activeSort ? "white" : "#374151",
                  cursor: "pointer", transition: "all 0.2s",
                }}>{s}</motion.button>
            ))}
          </div>

          {/* ── Category Filter Bar (screenshot 3) ── */}
          <CategoryFilterBar active={activeCategory} setActive={setActiveCategory} />

          {/* Recipe grid */}
          {isLoadingRecipes && (
            <div className="py-24 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#374151" }}>
              Loading recipes...
            </div>
          )}

          {!isLoadingRecipes && recipesError && (
            <div className="py-24 text-center" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#991b1b" }}>
              {recipesError}
            </div>
          )}

          {!isLoadingRecipes && !recipesError && (
            <AnimatePresence mode="wait">
              {filtered.length > 0 ? (
                <motion.div key={activeSort + searchQuery + dietary.join() + activeCategory}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  {filtered.map((recipe, i) => (
                    <RecipeCard key={recipe.id} recipe={recipe} index={i} color={CARD_COLORS[i % CARD_COLORS.length]} />
                  ))}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 text-center">
                  <div style={{ width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "4px" }}>
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                  </div>
                  <h3 style={{ fontFamily: "'Bangers', cursive", fontSize: "32px", letterSpacing: "0.04em", color: "#0f172a", marginTop: "16px", textTransform: "uppercase" }}>
                    No Recipes Found
                  </h3>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#64748b", marginTop: "8px" }}>
                    Try a different search or filter
                  </p>
                  <button onClick={clearAll} className="mt-6 px-7 py-3 rounded-full bg-[#0f172a] text-white"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, border: "none", cursor: "pointer" }}>
                    Clear filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          )}

          {/* Spice Up Your Inbox */}
          <SpiceUpInbox />
        </div>
      </div>

      {/* Dark footer */}
      <RecipesFooter />
    </div>
  );
}