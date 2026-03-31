import { useState } from "react";
import { motion } from "motion/react";

const CATEGORIES = [
  { label: "Most Popular", color: "#6D28D9" },
  { label: "Fruits",       color: "#d97706" },
  { label: "Vegetables",   color: "#16a34a" },
  { label: "Baby Food",    color: "#db2777" },
  { label: "Gym Food",     color: "#2563eb" },
];

const products = [
  { id: 1, name: "MIXED BERRY BLEND",   category: "Fruits",     weight: "600g", dietary: ["Vegan", "Vegetarian", "Gelatin Free"], img: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=700&q=90" },
  { id: 2, name: "MANGO CHUNKS",        category: "Fruits",     weight: "500g", dietary: ["Vegan", "Halal", "Gluten Free"],       img: "https://images.unsplash.com/photo-1667889244854-364252b3c14a?w=700&q=90" },
  { id: 3, name: "BROCCOLI FLORETS",    category: "Vegetables", weight: "750g", dietary: ["Vegan", "Vegetarian", "Gluten Free"], img: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=700&q=90" },
  { id: 4, name: "SPINACH & GREENS",    category: "Vegetables", weight: "400g", dietary: ["Vegan", "Vegetarian", "Halal"],       img: "https://images.unsplash.com/photo-1595265185654-f7b3c41c9a57?w=700&q=90" },
  { id: 5, name: "SWEET POTATO PURÉE",  category: "Baby Food",  weight: "300g", dietary: ["Vegan", "Vegetarian", "Gelatin Free"],img: "https://images.unsplash.com/photo-1711205229065-89353695a869?w=700&q=90" },
  { id: 6, name: "MIXED VEG PURÉE",     category: "Baby Food",  weight: "300g", dietary: ["Vegan", "Vegetarian", "Halal"],       img: "https://images.unsplash.com/photo-1473340186413-a68ba9c2564e?w=700&q=90" },
  { id: 7, name: "PROTEIN QUINOA BOWL", category: "Gym Food",   weight: "500g", dietary: ["Vegan", "Vegetarian", "Gluten Free"], img: "https://images.unsplash.com/photo-1679279726937-122c49626802?w=700&q=90" },
  { id: 8, name: "LEAN POWER PACK",     category: "Gym Food",   weight: "600g", dietary: ["Vegan", "Halal", "Gelatin Free"],     img: "https://images.unsplash.com/photo-1687041568037-dab13851ea14?w=700&q=90" },
];

const TICKER_ITEMS = [
  "FROZEN GOODNESS", "HALAL CERTIFIED", "NO PRESERVATIVES",
  "VEGAN FRIENDLY",  "PREMIUM QUALITY", "NUTRITIOUS & DELICIOUS",
];

// ── Scrolling ticker ─────────────────────────────────────────────────
function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ overflow: "hidden", backgroundColor: "#2e1065", padding: "13px 0", whiteSpace: "nowrap" }}>
      <motion.div
        style={{ display: "inline-flex" }}
        animate={{ x: ["0%", `-${100 / 4}%`] }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "15px", letterSpacing: "2.5px", color: "#e9d5ff",
              display: "inline-flex", alignItems: "center", gap: "16px", paddingRight: "44px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#a78bfa", display: "inline-block", flexShrink: 0 }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Elegant Pinwheel — 4 smooth curved swept blades ──────────────────
function Pinwheel({ color = "#a78bfa", size = 370 }: { color?: string; size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.44;

  // A single swept blade: starts at center, curves outward with a nice arc
  // Defined in local space (origin = center), then translated
  const bx1 = -0.22 * r, by1 = 0.12 * r;  // control point 1
  const bx2 = 0.04 * r,  by2 = 0.82 * r;  // control point 2
  const ex  = 0.42 * r,  ey  = 0.62 * r;  // blade tip
  const bx3 = 0.78 * r,  by3 = 0.42 * r;  // control point 3
  const bx4 = 0.48 * r,  by4 = -0.08 * r; // control point 4

  // Relative-to-center path
  const localPath = `M 0 0 C ${bx1} ${by1}, ${bx2} ${by2}, ${ex} ${ey} C ${bx3} ${by3}, ${bx4} ${by4}, 0 0 Z`;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: "block" }}>
      <g transform={`translate(${cx},${cy})`}>
        {[0, 90, 180, 270].map((deg, i) => (
          <path
            key={i}
            d={localPath}
            fill={color}
            opacity={i % 2 === 0 ? 0.92 : 0.78}
            transform={`rotate(${deg})`}
          />
        ))}
        {/* Center cap */}
        <circle cx={0} cy={0} r={r * 0.10} fill={color} opacity={1} />
        <circle cx={0} cy={0} r={r * 0.05} fill="white" opacity={0.6} />
      </g>
    </svg>
  );
}

