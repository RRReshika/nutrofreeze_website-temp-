import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { useCart } from "../lib/cart";
import { useAuth } from "../lib/auth-context";
import { useNavigate } from "react-router";

const FALLBACK_COLORS = [
  "#6D28D9",
  "#d97706",
  "#16a34a",
  "#db2777",
  "#2563eb",
  "#0ea5e9",
  "#ca8a04",
  "#dc2626",
];

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=700&q=90";
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "/api").replace(/\/$/, "");

// Map product title keywords → PC design-background images
// Order matters: more specific patterns first
const LOCAL_IMAGE_MAP: [RegExp, string][] = [
  // Fruits
  [/custard\s*apple/i, "/images/Custard%20apple/PC%20Custard%20apple.png"],
  [/black\s*jamun/i, "/images/Jamun/PC%20Jamun.png"],
  [/jamun/i, "/images/Jamun/PC%20Jamun.png"],
  [/chikoo|sapota/i, "/images/Chikoo/PC%20chikoo%20.png"],
  [/pink.*guava|white.*guava|guava/i, "/images/Guava/PC%20Pink%20guava.png"],
  [/jackfruit|jack\s*fruit/i, "/images/Jack%20Fruit/PC%20Jackfruit%20.png"],
  [/blueberry/i, "/images/Blueberry/PC%20Blueberry.png"],
  [/strawberry/i, "/images/Strawberry/PC%20strawberry.png"],
  [/raspberry/i, "/images/Raspberry/PC%20raspberry.png"],
  [/pineapple/i, "/images/Pineapple/PC%20Pineapple.png"],
  [/papaya/i, "/images/Papaya/PC%20papaya%20.png"],
  [/kiwi/i, "/images/Kiwi/PC%20Kiwi.png"],
  [/mango/i, "/images/Mango/PC%20Mango.png"],
  [/banana/i, "/images/Banana/PC%20Banana.png"],
  [/apple/i, "/images/APPLE/PC%20Apple%20.png"],
  // Vegetables
  [/amla|gooseberry/i, "/images/Amla/PC%20Amla.png"],
  [/bitter\s*gourd/i, "/images/Bitter%20gourd/PC%20Bitter%20guord.png"],
  [/zucchini/i, "/images/zucchini/PC%20zucchini.png"],
  [/green\s*bell\s*pepper/i, "/images/_GREEN%20Bellpepper/PC%20green%20bell%20pepper.png"],
  [/red\s*bell\s*pepper/i, "/images/red%20Bellpepper/PC%20red%20bell%20pepper.png"],
  [/carrot/i, "/images/Carrot/PC%20Carrot.png"],
  [/green\s*peas?|peas?\s*\(whole\)/i, "/images/GREEN%20Peas/PC%20Green%20peas%20.png"],
  [/sweet\s*corn|corn/i, "/images/corn/PC%20corn.png"],
  [/potato/i, "/images/Potato/PC%20potato%20.png"],
];

function getLocalImage(title: string): string | null {
  // Never assign a whole/slice/cube image to a powder or flake product
  if (/powder|flakes?\s*\/\s*peel/i.test(title)) return null;
  for (const [pattern, path] of LOCAL_IMAGE_MAP) {
    if (pattern.test(title)) return path;
  }
  return null;
}

type ApiCategory = {
  id: string;
  name: string;
  slug: string;
  sortOrder: number;
};

type ApiProduct = {
  id: string;
  title: string;
  slug?: string;
  category?: ApiCategory | null;
  variants?: Array<{ id: string; title?: string; packSizeG?: number | null; price?: string | number | null; currency?: string | null; sku?: string }>;
  images?: Array<{ url: string }>;
};

type ProductCard = {
  id: string;
  slug?: string;
  name: string;
  category: string;
  weight: string;
  dietary: string[];
  img: string;
  variantId?: string;
  variantTitle?: string;
  price?: number;
  currency?: string;
};

type CategoryPill = {
  label: string;
  color: string;
};

