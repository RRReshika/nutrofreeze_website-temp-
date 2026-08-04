import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
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

const BG_BASE = "/images/big%20packets%20no%20background";

// Transparent packet images — no background, float cleanly
const LOCAL_IMAGE_MAP: [RegExp, string][] = [
  // Fruits
  [/custard\s*apple/i, `${BG_BASE}/WB_Custard_front-removebg-preview.png`],
  [/black\s*jamun/i, `${BG_BASE}/WB_Jamun_front-removebg-preview.png`],
  [/jamun/i, `${BG_BASE}/WB_Jamun_front-removebg-preview.png`],
  [/chikoo|sapota/i, `${BG_BASE}/WB_chikoo_front-removebg-preview.png`],
  [/guava/i, `${BG_BASE}/WB_guava_front-removebg-preview.png`],
  [/jackfruit|jack\s*fruit/i, `${BG_BASE}/WB_jackfruit_front-removebg-preview.png`],
  [/blueberry/i, `${BG_BASE}/WB_Blueberry_Front_-removebg-preview.png`],
  [/strawberry/i, `${BG_BASE}/WB_strawberry_front-removebg-preview.png`],
  [/raspberry/i, `${BG_BASE}/WB_raspberry_front-removebg-preview.png`],
  [/pineapple/i, `${BG_BASE}/WB_pineapple_front-removebg-preview.png`],
  [/papaya/i, `${BG_BASE}/WB_Papaya_Front-removebg-preview.png`],
  [/kiwi/i, `${BG_BASE}/WB_Kiwi_front-removebg-preview.png`],
  [/mango/i, `${BG_BASE}/WB_Mango_front-removebg-preview.png`],
  [/banana/i, `${BG_BASE}/WB_Banana_front-removebg-preview.png`],
  [/apple/i, `${BG_BASE}/WB_Apple__front_png-removebg-preview.png`],
  // Vegetables
  [/amla|gooseberry/i, `${BG_BASE}/WB_Amla_Front-removebg-preview.png`],
  [/bitter\s*gourd/i, `${BG_BASE}/WB_Bitter_Gourd_Front_-removebg-preview.png`],
  [/zucchini/i, `${BG_BASE}/WB_Zucchini_front-removebg-preview.png`],
  [/green\s*bell\s*pepper/i, `${BG_BASE}/WB_green_bell_pepper_front-removebg-preview.png`],
  [/red\s*bell\s*pepper/i, `${BG_BASE}/WB_Red_bell_pepper_front-removebg-preview.png`],
  [/carrot/i, `${BG_BASE}/PC_Carrot-removebg-preview.png`],
  [/green\s*peas?|peas?\s*\(whole\)/i, `${BG_BASE}/WB_Peas_front-removebg-preview.png`],
  [/sweet\s*corn|corn/i, `${BG_BASE}/WB_corn_front-removebg-preview.png`],
  [/potato/i, `${BG_BASE}/WB_potato_front-removebg-preview.png`],
];

function getLocalImage(title: string): string | null {
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
  formFactor?: string | null;
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

function cleanProductName(raw: string): string {
  // Remove everything in parentheses (Slice, Cube, Whole, alternate names like Gooseberry/Sapota)
  return raw.replace(/\s*\([^)]*\)/g, "").replace(/\/\S+/g, "").trim();
}

