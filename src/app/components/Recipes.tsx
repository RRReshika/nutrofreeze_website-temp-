import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router";

const recipes = [
  {
    id: 1,
    name: "Mixed Berry Smoothie Bowl",
    time: "10 min",
    serves: "2",
    difficulty: "Easy",
    tag: "5-STAR",
    tagColor: "#0d9488",
    img: "https://images.unsplash.com/photo-1576777647084-cac2dd176310?w=700&q=90",
    desc: "Thick, creamy and loaded with our frozen mixed berry blend. Top with granola and fresh fruit for the ultimate breakfast.",
  },
  {
    id: 2,
    name: "Broccoli Power Stir Fry",
    time: "12 min",
    serves: "3",
    difficulty: "Easy",
    tag: "CLEAN EATS",
    tagColor: "#7c3aed",
    img: "https://images.unsplash.com/photo-1662611284583-f34180194370?w=700&q=90",
    desc: "Our broccoli florets and spinach wok-tossed in garlic and ginger. Serve over rice for a weeknight dinner everyone loves.",
  },
  {
    id: 3,
    name: "Gym Meal Prep Sunday",
    time: "20 min",
    serves: "5",
    difficulty: "Easy",
    tag: "HIGH PROTEIN",
    tagColor: "#0d9488",
    img: "https://images.unsplash.com/photo-1679279726937-122c49626802?w=700&q=90",
    desc: "Five days of high-protein meals using our Protein Quinoa Bowl. One prep session, entire week sorted.",
  },
];

export function Recipes() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="recipes" className="py-24 bg-[#0f172a] overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div
              className="inline-block px-5 py-2 rounded-full bg-[#0d9488] mb-5"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 700, letterSpacing: "3px", color: "white", textTransform: "uppercase" }}
            >
              Recipes
            </div>
            <h2
              style={{
                fontFamily: "'Bangers', cursive",
                fontSize: "clamp(36px, 6vw, 72px)",
                color: "white",
                lineHeight: 0.95,
                letterSpacing: "0.03em",
                textTransform: "uppercase",
              }}
            >
              Dine with<br /><span style={{ color: "#5eead4" }}>Nutrofreeze</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3 }}
          >
            <Link
              to="/recipes"
              className="hidden md:inline-flex items-center gap-2 border-2 border-[#5eead4] text-[#5eead4] px-7 py-3 rounded-full hover:bg-[#5eead4] hover:text-[#0f172a] transition-all"
              style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, whiteSpace: "nowrap", textDecoration: "none" }}
            >
              All Recipes <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              className="group cursor-pointer rounded-3xl overflow-hidden bg-[#1c2439]"
              initial={{ opacity: 0, y: 50, scale: 0.93 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ delay: i * 0.12, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
              whileHover={{ y: -10, boxShadow: "0 30px 70px rgba(0,0,0,0.3)" }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={recipe.img}
                  alt={recipe.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1c2439] via-transparent to-transparent" />
                <div
                  className="absolute top-4 left-4 px-3 py-1 rounded-full"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "10px", fontWeight: 800, backgroundColor: recipe.tagColor, color: "white", letterSpacing: "2px", textTransform: "uppercase" }}
                >
                  {recipe.tag}
                </div>
              </div>

              <div className="p-6">
                <h3
                  style={{ fontFamily: "'Bangers', cursive", fontSize: "26px", color: "white", textTransform: "uppercase", letterSpacing: "0.03em", lineHeight: 1.05 }}
                >
                  {recipe.name}
                </h3>
                <p
                  className="mt-2 mb-4"
                  style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}
                >
                  {recipe.desc}
                </p>

                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <Clock size={13} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 600 }}>{recipe.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5" style={{ color: "rgba(255,255,255,0.45)" }}>
                    <Users size={13} />
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "12px", fontWeight: 600 }}>Serves {recipe.serves}</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full"
                    style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "10px", fontWeight: 700, backgroundColor: "#ccfbf1", color: "#0d9488" }}
                  >
                    {recipe.difficulty}
                  </span>
                </div>

                <div
                  className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "#5eead4", fontFamily: "'Space Grotesk', sans-serif", fontSize: "13px", fontWeight: 700 }}
                >
                  View Recipe <ArrowRight size={14} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-10 md:hidden text-center">
          <Link
            to="/recipes"
            className="inline-flex items-center gap-2 border-2 border-[#5eead4] text-[#5eead4] px-7 py-3 rounded-full"
            style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "14px", fontWeight: 700, textDecoration: "none" }}
          >
            All Recipes <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}