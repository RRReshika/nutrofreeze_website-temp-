import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// ── Per-label config: colors, products, and unique floating positions ──
interface LabelConfig {
  text: string;
  color: string;
  left: {
    img: string; name: string; rotate: number;
    // unique anchor per label (one of top/bottom defined)
    top?: string; bottom?: string;
    // extra nudge inward from edge
    inset?: string;
    exitX?: string;
  };
  right: {
    img: string; name: string; rotate: number;
    top?: string; bottom?: string;
    inset?: string;
    exitX?: string;
  };
}

const LABELS: LabelConfig[] = [
  {
    text: "VEGAN", color: "#0d9488",
    left: { img: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=500&q=90", name: "Mixed Berry Blend", rotate: -11, top: "8%", inset: "-30px" },
    right: { img: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=500&q=90", name: "Broccoli Florets", rotate: 8, bottom: "6%", inset: "-25px" },
  },
  {
    text: "GELATIN FREE", color: "#7c3aed",
    left: { img: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=500&q=90", name: "Mixed Berry Blend", rotate: -14, bottom: "5%", inset: "-20px" },
    right: { img: "https://images.unsplash.com/photo-1711205229065-89353695a869?w=500&q=90", name: "Sweet Potato Purée", rotate: 7, top: "6%", inset: "-30px" },
  },
  {
    text: "GLUTEN FREE", color: "#0d9488",
    left: { img: "https://images.unsplash.com/photo-1667889244854-364252b3c14a?w=500&q=90", name: "Mango Chunks", rotate: -8, top: "38%", inset: "-28px" },
    right: { img: "https://images.unsplash.com/photo-1679279726937-122c49626802?w=500&q=90", name: "Ready to Eat Meal", rotate: 13, top: "18%", inset: "-22px" },
  },
  {
    text: "DAIRY FREE", color: "#7c3aed",
    left: { img: "https://images.unsplash.com/photo-1595265185654-f7b3c41c9a57?w=500&q=90", name: "Spinach & Greens", rotate: -10, top: "18%", inset: "-35px" },
    right: { img: "https://images.unsplash.com/photo-1667889244854-364252b3c14a?w=500&q=90", name: "Mango Chunks", rotate: 9, bottom: "18%", inset: "-20px" },
  },
  {
    text: "KETO FRIENDLY", color: "#0d9488",
    left: { img: "https://images.unsplash.com/photo-1687041568037-dab13851ea14?w=500&q=90", name: "Freeze Dried Snack", rotate: -9, bottom: "20%", inset: "-25px" },
    right: { img: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=500&q=90", name: "Broccoli Florets", rotate: 11, bottom: "8%", inset: "-30px" },
  },
  {
    text: "HALAL", color: "#7c3aed",
    left: { img: "https://images.unsplash.com/photo-1473340186413-a68ba9c2564e?w=500&q=90", name: "Mixed Veg Purée", rotate: -12, top: "26%", inset: "-20px" },
    right: { img: "https://images.unsplash.com/photo-1687041568037-dab13851ea14?w=500&q=90", name: "Freeze Dried Snack", rotate: 6, top: "30%", inset: "-28px" },
  },
];

// Blob splash
function Blob({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" style={{ width: "100%", height: "100%" }}>
      <path
        fill={color}
        d="M38.9,-68.1C50.3,-60.7,59.3,-50.2,66.8,-38.1C74.3,-26,80.3,-12.3,80.5,1.5C80.6,15.3,74.8,29.3,65.9,41.2C57,53.1,44.9,62.9,31.6,69.4C18.3,75.9,3.7,79.1,-11.2,78C-26.1,76.9,-41.3,71.4,-53.6,62C-65.9,52.6,-75.3,39.3,-78.9,24.8C-82.5,10.2,-80.3,-5.5,-75.4,-19.9C-70.4,-34.3,-62.7,-47.5,-51.5,-55.3C-40.3,-63.2,-25.6,-65.8,-11.5,-68.3C2.5,-70.8,27.4,-75.4,38.9,-68.1Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

interface FloatProps {
  cfg: LabelConfig["left"];
  side: "left" | "right";
  blobColor: string;
  labelKey: string;
  rotate: number;
}

function ProductFloat({ cfg, side, blobColor, labelKey, rotate }: FloatProps) {
  const posStyle: React.CSSProperties = {
    position: "absolute",
    [side]: cfg.inset ?? "-20px",
    ...(cfg.top !== undefined ? { top: cfg.top } : {}),
    ...(cfg.bottom !== undefined ? { bottom: cfg.bottom } : {}),
    width: "clamp(160px, 17vw, 250px)",
    zIndex: 10,
    pointerEvents: "none",
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={labelKey + "-" + side}
        initial={{ x: side === "left" ? "-140%" : "140%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: side === "left" ? "-130%" : "130%", opacity: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26, mass: 0.85 }}
        style={posStyle}
      >
        <div style={{ transform: `rotate(${rotate}deg)`, transformOrigin: "center center" }}>
          {/* Blob */}
          <div style={{ position: "absolute", inset: "-22%", zIndex: 0, opacity: 0.8 }}>
            <Blob color={blobColor} />
          </div>
          {/* Card */}
          <div style={{ position: "relative", zIndex: 1, borderRadius: "20px", overflow: "hidden", boxShadow: "0 18px 44px rgba(0,0,0,0.24)", background: "white" }}>
            <img
              src={cfg.img}
              alt={cfg.name}
              style={{ width: "100%", height: "clamp(120px, 14vw, 200px)", objectFit: "cover", display: "block" }}
            />
            <div style={{ padding: "9px 13px", background: "white" }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(11px, 1.3vw, 15px)", letterSpacing: "1.5px", color: "#111", margin: 0 }}>
                {cfg.name}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function DietaryShowcase() {
  const [active, setActive] = useState<string | null>("GLUTEN FREE");

  const activeLabel = LABELS.find(l => l.text === active) ?? LABELS[2];
  const blobColor = activeLabel.color === "#0d9488" ? "#99f6e4" : "#ddd6fe";

  return (
    <section
      id="dietary"
      style={{
        backgroundColor: "#f5f0e8",
        position: "relative",
        overflow: "hidden",
        minHeight: "clamp(540px, 72vh, 820px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Side product images */}
      <ProductFloat
        cfg={activeLabel.left}
        side="left"
        blobColor={blobColor}
        labelKey={active!}
        rotate={activeLabel.left.rotate}
      />
      <ProductFloat
        cfg={activeLabel.right}
        side="right"
        blobColor={blobColor}
        labelKey={active!}
        rotate={activeLabel.right.rotate}
      />

      {/* Center stacked labels */}
      <div
        style={{
          textAlign: "center",
          padding: "56px clamp(200px, 24vw, 340px)",
          position: "relative",
          zIndex: 5,
          width: "100%",
        }}
      >
        {LABELS.map((lbl) => {
          const isActive = lbl.text === active;
          return (
            <motion.div
              key={lbl.text}
              onMouseEnter={() => setActive(lbl.text)}
              whileHover={{ x: 10 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(50px, 9.5vw, 124px)",
                letterSpacing: "0.04em",
                lineHeight: 1.0,
                cursor: "default",
                userSelect: "none",
                color: isActive ? lbl.color : "#111",
                transition: "color 0.2s ease",
                display: "block",
                // Stroke / outline effect when not active
                WebkitTextStroke: isActive ? "0px" : "1px transparent",
              }}
            >
              {lbl.text}
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