// ── Animated pinwheel wrapper ─────────────────────────────────────────
function AnimatedPinwheel({ color, size, isHovered }: { color: string; size: number; isHovered: boolean }) {
  return (
    <motion.div
      animate={isHovered ? { rotate: 90, scale: 1.06 } : { rotate: 0, scale: 1 }}
      transition={isHovered
        ? { duration: 0.5, ease: [0.34, 1.56, 0.64, 1] }
        : { duration: 0.6, ease: "easeOut" }
      }
    >
      <Pinwheel color={color} size={size} />
    </motion.div>
  );
}

// ── Diamond pill bullet ──────────────────────────────────────────────
function Diamond({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill={color}>
      <polygon points="7,0 14,7 7,14 0,7" />
    </svg>
  );
}

// ── Dietary tag ──────────────────────────────────────────────────────
function DietaryTag({ label }: { label: string }) {
  return (
    <span className="flex items-center gap-1.5" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "14px", letterSpacing: "1px", color: "#111", whiteSpace: "nowrap" }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#f97316" />
        <path d="M4.5 8l2.5 2.5 4.5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  );
}

// ── Slot config ──────────────────────────────────────────────────────
const SLOTS = [-1, 0, 1] as const;
type SlotOffset = typeof SLOTS[number];

// pinwheelSize is bigger than imgW so blades peek out around the image
const SLOT_CONFIG: Record<SlotOffset, {
  imgW: number; imgH: number;
  nameSize: number; zIndex: number;
  showTags: boolean; pinwheelSize: number;
}> = {
  "-1": { imgW: 295, imgH: 250, nameSize: 24, zIndex: 2, showTags: false, pinwheelSize: 390 },
   "0": { imgW: 340, imgH: 285, nameSize: 34, zIndex: 5, showTags: true,  pinwheelSize: 440 },
   "1": { imgW: 295, imgH: 250, nameSize: 24, zIndex: 2, showTags: false, pinwheelSize: 390 },
};

