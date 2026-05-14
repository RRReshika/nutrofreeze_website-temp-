import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";

const tabs = ["Latest News", "Company Updates", "Product News"];

const articles = {
  "Latest News": [
    {
      id: 1,
      date: "March 1, 2026",
      headline: "NUTROFREEZE WINS BEST HEALTH FOOD BRAND 2026",
      excerpt: 'The \"Pure Nutrition For Every Family\" campaign earned recognition across two categories at the Singapore Health and Wellness Awards.',
      img: "https://images.unsplash.com/photo-1758523671087-b256bbbca475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMHdvbWFuJTIwbW92aW5nJTIwYm94ZXMlMjBob21lJTIwZmFtaWx5fGVufDF8fHx8MTc3MjQ5NzE4MXww&ixlib=rb-4.1.0&q=80&w=800",
      tag: "Award",
      tagBg: "#0d9488",
    },
    {
      id: 2,
      date: "February 18, 2026",
      headline: "NUTROFREEZE NOW AVAILABLE IN MORE STORES ACROSS SINGAPORE",
      excerpt: "We are expanding our retail presence so more families can access pure, wholesome freeze-dried nutrition conveniently.",
      img: "https://images.unsplash.com/photo-1649011401502-8b6125f33c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcHJvZHVjdCUyMGxhdW5jaCUyMGFubm91bmNlbWVudCUyMG5ld3N8ZW58MXx8fHwxNzcyNDk3MTg1fDA&ixlib=rb-4.1.0&q=80&w=800",
      tag: "Growth",
      tagBg: "#7c3aed",
    },
  ],
  "Company Updates": [
    {
      id: 3,
      date: "January 30, 2026",
      headline: "A NEW CHAPTER FOR OUR BRAND",
      excerpt: "We are sharing our sustainability roadmap and our commitment to providing pure, additive-free nutrition for every family in Singapore and beyond.",
      img: "https://images.unsplash.com/photo-1758874960855-3f74e8704a1d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGZhbWlseSUyMGNvb2tpbmclMjB0b2dldGhlciUyMGtpdGNoZW58ZW58MXx8fHwxNzcyNDk3MTg1fDA&ixlib=rb-4.1.0&q=80&w=800",
      tag: "Company",
      tagBg: "#0d9488",
    },
    {
      id: 4,
      date: "December 14, 2025",
      headline: "CERTIFIED: OUR COMMITMENT TO QUALITY AND PURITY",
      excerpt: "NutroFreeze has achieved food safety and quality certifications, a testament to our values of people, planet, and food made the right way.",
      img: "https://images.unsplash.com/photo-1649011401502-8b6125f33c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb29kJTIwcHJvZHVjdCUyMGxhdW5jaCUyMGFubm91bmNlbWVudCUyMG5ld3N8ZW58MXx8fHwxNzcyNDk3MTg1fDA&ixlib=rb-4.1.0&q=80&w=800",
      tag: "Milestone",
      tagBg: "#7c3aed",
    },
  ],
  "Product News": [
    {
      id: 5,
      date: "February 28, 2026",
      headline: "INTRODUCING FREEZE DRIED TROPICAL FRUIT MIX",
      excerpt: "Our newest product is finally here. Freeze dried mango, pineapple and papaya in one pack, no added sugar and packed with natural vitamins.",
      img: "https://images.unsplash.com/photo-1694101493160-10f1257fe9fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbG9vJTIwdGlra2klMjBwb3RhdG8lMjBwYXR0eSUyMHNuYWNrfGVufDF8fHx8MTc3MTk5MTE5Mnww&ixlib=rb-4.1.0&q=80&w=800",
      tag: "New Product",
      tagBg: "#0d9488",
    },
    {
      id: 6,
      date: "January 10, 2026",
      headline: "BABY FOOD BUNDLE PACKS NOW AVAILABLE ALL YEAR",
      excerpt: "By popular demand, our baby food bundles are now a permanent part of our lineup, available all year so you never run out.",
      img: "https://images.unsplash.com/photo-1615592602926-a3bfacbc1cbd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcm96ZW4lMjBmb29kJTIwc25hY2tzJTIwcGFja2FnaW5nJTIwcHJvZHVjdHxlbnwxfHx8fDE3NzE5OTExOTB8MA&ixlib=rb-4.1.0&q=80&w=800",
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
    <section id="news" className="bg-white py-16" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header row */}
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <div
              className="inline-block px-4 py-1.5 rounded-full bg-[#ccfbf1] mb-3"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 800, letterSpacing: "3px", color: "#0d9488", textTransform: "uppercase" }}
            >
              News & Updates
            </div>
            <h2
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(32px, 5vw, 64px)",
                color: "#1c1c1e",
                textTransform: "uppercase",
                lineHeight: 0.95,
                letterSpacing: "0.03em",
              }}
            >
              STAY IN THE<br /><span style={{ color: "#0d9488" }}>KNOW</span>
            </h2>
          </div>
          <motion.a
            href="#"
            className="hidden md:flex items-center gap-2 border-2 border-[#1c1c1e] text-[#1c1c1e] px-6 py-2.5 rounded-full hover:bg-[#1c1c1e] hover:text-white transition-all"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap" }}
            whileHover={{ scale: 1.04 }}
          >
            View More <ArrowRight size={15} />
          </motion.a>
        </motion.div>

        {/* Main card + side tabs layout */}
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          {/* Left vertical label */}
          <div
            className="hidden lg:flex items-center justify-center bg-[#1c1c1e] rounded-2xl px-3 py-6 flex-shrink-0"
            style={{ width: "52px", writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <span
              style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "13px",
                fontWeight: 900,
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#5eead4",
                transform: "rotate(180deg)",
                display: "block",
              }}
            >
              {activeTab}
            </span>
          </div>

          {/* Featured article */}
          <AnimatePresence mode="wait">
            <motion.div
              key={featured.id}
              className="flex-1 rounded-2xl overflow-hidden flex flex-col md:flex-row"
              style={{ backgroundColor: "#f0fdf4", minHeight: "380px" }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Image */}
              <div className="md:w-[44%] relative overflow-hidden flex-shrink-0">
                <img
                  src={featured.img}
                  alt={featured.headline}
                  className="w-full h-64 md:h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f0fdf4]/30" />
              </div>

              {/* Content */}
              <div className="flex-1 p-7 md:p-10 flex flex-col justify-center">
                <div
                  className="text-sm mb-3"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: "#666" }}
                >
                  {featured.date}
                </div>
                <h3
                  style={{
                    fontFamily: "'Bangers', cursive",
                    fontSize: "clamp(22px, 3.5vw, 40px)",
                    color: "#1c1c1e",
                    textTransform: "uppercase",
                    lineHeight: 1.0,
                    letterSpacing: "0.03em",
                    marginBottom: "14px",
                  }}
                >
                  {featured.headline}
                </h3>
                <p
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", color: "#555", lineHeight: 1.7, marginBottom: "20px" }}
                >
                  {featured.excerpt}
                </p>
                <motion.a
                  href="#"
                  className="inline-flex items-center gap-2 bg-[#1c1c1e] text-white px-6 py-3 rounded-full self-start hover:bg-[#0d9488] transition-all"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700 }}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Read More <ArrowRight size={14} />
                </motion.a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right tab strip */}
          <div className="hidden lg:flex flex-col gap-2 flex-shrink-0" style={{ width: "160px" }}>
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 rounded-2xl flex items-center justify-center transition-all duration-200 relative overflow-hidden"
                style={{
                  backgroundColor: activeTab === tab ? "#0d9488" : "#ede9fe",
                  writingMode: "vertical-rl",
                  textOrientation: "mixed",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: "12px",
                    fontWeight: 900,
                    letterSpacing: "3px",
                    textTransform: "uppercase",
                    color: activeTab === tab ? "white" : "#7c3aed",
                    transform: "rotate(180deg)",
                    display: "block",
                    padding: "16px 0",
                  }}
                >
                  {tab}
                </span>
                {activeTab === tab && (
                  <motion.div
                    className="absolute inset-0 bg-white/10"
                    layoutId="activeTab"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Mobile tab switcher */}
        <div className="flex lg:hidden gap-2 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 rounded-xl text-center transition-all"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "12px",
                fontWeight: 700,
                backgroundColor: activeTab === tab ? "#0d9488" : "#ede9fe",
                color: activeTab === tab ? "white" : "#7c3aed",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Secondary article (smaller) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={secondary.id}
            className="mt-4 rounded-2xl overflow-hidden flex gap-5 items-center p-5 bg-[#faf5ff] border border-[#ede9fe]"
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
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", color: "#999", marginBottom: "4px" }}>
                {secondary.date}
              </div>
              <h4
                className="truncate"
                style={{ fontFamily: "'Bangers', cursive", fontSize: "22px", color: "#1c1c1e", textTransform: "uppercase", letterSpacing: "0.03em" }}
              >
                {secondary.headline}
              </h4>
              <p
                className="mt-1 line-clamp-1"
                style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", color: "#666" }}
              >
                {secondary.excerpt}
              </p>
            </div>
            <a
              href="#"
              className="hidden sm:flex items-center gap-1 text-[#7c3aed] flex-shrink-0"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700 }}
            >
              Read <ArrowRight size={13} />
            </a>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}