const getWeightLabel = (variants: ApiProduct["variants"]) => {
  const weight = variants?.find(v => typeof v.packSizeG === "number")?.packSizeG;
  return weight ? `${weight}g` : "-";
};

const getPrimaryVariant = (variants: ApiProduct["variants"]) => variants?.[0];

const formatCategoryLabel = (raw: string | undefined) => {
  if (!raw) return "Uncategorized";
  return raw
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const toProductCard = (product: ApiProduct): ProductCard => {
  const categoryLabel = formatCategoryLabel(product.category?.name || product.category?.slug);
  const primaryVariant = getPrimaryVariant(product.variants);
  return {
    id: product.id,
    slug: product.slug,
    name: product.title,
    category: categoryLabel,
    weight: getWeightLabel(product.variants),
    dietary: ["Halal Certified", "No Preservatives", "Freeze Dried"],
    img: getLocalImage(product.title) || product.images?.[0]?.url || DEFAULT_IMAGE,
    variantId: primaryVariant?.id,
    variantTitle: primaryVariant?.title || "Default",
    price: typeof primaryVariant?.price === "string" || typeof primaryVariant?.price === "number" ? Number(primaryVariant.price) : undefined,
    currency: primaryVariant?.currency || "SGD",
  };
};

const TICKER_ITEMS = [
  "FROZEN GOODNESS", "HALAL CERTIFIED", "NO PRESERVATIVES",
  "VEGAN FRIENDLY", "PREMIUM QUALITY", "NUTRITIOUS & DELICIOUS",
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
  const bx2 = 0.04 * r, by2 = 0.82 * r;  // control point 2
  const ex = 0.42 * r, ey = 0.62 * r;  // blade tip
  const bx3 = 0.78 * r, by3 = 0.42 * r;  // control point 3
  const bx4 = 0.48 * r, by4 = -0.08 * r; // control point 4

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

// ── Brars-style 4-pointed sparkle star ──────────────────────────────
function Sparkle({
  size = 32,
  color = "#f6f3eb",
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

// ── Circular spinning product badge ──────────────────────────────────
function ProductSpinBadge({ color = "#0d9488" }: { color?: string }) {
  return (
    <div style={{ position: "relative", width: "96px", height: "96px" }}>
      <motion.svg
        viewBox="0 0 96 96"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="prodCircle"
            d="M 84,48 a 36,36 0 1,0 -72,0"
          />
        </defs>
        <circle cx="48" cy="48" r="44" fill="none" stroke={color} strokeWidth="1.5" opacity="0.35" />
        <text style={{ fontSize: "7.5px", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "3.5px", fill: color }}>
          <textPath href="#prodCircle">
            FREEZE DRIED · PURE NUTRITION · NO ADDITIVES ·&nbsp;
          </textPath>
        </text>
      </motion.svg>
      {/* Center snowflake */}
      <div style={{
        position: "absolute", inset: "22px", borderRadius: "50%",
        background: color, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" style={{ width: "20px", height: "20px" }}>
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
          <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
          <line x1="12" y1="2" x2="10" y2="6" /><line x1="12" y1="2" x2="14" y2="6" />
          <line x1="12" y1="22" x2="10" y2="18" /><line x1="12" y1="22" x2="14" y2="18" />
          <line x1="2" y1="12" x2="6" y2="10" /><line x1="2" y1="12" x2="6" y2="14" />
          <line x1="22" y1="12" x2="18" y2="10" /><line x1="22" y1="12" x2="18" y2="14" />
        </svg>
      </div>
    </div>
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
const SLOTS = [-2, -1, 0, 1, 2] as const;
type SlotOffset = typeof SLOTS[number];

const SLOT_CONFIG: Record<SlotOffset, {
  imgW: number; imgH: number;
  nameSize: number; zIndex: number;
  showInfo: boolean; opacity: number; yOffset: number;
}> = {
  "-2": { imgW: 200, imgH: 200, nameSize: 0, zIndex: 1, showInfo: false, opacity: 0.38, yOffset: 42 },
  "-1": { imgW: 330, imgH: 330, nameSize: 22, zIndex: 2, showInfo: false, opacity: 0.7, yOffset: 20 },
  "0": { imgW: 460, imgH: 460, nameSize: 36, zIndex: 5, showInfo: true, opacity: 1, yOffset: 0 },
  "1": { imgW: 330, imgH: 330, nameSize: 22, zIndex: 2, showInfo: false, opacity: 0.7, yOffset: 20 },
  "2": { imgW: 200, imgH: 200, nameSize: 0, zIndex: 1, showInfo: false, opacity: 0.38, yOffset: 42 },
};

export function Products() {
  const { addItem, openCart } = useCart();
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigateToRoute = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Most Popular");
  const [centerIdx, setCenterIdx] = useState(0);
  const [hoveredSlot, setHoveredSlot] = useState<SlotOffset | null>(null);
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const response = await fetch(`${API_BASE_URL}/catalog/products`);
        if (!response.ok) {
          throw new Error(`Unable to load products (${response.status})`);
        }
        const data: ApiProduct[] = await response.json();
        if (isActive) {
          setProducts(data.map(toProductCard).filter(p => p.img !== DEFAULT_IMAGE));
        }
      } catch (error) {
        if (isActive) {
          setLoadError(error instanceof Error ? error.message : "Unable to load products");
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  const categories = useMemo<CategoryPill[]>(() => {
    const fromProducts = Array.from(new Set(products.map(p => p.category)));
    return [
      { label: "Most Popular", color: "#6D28D9" },
      ...fromProducts.map((label, index) => ({
        label,
        color: FALLBACK_COLORS[index % FALLBACK_COLORS.length],
      })),
    ];
  }, [products]);

  const filtered = products.filter(p => activeCategory === "Most Popular" || p.category === activeCategory);
  const safeCenter = filtered.length ? centerIdx % filtered.length : 0;

  const navigate = (dir: 1 | -1) =>
    setCenterIdx(i => (i + dir + filtered.length) % filtered.length);

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCenterIdx(0);
  };

  const slotProducts = filtered.length
    ? SLOTS.map(offset => {
      const idx = ((safeCenter + offset) % filtered.length + filtered.length) % filtered.length;
      return { offset, product: filtered[idx] };
    })
    : [];

  const activeCatColor = categories.find(c => c.label === activeCategory)?.color || "#6D28D9";

  const handleAddToCart = async (product: ProductCard) => {
    if (!user) {
      navigateToRoute("/signin");
      return;
    }
    if (!product.variantId || typeof product.price !== "number") return;
    await addItem(
      {
        productId: product.id,
        productTitle: product.name,
        productSlug: product.slug,
        variantId: product.variantId,
        variantTitle: product.variantTitle || "Default",
        variantSku: product.variantId,
        unitPrice: product.price,
        currency: product.currency,
        image: product.img,
      },
      1,
    );
    openCart();
  };

  return (
    <section id="products" style={{ backgroundColor: "#0d9488", padding: "48px 16px 64px", minHeight: "100vh" }}>
      {/* ── Rounded cream card ── */}
      <div style={{ backgroundColor: "#f6f3eb", borderRadius: "24px", overflow: "hidden", maxWidth: "1440px", margin: "0 auto", boxShadow: "0 24px 60px rgba(0,0,0,0.18)" }}>

        {/* Purple ticker at top of card */}
        <Ticker />

        {/* Category pills */}
        <div style={{ paddingTop: "36px", paddingBottom: "20px", display: "flex", justifyContent: "center", paddingLeft: "24px", paddingRight: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "18px", flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map((cat, i) => {
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
          {isLoading && (
            <div style={{ textAlign: "center", minHeight: "220px", display: "grid", placeItems: "center" }}>
              <p style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "20px", color: "#1a1a1a" }}>Loading products...</p>
            </div>
          )}

          {!isLoading && loadError && (
            <div style={{ textAlign: "center", minHeight: "220px", display: "grid", placeItems: "center", padding: "0 20px" }}>
              <p style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "18px", color: "#991b1b" }}>
                {loadError}. Make sure the API is running on port 3001.
              </p>
            </div>
          )}

          {!isLoading && !loadError && filtered.length === 0 && (
            <div style={{ textAlign: "center", minHeight: "220px", display: "grid", placeItems: "center" }}>
              <p style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "18px", color: "#1a1a1a" }}>No products found in this category.</p>
            </div>
          )}

          {!isLoading && !loadError && filtered.length > 0 && (
            <div style={{ position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center", gap: "12px", minHeight: "660px", paddingBottom: "52px", overflow: "visible" }}>

              {/* ── Background sparkle decorations (Brars style) ── */}
              {[
                { size: 44, top: "6%", left: "2%", delay: 0, opac: 0.55 },
                { size: 26, top: "14%", right: "3%", delay: 0.8, opac: 0.45 },
                { size: 34, top: "62%", left: "4%", delay: 1.4, opac: 0.5 },
                { size: 20, top: "72%", right: "5%", delay: 0.4, opac: 0.4 },
                { size: 18, top: "38%", left: "1%", delay: 1.8, opac: 0.35 },
                { size: 16, top: "48%", right: "2%", delay: 1.1, opac: 0.3 },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  style={{
                    position: "absolute",
                    top: s.top,
                    ...(("left" in s) ? { left: (s as any).left } : { right: (s as any).right }),
                    pointerEvents: "none",
                    zIndex: 1,
                  }}
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: s.opac, scale: 1, rotate: 0 }}
                  transition={{ delay: s.delay, duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Sparkle size={s.size} color={activeCatColor} opacity={1} />
                </motion.div>
              ))}

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
                    animate={{ opacity: cfg.opacity, y: cfg.yOffset }}
                    transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {/* Image */}
                    <div
                      style={{
                        position: "relative",
                        width: `${cfg.imgW}px`,
                        height: `${cfg.imgH}px`,
                        marginBottom: isCenter ? "28px" : "12px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        overflow: "visible",
                      }}
                      onMouseEnter={() => setHoveredSlot(offset)}
                      onMouseLeave={() => setHoveredSlot(null)}
                      onTouchStart={() => setHoveredSlot(offset)}
                      onTouchEnd={() => setHoveredSlot(null)}
                    >
                      <motion.img
                        src={product.img}
                        alt={product.name}
                        style={{
                          width: "100%", height: "100%",
                          objectFit: "contain", display: "block",
                          borderRadius: "20px",
                          filter: isCenter
                            ? "drop-shadow(0 28px 52px rgba(0,0,0,0.26))"
                            : "drop-shadow(0 10px 22px rgba(0,0,0,0.14)) brightness(0.88)",
                        }}
                        animate={isHovered && isCenter ? { scale: 1.04 } : { scale: 1 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      />

                      {/* Corner sparkles + spin badge — center only */}
                      {isCenter && (
                        <>
                          <motion.div style={{ position: "absolute", top: "-44px", left: "-52px", zIndex: 6, pointerEvents: "none" }}
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
                            <Sparkle size={40} color="#1a1a1a" opacity={0.6} />
                          </motion.div>
                          <motion.div style={{ position: "absolute", top: "-28px", right: "-44px", zIndex: 6, pointerEvents: "none" }}
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
                            <Sparkle size={25} color={activeCatColor} opacity={0.75} />
                          </motion.div>
                          <motion.div style={{ position: "absolute", bottom: "-38px", left: "-44px", zIndex: 6, pointerEvents: "none" }}
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
                            <Sparkle size={20} color={activeCatColor} opacity={0.55} />
                          </motion.div>
                          <motion.div style={{ position: "absolute", bottom: "-44px", right: "-50px", zIndex: 6, pointerEvents: "none" }}
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.15, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}>
                            <Sparkle size={34} color="#1a1a1a" opacity={0.5} />
                          </motion.div>
                          <motion.div
                            style={{ position: "absolute", top: "-16px", right: "-62px", zIndex: 8, pointerEvents: "none" }}
                            initial={{ opacity: 0, scale: 0.4, rotate: -30 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.25, duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
                          >
                            <ProductSpinBadge color={activeCatColor} />
                          </motion.div>
                        </>
                      )}
                    </div>

                    {/* Info — ±1 gets name only, center gets full info */}
                    {cfg.nameSize > 0 && (
                      <div style={{ width: `${cfg.imgW}px`, textAlign: "center", position: "relative", zIndex: 3 }}>
                        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: `${cfg.nameSize}px`, color: "#000", textTransform: "uppercase", letterSpacing: "2px", lineHeight: 1.05, marginBottom: isCenter ? "10px" : "0" }}>
                          {product.name}
                          {isCenter && (
                            <span style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "18px", marginLeft: "8px", color: activeCatColor, letterSpacing: "1px" }}>
                              {product.weight}
                            </span>
                          )}
                        </h3>
                        {cfg.showInfo && (
                          <>
                            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "6px 10px", marginTop: "4px" }}>
                              {product.dietary.map(d => <DietaryTag key={d} label={d} />)}
                            </div>
                            <button
                              type="button"
                              onClick={(event) => {
                                event.stopPropagation();
                                void handleAddToCart(product);
                              }}
                              disabled={!product.variantId || typeof product.price !== "number" || isAuthLoading}
                              style={{
                                marginTop: "14px",
                                border: "none",
                                borderRadius: "999px",
                                backgroundColor: activeCatColor,
                                color: "white",
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: "13px",
                                fontWeight: 700,
                                padding: "11px 18px",
                                cursor: (product.variantId && !isAuthLoading) ? "pointer" : "not-allowed",
                                opacity: (product.variantId && !isAuthLoading) ? 1 : 0.55,
                                boxShadow: "0 10px 24px rgba(0,0,0,0.16)",
                              }}
                            >
                              {isAuthLoading ? "Loading..." : product.price ? `${!user ? "Sign In to Add" : "Add to Cart"} \u00B7 ${product.currency} ${product.price.toFixed(2)}` : "Add to Cart"}
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Nav: arrows + dots + View All */}
          {!isLoading && !loadError && filtered.length > 1 && (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "16px", paddingBottom: "16px", paddingLeft: "24px", paddingRight: "24px", flexWrap: "wrap" }}>
              <motion.button
                onClick={() => navigate(-1)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  border: `2px solid ${activeCatColor}`,
                  backgroundColor: "transparent",
                  color: activeCatColor,
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </motion.button>

              {/* Progress dots — capped at 12 */}
              <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
                {filtered.slice(0, Math.min(filtered.length, 12)).map((_, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setCenterIdx(i)}
                    style={{ height: "8px", borderRadius: "999px", backgroundColor: i === safeCenter ? activeCatColor : "#c4b5fd", border: "none", padding: 0, cursor: "pointer", flexShrink: 0 }}
                    animate={{ width: i === safeCenter ? 28 : 8 }}
                    initial={false}
                    transition={{ duration: 0.3 }}
                  />
                ))}
                {filtered.length > 12 && (
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: "#888", marginLeft: "4px" }}>+{filtered.length - 12} more</span>
                )}
              </div>

              <motion.button
                onClick={() => navigate(1)}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                style={{
                  width: "52px", height: "52px", borderRadius: "50%",
                  border: "none",
                  backgroundColor: activeCatColor,
                  color: "white",
                  cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>

              {/* View All */}
              <motion.button
                onClick={() => navigateToRoute("/catalog")}
                whileHover={{ scale: 1.04, backgroundColor: "#333" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "14px 24px",
                  borderRadius: "999px",
                  backgroundColor: "#1a1a1a",
                  color: "white",
                  border: "none",
                  fontFamily: "'Gagalin', sans-serif",
                  fontSize: "15px",
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  flexShrink: 0,
                }}
              >
                View All
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}