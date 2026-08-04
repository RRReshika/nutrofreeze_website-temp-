import { motion } from "motion/react";

const items = [
  "Freeze Dried Nutrition",
  "No Additives or Preservatives",
  "Baby and Family Friendly",
  "Just Add Water",
  "Freeze Dried Fruits",
  "Freeze Dried Vegetables",
  "Freeze Dried Baby Food",
  "Ready to Eat Meals",
];

export function MarqueeBanner() {
  const doubled = [...items, ...items];

  return (
    <div className="bg-[#0f172a] py-4 overflow-hidden border-t border-white/5">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 text-white/80 mx-8"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", letterSpacing: "3px", fontWeight: 700, textTransform: "uppercase" }}
          >
            {item}
            <span className="text-[#5eead4] mx-1">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}