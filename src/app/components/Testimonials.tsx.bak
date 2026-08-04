import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Star } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Sarah T.",
    location: "Singapore",
    rating: 5,
    text: "The freeze dried mixed fruits are amazing for my kids. They love the crunchy texture and I love knowing there are no preservatives or added sugar. Goes straight into every lunchbox.",
    product: "Freeze Dried Fruits",
    avatar: "S",
    accentTeal: true,
  },
  {
    id: 2,
    name: "Marcus L.",
    location: "Singapore",
    rating: 5,
    text: "The ready to eat meals are a lifesaver on busy weeknights. Just add water and you have a proper nutritious meal in minutes. Quality is outstanding and nothing artificial inside.",
    product: "Ready to Eat Meals",
    avatar: "M",
    accentTeal: false,
  },
  {
    id: 3,
    name: "Priya K.",
    location: "Singapore",
    rating: 5,
    text: "The baby food range is the best I have found for my little one. No salt, no preservatives, just pure ingredients. My baby loves it and I feel confident giving it every single day.",
    product: "Baby Food",
    avatar: "P",
    accentTeal: true,
  },
  {
    id: 4,
    name: "Wei Ling C.",
    location: "Singapore",
    rating: 5,
    text: "The freeze dried vegetables are genuinely so convenient. I add them to soups and stir fries and they rehydrate perfectly. You can taste the freshness. Will not buy any other brand.",
    product: "Freeze Dried Vegetables",
    avatar: "W",
    accentTeal: false,
  },
];

export function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-[#faf8f4]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <div
            className="inline-block px-5 py-2 rounded-full bg-[#ccfbf1] mb-5"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "#0d9488", textTransform: "uppercase" }}
          >
            Reviews
          </div>
          <h2
            style={{
              fontFamily: "'Gagalin', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(32px, 5vw, 54px)",
              color: "#0f172a",
              lineHeight: 1.0,
              letterSpacing: "-1px",
            }}
          >
            Loved by<br /><span style={{ color: "#0d9488" }}>Families</span>
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.id}
              className="bg-white rounded-3xl p-7 shadow-sm border border-gray-100 relative overflow-hidden group"
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.1, duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -6, boxShadow: "0 24px 60px rgba(0,0,0,0.10)" }}
            >
              {/* Color accent bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1 rounded-t-3xl"
                style={{ backgroundColor: t.accentTeal ? "#0d9488" : "#7c3aed" }}
              />

              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={16} fill={t.accentTeal ? "#0d9488" : "#7c3aed"} color={t.accentTeal ? "#0d9488" : "#7c3aed"} />
                ))}
              </div>

              <p
                className="mb-6"
                style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "15px", color: "#444", lineHeight: 1.75, fontStyle: "italic" }}
              >
                "{t.text}"
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0"
                    style={{
                      backgroundColor: t.accentTeal ? "#0d9488" : "#7c3aed",
                      fontFamily: "'Syne', sans-serif",
                      fontSize: "16px",
                      fontWeight: 800,
                    }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: "15px", fontWeight: 700, color: "#0f172a" }}>{t.name}</div>
                    <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "12px", color: "#888" }}>{t.location}</div>
                  </div>
                </div>
                <div
                  className="px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: t.accentTeal ? "#ccfbf1" : "#ede9fe",
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: t.accentTeal ? "#0d9488" : "#7c3aed",
                  }}
                >
                  {t.product}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats bar — removed */}
      </div>
    </section>
  );
}