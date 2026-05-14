import { useRef } from "react";
import { motion, useInView } from "motion/react";

const PRODUCT_IMG = "https://images.unsplash.com/photo-1643494847705-74808059bf07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcm96ZW4lMjBmb29kJTIwcHJvZHVjdHMlMjBzcHJlYWQlMjBhcnJhbmdlbWVudHxlbnwxfHx8fDE3NzM4NDU5Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080";

// Circular spinning badge
function SpinBadge() {
  return (
    <div style={{ position: "relative", width: "120px", height: "120px" }}>
      <motion.svg
        viewBox="0 0 120 120"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        animate={{ rotate: 360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path
            id="circleText"
            d="M 60,60 m -42,0 a 42,42 0 1,1 84,0 a 42,42 0 1,1 -84,0"
          />
        </defs>
        <circle cx="60" cy="60" r="54" fill="none" stroke="#0d9488" strokeWidth="2" opacity="0.4" />
        <text style={{ fontSize: "9.5px", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "4px", fill: "#0d9488" }}>
          <textPath href="#circleText">
            FREEZE DRIED · PURE NUTRITION · NO ADDITIVES ·&nbsp;
          </textPath>
        </text>
      </motion.svg>
      {/* Center icon */}
      <div style={{
        position: "absolute", inset: "28px",
        borderRadius: "50%", background: "#0d9488",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg viewBox="0 0 24 24" fill="white" style={{ width: "28px", height: "28px" }}>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </div>
    </div>
  );
}

// Stamp badge (bottom-left)
function StampBadge() {
  return (
    <motion.div
      animate={{ rotate: [-8, -12, -8] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      style={{ position: "relative", width: "150px", height: "150px" }}
    >
      <svg viewBox="0 0 110 110" style={{ width: "100%", height: "100%" }}>
        <polygon
          points="55,4 66,20 84,12 87,31 106,34 98,51 110,63 97,73 103,92 84,93 77,110 58,103 45,115 34,100 14,105 13,86 0,76 8,57 0,41 19,35 18,16 37,16 44,2 55,4"
          fill="#7c3aed" opacity="0.95"
        />
        <polygon
          points="55,14 64,27 80,20 83,36 99,39 92,54 103,64 92,73 97,89 81,90 75,105 59,99 48,109 38,97 21,101 20,85 7,75 15,60 8,46 24,40 23,24 39,24 46,12 55,14"
          fill="none" stroke="white" strokeWidth="1.2" opacity="0.6"
        />
      </svg>
      <div style={{
        position: "absolute", inset: "28px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center",
      }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "11px", letterSpacing: "1px", color: "white", lineHeight: 1.3 }}>
          FROZEN<br />THE NUTRO<br />WAY<br />★<br />FROZEN<br />THE NUTRO<br />WAY
        </span>
      </div>
    </motion.div>
  );
}

export function OurStory() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} id="our-story" style={{ background: "#fafaf7", overflow: "hidden", position: "relative" }}>

      {/* ── TOP HUGE HEADLINE ── */}
      <div style={{ padding: "48px 40px 0", overflow: "hidden" }}>
        <motion.h2
          initial={{ y: "110%", opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: "clamp(52px, 11.5vw, 150px)",
            lineHeight: 0.88,
            margin: 0,
            color: "#0f0f0f",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          BORN FROM A<br />MOM'S DREAM,
        </motion.h2>
      </div>

      {/* ── MIDDLE: IMAGE + TEXT ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        position: "relative",
        marginTop: "-28px",
        zIndex: 2,
      }}>

        {/* Product image — 62% width */}
        <motion.div
          initial={{ scale: 1.06, opacity: 0 }}
          animate={inView ? { scale: 1, opacity: 1 } : {}}
          transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ flex: "0 0 62%", minWidth: "320px", position: "relative", overflow: "hidden" }}
        >
          <img
            src={PRODUCT_IMG}
            alt="NutroFreeze products"
            style={{ width: "100%", height: "clamp(320px, 42vw, 560px)", objectFit: "cover", display: "block" }}
          />
          {/* Bottom-left stamp */}
          <div style={{ position: "absolute", bottom: "28px", left: "28px", zIndex: 10 }}>
            <StampBadge />
          </div>
        </motion.div>

        {/* Right text panel */}
        <motion.div
          initial={{ x: 60, opacity: 0 }}
          animate={inView ? { x: 0, opacity: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{
            flex: "1 1 280px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 56px 48px 48px",
            background: "#fafaf7",
            position: "relative",
          }}
        >
          {/* Spin badge — top right corner */}
          <div style={{ position: "absolute", top: "28px", right: "28px" }}>
            <SpinBadge />
          </div>

          <p style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: "clamp(15px, 1.5vw, 18px)",
            color: "#2d2d2d",
            lineHeight: 1.7,
            maxWidth: "380px",
            marginBottom: "32px",
            marginTop: "80px",
          }}>
            NutroFreeze was founded by a mother who sought a better way to nourish her child in today's fast-paced environment. Frustrated by the lack of convenient, high-quality options free from additives, she discovered freeze-drying, a gentle method that locks in natural flavours, vitamins, and nutrients with no preservatives. Every product is crafted with the same care any parent would expect for their own child.
          </p>

          <motion.a
            href="#"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "10px",
              backgroundColor: "#0f0f0f",
              color: "white",
              padding: "14px 28px",
              borderRadius: "0",
              textDecoration: "none",
              fontFamily: "'Gagalin', sans-serif",
              fontSize: "16px",
              letterSpacing: "1px",
              alignSelf: "flex-start",
              boxShadow: "4px 4px 0px #0d9488",
            }}
          >
            Learn More
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </motion.a>
        </motion.div>
      </div>

      {/* ── BOTTOM HUGE HEADLINE ── */}
      <div style={{ padding: "0 40px 52px", overflow: "hidden", marginTop: "8px" }}>
        <motion.h2
          initial={{ y: "110%", opacity: 0 }}
          animate={inView ? { y: 0, opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: "'Bangers', cursive",
            fontSize: "clamp(52px, 11.5vw, 150px)",
            lineHeight: 0.88,
            margin: 0,
            color: "#0f0f0f",
            textTransform: "uppercase",
            letterSpacing: "0.03em",
          }}
        >
          REAL NUTRITION,<br />REAL CONVENIENCE
        </motion.h2>
      </div>

    </section>
  );
}