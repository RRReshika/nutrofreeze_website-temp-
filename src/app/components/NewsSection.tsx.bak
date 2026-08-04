import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";

const tabs = ["Latest News", "Company Updates", "Product News"];

const tabColors: Record<string, string> = {
  "Latest News": "#0d9488",
  "Company Updates": "#7c3aed",
  "Product News": "#0891b2",
};

const articles = {
  "Latest News": [
    {
      id: 1,
      date: "March 1, 2026",
      headline: "NUTROFREEZE WINS BEST HEALTH FOOD BRAND 2026",
      excerpt:
        'The "Pure Nutrition For Every Family" campaign earned recognition across two categories at the Singapore Health and Wellness Awards.',
      img: "/images/other%20images/healthy%20bowl.png",
      tag: "Award",
      tagBg: "#0d9488",
    },
    {
      id: 2,
      date: "February 18, 2026",
      headline: "NUTROFREEZE NOW AVAILABLE IN MORE STORES ACROSS SINGAPORE",
      excerpt:
        "We are expanding our retail presence so more families can access pure, wholesome freeze-dried nutrition conveniently.",
      img: "/images/big%20packets%20no%20background/WB_Apple__front_png-removebg-preview.png",
      tag: "Growth",
      tagBg: "#7c3aed",
    },
  ],

  "Company Updates": [
    {
      id: 3,
      date: "January 30, 2026",
      headline: "A NEW CHAPTER FOR OUR BRAND",
      excerpt:
        "We are sharing our sustainability roadmap and our commitment to providing pure, additive-free nutrition for every family in Singapore and beyond.",
      img: "/images/mom%27s%20touch%20pic.png",
      tag: "Company",
      tagBg: "#0d9488",
    },
    {
      id: 4,
      date: "December 14, 2025",
      headline: "CERTIFIED: OUR COMMITMENT TO QUALITY AND PURITY",
      excerpt:
        "NutroFreeze has achieved food safety and quality certifications, a testament to our values of people, planet, and food made the right way.",
      img: "/images/big%20packets%20no%20background/WB_Mango_front-removebg-preview.png",
      tag: "Milestone",
      tagBg: "#7c3aed",
    },
  ],

  "Product News": [
    {
      id: 5,
      date: "February 28, 2026",
      headline: "INTRODUCING FREEZE DRIED TROPICAL FRUIT MIX",
      excerpt:
        "Our newest product is finally here. Freeze dried mango, pineapple and papaya in one pack, no added sugar and packed with natural vitamins.",
      img: "/images/Mango/PC%20Mango.png",
      tag: "New Product",
      tagBg: "#0d9488",
    },

    {
      id: 6,
      date: "January 10, 2026",
      headline: "BABY FOOD BUNDLE PACKS NOW AVAILABLE ALL YEAR",
      excerpt:
        "By popular demand, our baby food bundles are now a permanent part of our lineup, available all year so you never run out.",
      img: "/images/other%20images/puree.png",
      tag: "Product Update",
      tagBg: "#7c3aed",
    },
  ],
};