function getFormFactor(raw: string): string | null {
  const m = raw.match(/\((Slice|Cube|Whole|Pieces|Flakes?|Powder)\)/i);
  return m ? m[1].toUpperCase() : null;
}

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
    name: cleanProductName(product.title),
    formFactor: getFormFactor(product.title),
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
  "BRINGING YOU THE BEST IN SNACKS, DESSERTS & DAIRY",
  "VEGETARIAN DONE BETTER",
  "HALAL CERTIFIED",
  "NO PRESERVATIVES",
  "VEGAN FRIENDLY",
  "FREEZE DRIED GOODNESS",
];

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ overflow: "hidden", backgroundColor: "#111111", padding: "11px 0", whiteSpace: "nowrap", maxWidth: "100%" }}>
      <motion.div
        style={{ display: "inline-flex" }}
        animate={{ x: ["0%", `-${100 / 3}%`] }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "12.5px", fontWeight: 700, letterSpacing: "2.5px", color: "white",
              textTransform: "uppercase",
              display: "inline-flex", alignItems: "center", gap: "14px", paddingRight: "44px",
            }}
          >
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#f97316", display: "inline-block", flexShrink: 0 }} />
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ── Dietary badge with teal check ──────────────────────────────────
function DietaryCheck({ label }: { label: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: "5px",
      fontFamily: "'DM Sans', sans-serif", fontSize: "13px", fontWeight: 600,
      color: "#1a1a1a",
    }}>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="8" fill="#00B2A9" />
        <path d="M4.5 8l2.5 2.5 4.5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {label}
    </span>
  );
}

// ── Carousel slot constants ───────────────────────────────────────────
const SLOTS = [-2, -1, 0, 1, 2] as const;

const SLOT_X: Record<string, number> = { "-2": -660, "-1": -375, "0": 0, "1": 375, "2": 660 };
const SLOT_SCALE: Record<string, number> = { "-2": 0.33, "-1": 0.58, "0": 1, "1": 0.58, "2": 0.33 };
const SLOT_OPACITY: Record<string, number> = { "-2": 0.15, "-1": 0.55, "0": 1, "1": 0.55, "2": 0.15 };
const SLOT_Z: Record<string, number> = { "-2": 1, "-1": 3, "0": 10, "1": 3, "2": 1 };

