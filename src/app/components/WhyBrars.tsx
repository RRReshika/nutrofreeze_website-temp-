import { useRef } from "react";
import { motion, useInView } from "motion/react";

const steps = [
  {
    num: "01",
    title: "Find Your Favourite",
    desc: "Browse our range of frozen South Asian snacks — from Dahi Ke Kebab to crispy Samosas. Something for everyone.",
    icon: "🔍",
    color: "#0d9488",
  },
  {
    num: "02",
    title: "Find a Retailer",
    desc: "Available at major Canadian grocery chains including Costco, Real Canadian Superstore, T&T, and more.",
    icon: "🏪",
    color: "#7c3aed",
  },
  {
    num: "03",
    title: "Cook in Minutes",
    desc: "From freezer to table in under 15 minutes. Bake, fry or air fry — they come out perfect every time.",
    icon: "⏱️",
    color: "#0d9488",
  },
  {
    num: "04",
    title: "Enjoy & Share",
    desc: "Serve up at parties, family dinners, or just a late-night snack. The flavour speaks for itself.",
    icon: "🎉",
    color: "#7c3aed",
  },
];

export function WhyBrars() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#f7f4ef]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div
            className="inline-block px-5 py-2 rounded-full bg-[#0f172a] mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "white", textTransform: "uppercase" }}
          >
            How It Works
          </div>
          <h2
            style={{
              fontFamily: "'Syne', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(36px, 6vw, 70px)",
              color: "#0f172a",
              textTransform: "uppercase",
              lineHeight: 0.95,
              letterSpacing: "-2px",
            }}
          >
            FROM FREEZER<br /><span style={{ color: "#7c3aed" }}>TO TABLE IN MINUTES</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative bg-white rounded-3xl p-7 shadow-sm overflow-hidden group"
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -8, boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}
            >
              {/* Step number (bg) */}
              <div
                className="absolute top-4 right-4 opacity-10 group-hover:opacity-20 transition-opacity"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "80px",
                  fontWeight: 800,
                  lineHeight: 1,
                  color: step.color,
                }}
              >
                {step.num}
              </div>

              {/* Icon */}
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-5"
                style={{ backgroundColor: step.color + "20" }}
              >
                {step.icon}
              </div>

              {/* Step badge */}
              <div
                className="inline-block px-3 py-1 rounded-full mb-3"
                style={{ backgroundColor: step.color, fontFamily: "'Space Grotesk', sans-serif", fontSize: "11px", fontWeight: 700, color: "white", letterSpacing: "1px" }}
              >
                STEP {step.num}
              </div>

              <h3
                style={{ fontFamily: "'Syne', sans-serif", fontSize: "20px", fontWeight: 800, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", lineHeight: 1.2, marginBottom: "10px" }}
              >
                {step.title}
              </h3>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", color: "#64748b", lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}