export function NewsSection() {
  const [activeTab, setActiveTab] = useState("Latest News");
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const currentArticles = articles[activeTab as keyof typeof articles];
  const featured = currentArticles[0];
  const secondary = currentArticles[1];

  return (
    <section
      id="news"
      ref={ref}
      style={{ backgroundColor: "#0f172a", padding: "80px 0 80px" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* ── CENTERED HEADER ── */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div
            className="inline-block px-5 py-2 rounded-full mb-5"
            style={{
              backgroundColor: "#0d9488",
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "11px",
              fontWeight: 800,
              letterSpacing: "3px",
              color: "white",
              textTransform: "uppercase",
            }}
          >
            What's New
          </div>

          <h2
            style={{
              fontFamily: "'Bangers', cursive",
              fontSize: "clamp(52px, 10vw, 120px)",
              color: "white",
              textTransform: "uppercase",
              lineHeight: 0.9,
              letterSpacing: "0.02em",
              marginBottom: "32px",
            }}
          >
            THE WORLD OF
            <br />
            <span style={{ color: "#5eead4" }}>NUTROFREEZE</span>
          </h2>

          <motion.a
            href="#"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "#1c1c1e",
              color: "white",
              padding: "14px 32px",
              borderRadius: "100px",
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: 700,
              fontSize: "15px",
              textDecoration: "none",
              border: "2px solid rgba(255,255,255,0.12)",
            }}
            whileHover={{ backgroundColor: "#0d9488", scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
          >
            View More <ArrowRight size={16} />
          </motion.a>
        </motion.div>

        {/* ── MAIN CARD + SIDE TABS ── */}
        <motion.div
          className="flex gap-3 items-stretch"
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          {/* Featured article card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              className="flex-1 rounded-3xl overflow-hidden flex flex-col lg:flex-row"
              style={{
                background: `linear-gradient(135deg, ${tabColors[activeTab]}22 0%, ${tabColors[activeTab]}44 100%)`,
                border: `1px solid ${tabColors[activeTab]}55`,
                minHeight: "560px",
              }}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 24 }}
              transition={{ duration: 0.45 }}
            >
              {/* Image */}
              <div className="lg:w-[42%] h-[360px] lg:h-auto relative overflow-hidden flex-shrink-0">
                <img
                  src={featured.img}
                  alt={featured.headline}
                  className="w-full h-full object-cover"
                />

                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, transparent 60%, rgba(15,23,42,0.4))",
                  }}
                />

                <div
                  className="absolute top-4 left-4 px-3 py-1.5 rounded-full"
                  style={{
                    backgroundColor: featured.tagBg,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "11px",
                    fontWeight: 800,
                    letterSpacing: "2px",
                    color: "white",
                    textTransform: "uppercase",
                  }}
                >
                  {featured.tag}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-8 lg:p-12 flex flex-col justify-center">
                <div
                  style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "13px",
                    color: "rgba(255,255,255,0.45)",
                    marginBottom: "12px",
                    letterSpacing: "0.5px",
                  }}
                >
                  {featured.date}
                </div>

                <h3
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "clamp(28px, 3.8vw, 48px)",
                    color: "white",
                    textTransform: "uppercase",
                    lineHeight: 1.05,
                    letterSpacing: "0.03em",
                    marginBottom: "20px",
                  }}
                >
                  {featured.headline}
                </h3>

                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: "16px",
                    color: "rgba(255,255,255,0.65)",
                    lineHeight: 1.75,
                    marginBottom: "28px",
                    maxWidth: "620px",
                  }}
                >
                  {featured.excerpt}
                </p>

                <motion.a
                  href="#"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    backgroundColor: "white",
                    color: "#1c1c1e",
                    padding: "14px 30px",
                    borderRadius: "100px",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "14px",
                    fontWeight: 700,
                    textDecoration: "none",
                    alignSelf: "flex-start",
                  }}
                  whileHover={{ backgroundColor: "#5eead4", scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Read More <ArrowRight size={14} />
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right vertical tab strip */}
          <div
            className="hidden lg:flex flex-col gap-2 flex-shrink-0"
            style={{ width: "180px" }}
          >
            {tabs.map((tab) => {
              const isActive = activeTab === tab;
              const color = tabColors[tab];

              return (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="flex-1 rounded-2xl flex items-center justify-center relative overflow-hidden cursor-pointer"
                  style={{
                    backgroundColor: isActive ? color : "#1c1c1e",
                    border: isActive
                      ? `2px solid ${color}`
                      : "2px solid rgba(255,255,255,0.06)",
                    writingMode: "vertical-rl",
                    textOrientation: "mixed",
                    transition: "all 0.25s ease",
                  }}
                  whileHover={{
                    scale: 1.03,
                    backgroundColor: isActive ? color : "#252535",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "13px",
                      fontWeight: 900,
                      letterSpacing: "3px",
                      textTransform: "uppercase",
                      color: isActive ? "white" : "rgba(255,255,255,0.4)",
                      transform: "rotate(180deg)",
                      display: "block",
                      padding: "20px 0",
                    }}
                  >
                    {tab}
                  </span>

                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      layoutId="newsActiveTab"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Mobile tab switcher */}
        <div className="flex lg:hidden gap-2 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2.5 rounded-xl text-center transition-all"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                backgroundColor:
                  activeTab === tab ? tabColors[tab] : "#1c1c1e",
                color:
                  activeTab === tab ? "white" : "rgba(255,255,255,0.45)",
                border: `2px solid ${activeTab === tab
                    ? tabColors[tab]
                    : "rgba(255,255,255,0.06)"
                  }`,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Secondary article */}
        <AnimatePresence mode="wait">
          <motion.div
            key={secondary.id}
            className="mt-4 rounded-2xl overflow-hidden flex gap-4 items-center p-5"
            style={{
              backgroundColor: "#1c1c1e",
              border: "1px solid rgba(255,255,255,0.07)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <img
              src={secondary.img}
              alt={secondary.headline}
              className="w-24 h-20 object-cover rounded-xl flex-shrink-0"
            />

            <div className="flex-1 min-w-0">
              <div
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.35)",
                  marginBottom: "4px",
                }}
              >
                {secondary.date}
              </div>

              <h4
                className="truncate"
                style={{
                  fontFamily: "'Bangers', cursive",
                  fontSize: "22px",
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.03em",
                }}
              >
                {secondary.headline}
              </h4>

              <p
                className="mt-1 line-clamp-1"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.45)",
                }}
              >
                {secondary.excerpt}
              </p>
            </div>

            <motion.a
              href="#"
              className="hidden sm:flex items-center gap-1 flex-shrink-0"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "13px",
                fontWeight: 700,
                color: "#5eead4",
                textDecoration: "none",
              }}
              whileHover={{ gap: "6px" }}
            >
              Read <ArrowRight size={13} />
            </motion.a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}