export function Products() {
  const [activeCategory, setActiveCategory] = useState("Most Popular");
  const [centerIdx, setCenterIdx] = useState(0);
  const [hoveredSlot, setHoveredSlot] = useState<SlotOffset | null>(null);

  const filtered = products.filter(p => activeCategory === "Most Popular" || p.category === activeCategory);
  const safeCenter = centerIdx % filtered.length;

  const navigate = (dir: 1 | -1) =>
    setCenterIdx(i => (i + dir + filtered.length) % filtered.length);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCenterIdx(0);
  };

  const slotProducts = SLOTS.map(offset => {
    const idx = ((safeCenter + offset) % filtered.length + filtered.length) % filtered.length;
    return { offset, product: filtered[idx] };
  });

  const activeCatColor = CATEGORIES.find(c => c.label === activeCategory)?.color || "#6D28D9";

  return (
    <section id="products" style={{ backgroundColor: "#0d9488", padding: "48px 24px 64px", minHeight: "100vh" }}>
      {/* ── Rounded cream card ── */}
      <div style={{ backgroundColor: "#f6f3eb", borderRadius: "24px", overflow: "hidden", maxWidth: "1100px", margin: "0 auto", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>

        {/* Purple ticker at top of card */}
        <Ticker />

        {/* Category pills */}
        <div style={{ paddingTop: "36px", paddingBottom: "20px", display: "flex", justifyContent: "center", paddingLeft: "24px", paddingRight: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap", justifyContent: "center" }}>
            {CATEGORIES.map((cat, i) => {
              const isActive = activeCategory === cat.label;
              return (
                <motion.button
                  key={cat.label}
                  onClick={() => handleCategoryChange(cat.label)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  style={{
                    display: "flex", alignItems: "center", gap: "9px",
                    padding: isActive ? "10px 26px" : "10px 18px",
                    borderRadius: isActive ? "12px" : "0px",
                    border: "none", cursor: "pointer",
                    fontFamily: "'Gagalin', sans-serif", fontSize: "17px", letterSpacing: "0.5px",
                    backgroundColor: isActive ? "#1a1a1a" : "transparent",
                    color: isActive ? "white" : "#1a1a1a",
                    transition: "all 0.2s",
                    boxShadow: isActive ? "0 6px 20px rgba(0,0,0,0.18)" : "none",
                  }}
                >
                  <Diamond color={isActive ? "white" : cat.color} />
                  {cat.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ── Carousel ── */}
        <div style={{ paddingBottom: "52px", paddingTop: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "28px", minHeight: "520px" }}>
            {slotProducts.map(({ offset, product }) => {
              const cfg = SLOT_CONFIG[offset];
              const isCenter = offset === 0;
              const isHovered = hoveredSlot === offset;

              return (
                <motion.div
                  key={product.id + "-" + offset}
                  onClick={!isCenter ? () => navigate(offset > 0 ? 1 : -1) : undefined}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    flexShrink: 0, position: "relative", zIndex: cfg.zIndex,
                    width: `${cfg.imgW}px`,
                    cursor: !isCenter ? "pointer" : "default",
                  }}
                  initial={false}
                  animate={{ scale: isCenter ? 1 : 0.93, y: isCenter ? 0 : 14 }}
                  transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                >
                  {/* Image + pinwheel — overflow visible so blades show outside */}
                  <div
                    style={{
                      position: "relative",
                      width: `${cfg.imgW}px`,
                      height: `${cfg.imgH}px`,
                      marginBottom: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "visible",
                    }}
                    onMouseEnter={() => setHoveredSlot(offset)}
                    onMouseLeave={() => setHoveredSlot(null)}
                    onTouchStart={() => setHoveredSlot(offset)}
                    onTouchEnd={() => setHoveredSlot(null)}
                  >
                    {/* Pinwheel — centred behind image, larger so blades peek out */}
                    <div
                      style={{
                        position: "absolute",
                        top: "50%", left: "50%",
                        transform: "translate(-50%, -50%)",
                        zIndex: 0, pointerEvents: "none",
                      }}
                    >
                      <AnimatedPinwheel
                        color={isCenter ? activeCatColor : "#c4b5fd"}
                        size={cfg.pinwheelSize}
                        isHovered={isHovered}
                      />
                    </div>

                    {/* Product image on top */}
                    <div
                      style={{
                        position: "relative", zIndex: 1,
                        width: `${cfg.imgW}px`, height: `${cfg.imgH}px`,
                        borderRadius: "16px", overflow: "hidden",
                        boxShadow: isCenter ? "0 20px 48px rgba(0,0,0,0.22)" : "0 10px 28px rgba(0,0,0,0.14)",
                      }}
                    >
                      <img
                        src={product.img}
                        alt={product.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    </div>
                  </div>

                  {/* Product info */}
                  <div style={{ width: `${cfg.imgW}px`, textAlign: "center", position: "relative", zIndex: 3 }}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: `${cfg.nameSize}px`, color: "#000", textTransform: "uppercase", letterSpacing: "2px", lineHeight: 1.05, marginBottom: "8px" }}>
                      {product.name}
                      {isCenter && (
                        <span style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "18px", marginLeft: "8px", color: activeCatColor, letterSpacing: "1px" }}>
                          {product.weight}
                        </span>
                      )}
                    </h3>
                    {cfg.showTags && (
                      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 10px", marginTop: "4px" }}>
                        {product.dietary.map(d => <DietaryTag key={d} label={d} />)}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Nav dots */}
          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "24px" }}>
            {filtered.map((_, i) => (
              <motion.button
                key={i}
                onClick={() => setCenterIdx(i)}
                animate={{ width: i === safeCenter ? 30 : 10, backgroundColor: i === safeCenter ? activeCatColor : "#c4b5fd" }}
                transition={{ duration: 0.3 }}
                style={{ height: "9px", borderRadius: "100px", border: "none", cursor: "pointer", padding: 0 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}