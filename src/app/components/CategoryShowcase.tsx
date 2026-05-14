import { useRef } from "react";
import { motion, useInView } from "motion/react";

const categories = [
    {
        id: 1,
        name: "Freeze Dried Fruits",
        tagline: "Crunchy, Natural, No Added Sugar",
        accentColor: "#0d9488",
        description:
            "NutroFreeze freeze-dried fruits capture the vibrant flavors, natural sweetness, and full nutritional power of fresh fruits in a convenient, lightweight form. Gently freeze-dried to remove only the water while preserving 97% of the nutrients, vitamins, and antioxidants with no additives, no preservatives, and no added sugar. Perfect for busy families, these crunchy, delicious snacks are ideal for lunchboxes, on-the-go moments, or as a wholesome treat that little tummies love.",
        img: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=640&q=85",
    },
    {
        id: 2,
        name: "Freeze Dried Vegetables",
        tagline: "Pure Taste, Complete Nutrition",
        accentColor: "#7c3aed",
        description:
            "NutroFreeze freeze-dried vegetables deliver the pure taste, vibrant color, and complete nutritional goodness of fresh vegetables in a convenient, shelf-stable form. Through gentle freeze-drying, we preserve up to 97% of the essential vitamins, minerals, and antioxidants while removing only the water with no additives, no preservatives, and no compromise on quality. Enjoy them raw as a healthy snack or easily rehydrated and added to soups, stir-fries, pasta, and everyday recipes.",
        img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=640&q=85",
    },
    {
        id: 3,
        name: "Freeze Dried Baby Foods",
        tagline: "Pure, Gentle Nutrition for Little Ones",
        accentColor: "#0d9488",
        description:
            "NutroFreeze freeze-dried baby foods are thoughtfully crafted to provide pure, gentle nutrition for babies and toddlers. Available as convenient crunchy bites or fine puree powders, our products preserve nearly all the natural vitamins, minerals, and flavors of fresh ingredients with no additives, no preservatives, and no hidden fillers. Simply enjoy the bites as a wholesome snack or rehydrate the puree powders with water for a quick, nutritious meal. Made with the same care you would give your own little one.",
        img: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=640&q=85",
    },
    {
        id: 4,
        name: "Ready to Eat Meals",
        tagline: "Just Add Water, Complete Nutrition",
        accentColor: "#7c3aed",
        description:
            "NutroFreeze freeze-dried ready-to-eat meals offer busy families complete, balanced nutrition in a convenient, lightweight form. Each meal is gently freeze-dried to lock in natural flavors, essential nutrients, and wholesome ingredients with no additives, no preservatives, and no compromises. Simply add water to reconstitute into a delicious, nourishing hot or cold meal in minutes, perfect for on-the-go lunches, travel, camping, or hectic weekdays.",
        img: "https://images.unsplash.com/photo-1547592180-85f173990554?w=640&q=85",
    },
];

const TAGS = ["97% Nutrients Preserved", "No Additives", "No Preservatives"];

export function CategoryShowcase() {
    const headingRef = useRef<HTMLDivElement>(null);
    const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

    return (
        <section style={{ background: "#0f172a", padding: "100px 0 120px" }}>
            <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 24px" }}>

                {/* Section heading */}
                <div ref={headingRef} style={{ textAlign: "center", marginBottom: "72px" }}>
                    <motion.p
                        initial={{ opacity: 0, y: 16 }}
                        animate={headingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5 }}
                        style={{
                            fontFamily: "'Bebas Neue', sans-serif",
                            fontSize: "13px",
                            letterSpacing: "5px",
                            color: "#5eead4",
                            margin: "0 0 16px 0",
                        }}
                    >
                        OUR PRODUCT RANGE
                    </motion.p>
                    <motion.h2
                        initial={{ opacity: 0, y: 24 }}
                        animate={headingInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.7, delay: 0.1 }}
                        style={{
                            fontFamily: "'Bangers', cursive",
                            fontSize: "clamp(52px, 9vw, 110px)",
                            color: "white",
                            lineHeight: 0.88,
                            letterSpacing: "0.02em",
                            textTransform: "uppercase",
                            margin: 0,
                        }}
                    >
                        FREEZE DRIED<br />
                        <span style={{ color: "#c4b5fd" }}>FOR EVERY FAMILY</span>
                    </motion.h2>
                </div>

                {/* Cards grid */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))",
                        gap: "24px",
                    }}
                >
                    {categories.map((cat, i) => (
                        <CategoryCard key={cat.id} cat={cat} index={i} />
                    ))}
                </div>

            </div>
        </section>
    );
}

function CategoryCard({ cat, index }: { cat: (typeof categories)[number]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const inView = useInView(ref, { once: true, margin: "-60px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 56 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1, ease: [0.23, 1, 0.32, 1] }}
            style={{
                borderRadius: "24px",
                overflow: "hidden",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                display: "flex",
                flexDirection: "column",
            }}
        >
            {/* Image */}
            <div style={{ height: "220px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
                <img
                    src={cat.img}
                    alt={cat.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: `linear-gradient(to top, ${cat.accentColor}bb 0%, transparent 55%)`,
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        bottom: "14px",
                        left: "16px",
                        background: cat.accentColor,
                        borderRadius: "100px",
                        padding: "4px 14px",
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: "11px",
                        fontWeight: 700,
                        color: "white",
                        letterSpacing: "0.8px",
                        textTransform: "uppercase",
                    }}
                >
                    {cat.tagline}
                </div>
            </div>

            {/* Content */}
            <div style={{ padding: "24px 24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <h3
                        style={{
                            fontFamily: "'Bangers', cursive",
                            fontSize: "22px",
                            color: "white",
                            letterSpacing: "0.06em",
                            textTransform: "uppercase",
                            margin: 0,
                        }}
                    >
                        {cat.name}
                    </h3>
                </div>

                <p
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: "14px",
                        color: "rgba(255,255,255,0.62)",
                        lineHeight: 1.75,
                        margin: "0 0 20px 0",
                        flex: 1,
                    }}
                >
                    {cat.description}
                </p>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {TAGS.map((tag) => (
                        <span
                            key={tag}
                            style={{
                                fontFamily: "'Space Grotesk', sans-serif",
                                fontSize: "11px",
                                fontWeight: 700,
                                color: cat.accentColor,
                                background: `${cat.accentColor}22`,
                                padding: "3px 10px",
                                borderRadius: "100px",
                                letterSpacing: "0.3px",
                            }}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