export function Products() {
  const { addItem, openCart } = useCart();
  const { user, isLoading: isAuthLoading } = useAuth();
  const navigateToRoute = useNavigate();
  const [activeCategory, setActiveCategory] = useState("Most Popular");
  const [products, setProducts] = useState<ProductCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    let isActive = true;
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const response = await fetch(`${API_BASE_URL}/catalog/products`);
        if (!response.ok) throw new Error(`Unable to load products (${response.status})`);
        const data: ApiProduct[] = await response.json();
        if (isActive) setProducts(data.map(toProductCard).filter(p => p.img !== DEFAULT_IMAGE));
      } catch (error) {
        if (isActive) setLoadError(error instanceof Error ? error.message : "Unable to load products");
      } finally {
        if (isActive) setIsLoading(false);
      }
    };
    loadProducts();
    return () => { isActive = false; };
  }, []);

  useEffect(() => { setActiveIdx(0); }, [activeCategory]);

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

  const filtered = useMemo(
    () => products.filter(p => activeCategory === "Most Popular" || p.category === activeCategory),
    [products, activeCategory]
  );

  // Auto-scroll: restarts when products load (filtered.length changes) or hover state changes
  useEffect(() => {
    if (paused || filtered.length <= 1) return;
    const id = setInterval(() => {
      setActiveIdx(i => (i + 1) % filtered.length);
    }, 3000);
    return () => clearInterval(id);
  }, [paused, filtered.length]);

  const goNext = () => { if (filtered.length > 0) setActiveIdx(i => (i + 1) % filtered.length); };
  const goPrev = () => { if (filtered.length > 0) setActiveIdx(i => (i - 1 + filtered.length) % filtered.length); };

  const getIdxAtSlot = (slot: number) => {
    if (filtered.length === 0) return -1;
    return (activeIdx + slot + filtered.length * 100) % filtered.length;
  };

  const handleAddToCart = async (product: ProductCard) => {
    if (!user) { navigateToRoute("/signin"); return; }
    if (!(product.variants?.[0]?.id ?? product.variantId) || typeof (product.variants?.[0]?.price ?? product.price) !== "number") return;
    await addItem(
      {
        productId: product.id,
        productTitle: product.name,
        productSlug: product.slug,
        variantId: (product.variants?.[0]?.id ?? product.variantId),
        variantTitle: product.variantTitle || "Default",
        variantSku: (product.variants?.[0]?.id ?? product.variantId),
        unitPrice: (product.variants?.[0]?.price ?? product.price),
        currency: (product.variants?.[0]?.currency ?? product.currency ?? 'SGD'),
        image: product.img,
      },
      1,
    );
    openCart();
  };

  return (
    <section id="products" style={{ backgroundColor: "#f6f3eb", padding: "0 0 64px" }}>
      <Ticker />

      {/* Section header */}
      <div style={{ paddingTop: "40px", paddingBottom: "4px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "#888", textTransform: "uppercase", margin: "0 0 10px" }}>
          Our Products
        </p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(36px, 5vw, 64px)", color: "#1a1a1a", letterSpacing: "2px", margin: 0, lineHeight: 1 }}>
          THE WORLD OF NUTROFREEZE
        </h2>
      </div>

      {/* Category pills */}
      <div style={{ paddingTop: "28px", paddingBottom: "12px", display: "flex", justifyContent: "center", paddingLeft: "24px", paddingRight: "24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap", justifyContent: "center" }}>
          {categories.map((cat, i) => {
            const isActive = activeCategory === cat.label;
            return (
              <motion.button
                key={cat.label}
                onClick={() => setActiveCategory(cat.label)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  padding: "10px 22px",
                  borderRadius: "12px",
                  border: "none", cursor: "pointer",
                  fontFamily: "'Gagalin', sans-serif", fontSize: "17px", letterSpacing: "0.5px",
                  backgroundColor: isActive ? "#1a1a1a" : "transparent",
                  color: isActive ? "white" : "#1a1a1a",
                  transition: "background-color 0.2s, color 0.2s",
                  boxShadow: isActive ? "0 6px 20px rgba(0,0,0,0.18)" : "none",
                }}
              >
                {isActive ? (
                  <svg width="13" height="13" viewBox="0 0 47 47" fill="white">
                    <path d="M23.2496 0.345703C17.2963 12.4504 12.4733 17.2676 0.350836 23.217C12.4795 29.1664 17.3075 33.9836 23.2736 46.1089C29.2269 33.9836 34.0292 29.1664 46.1723 23.217C34.023 17.2676 29.2156 12.4504 23.2496 0.345703Z" />
                  </svg>
                ) : (
                  <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: cat.color, display: "inline-block", flexShrink: 0 }} />
                )}
                {cat.label}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Loading / error states */}
      {isLoading && (
        <div style={{ textAlign: "center", height: "500px", display: "grid", placeItems: "center" }}>
          <p style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "20px", color: "#1a1a1a" }}>Loading products...</p>
        </div>
      )}
      {!isLoading && loadError && (
        <div style={{ textAlign: "center", height: "500px", display: "grid", placeItems: "center", padding: "0 20px" }}>
          <p style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "18px", color: "#991b1b" }}>{loadError}. Make sure the API is running on port 3001.</p>
        </div>
      )}
      {!isLoading && !loadError && filtered.length === 0 && (
        <div style={{ textAlign: "center", height: "500px", display: "grid", placeItems: "center" }}>
          <p style={{ fontFamily: "'Gagalin', sans-serif", fontSize: "18px", color: "#1a1a1a" }}>No products in this category.</p>
        </div>
      )}

      {/* ── Coverflow carousel ── */}
      {!isLoading && !loadError && filtered.length > 0 && (
        <>
          <div
            style={{ position: "relative", height: isMobile ? "470px" : "560px", overflow: "hidden", marginTop: "8px" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {(isMobile ? [0] : SLOTS).map(slot => {
              const productIdx = getIdxAtSlot(slot);
              if (productIdx === -1) return null;
              const product = filtered[productIdx];
              const isCenter = slot === 0;
              return (
                <motion.div
                  key={product.id + "_" + slot}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    width: isMobile ? "min(92vw, 360px)" : "380px",
                    height: isMobile ? "450px" : "510px",
                    marginLeft: isMobile ? "calc(min(92vw, 360px) / -2)" : "-190px",
                    marginTop: isMobile ? "-225px" : "-255px",
                    transformOrigin: "center center",
                    cursor: slot !== 0 ? "pointer" : "default",
                  }}
                  animate={{
                    x: isMobile ? 0 : SLOT_X[slot.toString()],
                    scale: isMobile ? 1 : SLOT_SCALE[slot.toString()],
                    opacity: isMobile ? 1 : SLOT_OPACITY[slot.toString()],
                    zIndex: isMobile ? 10 : SLOT_Z[slot.toString()],
                  }}
                  transition={{ type: "spring", stiffness: 220, damping: 26 }}
                  onClick={slot !== 0 ? () => setActiveIdx(productIdx) : undefined}
                >
                  {isCenter ? (
                    /* ── CENTER ── */
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
                      <div style={{ position: "relative", width: isMobile ? "100%" : "460px", maxWidth: "460px", height: isMobile ? "300px" : "420px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {/* Soft radial glow — no hard edge */}
                        <div style={{ position: "absolute", inset: "-8%", background: "radial-gradient(ellipse at 50% 54%, rgba(0,178,169,0.48) 0%, rgba(0,178,169,0.22) 36%, transparent 62%)", borderRadius: "50%", filter: "blur(22px)", zIndex: 0, pointerEvents: "none" }} />
                        {/* Dashed orbit ring */}
                        <div style={{ position: "absolute", width: isMobile ? "260px" : "360px", height: isMobile ? "260px" : "360px", borderRadius: "50%", border: "1.5px dashed rgba(0,178,169,0.30)", zIndex: 0, pointerEvents: "none" }} />
                        {/* Continuous float + entrance */}
                        <motion.div animate={{ y: [0, -16, 0] }} transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }} style={{ position: "relative", zIndex: 1 }}>
                          <AnimatePresence mode="wait">
                            <motion.img key={product.id} src={product.img} alt={product.name}
                              initial={{ opacity: 0, scale: 0.82, y: 28 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                              style={{ width: isMobile ? "min(80vw, 300px)" : "400px", height: isMobile ? "min(80vw, 300px)" : "400px", objectFit: "contain", filter: "drop-shadow(0 36px 52px rgba(0,0,0,0.28))" }}
                            />
                          </AnimatePresence>
                        </motion.div>
                        {product.weight && product.weight !== "-" && (
                          <div style={{ position: "absolute", bottom: "8px", right: "8px", zIndex: 2, backgroundColor: "#231F20", color: "white", fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, padding: "4px 12px", borderRadius: "999px", letterSpacing: "0.5px" }}>
                            {product.weight}
                          </div>
                        )}
                      </div>
                      <AnimatePresence mode="wait">
                        <motion.h3 key={product.id + "_n"} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35, delay: 0.1 }}
                          style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(38px, 4.8vw, 60px)", letterSpacing: isMobile ? "2px" : "3px", color: "#1a1a1a", margin: "0 0 12px", textAlign: "center", lineHeight: 1.0, textTransform: "uppercase", padding: isMobile ? "0 8px" : "0" }}
                        >{product.name}</motion.h3>
                      </AnimatePresence>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: isMobile ? "6px 12px" : "6px 18px", justifyContent: "center", marginBottom: "18px", padding: isMobile ? "0 8px" : "0" }}>
                        {(isMobile ? product.dietary.slice(0, 2) : product.dietary).map(d => <DietaryCheck key={d} label={d} />)}
                      </div>
                      <motion.button type="button" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
                        onClick={() => void handleAddToCart(product)}
                        disabled={!(product.variants?.[0]?.id ?? product.variantId) || typeof (product.variants?.[0]?.price ?? product.price) !== "number" || isAuthLoading}
                        style={{ display: "inline-flex", alignItems: "center", gap: 0, borderRadius: "999px", border: "none", backgroundColor: "#231F20", color: "white", fontFamily: "'Space Grotesk', sans-serif", fontSize: isMobile ? "12px" : "14px", fontWeight: 700, cursor: ((product.variants?.[0]?.id ?? product.variantId) && !isAuthLoading) ? "pointer" : "not-allowed", opacity: ((product.variants?.[0]?.id ?? product.variantId) && !isAuthLoading) ? 1 : 0.55, boxShadow: "0 8px 28px rgba(0,0,0,0.22)", overflow: "hidden", maxWidth: "100%" }}
                      >
                        <span style={{ padding: isMobile ? "11px 14px" : "13px 22px" }}>{isAuthLoading ? "Loading…" : !user ? "Sign In to Buy" : "Add to Cart"}</span>
                        {(product.variants?.[0]?.price ?? product.price) !== undefined && <span style={{ backgroundColor: "#00B2A9", padding: isMobile ? "11px 12px" : "13px 20px", fontSize: isMobile ? "12px" : "14px", fontWeight: 800 }}>{(product.variants?.[0]?.currency ?? product.currency ?? 'SGD')} {(product.variants?.[0]?.price ?? product.price).toFixed(2)}</span>}
                      </motion.button>
                    </div>
                  ) : Math.abs(slot) === 1 ? (
                    /* ── ADJACENT: white card ── */
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", backgroundColor: "white", borderRadius: "28px", boxShadow: "0 8px 40px rgba(0,0,0,0.09)", padding: "28px 20px 24px" }}>
                      <img src={product.img} alt={product.name} style={{ width: "230px", height: "230px", objectFit: "contain", filter: "drop-shadow(0 12px 22px rgba(0,0,0,0.15))", marginBottom: "16px" }} />
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "24px", letterSpacing: "2px", color: "#1a1a1a", textAlign: "center", margin: "0 0 10px", textTransform: "uppercase", lineHeight: 1.1 }}>{product.name}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", justifyContent: "center" }}>
                        {product.dietary.slice(0, 2).map(d => <DietaryCheck key={d} label={d} />)}
                      </div>
                    </div>
                  ) : (
                    /* ── FAR SIDES ── */
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
                      <img src={product.img} alt={product.name} style={{ width: "200px", height: "200px", objectFit: "contain", filter: "drop-shadow(0 6px 12px rgba(0,0,0,0.10))" }} />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* ── Navigation ── */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "20px", paddingTop: "12px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", gap: "8px" }}>
              {([{ fn: goPrev, lbl: "←" }, { fn: goNext, lbl: "→" }] as const).map(({ fn, lbl }) => (
                <motion.button key={lbl} type="button" onClick={fn}
                  whileHover={{ backgroundColor: "#00B2A9", borderColor: "#00B2A9", color: "white", scale: 1.1 }}
                  whileTap={{ scale: 0.93 }}
                  style={{ width: "44px", height: "44px", borderRadius: "50%", border: "2px solid #231F20", backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: "16px", color: "#231F20", fontWeight: 700 }}
                >{lbl}</motion.button>
              ))}
            </div>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              {filtered.map((_, i) => (
                <button key={i} type="button" onClick={() => setActiveIdx(i)}
                  style={{ width: i === activeIdx ? "24px" : "8px", height: "8px", borderRadius: "4px", backgroundColor: i === activeIdx ? "#00B2A9" : "rgba(0,0,0,0.15)", border: "none", cursor: "pointer", padding: 0, transition: "width 0.3s ease, background-color 0.3s ease" }}
                />
              ))}
            </div>
            <motion.button onClick={() => navigateToRoute("/catalog")}
              whileHover={{ scale: 1.04, backgroundColor: "#00B2A9" }} whileTap={{ scale: 0.97 }}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "11px 28px", borderRadius: "999px", backgroundColor: "#231F20", color: "white", border: "none", fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, cursor: "pointer", boxShadow: "0 6px 20px rgba(0,0,0,0.18)" }}
            >
              View All
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6" /></svg>
            </motion.button>
          </div>
        </>
      )}
    </section>
  );
}