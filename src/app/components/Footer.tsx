import { motion } from "motion/react";
import { Instagram, Facebook, Twitter, Youtube, Heart } from "lucide-react";

// Brars-style spinning mandala decoration
function SpinMandala({ size = 120, color = "#5eead4" }: { size?: number; color?: string }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      style={{ display: "block", opacity: 0.18 }}
    >
      {[0, 45, 90, 135].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 60 60)`}>
          <ellipse cx="60" cy="32" rx="6" ry="26" fill={color} />
          <ellipse cx="60" cy="88" rx="6" ry="26" fill={color} />
        </g>
      ))}
      {[22.5, 67.5, 112.5, 157.5].map((deg) => (
        <g key={deg} transform={`rotate(${deg} 60 60)`}>
          <ellipse cx="60" cy="36" rx="4" ry="20" fill={color} opacity="0.6" />
          <ellipse cx="60" cy="84" rx="4" ry="20" fill={color} opacity="0.6" />
        </g>
      ))}
      <circle cx="60" cy="60" r="10" fill="none" stroke={color} strokeWidth="1.5" />
      <circle cx="60" cy="60" r="20" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <circle cx="60" cy="60" r="32" fill="none" stroke={color} strokeWidth="0.6" opacity="0.35" />
    </motion.svg>
  );
}

// Brars-style circular sticker badge (rotating text + center label)
function StickerBadge({
  lines,
  ringText,
  color = "#5eead4",
  size = 110,
  wobble = -8,
}: {
  lines: string[];
  ringText: string;
  color?: string;
  size?: number;
  wobble?: number;
}) {
  return (
    <motion.div
      animate={{ rotate: [wobble, wobble + 5, wobble] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "relative", width: `${size}px`, height: `${size}px` }}
    >
      {/* Spinning ring text */}
      <motion.svg
        viewBox="0 0 110 110"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          {/* Start at right (97,55), sweep counter-clockwise over the top. Text reads left-to-right on the outer top arc. */}
          <path id={`stickerRing-${ringText.slice(0, 5)}`} d="M 97,55 a 42,42 0 1,0 -84,0" />
        </defs>
        <polygon
          points="55,4 66,20 84,12 87,31 106,34 98,51 110,63 97,73 103,92 84,93 77,110 58,103 45,115 34,100 14,105 13,86 0,76 8,57 0,41 19,35 18,16 37,16 44,2 55,4"
          fill={color} opacity="0.9"
        />
        <polygon
          points="55,14 64,27 80,20 83,36 99,39 92,54 103,64 92,73 97,89 81,90 75,105 59,99 48,109 38,97 21,101 20,85 7,75 15,60 8,46 24,40 23,24 39,24 46,12 55,14"
          fill="none" stroke="white" strokeWidth="1" opacity="0.5"
        />
        <text style={{ fontSize: "8.5px", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "2.5px", fill: "white" }}>
          <textPath href={`#stickerRing-${ringText.slice(0, 5)}`}>{ringText}</textPath>
        </text>
      </motion.svg>
      {/* Center text */}
      <div style={{
        position: "absolute", inset: "26px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center",
      }}>
        {lines.map((line, i) => (
          <span key={i} style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "9.5px", letterSpacing: "0.8px", color: "white", lineHeight: 1.3 }}>
            {line}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

const footerLinks = {
  Products: ["Freeze Dried Fruits", "Freeze Dried Vegetables", "Freeze Dried Baby Food", "Ready-to-Eat Meals"],
  Company: ["About Us", "Our Story", "Our Mission", "News & Media", "Sustainability"],
  Recipes: ["Baby Purees", "Snack Ideas", "Rehydrated Meals", "Lunchbox Ideas", "Quick Meals"],
  Help: ["FAQ", "Contact Us", "Wholesale Enquiries"],
};

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
  { icon: Youtube, label: "YouTube" },
];

export function Footer() {
  return (
    <footer id="contact" className="bg-[#111] text-white/60">
      {/* Main */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div
              className="text-white mb-6"
              style={{
                fontFamily: "'Gagalin', sans-serif",
                fontSize: "30px",
                fontWeight: 900,
                background: "linear-gradient(135deg, #5eead4 0%, #c4b5fd 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              NutroFreeze
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: 1.8 }}>
              NutroFreeze delivers pure, wholesome freeze-dried foods for families who want real nutrition without additives or preservatives. Born from a mother's promise, for every child, every day.
            </p>

            <div className="flex items-center gap-2 mt-4 mb-6">
              <span
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700, color: "#5eead4" }}
              >
                A Mom's Promise · Pure Nutrition
              </span>
            </div>

            <div className="flex gap-3">
              {socials.map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center hover:bg-[#0d9488] hover:border-[#0d9488] hover:text-white transition-all text-white/60"
                  whileHover={{ scale: 1.1, y: -2 }}
                >
                  <Icon size={15} />
                </motion.a>
              ))}
            </div>

            {/* Linktree QR Code */}
            <div className="mt-6">
              <p
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#5eead4",
                  marginBottom: "10px",
                }}
              >
                Scan to connect with us
              </p>
              <div
                style={{
                  width: "110px",
                  height: "110px",
                  background: "white",
                  borderRadius: "12px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/qr-linktree.png"
                  alt="NutroFreeze Linktree QR Code"
                  style={{ width: "98px", height: "98px", objectFit: "contain", display: "block" }}
                />
              </div>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "11px",
                  color: "rgba(255,255,255,0.35)",
                  marginTop: "6px",
                }}
              >
                linktree.com/nutrofreeze
              </p>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "14px", fontWeight: 800, color: "white", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "14px" }}
              >
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="hover:text-[#5eead4] transition-colors"
                      style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px" }}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Mandala + Sticker badges strip — Brars style */}
      <div className="border-t border-white/5 py-8 relative overflow-hidden">
        {/* Spinning mandala — decorative background element */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
          <SpinMandala size={220} color="#5eead4" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap items-center justify-center gap-6">
          <StickerBadge
            ringText="SINCE 2024 · NUTROFREEZE · SINCE 2024 ·&nbsp;"
            lines={["SINCE", "2024", "★"]}
            color="#5eead4"
            wobble={-9}
          />
          <StickerBadge
            ringText="PURE NUTRITION · NO ADDITIVES ·&nbsp;"
            lines={["PURE", "NUTRITION"]}
            color="#7c3aed"
            wobble={6}
          />
          <StickerBadge
            ringText="HALAL CERTIFIED · FREEZE DRIED · HALAL CERTIFIED ·&nbsp;"
            lines={["HALAL", "CERTIFIED", "★"]}
            color="#0d9488"
            wobble={-12}
          />
        </div>
      </div>

      {/* Awards */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-wrap justify-center gap-6">
          {["Freeze Dried Nutrition", "No Artificial Preservatives", "No Added Sugar", "Baby & Family Safe", "A Mom's Promise"].map((a) => (
            <span key={a} style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", letterSpacing: "1px" }}>
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/5 py-5">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}>
            © 2026 Nutrofreeze Foods Inc. All rights reserved.
          </p>
          <p className="flex items-center gap-1" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}>
            Made with <Heart size={12} className="text-[#5eead4]" fill="currentColor" /> by NutroFreeze &middot; nutrofreeze@gmail.com &middot; +65 8503 9022
          </p>
          <div className="flex gap-4">
            {["Privacy Policy", "Terms of Use", "Cookie Policy"].map((l) => (
              <a key={l} href="#" className="hover:text-[#5eead4] transition-colors" style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}